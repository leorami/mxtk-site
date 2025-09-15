/*
  Attempt to interact with the chat bot on the external site and capture a transcript.
  This uses Puppeteer to open the site, wait for a chat widget, send questions, and
  save the Q&A into a JSON transcript under the latest snapshot directory.

  Usage:
    pnpm tsx scripts/bot-chat-capture.ts --base https://mineral-token.com
*/

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import puppeteer, { Browser } from 'puppeteer';

type CliArgs = { base?: string; domain?: string; snap?: string };

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' && argv[i + 1]) args.base = argv[++i];
    else if (a === '--domain' && argv[i + 1]) args.domain = argv[++i];
    else if (a === '--snap' && argv[i + 1]) args.snap = argv[++i];
  }
  return args;
}

function getLatestSnapshotDir(domain: string): string | null {
  const base = path.join('docs', 'reference', 'external', domain);
  if (!fs.existsSync(base)) return null;
  const entries = fs.readdirSync(base).map((n) => path.join(base, n)).filter((p) => fs.statSync(p).isDirectory());
  entries.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return entries[0] ?? null;
}

async function run() {
  const args = parseArgs(process.argv);
  const baseUrl = args.base ?? (args.domain ? `https://${args.domain}` : 'https://mineral-token.com');
  const u = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const domain = u.host.replace(/^www\./, '');

  const snapshotDir = args.snap ?? getLatestSnapshotDir(domain);
  if (!snapshotDir) {
    console.error('No snapshot directory found. Run scripts/crawl-external.ts first.');
    process.exit(1);
  }

  const outDir = path.join(snapshotDir, 'bot');
  fs.mkdirSync(outDir, { recursive: true });

  const questions = [
    'What is Mineral Token (MXTK)?',
    'How is MXTK backed by mineral assets? Be specific.',
    'What is the current status of asset commitments and audits?',
    'How can institutions participate, and what are compliance steps?',
    'How do retail users get exposure? Any restrictions?',
    'What are the fees, liquidity, and redemption mechanics?',
    'How are price and oracle data produced?',
    'What are the key risks and mitigations?',
  ];

  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
    await page.goto(u.toString(), { waitUntil: 'networkidle2', timeout: 120_000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Heuristic selectors; adjust if the widget markup differs
    // Try to open a typical chat launcher button
    const launcher = await page.$('button:has-text("Chat") , button[aria-label~="chat" i], .chat-launcher, .intercom-launcher, .crisp-client .cc-1');
    if (launcher) {
      await launcher.click();
      await page.waitForTimeout(1000);
    }

    const transcript: Array<{ role: 'user'|'assistant'; text: string }> = [];

    // Attempt to find an input; cover common chat providers
    const inputSelectors = [
      'textarea',
      'input[type="text"]',
      'input[placeholder*="message" i]',
      'input[aria-label*="message" i]'
    ];

    for (const q of questions) {
      let inputFound = false;
      for (const sel of inputSelectors) {
        const el = await page.$(sel);
        if (el) {
          await el.click({ delay: 50 });
          await page.keyboard.type(q, { delay: 10 });
          await page.keyboard.press('Enter');
          inputFound = true;
          break;
        }
      }
      transcript.push({ role: 'user', text: q });
      if (!inputFound) {
        transcript.push({ role: 'assistant', text: '[Bot input not detected automatically; manual follow-up required]'});
        continue;
      }
      // Wait and capture latest assistant message heuristically
      await new Promise((r) => setTimeout(r, 3500));
      const reply = await page.evaluate(() => {
        // collect last message-like nodes by heuristics
        const candidates = Array.from(document.querySelectorAll('div, p, li'))
          .filter((n) => (n.textContent || '').trim().length > 0)
          .slice(-20)
          .map((n) => (n.textContent || '').trim());
        return candidates[candidates.length - 1] || '';
      });
      transcript.push({ role: 'assistant', text: reply || '[No visible response captured]'});
    }

    fs.writeFileSync(path.join(outDir, 'transcript.json'), JSON.stringify(transcript, null, 2), 'utf8');
    console.log(`BOT_OUT_DIR=${outDir}`);
  } finally {
    if (browser) await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});



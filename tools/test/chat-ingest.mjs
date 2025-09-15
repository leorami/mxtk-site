// tools/test/chat-ingest.mjs
// Chat ingestion for external sites using our auditor tooling stack (Puppeteer).
// Saves transcripts under docs/reference/external/<domain>/<timestamp>/bot/
//
// Usage:
//   BASE_URL=https://mineral-token.com node tools/test/chat-ingest.mjs

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const BASE_URL = process.env.BASE_URL || 'https://mineral-token.com/';

function domainFromUrl(urlStr) {
  const u = new URL(urlStr);
  return u.hostname.replace(/^www\./, '');
}

function latestSnapshotDir(domain) {
  const base = path.join('docs', 'reference', 'external', domain);
  if (!fs.existsSync(base)) return null;
  const dirs = fs.readdirSync(base)
    .map(n => path.join(base, n))
    .filter(p => fs.statSync(p).isDirectory())
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return dirs[0] || null;
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

async function findChatInputHandle(page) {
  // Prefer the specific chat container provided
  const xpathCandidates = [
    // Input within a card-mineral chat container
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' card-mineral ')]//input[contains(@placeholder, 'Ask') or contains(@aria-label, 'Ask') or @placeholder]",
    // Input near MXTK AI Guide header
    "//*[.//h3[contains(normalize-space(.), 'MXTK AI Guide')]]//input[contains(@placeholder, 'Ask') or @placeholder]",
  ];
  for (const xp of xpathCandidates) {
    try {
      const els = await page.$x(xp);
      if (els && els[0]) return { handle: els[0], inFrame: false };
    } catch {}
  }
  // Fallbacks (non-xpath)
  const selectors = [
    'input[placeholder*="Ask" i]',
    'input[placeholder]',
    'textarea',
    'input',
    '[contenteditable="true"]',
  ];
  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el) return { handle: el, inFrame: false };
    } catch {}
  }
  // Try iframes
  for (const frame of page.frames()) {
    try {
      const el = await frame.$('input[placeholder], textarea, [contenteditable="true"]');
      if (el) return { handle: el, inFrame: true, frame };
    } catch {}
  }
  return null;
}

async function clickButtonByText(page, text) {
  // Prefer querySelectorAll with innerText match due to $x availability differences
  const found = await page.evaluate((t) => {
    const btns = Array.from(document.querySelectorAll('button'));
    const match = btns.find(b => (b.innerText || b.textContent || '').trim().toLowerCase().includes(String(t).toLowerCase()));
    if (match) { (match).scrollIntoView({ behavior: 'instant', block: 'center' }); (match).click(); return true; }
    return false;
  }, text).catch(() => false);
  return !!found;
}

async function openChatIfPresent(page) {
  // Try the site CTA first
  if (await clickButtonByText(page, 'Start Your MXTK Journey')) { await delay(800); }
  // Scroll to chat section header if present
  await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('h2,h3')).filter(h => /Chat with MXTK Guide/i.test(h.textContent || ''));
    if (headers[0]) headers[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }).catch(() => {});
  await delay(500);
  // Secondary: Try generic launcher classes if present
  const launchers = ['.chat-launcher', '.intercom-launcher', '.crisp-client .cc-1'];
  for (const sel of launchers) {
    try {
      const el = await page.$(sel);
      if (el) { await el.click({ delay: 50 }); await delay(800); return true; }
    } catch {}
  }
  return true;
}

async function run() {
  const base = new URL(BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`).toString();
  const domain = domainFromUrl(base);
  const snap = latestSnapshotDir(domain);
  const snapshotDir = snap || path.join('docs', 'reference', 'external', domain, new Date().toISOString().replace(/:/g,'-'));
  const outDir = path.join(snapshotDir, 'bot');
  ensureDir(outDir);

  const questions = [
    'What is Mineral Token (MXTK)?',
    'How is MXTK backed by mineral assets? Provide specifics.',
    'What asset commitments and audits exist today?',
    'How can institutions participate? Compliance steps?',
    'How do retail users get exposure? Jurisdictional restrictions?',
    'Fees, liquidity, and redemption mechanics?',
    'How are price and oracle data produced?',
    'Key risks and mitigations?',
  ];

  const transcript = [];
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle2', timeout: 120000 });
    await delay(1500);

    await openChatIfPresent(page);

    // Try to locate an input
    const input = await findChatInputHandle(page);
    for (const q of questions) {
      transcript.push({ role: 'user', text: q, ts: new Date().toISOString() });
      if (!input) {
        transcript.push({ role: 'assistant', text: '[Chat input not detected automatically]', ts: new Date().toISOString() });
        continue;
      }
      try {
        const handle = input.handle;
        await handle.click({ delay: 50 });
        await page.type('input[placeholder], textarea, [contenteditable="true"]', q, { delay: 8 }).catch(async () => {
          // Fallback: type via focused element
          await page.keyboard.type(q, { delay: 8 });
        });
        // Try to click an enabled send button inside the same container
        await page.evaluate(() => {
          const el = document.activeElement;
          const card = el ? el.closest('.card-mineral') : null;
          if (card) {
            const btn = card.querySelector('button');
            if (btn) btn.removeAttribute('disabled');
          }
        }).catch(() => {});
        // Press Enter to send
        await page.keyboard.press('Enter');
      } catch {}
      await delay(4500);
      const reply = await page.evaluate(() => {
        // Extract the latest visible chat bubble from the card container
        const card = Array.from(document.querySelectorAll('.card-mineral')).find(n => /MXTK AI Guide/i.test(n.textContent || '')) || document.querySelector('.card-mineral');
        if (!card) return '';
        const bubbles = Array.from(card.querySelectorAll('div'))
          .map(n => (n.textContent || '').trim())
          .filter(Boolean);
        return bubbles.slice(-1)[0] || '';
      }).catch(() => '');
      transcript.push({ role: 'assistant', text: reply || '[No visible response captured]', ts: new Date().toISOString() });
    }

    fs.writeFileSync(path.join(outDir, 'transcript.json'), JSON.stringify(transcript, null, 2), 'utf8');
    // Screenshot for context
    await page.screenshot({ path: path.join(outDir, 'chat.png'), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify({ base, domain, when: new Date().toISOString() }, null, 2));
    console.log(`CHAT_OUT_DIR=${outDir}`);
  } finally {
    await browser.close();
  }
}

run().catch(err => { console.error(err); process.exit(1); });



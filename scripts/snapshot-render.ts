/*
  Render a live SPA page with Puppeteer and archive rendered HTML, text, and a screenshot
  into the latest crawl snapshot directory for the given domain.

  Usage examples:
    pnpm tsx scripts/snapshot-render.ts --base https://mineral-token.com
    pnpm tsx scripts/snapshot-render.ts --domain mineral-token.com --snap docs/reference/external/mineral-token.com/<timestamp>
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

async function autoScroll(page: puppeteer.Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 600;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight - 50) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
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

  const renderDir = path.join(snapshotDir, 'rendered');
  fs.mkdirSync(renderDir, { recursive: true });

  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
    await page.goto(u.toString(), { waitUntil: 'networkidle2', timeout: 120_000 });
    await autoScroll(page);
    await new Promise((r) => setTimeout(r, 1500));

    const html = await page.content();
    const text = await page.evaluate(() => document.body.innerText);

    fs.writeFileSync(path.join(renderDir, 'index.rendered.html'), html, 'utf8');
    fs.writeFileSync(path.join(renderDir, 'index.rendered.txt'), text, 'utf8');
    await page.screenshot({ path: path.join(renderDir, 'index.screenshot.png'), fullPage: true });

    console.log(`RENDERED_DIR=${renderDir}`);
  } finally {
    if (browser) await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});



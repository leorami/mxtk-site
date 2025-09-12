// tools/test/crawl-regression.mjs
// Full-site crawler: recursively visits internal links starting from BASE_URL,
// de-dupes, captures console errors/warnings and network errors, and inspects
// Docker container logs for warnings/errors. Writes a JSON report to
// tools/debug/output/reports/.

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('ERROR: BASE_URL env var is required (e.g., https://ramileo.ngrok.app/mxtk)');
  process.exit(1);
}

const MAX_PAGES = parseInt(process.env.CRAWL_MAX_PAGES || '200', 10);
const NAV_TIMEOUT = parseInt(process.env.CRAWL_NAV_TIMEOUT || '45000', 10);
const IGNORE_CONTRAST = /^1|true$/i.test(process.env.CRAWL_IGNORE_CONTRAST || '');
const DISABLE_DOCKER_LOGS = /^1|true$/i.test(process.env.DOCKER_LOGS_DISABLED || '');
const SINCE_LOGS = process.env.DOCKER_LOGS_SINCE || '10m';
const CONTAINERS = (process.env.DOCKER_CONTAINERS || 'mxtk-site-dev,mxtk-site-dev-mxtk').split(',');

function sameOrigin(u) {
  const base = new URL(BASE_URL);
  return u.origin === base.origin;
}

function withinPrefix(u) {
  const base = new URL(BASE_URL);
  const prefix = (base.pathname || '/').replace(/\/$/, '');
  const path = u.pathname.replace(/\/$/, '');
  return prefix ? path === prefix || path.startsWith(prefix + '/') : path.startsWith('/');
}

function resolveHref(currentUrl, href) {
  try { return new URL(href, currentUrl); } catch { return null; }
}

function isInternalHref(currentUrl, href) {
  if (!href) return false;
  if (href.startsWith('#')) return false;
  if (/^(mailto:|tel:|data:|javascript:)/i.test(href)) return false;
  const u = resolveHref(currentUrl, href);
  if (!u) return false;
  return sameOrigin(u) && withinPrefix(u);
}

function normalizeAbsoluteUrl(abs) {
  try {
    const u = new URL(abs);
    const base = new URL(BASE_URL);
    const prefix = (base.pathname || '/').replace(/\/$/, '');
    if (!prefix) return abs;
    let path = u.pathname;
    // Collapse duplicated prefixes like <basePath>/<basePath>/... → <basePath>/
    while (path.startsWith(prefix + prefix)) {
      path = path.slice(prefix.length);
    }
    u.pathname = path;
    return u.toString();
  } catch {
    return abs;
  }
}

async function captureConsole(page, store) {
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const entry = { type, text, ts: Date.now() };
    if (type === 'error') store.consoleErrors.push(entry);
    else if (type === 'warning' || /warn/i.test(type)) store.consoleWarnings.push(entry);
  });
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    if (status >= 400 && !/__nextjs_original-stack-frames|webpack-hmr|\.map($|\?)/.test(url)) {
      store.networkErrors.push({ status, statusText: response.statusText(), url });
    }
  });
}

// Compute contrast ratio between two computed colors in the page context
async function evaluateContrastOnPage(page) {
  return await page.evaluate(() => {
    function parseColor(color) {
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = color;
      const computed = ctx.fillStyle;
      // computed is in rgb(a) format
      const m = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/.exec(computed);
      if (!m) return null;
      return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
    }
    function luminance(rgb) {
      const [r, g, b] = rgb.map(v => v / 255);
      const srgb = [r, g, b].map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    }
    function contrast(fg, bg) {
      const L1 = luminance(fg);
      const L2 = luminance(bg);
      const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
      return (light + 0.05) / (dark + 0.05);
    }
    function getBgColor(el) {
      // Walk up until we find a non-transparent background
      let node = el;
      while (node && node !== document.documentElement) {
        const cs = getComputedStyle(node);
        const bg = cs.backgroundColor;
        if (bg && !/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)/.test(bg) && !/transparent/i.test(bg)) {
          const parsed = parseColor(bg);
          if (parsed) return parsed;
        }
        node = node.parentElement;
      }
      // Default to page background
      const rootBg = getComputedStyle(document.body).backgroundColor;
      return parseColor(rootBg) || [255, 255, 255];
    }
    const results = [];
    const candidates = Array.from(document.querySelectorAll('a, button, .btn, .btn-primary, .btn-outline, .btn-soft, .btn-link, th, td, p, h1, h2, h3'));
    for (const el of candidates) {
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      const bg = getBgColor(el);
      if (!fg || !bg) continue;
      const ratio = contrast(fg, bg);
      // WCAG thresholds: 4.5 for normal text, 3.0 for large (>=18pt/24px or 14pt/18.66px bold)
      const fontSizePx = parseFloat(cs.fontSize);
      const isBold = /bold|600|700|800|900/.test(cs.fontWeight);
      const isLarge = fontSizePx >= 24 || (isBold && fontSizePx >= 18.66);
      const required = isLarge ? 3.0 : 4.5;
      if (ratio < required) {
        results.push({
          selector: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 80),
          ratio: Number(ratio.toFixed(2)),
          required,
          fontSize: Number(fontSizePx.toFixed(1)),
          isBold,
        });
      }
    }
    return results;
  });
}

async function crawl(browser) {
  const toVisit = [BASE_URL];
  const visited = new Set();
  const report = { baseUrl: BASE_URL, pages: [], consoleTotals: { errors: 0, warnings: 0 }, networkTotals: { errors: 0 }, contrastTotals: { violations: 0 } };

  while (toVisit.length && visited.size < MAX_PAGES) {
    const url = toVisit.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const store = { url, consoleErrors: [], consoleWarnings: [], networkErrors: [], links: [], contrast: [] };
    await captureConsole(page, store);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: NAV_TIMEOUT });
      const anchors = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href') || ''));
      // Evaluate contrast violations on the loaded page
      store.contrast = await evaluateContrastOnPage(page);
      for (const href of anchors) {
        if (!isInternalHref(url, href)) continue;
        const u = resolveHref(url, href);
        if (!u) continue;
        const abs = normalizeAbsoluteUrl(u.toString());
        store.links.push(abs);
        if (!visited.has(abs) && !toVisit.includes(abs)) toVisit.push(abs);
      }
    } catch (err) {
      store.consoleErrors.push({ type: 'error', text: String(err && err.message || err), ts: Date.now() });
    } finally {
      await page.close();
    }
    report.consoleTotals.errors += store.consoleErrors.length;
    report.consoleTotals.warnings += store.consoleWarnings.length;
    report.networkTotals.errors += store.networkErrors.length;
    report.pages.push(store);
    report.contrastTotals.violations += store.contrast.length;
    try {
      console.log(`[crawl] ${url} console=${store.consoleErrors.length}/${store.consoleWarnings.length} network=${store.networkErrors.length} contrast=${store.contrast.length}`);
    } catch {}
  }
  return report;
}

function dockerLogs() {
  if (DISABLE_DOCKER_LOGS) return {};
  const logs = {};
  for (const name of CONTAINERS) {
    try {
      const out = execSync(`docker logs --since ${SINCE_LOGS} ${name} 2>&1`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      const lines = out.split(/\r?\n/).filter(Boolean);
      const errors = lines.filter(l => /\b(error|uncaught|unhandled|failed)\b/i.test(l));
      const warnings = lines.filter(l => /\b(warn|deprecated)\b/i.test(l));
      logs[name] = { errors, warnings, total: lines.length };
    } catch (e) {
      logs[name] = { errors: [String(e && e.message || e)], warnings: [], total: 0 };
    }
  }
  return logs;
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const report = await crawl(browser);
    report.docker = dockerLogs();

    // Write report
    const outDir = resolve('tools/debug/output/reports');
    mkdirSync(outDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = resolve(outDir, `crawl-regression-${ts}.json`);
    writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');
    console.log(`Wrote report: ${outFile}`);

    // Decide pass/fail
    const dockerHasErrors = DISABLE_DOCKER_LOGS ? false : Object.values(report.docker).some(d => d && (d.errors?.length || 0) > 0);
    const hasConsole = report.consoleTotals.errors > 0 || report.consoleTotals.warnings > 0;
    const hasNetwork = report.networkTotals.errors > 0;
    const hasContrast = IGNORE_CONTRAST ? false : report.contrastTotals.violations > 0;
    if (dockerHasErrors || hasConsole || hasNetwork || hasContrast) {
      console.error(`FAIL: dockerErrors=${dockerHasErrors} console=${report.consoleTotals.errors}/${report.consoleTotals.warnings} network=${report.networkTotals.errors} contrast=${report.contrastTotals.violations}${IGNORE_CONTRAST ? ' (contrast ignored)' : ''}${DISABLE_DOCKER_LOGS ? ' (docker logs disabled)' : ''}`);
      process.exit(1);
    }
    console.log(`✅ crawl-regression: all checks passed${IGNORE_CONTRAST ? ' (contrast ignored)' : ''}${DISABLE_DOCKER_LOGS ? ' (docker logs disabled)' : ''}`);
    process.exit(0);
  } catch (err) {
    console.error(String(err && err.stack || err));
    process.exit(1);
  } finally {
    await browser.close();
  }
})();



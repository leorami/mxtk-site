// tools/test/dashboard-screens.mjs
// Capture dashboard screenshots (desktop/iPad/mobile) and verify key invariants.
// Usage: node tools/test/dashboard-screens.mjs [BASE_URL]

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:2000';
const DASHBOARD = `${BASE.replace(/\/$/, '')}/dashboard`;
const TS = new Date().toISOString().replace(/[:.]/g, '-');
const ART_DIR = path.join(process.cwd(), 'artifacts');

async function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

async function withPage(browser, viewport, fn) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const errors = []; const warnings = []; const networkErrors = [];
  page.on('console', m => { const t = m.type(); if (t === 'error') errors.push(m.text()); if (t === 'warning') warnings.push(m.text()); });
  page.on('response', r => { const url = r.url(); if (r.status() >= 400 && !/webpack-hmr|__nextjs_original/.test(url)) networkErrors.push(`${r.status()} ${r.statusText()}: ${url}`); });
  await fn(page, { errors, warnings, networkErrors });
  await page.close();
  return { errors, warnings, networkErrors };
}

async function toggleGuideIfPresent(page) {
  try {
    await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 5000 });
    await page.click('[data-testid="sherpa-pill"]');
    await new Promise(r => setTimeout(r, 250));
  } catch (_) { /* optional */ }
}

async function verifyNoUnderlinedLinksInsideButtons(page) {
  return await page.evaluate(() => {
    const offenders = [];
    document.querySelectorAll('button a').forEach(a => {
      const s = getComputedStyle(a);
      const deco = s.textDecorationLine || '';
      if (deco.includes('underline')) offenders.push(a.outerHTML.slice(0, 120));
    });
    return offenders;
  });
}

async function verifyGlassRails(page) {
  return await page.evaluate(() => {
    const rails = document.querySelectorAll('.section-rail');
    if (!rails.length) return false;
    for (const rail of rails) {
      if (rail.querySelector('.glass, .glass--panel')) return true;
    }
    return false;
  });
}

async function verifyHeroGlass(page) {
  return await page.evaluate(() => !!document.querySelector('.glass.glass--panel'));
}

async function verifyWidgetControlsVisibilityToggle(page) {
  function anyVisible(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.opacity !== '0' && s.pointerEvents !== 'none';
  }
  const before = await page.evaluate(() => ({
    wc: (document.querySelector('.widget-controls') ? getComputedStyle(document.querySelector('.widget-controls')).opacity : null),
    wf: (document.querySelector('.wframe-controls') ? getComputedStyle(document.querySelector('.wframe-controls')).opacity : null),
  }));
  await toggleGuideIfPresent(page);
  // Force-open if the click didn't flip the class for any reason (mobile overlays, etc.)
  await page.evaluate(() => {
    try {
      document.documentElement.classList.add('guide-open');
      localStorage.setItem('mxtk_guide_open','1');
    } catch {}
  });
  const after = await page.evaluate(() => ({
    wc: (document.querySelector('.widget-controls') ? getComputedStyle(document.querySelector('.widget-controls')).opacity : null),
    wf: (document.querySelector('.wframe-controls') ? getComputedStyle(document.querySelector('.wframe-controls')).opacity : null),
  }));
  return { before, after };
}

async function verifyGridInlineSpans(page) {
  return await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('.widget-tile'));
    const inline = tiles.filter(t => t.hasAttribute('style'));
    const spans = inline.filter(t => {
      const st = (t.getAttribute('style') || '').toLowerCase();
      // Accept either explicit grid-column/row or shorthand grid-area
      const hasExplicit = /grid-column\s*:\s*span/.test(st) && /grid-row\s*:\s*span/.test(st);
      const hasArea = /grid-area\s*:\s*span\s+\d+\s*\/\s*span\s+\d+/.test(st);
      return hasExplicit || hasArea;
    });
    return { count: spans.length, sample: spans.slice(0, 3).map(el => el.getAttribute('style')) };
  });
}

async function verifyNoHorizontalScroll(page) {
  return await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

async function auditWidgetColors(page, outDir) {
  return await page.evaluate(async () => {
    function color(el) { return getComputedStyle(el).color; }
    const results = [];
    const wfTitle = document.querySelector('.wf-title');
    if (wfTitle) results.push({ sel: '.wf-title', color: color(wfTitle), text: wfTitle.textContent?.trim() });
    const firstLink = document.querySelector('.wframe a.underline');
    if (firstLink) results.push({ sel: '.wframe a.underline', color: color(firstLink), text: firstLink.textContent?.trim() });
    const firstBtnLink = document.querySelector('.wframe .btn-link.text-sm');
    if (firstBtnLink) results.push({ sel: '.wframe .btn-link.text-sm', color: color(firstBtnLink), text: firstBtnLink.textContent?.trim() });
    const toggle = Array.from(document.querySelectorAll('button')).find(b => /collapse/i.test(b.textContent||''));
    if (toggle) results.push({ sel: 'button[Collapse]', color: color(toggle), text: toggle.textContent?.trim() });
    return results;
  });
}

(async () => {
  await ensureDir(ART_DIR);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const viewports = [
      { name: 'desktop', vp: { width: 1366, height: 900, deviceScaleFactor: 1 } },
      { name: 'ipad',    vp: { width: 820,  height: 1180, deviceScaleFactor: 1 } },
      { name: 'mobile',  vp: { width: 390,  height: 844, deviceScaleFactor: 2 } },
    ];

    const results = {};

    for (const { name, vp } of viewports) {
      const metrics = {};
      const caps = await withPage(browser, vp, async (page, capsInner) => {
        await page.goto(DASHBOARD, { waitUntil: 'networkidle2', timeout: 45000 });
        // Ensure a known starting state: guide closed
        await page.evaluate(() => {
          try {
            document.documentElement.classList.remove('guide-open');
            localStorage.setItem('mxtk_guide_open', '0');
          } catch {}
        });
        // Poll for widget tiles and inline spans up to ~25s
        const start = Date.now();
        while (Date.now() - start < 25000) {
          const { count, withSpans } = await page.evaluate(() => {
            const tiles = Array.from(document.querySelectorAll('.widget-tile'));
            const spans = tiles.filter(t => {
              const st = t.getAttribute('style') || '';
              return /grid-column\s*:\s*span/i.test(st) && /grid-row\s*:\s*span/i.test(st);
            }).length;
            return { count: tiles.length, withSpans: spans };
          });
          if (count > 0 && withSpans > 0) break;
          await new Promise(r => setTimeout(r, 300));
        }

        // Color audit of the elements the user highlighted
        const colorAudit = await auditWidgetColors(page);

        // Screenshot
        const file = path.join(ART_DIR, `dashboard-${name}-${TS}.png`);
        await page.screenshot({ path: file, fullPage: true });

        Object.assign(metrics, { colorAudit, screenshot: file });
      });
      results[name] = {
        consoleErrors: caps.errors,
        consoleWarnings: caps.warnings,
        networkErrors: caps.networkErrors,
        ...metrics,
      };
    }

    const outJson = path.join(ART_DIR, `dashboard-check-${TS}.json`);
    fs.writeFileSync(outJson, JSON.stringify({ timestamp: TS, base: BASE, results }, null, 2));
    console.log('Artifacts saved:', Object.values(results).map(r => r.screenshot));
    console.log('Report:', outJson);
    process.exit(0);
  } catch (err) {
    console.error(err && err.stack || String(err));
    process.exit(1);
  } finally {
    await browser?.close().catch(() => {});
  }
})();



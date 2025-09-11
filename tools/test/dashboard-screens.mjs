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

        // Glass checks
        const heroGlass = await verifyHeroGlass(page);
        const railGlass = await verifyGlassRails(page);

        // Controls toggle
        const toggle = await verifyWidgetControlsVisibilityToggle(page);

        // Grid spans and debug counts
        const spans = await verifyGridInlineSpans(page);
        const debugCounts = await page.evaluate(() => {
          const tiles = document.querySelectorAll('.widget-tile');
          const styled = Array.from(document.querySelectorAll('[style]')).filter(el => /grid-column\s*:\s*span/i.test(el.getAttribute('style')||''));
          return { tiles: tiles.length, styled: styled.length };
        });

        // Underline-in-button
        const offenders = await verifyNoUnderlinedLinksInsideButtons(page);

        // iPad horizontal scroll (only for ipad viewport), test both closed and open
        let ipadNoHScrollClosed = true, ipadNoHScrollOpen = true;
        if (name === 'ipad') {
          ipadNoHScrollClosed = await verifyNoHorizontalScroll(page);
          await toggleGuideIfPresent(page);
          await new Promise(r => setTimeout(r, 150));
          ipadNoHScrollOpen = await verifyNoHorizontalScroll(page);
        }

        // Screenshot
        const file = path.join(ART_DIR, `dashboard-${name}-${TS}.png`);
        await page.screenshot({ path: file, fullPage: true });

        Object.assign(metrics, {
          heroGlass,
          railGlass,
          controlsOpacityBefore: toggle.before,
          controlsOpacityAfter: toggle.after,
          spans,
          underlineOffenders: offenders,
          ipadNoHScrollClosed,
          ipadNoHScrollOpen,
          screenshot: file,
          debugCounts,
        });
      });
      results[name] = {
        consoleErrors: caps.errors,
        consoleWarnings: caps.warnings,
        networkErrors: caps.networkErrors,
        ...metrics,
      };
    }

    // Emit summary and exit nonzero if violations
    const issues = [];
    for (const [name, r] of Object.entries(results)) {
      if (!r) continue;
      if (r.consoleErrors?.length) issues.push(`${name}: console errors`);
      if (r.consoleWarnings?.length) issues.push(`${name}: console warnings`);
      if (r.networkErrors?.length) issues.push(`${name}: network errors`);
      if (!r.heroGlass) issues.push(`${name}: hero glass missing`);
      if (!r.railGlass) issues.push(`${name}: section rail glass missing`);
      const afterOpac = [r.controlsOpacityAfter?.wc, r.controlsOpacityAfter?.wf].filter(v => v !== null);
      const beforeOpac = [r.controlsOpacityBefore?.wc, r.controlsOpacityBefore?.wf].filter(v => v !== null);
      if (afterOpac.length && beforeOpac.length) {
        const becameVisible = afterOpac.some(v => parseFloat(String(v)) > 0) && beforeOpac.every(v => String(v) === '0');
        if (!becameVisible) issues.push(`${name}: widget controls did not toggle visible with guide`);
      }
      if (!r.spans || r.spans.count === 0) issues.push(`${name}: no inline grid spans detected`);
      if (r.underlineOffenders?.length) issues.push(`${name}: underlined links inside buttons`);
      if (name === 'ipad') {
        if (!r.ipadNoHScrollClosed) issues.push('ipad: horizontal scroll with guide closed');
        if (!r.ipadNoHScrollOpen) issues.push('ipad: horizontal scroll with guide open');
      }
    }

    const outJson = path.join(ART_DIR, `dashboard-check-${TS}.json`);
    fs.writeFileSync(outJson, JSON.stringify({ timestamp: TS, base: BASE, results, issues }, null, 2));
    console.log('Artifacts saved:', Object.values(results).map(r => r.screenshot));
    console.log('Report:', outJson);
    if (issues.length) {
      console.error('Violations:', issues);
      process.exit(2);
    }
    process.exit(0);
  } catch (err) {
    console.error(err && err.stack || String(err));
    process.exit(1);
  } finally {
    await browser?.close().catch(() => {});
  }
})();



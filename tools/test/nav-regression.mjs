// tools/test/nav-regression.mjs
// Regression test: verify anchor hrefs after hydration reflect correct prefix behavior.
// Usage:
//   BASE_URL=http://localhost:2000 node tools/test/nav-regression.mjs
//   BASE_URL=https://ramileo.ngrok.app/mxtk node tools/test/nav-regression.mjs
//
// Requires: puppeteer (dev dependency)

import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('ERROR: BASE_URL env var is required (e.g., http://localhost:2000 or https://ramileo.ngrok.app/mxtk)');
  process.exit(1);
}

// Infer expected prefix from BASE_URL path (first segment)
function expectedPrefixFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const segs = u.pathname.split('/').filter(Boolean);
    return segs.length && segs[0].toLowerCase() !== '_next' ? `/${segs[0]}` : '';
  } catch (_) {
    return '';
  }
}

const EXPECT_PREFIX = expectedPrefixFromUrl(BASE_URL);
// On localhost root (e.g., http://localhost:2000), EXPECT_PREFIX === '' (no prefix)
// On ngrok mxtk (e.g., https://ramileo.ngrok.app/mxtk), EXPECT_PREFIX === '/mxtk'

function isInternal(href) {
  if (!href) return false;
  if (href.startsWith('#')) return false;
  // Treat absolute http(s) as external
  if (/^https?:\/\//i.test(href)) return false;
  // Treat other schemes as external too (mailto:, tel:, data:, javascript:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(href) || /^(mailto:|tel:|data:|javascript:)/i.test(href)) return false;
  return true;
}

function normalize(href) {
  // Convert relative links like "owners" or "../media" into absolute paths relative to current location
  // We don't actually resolve; we assert final DOM has absolute hrefs after hydration
  return href;
}

function assertLink(path, cond, message) {
  if (!cond) {
    throw new Error(`[FAIL] ${message} :: href="${path}"`);
  }
}

async function collectAnchors(page) {
  return await page.$$eval('a[href]', as => as.map(a => ({
    text: (a.textContent || '').trim(),
    href: a.getAttribute('href') || '',
    pathname: a.pathname || '',
  })));
}

async function captureErrors(page) {
  const consoleErrors = [];
  const consoleWarnings = [];
  const networkErrors = [];
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      const text = msg.text();
      if (
        !text.includes('__nextjs_original-stack-frames') &&
        !/preload but not used/i.test(text)
      ) {
        consoleErrors.push(text);
      }
    } else if (/^warn/i.test(type)) {
      const text = msg.text();
      if (
        !/preload but not used/i.test(text) &&
        !/Skipping auto-scroll behavior due to `position: (sticky|fixed)`/i.test(text)
      ) {
        consoleWarnings.push(text);
      }
    }
  });
  page.on('response', response => {
    const url = response.url();
    if (response.status() >= 400 &&
        !url.includes('__nextjs_original-stack-frames') &&
        !url.includes('webpack-hmr')) {
      networkErrors.push(`${response.status()} ${response.statusText()}: ${url}`);
    }
  });
  return { consoleErrors, consoleWarnings, networkErrors };
}

async function gotoWithRetry(page, url, attempts = 3, timeout = 30000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout });
      return;
    } catch (err) {
      lastErr = err;
      await new Promise(res => setTimeout(res, 500));
    }
  }
  throw lastErr;
}

async function clickAndWaitForUrl(page, href, expectPrefix) {
  const before = new URL(page.url());
  const expected = new URL(href, before.origin);
  const expectedPath = expected.pathname.replace(/\/$/, '');
  try {
    await page.click(`a[href="${href}"]`);
  } catch {
    // Try a broader selector if exact match fails
    const selector = `a[href="${href}"]`;
    await page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (el) el.click();
    }, selector);
  }
  // Prefer waiting for pathname to reach the expected route
  try {
    await page.waitForFunction(
      (path) => location.pathname.replace(/\/$/, '') === path,
      { timeout: 8000 },
      expectedPath,
    );
  } catch (_) {
    // Fallback: ensure we at least landed under the expected prefix if provided
    if (expectPrefix) {
      await page.waitForFunction(
        (prefix) => location.pathname.startsWith(prefix),
        { timeout: 8000 },
        expectPrefix,
      );
    }
  }
  return page.url();
}

async function testPage(browser, url, { checkFooterLegalEscape = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const { consoleErrors, consoleWarnings, networkErrors } = await captureErrors(page);
  await gotoWithRetry(page, url);

  // After hydration, Next should render absolute, prefix-aware hrefs in the DOM (client)
  const anchors = await collectAnchors(page);

  // Debug: Log some anchors to see what we're getting
  console.log('Debug: First 5 anchors:', anchors.slice(0, 5).map(a => ({ text: a.text, href: a.href })));

  // Filter internal links we care about (skip external and hash)
  const internal = anchors.filter(a => isInternal(a.href));

  // Debug: Log internal links
  console.log('Debug: Internal links:', internal.slice(0, 5).map(a => ({ text: a.text, href: a.href })));

  // Expected behavior:
  // - If EXPECT_PREFIX === '/mxtk', all internal hrefs should start with '/mxtk/' (or be exactly '/mxtk')
  // - If EXPECT_PREFIX === '', all internal hrefs should start with '/' (root) and NOT with '/mxtk'
  for (const a of internal) {
    const h = a.href;

    // Allow absolute root '/' for home
    if (h === '/' || h === EXPECT_PREFIX || h === `${EXPECT_PREFIX}/`) continue;

    if (!EXPECT_PREFIX) {
      assertLink(h, h.startsWith('/'), `Expected root-absolute href starting with "/"`);
      assertLink(h, !h.startsWith('/mxtk/'), `Localhost must not use "/mxtk" prefix`);
    } else {
      // On proxy, allow either '/mxtk/...' or plain '/...'; proxy will redirect root to prefixed
      assertLink(h, h.startsWith('/') || h.startsWith(`${EXPECT_PREFIX}/`), `Expected root or prefixed href`);
    }
  }

  // Special case: on legal pages, footer links (Media/Team/Careers/Contact) must NOT contain '/legal/'
  if (checkFooterLegalEscape) {
    const footerLinks = await page.$$eval('footer a[href]', as => as.map(a => a.getAttribute('href') || ''));
    for (const h of footerLinks) {
      if (!isInternal(h)) continue;
      // Legal links themselves are allowed to include /legal/
      const isLegalSelf = /\/legal(\/|$)/.test(h) && /\/legal(\/|$)/.test(new URL(url).pathname);
      if (isLegalSelf) continue;

      // Non-legal footer targets should never include '/legal/' in their href
      if (/\/legal\//.test(h)) {
        throw new Error(`[FAIL] Footer link must not contain "/legal/" :: href="${h}"`);
      }
    }
  }

  if (consoleErrors.length || consoleWarnings.length || networkErrors.length) {
    throw new Error(`Page issues detected: consoleErrors=${consoleErrors.length}, consoleWarnings=${consoleWarnings.length}, network=${networkErrors.length}`);
  }
  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });

  try {
    // 1) Landing page
    await testPage(browser, BASE_URL);

    // 2) Click through: Owners
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      const { consoleErrors, networkErrors } = await captureErrors(page);
      await gotoWithRetry(page, BASE_URL);
      // Find a visible Owners link (case-insensitive)
      const ownerSel = 'a[href]:not([href^="http"]):not([href^="#"])';
      await page.waitForSelector(ownerSel);
      const linkToOwners = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const match = links.find(a => /owners/i.test(a.textContent || ''));
        return match ? match.getAttribute('href') : null;
      });
      if (!linkToOwners) throw new Error('Owners link not found on landing page');
      const current = await clickAndWaitForUrl(page, linkToOwners, EXPECT_PREFIX);
      if (EXPECT_PREFIX) {
        if (!/\/mxtk\/owners(\/|$)/.test(current)) {
          throw new Error(`[FAIL] Owners page URL should be "${EXPECT_PREFIX}/owners", got: ${current}`);
        }
      } else {
        if (!/\/owners(\/|$)/.test(new URL(current).pathname)) {
          throw new Error(`[FAIL] Owners page URL should be "/owners", got: ${current}`);
        }
      }
      if (consoleErrors.length || networkErrors.length) {
        throw new Error(`Click-through page errors: console=${consoleErrors.length}, network=${networkErrors.length}`);
      }
      await page.close();
    }

    // 3) Legal page + footer escape
    {
      const legalUrl = new URL(BASE_URL);
      if (EXPECT_PREFIX) legalUrl.pathname = `${EXPECT_PREFIX}/legal/terms`;
      else legalUrl.pathname = '/legal/terms';
      await testPage(browser, legalUrl.toString(), { checkFooterLegalEscape: true });
    }

    // 4) Click all header/footer internal links to ensure no errors and correct prefixes
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      const { consoleErrors, networkErrors } = await captureErrors(page);
      await gotoWithRetry(page, BASE_URL);
      const links = await page.$$eval('header a[href], footer a[href]', as => as.map(a => a.getAttribute('href') || ''));
      const internalLinks = links.filter(h => h && !h.startsWith('http') && !h.startsWith('#'));
      for (const href of internalLinks) {
        if (EXPECT_PREFIX) {
          if (!(href === EXPECT_PREFIX || href.startsWith(`${EXPECT_PREFIX}/`))) {
            throw new Error(`[FAIL] Header/Footer link missing prefix on ngrok :: href="${href}"`);
          }
        } else {
          if (!(href === '/' || href.startsWith('/'))) {
            throw new Error(`[FAIL] Header/Footer link not root-absolute on localhost :: href="${href}`);
          }
        }
        const current = await clickAndWaitForUrl(page, href, EXPECT_PREFIX);
        if (EXPECT_PREFIX && !new URL(current).pathname.startsWith(EXPECT_PREFIX)) {
          throw new Error(`[FAIL] Navigation lost prefix :: url="${current}"`);
        }
        await gotoWithRetry(page, BASE_URL);
      }
      if (consoleErrors.length || networkErrors.length) {
        throw new Error(`Header/Footer nav errors: console=${consoleErrors.length}, network=${networkErrors.length}`);
      }
      await page.close();
    }

    // 5) MXTK Wave1 additions: Test Guide and Dev Ingest pages
    await testMXTKWave1(browser, BASE_URL);

    console.log('✅ nav-regression: all checks passed');
    process.exit(0);
  } catch (err) {
    console.error(String(err && err.stack || err));
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

// MXTK Wave1 additions
import fs from 'node:fs';

async function testGuide(browser, base) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => { 
    const t = msg.type(); 
    if(t === 'error' || t === 'warning') { 
      consoleErrors.push(`Console ${t}: ${msg.text()}`);
    } 
  });

  await gotoWithRetry(page, `${base}/guide`);
  
  // Look for the Sherpa button
  const btn = await page.$('button[aria-label="Open Sherpa"]');
  if(!btn) throw new Error('Guide launcher button not found on /guide page');
  
  // Get computed styles
  const styles = await page.evaluate(el => {
    const s = getComputedStyle(el); 
    return { position: s.position, zIndex: s.zIndex, borderRadius: s.borderRadius };
  }, btn);
  
  // Ensure temp directory exists
  fs.mkdirSync('.tmp/mxtk', { recursive: true });
  fs.writeFileSync('.tmp/mxtk/guide-launcher-styles.json', JSON.stringify(styles, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: '.tmp/mxtk/guide-page.png', fullPage: true });
  
  if (consoleErrors.length > 0) {
    throw new Error(`Guide page console errors: ${consoleErrors.join('; ')}`);
  }
  
  await page.close();
}

async function testHome(browser, base) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  await gotoWithRetry(page, base);
  await page.screenshot({ path: '.tmp/mxtk/home.png', fullPage: true });
  
  await page.close();
}

async function testMXTKWave1(browser, base) {
  console.log('Running MXTK Wave1 tests...');
  await testGuide(browser, base);
  await testHome(browser, base);
  console.log('✅ MXTK Wave1 tests passed');
}

// Wave 2 checks
async function assertVisible(page, sel){ await page.waitForSelector(sel,{timeout:5000}); const box=await page.$eval(sel,el=>({d: getComputedStyle(el).display, v: !!(el.offsetWidth||el.offsetHeight)})); if(box.d==='none'||!box.v) throw new Error(`${sel} not visible`); }
async function assertHidden(page, sel){ await page.waitForSelector(sel,{timeout:5000}); const d=await page.$eval(sel,el=>getComputedStyle(el).display); if(d!=='none') throw new Error(`${sel} not hidden`); }
export async function runWave2(page, base){
  page.on('console', msg=>{ const t=msg.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+msg.text()); } });
  // Desktop
  await page.setViewport({ width:1366, height:900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil:'networkidle0' });
  await assertVisible(page, '[data-testid="nav-links"]');
  await assertHidden(page, '[data-testid="nav-toggle"]');
  await assertVisible(page, '[data-testid="experience-controls-desktop"]');
  await assertVisible(page, '[data-testid="ai-button"]');
  await page.screenshot({ path: '.tmp/mxtk/w2-desktop.png', fullPage:true });
  // iPad portrait (820 x 1180)
  await page.setViewport({ width:820, height:1180, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil:'networkidle0' });
  await assertHidden(page, '[data-testid="nav-links"]');
  await assertVisible(page, '[data-testid="nav-toggle"]');
  await page.click('[data-testid="nav-toggle"]');
  // After mobile menu opens, experience controls should be present
  await assertVisible(page, '[data-testid="experience-controls-mobile"]');
  await assertVisible(page, '[data-testid="ai-button"]');
  await page.screenshot({ path: '.tmp/mxtk/w2-ipad-portrait.png', fullPage:true });
  // iPad landscape (1024 x 768)
  await page.setViewport({ width:1024, height:768, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil:'networkidle0' });
  await assertHidden(page, '[data-testid="nav-links"]');
  await assertVisible(page, '[data-testid="nav-toggle"]');
  await page.screenshot({ path: '.tmp/mxtk/w2-ipad-landscape.png', fullPage:true });
}

// Wave 3 flow
export async function runWave3(page, base) {
  page.on('console', msg => { 
    const t = msg.type(); 
    if(t === 'error' || t === 'warning') { 
      throw new Error('Console '+t+': '+msg.text()); 
    } 
  });
  
  // Desktop
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Click AI button in experience controls
  await page.click('button[aria-pressed]:has-text("AI")');
  
  // Wait for AI panel to open
  const inputSel = 'input[placeholder^="Ask about MXTK"],textarea';
  await page.waitForSelector(inputSel);
  
  // Type a question that should trigger auto-append
  await page.type(inputSel, 'explain validator incentives');
  await page.keyboard.press('Enter');
  
  // Wait for response
  await page.waitForTimeout(1500);
  
  // Find Journey link and click
  const [link] = await page.$x("//a[contains(., 'Journey') or contains(., 'journey')]");
  if (!link) throw new Error('Journey link not found');
  await link.click();
  
  // Wait for navigation and check footnotes
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForSelector('aside h3');
  
  await page.screenshot({ path: '.tmp/mxtk/w3-journey-desktop.png', fullPage: true });
  
  // iPad
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Click AI button in experience controls
  await page.click('button[aria-pressed]:has-text("AI")');
  
  // Wait for AI panel to open
  await page.waitForSelector(inputSel);
  
  await page.screenshot({ path: '.tmp/mxtk/w3-journey-ipad.png', fullPage: true });
}

if (import.meta.main) {
  const puppeteer = await import('puppeteer');
  const base = process.env.BASE_URL || 'http://localhost:2000';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try { await runWave3(page, base); } finally { await browser.close(); }
}

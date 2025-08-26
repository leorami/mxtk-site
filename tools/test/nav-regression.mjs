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
  const networkErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        !text.includes('__nextjs_original-stack-frames') &&
        !/preload but not used/i.test(text)
      ) {
        consoleErrors.push(text);
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
  return { consoleErrors, networkErrors };
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
  // Poll for URL change or expected path within timeout
  const start = Date.now();
  const timeoutMs = 8000;
  while (Date.now() - start < timeoutMs) {
    await new Promise(res => setTimeout(res, 250));
    const current = new URL(page.url());
    // Accept either exact href path or any path that retains required prefix (for client router transitions)
    const prefixOk = expectPrefix ? current.pathname.startsWith(expectPrefix) : current.pathname.startsWith('/');
    if (current.pathname === expected.pathname || prefixOk) return current.toString();
  }
  return new URL(page.url()).toString();
}

async function testPage(browser, url, { checkFooterLegalEscape = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const { consoleErrors, networkErrors } = await captureErrors(page);
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

    if (EXPECT_PREFIX) {
      assertLink(h, h.startsWith(`${EXPECT_PREFIX}/`), `Expected prefixed href starting with "${EXPECT_PREFIX}/"`);
    } else {
      assertLink(h, h.startsWith('/'), `Expected root-absolute href starting with "/"`);
      assertLink(h, !h.startsWith('/mxtk/'), `Localhost must not use "/mxtk" prefix`);
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

  if (consoleErrors.length || networkErrors.length) {
    throw new Error(`Page errors detected: console=${consoleErrors.length}, network=${networkErrors.length}`);
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

    console.log('✅ nav-regression: all checks passed');
    process.exit(0);
  } catch (err) {
    console.error(String(err && err.stack || err));
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

function within(a, b, tol = 1) { return Math.abs(a - b) <= tol; }

async function getRects(page){
  // Ensure the input is rendered before measuring
  await page.waitForSelector('.footer-chat-dock input', { timeout: 8000 });
  return await page.evaluate(() => {
    const input = document.querySelector('.footer-chat-dock input');
    const button = document.querySelector('.footer-chat-dock button[type="submit"]');
    const outer = document.querySelector('.footer-chat-absolute');
    const footer = document.querySelector('footer.brand-footer');
    const vw = window.innerWidth;
    const ir = input ? input.getBoundingClientRect() : null;
    const br = button ? button.getBoundingClientRect() : null;
    const or = outer ? outer.getBoundingClientRect() : null;
    const cs = outer ? getComputedStyle(outer) : null;
    const cw = cs ? cs.width : null;
    const fr = footer ? footer.getBoundingClientRect() : null;
    return {
      input: ir && { left: ir.left, right: ir.right, width: ir.width, top: ir.top, bottom: ir.bottom },
      button: br && { left: br.left, right: br.right, width: br.width, top: br.top, bottom: br.bottom },
      outer: or && { left: or.left, right: or.right, width: or.width, top: or.top, bottom: or.bottom, cssWidth: cw },
      footer: fr && { left: fr.left, right: fr.right, width: fr.width, top: fr.top, bottom: fr.bottom },
      vw,
    };
  });
}

async function getVars(page){
  return await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    function num(name){ return parseFloat(root.getPropertyValue(name).trim().replace('px','')) || 0; }
    return {
      guideWidth: num('--guide-width'),
      footerHeight: num('--footer-height'),
      drawerInnerX: num('--drawer-inner-x'),
    };
  });
}

async function assertPage(page, url){
  await page.goto(url, { waitUntil: 'networkidle0' });

  const vars = await getVars(page);
  const before = await getRects(page);

  if (!before.input || !before.button) {
    throw new Error('Footer chat input/button not found');
  }

  // Open drawer
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} }));
  });
  await page.waitForSelector('[aria-label="Sherpa Drawer"]', { timeout: 8000 });

  const after = await getRects(page);
  const drawerLeft = await page.evaluate(() => {
    const d = document.querySelector('.guide-drawer');
    return d ? d.getBoundingClientRect().left : null;
  });

  if (drawerLeft == null) throw new Error('Drawer not found after open');

  // Debug dump
  console.log('[debug] vars', vars, 'before.outer', before.outer, 'after.outer', after.outer);

  // Assertions
  const expectedLeft = drawerLeft + vars.drawerInnerX;
  if (!within(after.input.left, expectedLeft, 1)) {
    throw new Error(`Input left ${after.input.left} != drawerLeft+inset ${expectedLeft}`);
  }
  if (!within(before.input.left, after.input.left, 1)) {
    throw new Error(`Input left shifted after opening: before ${before.input.left}, after ${after.input.left}`);
  }

  const viewportRight = after.vw; // right edge of viewport
  if (!within(after.button.right, viewportRight, 2)) {
    throw new Error(`Send button right ${after.button.right} should be ~ viewportRight ${viewportRight}`);
  }
  if (!within(before.button.right, after.button.right, 1)) {
    throw new Error(`Send button right shifted after opening`);
  }

  // Copyright single line
  const copyright = await page.$eval('.footer-copyright', el => getComputedStyle(el).whiteSpace);
  if (copyright !== 'nowrap') {
    throw new Error(`Copyright white-space expected nowrap, got ${copyright}`);
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
    await assertPage(page, BASE_URL + '/');
    await assertPage(page, BASE_URL + '/journey');
    console.log('✅ guide-alignment checks passed');
    process.exit(0);
  } catch (e) {
    console.error('❌ guide-alignment failed:', e && e.message || e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

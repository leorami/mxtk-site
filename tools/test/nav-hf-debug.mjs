import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('ERROR: BASE_URL env var is required (e.g., https://<ngrok>/mxtk)');
  process.exit(1);
}

async function capture(page) {
  const consoleErrors = [];
  const networkErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('__nextjs_original-stack-frames') && !/preload but not used/i.test(text)) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('response', response => {
    const url = response.url();
    if (response.status() >= 400 && !url.includes('__nextjs_original-stack-frames') && !url.includes('webpack-hmr')) {
      networkErrors.push(`${response.status()} ${response.statusText()}: ${url}`);
    }
  });
  return { consoleErrors, networkErrors };
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const { consoleErrors, networkErrors } = await capture(page);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    const links = await page.$$eval('header a[href], footer a[href]', as => as.map(a => a.getAttribute('href')));
    console.log('Header/Footer links:', links);
    const internal = links.filter(h => h && !h.startsWith('http') && !h.startsWith('#'));
    for (const href of internal) {
      console.log('Clicking:', href);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(()=>{}),
        page.evaluate(h => { const a = Array.from(document.querySelectorAll('a[href]')).find(el => el.getAttribute('href') === h); if (a) a.click(); }, href)
      ]);
      // brief idle
      await new Promise(r => setTimeout(r, 300));
      console.log('Now at:', page.url());
      if (consoleErrors.length || networkErrors.length) {
        console.log('Accumulated console errors:', consoleErrors);
        console.log('Accumulated network errors:', networkErrors);
        break;
      }
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    }
  } finally {
    await browser.close();
  }
})();



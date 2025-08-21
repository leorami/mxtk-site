const puppeteer = require('puppeteer');

async function testThemeColors(url, label, darkMode = false) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  if (darkMode) {
    // Set dark mode
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    });
  }
  
  console.log(`\nTesting ${label}${darkMode ? ' (DARK MODE)' : ''}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Check if data-mineral is set
  const dataMineral = await page.$eval('[data-mineral]', el => el.getAttribute('data-mineral'));
  console.log('data-mineral:', dataMineral);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const element = document.querySelector('[data-mineral]');
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      accent: style.getPropertyValue('--mxtk-accent'),
      accentText: style.getPropertyValue('--mxtk-accent-text')
    };
  });
  console.log('CSS Variables:', cssVars);
  
  // Check h1 color
  const h1Color = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    return getComputedStyle(h1).color;
  });
  console.log('H1 computed color:', h1Color);
  
  await browser.close();
}

async function runTests() {
  // Test key pages in light mode
  await testThemeColors('http://localhost:2000/', 'home');
  await testThemeColors('http://localhost:2000/owners', 'owners');
  await testThemeColors('http://localhost:2000/institutions', 'institutions');
  await testThemeColors('http://localhost:2000/elite-drop', 'elite-drop');
  await testThemeColors('http://localhost:2000/careers', 'careers');
  
  // Test key pages in dark mode
  await testThemeColors('http://localhost:2000/', 'home', true);
  await testThemeColors('http://localhost:2000/owners', 'owners', true);
  await testThemeColors('http://localhost:2000/institutions', 'institutions', true);
  await testThemeColors('http://localhost:2000/elite-drop', 'elite-drop', true);
  await testThemeColors('http://localhost:2000/careers', 'careers', true);
}

runTests().catch(console.error);

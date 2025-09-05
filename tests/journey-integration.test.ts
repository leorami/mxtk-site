import puppeteer, { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Journey Integration Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = process.env.BASE_URL || 'http://localhost:2000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Set viewport for desktop testing
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterAll(async () => {
    await browser.close();
  });

  it('GET /journey (no id) renders shell without hydration warnings', async () => {
    await page.goto(`${baseUrl}/journey`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check shell renders correctly
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toContain('Your MXTK Journey');
    
    // Check for What's Next strip
    const whatsNext = await page.$eval('h3', el => el.textContent);
    expect(whatsNext).toContain('What\'s Next');
    
    // Check no hydration warnings in console
    const logs = await page.evaluate(() => {
      return (window as any).console?.logs || [];
    });
    
    const hydrationWarnings = logs.filter((log: any) => 
      log.includes('hydration') || log.includes('Hydration')
    );
    expect(hydrationWarnings).toHaveLength(0);
  }, 30000);

  it('opens docked Guide and asks question to create journey', async () => {
    await page.goto(`${baseUrl}/journey`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Click the Guide dock button
    const guideButton = await page.$('button[aria-label="Open Sherpa"]');
    expect(guideButton).toBeTruthy();
    // Ensure click fires even if element is partially off-screen
    await page.evaluate(() => {
      const el = document.querySelector('button[aria-label="Open Sherpa"]') as HTMLElement | null;
      if (el) el.click();
    });
    
    // Wait for Guide panel to open (close button appears when open)
    await page.waitForSelector('button[aria-label="Close Sherpa"]', { timeout: 15000 });
    // Then wait for input inside the panel
    await page.waitForSelector('input[placeholder*="Ask about MXTK"]', { timeout: 5000 });
    
    // Type a question
    await page.type('input[placeholder*="Ask about MXTK"]', 'explain what MXTK is');
    
    // Click send button
    const sendButton = await page.$('button[type="submit"]');
    await sendButton!.click();
    
    // Wait for response (this may take time for AI processing)
    await page.waitForFunction(
      () => document.querySelectorAll('[data-role="assistant"]').length > 0,
      { timeout: 30000 }
    );
    
    // Check if journey was created (look for journey link)
    const journeyLink = await page.$('a[href*="/journey/"]');
    expect(journeyLink).toBeTruthy();
    
    // Click the journey link
    await journeyLink!.click();
    
    // Should navigate to journey page
    await page.waitForURL(/\/journey\/[^\/]+$/, { timeout: 10000 });
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/journey\/[^\/]+$/);
  }, 60000);

  it('What\'s Next reflects lastLevel and avoids duplicates', async () => {
    await page.goto(`${baseUrl}/journey`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check initial What's Next content
    const initialSteps = await page.$$eval('.bg-white.dark\\:bg-gray-800', elements => 
      elements.map(el => el.textContent)
    );
    
    expect(initialSteps.length).toBeGreaterThan(0);
    
    // Click on a step to capture signal
    const firstStep = await page.$('.bg-white.dark\\:bg-gray-800');
    await firstStep!.click();
    
    // Wait a moment for signal processing
    await new Promise(r => setTimeout(r, 1000));
    
    // Refresh page to test signal persistence
    await page.reload();
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check that the clicked step is no longer shown (filtered out)
    const newSteps = await page.$$eval('.bg-white.dark\\:bg-gray-800', elements => 
      elements.map(el => el.textContent)
    );
    
    // Should have different content or fewer steps
    expect(newSteps).not.toEqual(initialSteps);
  }, 30000);

  it('handles iPad viewport correctly', async () => {
    // Set iPad viewport
    await page.setViewport({ width: 768, height: 1024 });
    
    await page.goto(`${baseUrl}/journey`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check responsive layout
    const container = await page.$('.container');
    const styles = await container!.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        padding: computed.padding,
        maxWidth: computed.maxWidth
      };
    });
    
    // Should have appropriate horizontal padding for mobile (px-4 ~ 16px)
    expect(/\b16px\b/.test(styles.padding)).toBe(true);
    
    // Check Guide dock button is accessible
    const guideButton = await page.$('button[aria-label="Open Sherpa"]');
    expect(guideButton).toBeTruthy();
    
    // Check button wrapper positioning for mobile (wrapper has fixed positioning)
    const wrapperStyles = await guideButton!.evaluate(el => {
      const wrapper = el.closest('div');
      const computed = wrapper ? window.getComputedStyle(wrapper) : window.getComputedStyle(el);
      return {
        position: computed.position,
        bottom: computed.bottom,
        right: computed.right
      };
    });
    
    expect(wrapperStyles.position).toBe('fixed');
    expect(wrapperStyles.bottom).toBe('1.5rem'); // bottom-6
    expect(wrapperStyles.right).toBe('1.5rem'); // right-6
  }, 30000);

  it('captures and stores user signals in localStorage', async () => {
    await page.goto(`${baseUrl}/journey`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check initial localStorage state
    // Clear any existing signals to start fresh
    await page.evaluate(() => localStorage.removeItem('mxtkSignals'));
    
    // Interact with page to generate signals
    const firstStep = await page.$('.bg-white.dark\\:bg-gray-800');
    await firstStep!.click();
    
    // Wait for signal processing
    await new Promise(r => setTimeout(r, 1000));
    
    // Check signals were stored
    const storedSignals = await page.evaluate(() => {
      return localStorage.getItem('mxtkSignals');
    });
    
    expect(storedSignals).toBeTruthy();
    
    const signals = JSON.parse(storedSignals!);
    expect(signals).toHaveProperty('clicks');
    expect(signals).toHaveProperty('viewedSections');
    expect(signals).toHaveProperty('timestamp');
    
    // Should have captured the click
    expect(signals.clicks.length).toBeGreaterThan(0);
  }, 30000);
});

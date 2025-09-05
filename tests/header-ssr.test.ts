import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('SiteHeader SSR safety', () => {
  it('contains required testids and no /mxtk hardcodes', () => {
    const s = fs.readFileSync('components/SiteHeader.tsx','utf8');
    expect(s).toMatch(/data-testid="experience-controls-desktop"/);
    expect(s).toMatch(/data-testid="experience-controls-mobile"/);
    expect(s).toMatch(/data-testid="nav-links"/);
    expect(s).toMatch(/data-testid="nav-toggle"/);
    expect(s).not.toMatch(/\/mxtk/);
  });
  
  it('GuideHeaderButton contains ai-button testid', () => {
    const s = fs.readFileSync('components/ai/GuideHeaderButton.tsx','utf8');
    expect(s).toMatch(/data-testid="ai-button"/);
    expect(s).not.toMatch(/\/mxtk/);
  });
  
  it('imports GuideHeaderButton correctly', () => {
    const s = fs.readFileSync('components/SiteHeader.tsx','utf8');
    expect(s).toMatch(/import.*GuideHeaderButton.*from.*@\/components\/ai\/GuideHeaderButton/);
  });
  
  it('GuideHeaderButton imports GuidePanel correctly', () => {
    const s = fs.readFileSync('components/ai/GuideHeaderButton.tsx','utf8');
    expect(s).toMatch(/import.*\{.*GuidePanel.*\}.*from.*@\/components\/ai\/GuidePanel/);
  });
});

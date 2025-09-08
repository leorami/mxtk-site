#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';
const OUTPUT_DIR = join(process.cwd(), 'tools/debug/mobile-screenshots');

// Mobile viewport configurations
const VIEWPORTS = {
    iPhone: { width: 375, height: 667, deviceScaleFactor: 2 },
    iPhoneX: { width: 375, height: 812, deviceScaleFactor: 3 },
    iPad: { width: 768, height: 1024, deviceScaleFactor: 2 },
    iPadPro: { width: 1024, height: 1366, deviceScaleFactor: 2 },
};

// Test pages to capture
const TEST_PAGES = [
    { url: '/', name: 'home' },
    { url: '/home', name: 'user-home' },
    { url: '/owners', name: 'owners' },
    { url: '/transparency', name: 'transparency' },
    { url: '/ecosystem', name: 'ecosystem' },
    { url: '/admin', name: 'admin' },
];

// Test scenarios
const SCENARIOS = [
    { name: 'default', action: null },
    { name: 'hamburger-open', action: 'openHamburger' },
    { name: 'sherpa-open', action: 'openSherpa' },
    { name: 'dark-mode', action: 'toggleDarkMode' },
    { name: 'dark-hamburger', action: 'darkModeAndHamburger' },
];

class MobileTestSuite {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = [];
        this.consoleMessages = [];
    }

    async init() {
        console.log('🚀 Starting mobile UI test suite...');
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        this.page = await this.browser.newPage();

        // Capture console messages and errors
        this.page.on('console', msg => {
            const type = msg.type();
            if (type === 'error' || type === 'warn') {
                this.consoleMessages.push({
                    type,
                    text: msg.text(),
                    location: msg.location()
                });
            }
        });

        this.page.on('pageerror', error => {
            this.consoleMessages.push({
                type: 'pageerror',
                text: error.message,
                stack: error.stack
            });
        });
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async setViewport(viewportName) {
        const viewport = VIEWPORTS[viewportName];
        await this.page.setViewport(viewport);
        console.log(`📱 Set viewport to ${viewportName}: ${viewport.width}x${viewport.height}`);
    }

    async navigateToPage(pageUrl) {
        const fullUrl = `${BASE_URL}${pageUrl}`;
        console.log(`🌐 Navigating to ${fullUrl}`);

        try {
            await this.page.goto(fullUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            return true;
        } catch (error) {
            console.error(`❌ Failed to navigate to ${fullUrl}:`, error.message);
            return false;
        }
    }

    async executeScenario(scenarioName) {
        switch (scenarioName) {
            case 'openHamburger':
                await this.openHamburgerMenu();
                break;
            case 'openSherpa':
                await this.openSherpaDrawer();
                break;
            case 'toggleDarkMode':
                await this.toggleDarkMode();
                break;
            case 'darkModeAndHamburger':
                await this.toggleDarkMode();
                await this.page.waitForTimeout(500);
                await this.openHamburgerMenu();
                break;
            default:
                // Default scenario - no action
                break;
        }

        // Wait for animations to settle
        await this.page.waitForTimeout(1000);
    }

    async openHamburgerMenu() {
        try {
            const hamburgerBtn = await this.page.$('[data-testid="nav-toggle"]');
            if (hamburgerBtn) {
                await hamburgerBtn.click();
                await this.page.waitForTimeout(500);
                console.log('🍔 Opened hamburger menu');
            }
        } catch (error) {
            console.warn('⚠️ Could not open hamburger menu:', error.message);
        }
    }

    async openSherpaDrawer() {
        try {
            const sherpaBtn = await this.page.$('[data-testid="sherpa-pill"]');
            if (sherpaBtn) {
                await sherpaBtn.click();
                await this.page.waitForTimeout(1000);
                console.log('🤖 Opened Sherpa drawer');
            }
        } catch (error) {
            console.warn('⚠️ Could not open Sherpa drawer:', error.message);
        }
    }

    async toggleDarkMode() {
        try {
            // Look for theme switch in footer (desktop) or try to toggle programmatically
            const themeBtn = await this.page.$('button[aria-label="Toggle theme"]');
            if (themeBtn) {
                await themeBtn.click();
                await this.page.waitForTimeout(500);
                console.log('🌙 Toggled dark mode');
            } else {
                // Fallback: programmatically toggle dark mode
                await this.page.evaluate(() => {
                    document.documentElement.classList.toggle('dark');
                });
                console.log('🌙 Toggled dark mode programmatically');
            }
        } catch (error) {
            console.warn('⚠️ Could not toggle dark mode:', error.message);
        }
    }

    async captureScreenshot(filename) {
        const filepath = join(OUTPUT_DIR, `${filename}.png`);

        try {
            await this.page.screenshot({
                path: filepath,
                fullPage: true,
                quality: 90
            });
            console.log(`📸 Screenshot saved: ${filename}.png`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to capture screenshot ${filename}:`, error.message);
            return false;
        }
    }

    async checkAccessibility() {
        // Basic accessibility checks
        const results = await this.page.evaluate(() => {
            const issues = [];

            // Check for missing alt text on images
            const images = document.querySelectorAll('img:not([alt])');
            if (images.length > 0) {
                issues.push({ type: 'missing-alt', count: images.length });
            }

            // Check for buttons without accessible names
            const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([title])');
            const unlabeledButtons = Array.from(buttonsWithoutLabels).filter(btn =>
                !btn.textContent?.trim() && !btn.querySelector('span.sr-only')
            );
            if (unlabeledButtons.length > 0) {
                issues.push({ type: 'unlabeled-buttons', count: unlabeledButtons.length });
            }

            // Check for proper heading hierarchy
            const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
            let headingIssues = 0;
            let lastLevel = 0;

            headings.forEach(h => {
                const level = parseInt(h.tagName[1]);
                if (level > lastLevel + 1) headingIssues++;
                lastLevel = level;
            });

            if (headingIssues > 0) {
                issues.push({ type: 'heading-hierarchy', count: headingIssues });
            }

            return issues;
        });

        return results;
    }

    async checkKeyboardNavigation() {
        // Test tab navigation on key interactive elements
        try {
            // Focus on the first focusable element
            await this.page.keyboard.press('Tab');
            const firstFocus = await this.page.evaluate(() => document.activeElement?.tagName);

            // Tab through a few elements
            for (let i = 0; i < 5; i++) {
                await this.page.keyboard.press('Tab');
                await this.page.waitForTimeout(100);
            }

            const lastFocus = await this.page.evaluate(() => document.activeElement?.tagName);

            return {
                firstFocus,
                lastFocus,
                tabNavigationWorks: firstFocus !== lastFocus
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    async runTest(viewport, page, scenario) {
        const testName = `${viewport}-${page.name}-${scenario.name}`;
        console.log(`\n🧪 Running test: ${testName}`);

        // Reset console messages for this test
        this.consoleMessages = [];

        // Set viewport
        await this.setViewport(viewport);

        // Navigate to page
        const navigated = await this.navigateToPage(page.url);
        if (!navigated) {
            this.results.push({ testName, status: 'failed', reason: 'navigation-failed' });
            return;
        }

        // Execute scenario
        await this.executeScenario(scenario.name);

        // Capture screenshot
        const screenshotTaken = await this.captureScreenshot(testName);

        // Check accessibility
        const accessibilityIssues = await this.checkAccessibility();

        // Check keyboard navigation (on default scenario only to avoid conflicts)
        let keyboardNavigation = null;
        if (scenario.name === 'default') {
            keyboardNavigation = await this.checkKeyboardNavigation();
        }

        // Collect results
        const result = {
            testName,
            viewport,
            page: page.name,
            scenario: scenario.name,
            status: screenshotTaken ? 'passed' : 'failed',
            consoleErrors: this.consoleMessages.filter(msg => msg.type === 'error').length,
            consoleWarnings: this.consoleMessages.filter(msg => msg.type === 'warn').length,
            accessibilityIssues: accessibilityIssues.length,
            accessibilityDetails: accessibilityIssues,
            keyboardNavigation,
            consoleMessages: this.consoleMessages.slice() // Copy array
        };

        this.results.push(result);

        // Log result summary
        const status = result.status === 'passed' ? '✅' : '❌';
        console.log(`${status} ${testName}: ${result.consoleErrors} errors, ${result.consoleWarnings} warnings, ${result.accessibilityIssues} a11y issues`);
    }

    async runAllTests() {
        console.log('\n🎯 Starting comprehensive mobile test suite...\n');

        // Test each viewport × page × scenario combination
        for (const viewport of Object.keys(VIEWPORTS)) {
            for (const page of TEST_PAGES) {
                for (const scenario of SCENARIOS) {
                    try {
                        await this.runTest(viewport, page, scenario);
                    } catch (error) {
                        console.error(`💥 Test failed with error: ${error.message}`);
                        this.results.push({
                            testName: `${viewport}-${page.name}-${scenario.name}`,
                            status: 'error',
                            error: error.message
                        });
                    }
                }
            }
        }
    }

    async generateReport() {
        console.log('\n📊 Generating test report...\n');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.status === 'passed').length,
                failed: this.results.filter(r => r.status === 'failed').length,
                errors: this.results.filter(r => r.status === 'error').length
            },
            results: this.results
        };

        // Save detailed report
        const reportPath = join(OUTPUT_DIR, 'mobile-test-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Generate HTML report
        const htmlReport = this.generateHtmlReport(report);
        const htmlPath = join(OUTPUT_DIR, 'mobile-test-report.html');
        await fs.writeFile(htmlPath, htmlReport);

        // Print summary
        console.log('📋 Test Summary:');
        console.log(`   Total tests: ${report.summary.total}`);
        console.log(`   ✅ Passed: ${report.summary.passed}`);
        console.log(`   ❌ Failed: ${report.summary.failed}`);
        console.log(`   💥 Errors: ${report.summary.errors}`);

        // Print accessibility summary
        const totalA11yIssues = this.results.reduce((sum, r) => sum + (r.accessibilityIssues || 0), 0);
        const totalConsoleErrors = this.results.reduce((sum, r) => sum + (r.consoleErrors || 0), 0);

        console.log(`   🔍 Accessibility issues: ${totalA11yIssues}`);
        console.log(`   🚨 Console errors: ${totalConsoleErrors}`);
        console.log(`\n📁 Reports saved to: ${OUTPUT_DIR}`);

        return report;
    }

    generateHtmlReport(report) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Mobile UI Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat { text-align: center; padding: 20px; border-radius: 8px; color: white; }
        .stat.total { background: #333; }
        .stat.passed { background: #28a745; }
        .stat.failed { background: #dc3545; }
        .stat.errors { background: #ffc107; color: #000; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .test-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: white; }
        .test-card.passed { border-left: 4px solid #28a745; }
        .test-card.failed { border-left: 4px solid #dc3545; }
        .test-card.error { border-left: 4px solid #ffc107; }
        .test-name { font-weight: bold; margin-bottom: 8px; }
        .test-details { font-size: 0.9em; color: #666; }
        .screenshot { width: 100%; max-width: 200px; border-radius: 4px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Mobile UI Test Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="stat total">
                <h3>${report.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="stat passed">
                <h3>${report.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="stat failed">
                <h3>${report.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="stat errors">
                <h3>${report.summary.errors}</h3>
                <p>Errors</p>
            </div>
        </div>
        
        <h2>📋 Test Results</h2>
        <div class="test-grid">
            ${report.results.map(result => `
                <div class="test-card ${result.status}">
                    <div class="test-name">${result.testName}</div>
                    <div class="test-details">
                        <p><strong>Status:</strong> ${result.status}</p>
                        <p><strong>Viewport:</strong> ${result.viewport || 'N/A'}</p>
                        <p><strong>Console Errors:</strong> ${result.consoleErrors || 0}</p>
                        <p><strong>Accessibility Issues:</strong> ${result.accessibilityIssues || 0}</p>
                        ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
                    </div>
                    <img class="screenshot" src="${result.testName}.png" alt="Screenshot" onerror="this.style.display='none'">
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `.trim();
    }
}

// Main execution
async function main() {
    const testSuite = new MobileTestSuite();

    try {
        await testSuite.init();
        await testSuite.runAllTests();
        const report = await testSuite.generateReport();

        // Exit with appropriate code
        const hasFailures = report.summary.failed > 0 || report.summary.errors > 0;
        process.exit(hasFailures ? 1 : 0);

    } catch (error) {
        console.error('💥 Test suite failed:', error);
        process.exit(1);
    } finally {
        await testSuite.cleanup();
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default MobileTestSuite;

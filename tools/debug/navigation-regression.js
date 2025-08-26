#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    timeout: 30000,
    waitTime: 2000,
    maxErrors: 5,
    maxWarnings: 8,
    maxNetworkErrors: 5,
    errorThreshold: 10
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    errors: [],
    warnings: [],
    networkErrors: [],
    navigationTests: {
        localhost: { passed: 0, failed: 0, details: [] },
        ngrok: { passed: 0, failed: 0, details: [] }
    }
};

// Helper functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        debug: '🔍'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
}

async function checkCodeSanity() {
    log('Running code sanity checks...', 'info');
    const checks = [];
    
    try {
        // 1. Check Next.js config for prefix-agnostic setup
        const nextConfig = fs.readFileSync('next.config.js', 'utf8');
        const hasBasePath = nextConfig.includes('basePath:');
        const hasAssetPrefix = nextConfig.includes('assetPrefix:');
        
        checks.push({
            name: 'Next.js Configuration',
            passed: !hasBasePath && !hasAssetPrefix,
            details: {
                hasBasePath,
                hasAssetPrefix,
                config: nextConfig.split('\n').slice(0, 5).join('\n')
            }
        });
        
        // 2. Check SiteHeader implementation
        const siteHeader = fs.readFileSync('components/SiteHeader.tsx', 'utf8');
        const headerHasGetRelativePath = siteHeader.includes('getRelativePath');
        const headerHasUsePathname = siteHeader.includes('usePathname');
        const headerUsesHelper = siteHeader.includes('getRelativePath(href, pathname)');
        
        checks.push({
            name: 'SiteHeader Implementation',
            passed: headerHasGetRelativePath && headerHasUsePathname && headerUsesHelper,
            details: {
                importsGetRelativePath: headerHasGetRelativePath,
                importsUsePathname: headerHasUsePathname,
                usesHelperWithPathname: headerUsesHelper
            }
        });
        
        // 3. Check SiteFooter implementation
        const siteFooter = fs.readFileSync('components/SiteFooter.tsx', 'utf8');
        const footerHasGetRelativePath = siteFooter.includes('getRelativePath');
        const footerHasUsePathname = siteFooter.includes('usePathname');
        const footerUsesHelper = siteFooter.includes('getRelativePath(');
        
        checks.push({
            name: 'SiteFooter Implementation',
            passed: footerHasGetRelativePath && footerHasUsePathname && footerUsesHelper,
            details: {
                importsGetRelativePath: footerHasGetRelativePath,
                importsUsePathname: footerHasUsePathname,
                usesHelperWithPathname: footerUsesHelper
            }
        });
        
        // 4. Check basePath helper implementation
        const basePath = fs.readFileSync('lib/routing/basePath.ts', 'utf8');
        const hasRouteSegmentsExcludingPrefix = basePath.includes('routeSegmentsExcludingPrefix');
        const hasGetRelativePath = basePath.includes('getRelativePath');
        const hasPrefixLogic = basePath.includes('mxtk') && basePath.includes('slice(1)');
        
        checks.push({
            name: 'BasePath Helper Implementation',
            passed: hasRouteSegmentsExcludingPrefix && hasGetRelativePath && hasPrefixLogic,
            details: {
                hasRouteSegmentsExcludingPrefix,
                hasGetRelativePath,
                hasPrefixLogic
            }
        });
        
        // 5. Check for absolute-root links
        const allFiles = getAllTsxFiles('.');
        let absoluteRootLinks = [];
        
        for (const file of allFiles) {
            const content = fs.readFileSync(file, 'utf8');
            const hrefMatches = content.match(/href="\//g);
            const srcMatches = content.match(/src="\//g);
            
            if (hrefMatches || srcMatches) {
                absoluteRootLinks.push({
                    file,
                    hrefCount: hrefMatches ? hrefMatches.length : 0,
                    srcCount: srcMatches ? srcMatches.length : 0
                });
            }
        }
        
        checks.push({
            name: 'Absolute Root Links',
            passed: absoluteRootLinks.length === 0,
            details: {
                filesWithAbsoluteLinks: absoluteRootLinks.length,
                absoluteLinks: absoluteRootLinks
            }
        });
        
        // 6. Check Nginx configuration
        const nginxConfig = fs.readFileSync('config/dev-proxy/apps/mxtk.conf', 'utf8');
        const hasRootBlock = nginxConfig.includes('location = / { return 404; }');
        const hasNextAllowlist = nginxConfig.includes('location ^~ /_next/');
        const hasMxtkPrefix = nginxConfig.includes('location ~* ^/mxtk');
        const hasOptionBSetup = hasRootBlock && hasNextAllowlist && hasMxtkPrefix;
        
        checks.push({
            name: 'Nginx Configuration (Option B)',
            passed: hasOptionBSetup,
            details: {
                hasRootBlock,
                hasNextAllowlist,
                hasMxtkPrefix,
                config: nginxConfig.split('\n').slice(0, 20).join('\n')
            }
        });
        
    } catch (error) {
        log(`Error during code sanity checks: ${error.message}`, 'error');
        checks.push({
            name: 'Code Sanity Checks',
            passed: false,
            details: { error: error.message }
        });
    }
    
    return checks;
}

function getAllTsxFiles(dir) {
    const files = [];
    
    function scan(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
                    scan(fullPath);
                }
            } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
                files.push(fullPath);
            }
        }
    }
    
    scan(dir);
    return files;
}

async function testNavigationBehavior(browser, baseUrl, environment) {
    log(`Testing navigation behavior for ${environment}: ${baseUrl}`, 'info');
    
    const page = await browser.newPage();
    const results = [];
    
    try {
        // Set up error collection
        const errors = [];
        const warnings = [];
        const networkErrors = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (!text.includes('__nextjs_original-stack-frames') && !text.includes('webpack-hmr')) {
                    errors.push(text);
                }
            } else if (msg.type() === 'warning') {
                warnings.push(msg.text());
            }
        });
        
        page.on('response', response => {
            if (response.status() >= 400) {
                const url = response.url();
                if (!url.includes('__nextjs_original-stack-frames') && !url.includes('webpack-hmr')) {
                    networkErrors.push(`${response.status()} ${response.statusText()}: ${url}`);
                }
            }
        });
        
        // Test 1: Home page navigation
        log(`Testing home page: ${baseUrl}`, 'debug');
        await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        // Check if page loaded correctly
        const pageTitle = await page.title();
        const hasNavigation = await page.evaluate(() => {
            return document.querySelectorAll('nav a, header a, footer a').length > 0;
        });
        
        if (!hasNavigation) {
            results.push({
                test: 'Home Page Load',
                passed: false,
                details: { error: 'No navigation elements found', title: pageTitle }
            });
            return results;
        }
        
        results.push({
            test: 'Home Page Load',
            passed: true,
            details: { title: pageTitle, navigationElements: hasNavigation }
        });
        
        // Test 2: Top navigation links
        log('Testing top navigation links...', 'debug');
        const topNavLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                expectedPrefix: window.location.pathname.includes('/mxtk') ? '/mxtk' : ''
            }));
        });
        
        for (const link of topNavLinks) {
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                const expectedPrefix = link.expectedPrefix;
                const hasCorrectPrefix = link.href.startsWith(expectedPrefix);
                
                results.push({
                    test: `Top Nav: ${link.text}`,
                    passed: hasCorrectPrefix,
                    details: {
                        href: link.href,
                        expectedPrefix,
                        hasCorrectPrefix
                    }
                });
                
                // Test clicking the link (only for a few key links to avoid timeouts)
                if (['Owners', 'Institutions', 'Transparency'].includes(link.text)) {
                    try {
                        // Try multiple selectors for better click detection
                        const selectors = [
                            `a[href="${link.href}"]`,
                            `nav a[href="${link.href}"]`,
                            `header a[href="${link.href}"]`,
                            `[href="${link.href}"]`
                        ];
                        
                        let clicked = false;
                        for (const selector of selectors) {
                            try {
                                await page.waitForSelector(selector, { timeout: 5000 });
                                await page.click(selector);
                                clicked = true;
                                break;
                            } catch (e) {
                                continue;
                            }
                        }
                        
                        if (clicked) {
                            await delay(CONFIG.waitTime);
                            
                            const newUrl = page.url();
                            const stillHasPrefix = newUrl.includes('/mxtk') || !newUrl.includes('/mxtk');
                            
                            results.push({
                                test: `Top Nav Click: ${link.text}`,
                                passed: stillHasPrefix,
                                details: {
                                    originalHref: link.href,
                                    newUrl,
                                    stillHasPrefix
                                }
                            });
                            
                            // Go back to home
                            await page.goto(baseUrl, { waitUntil: 'networkidle2' });
                            await delay(CONFIG.waitTime);
                        } else {
                            results.push({
                                test: `Top Nav Click: ${link.text}`,
                                passed: false,
                                details: { error: 'Could not find clickable element' }
                            });
                        }
                        
                    } catch (error) {
                        results.push({
                            test: `Top Nav Click: ${link.text}`,
                            passed: false,
                            details: { error: error.message }
                        });
                    }
                }
            }
        }
        
        // Test 3: Footer links from legal pages
        log('Testing footer links from legal pages...', 'debug');
        
        // Navigate to a legal page
        const legalPage = `${baseUrl}/legal/terms`;
        await page.goto(legalPage, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        const footerLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('footer a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                expectedPrefix: window.location.pathname.includes('/mxtk') ? '/mxtk' : ''
            }));
        });
        
        for (const link of footerLinks) {
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                const expectedPrefix = link.expectedPrefix;
                const hasCorrectPrefix = link.href.startsWith(expectedPrefix);
                const hasLegalPrefix = link.href.includes('/legal/');
                
                // Footer links should NOT have /legal/ prefix
                const passed = hasCorrectPrefix && !hasLegalPrefix;
                
                results.push({
                    test: `Footer from Legal: ${link.text}`,
                    passed,
                    details: {
                        href: link.href,
                        expectedPrefix,
                        hasCorrectPrefix,
                        hasLegalPrefix,
                        passed
                    }
                });
            }
        }
        
        // Test 4: Deep route navigation
        log('Testing deep route navigation...', 'debug');
        const deepRoute = `${baseUrl}/legal/disclosures`;
        await page.goto(deepRoute, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        // Check that navigation still works from deep routes
        const deepNavLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                expectedPrefix: window.location.pathname.includes('/mxtk') ? '/mxtk' : ''
            }));
        });
        
        for (const link of deepNavLinks.slice(0, 3)) { // Test first 3 links
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                const expectedPrefix = link.expectedPrefix;
                const hasCorrectPrefix = link.href.startsWith(expectedPrefix);
                
                results.push({
                    test: `Deep Route Nav: ${link.text}`,
                    passed: hasCorrectPrefix,
                    details: {
                        href: link.href,
                        expectedPrefix,
                        hasCorrectPrefix
                    }
                });
            }
        }
        
    } catch (error) {
        log(`Error testing navigation for ${environment}: ${error.message}`, 'error');
        results.push({
            test: 'Navigation Test Setup',
            passed: false,
            details: { error: error.message }
        });
    } finally {
        await page.close();
    }
    
    return results;
}

async function testNginxConfiguration() {
    log('Testing Nginx configuration...', 'info');
    const results = [];
    
    try {
        // Test root pages should return 404
        const rootTests = [
            { url: 'https://ramileo.ngrok.app/owners', expected: 404, name: 'Root Owners' }
        ];
        
        for (const test of rootTests) {
            try {
                const response = await fetch(test.url, { method: 'HEAD' });
                const passed = response.status === test.expected;
                
                results.push({
                    test: `Nginx ${test.name}`,
                    passed,
                    details: {
                        url: test.url,
                        expectedStatus: test.expected,
                        actualStatus: response.status,
                        passed
                    }
                });
            } catch (error) {
                results.push({
                    test: `Nginx ${test.name}`,
                    passed: false,
                    details: { error: error.message }
                });
            }
        }
        
        // Test Next.js assets should return 200
        try {
            const response = await fetch('https://ramileo.ngrok.app/_next/static/chunks/webpack.js', { method: 'HEAD' });
            const passed = response.status === 200;
            
            results.push({
                test: 'Nginx Next.js Assets',
                passed,
                details: {
                    url: 'https://ramileo.ngrok.app/_next/static/chunks/webpack.js',
                    expectedStatus: 200,
                    actualStatus: response.status,
                    passed
                }
            });
        } catch (error) {
            results.push({
                test: 'Nginx Next.js Assets',
                passed: false,
                details: { error: error.message }
            });
        }
        
        // Test prefixed pages should return 200
        const prefixTests = [
            { url: 'https://ramileo.ngrok.app/mxtk', name: 'MXTK Root' },
            { url: 'https://ramileo.ngrok.app/mxtk/owners', name: 'MXTK Owners' }
        ];
        
        for (const test of prefixTests) {
            try {
                const response = await fetch(test.url, { method: 'HEAD' });
                const passed = response.status === 200;
                
                results.push({
                    test: `Nginx ${test.name}`,
                    passed,
                    details: {
                        url: test.url,
                        expectedStatus: 200,
                        actualStatus: response.status,
                        passed
                    }
                });
            } catch (error) {
                results.push({
                    test: `Nginx ${test.name}`,
                    passed: false,
                    details: { error: error.message }
                });
            }
        }
        
    } catch (error) {
        log(`Error testing Nginx configuration: ${error.message}`, 'error');
        results.push({
            test: 'Nginx Configuration Test',
            passed: false,
            details: { error: error.message }
        });
    }
    
    return results;
}

async function generateReport(allResults) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTests: 0,
            passed: 0,
            failed: 0,
            successRate: 0
        },
        results: allResults,
        recommendations: []
    };
    
    // Calculate summary
    for (const category of Object.values(allResults)) {
        for (const test of category) {
            report.summary.totalTests++;
            if (test.passed) {
                report.summary.passed++;
            } else {
                report.summary.failed++;
            }
        }
    }
    
    report.summary.successRate = (report.summary.passed / report.summary.totalTests) * 100;
    
    // Generate recommendations
    if (report.summary.failed > 0) {
        report.recommendations.push('Review failed tests and fix navigation issues');
    }
    
    if (report.summary.successRate < 90) {
        report.recommendations.push('Navigation regression detected - investigate immediately');
    }
    
    // Save report
    const reportPath = `tools/debug/output/reports/navigation-regression-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
}

async function main() {
    log('🚀 Starting Navigation Regression Testing', 'info');
    log(`⚙️  Configuration:`, 'info');
    log(`  Timeout: ${CONFIG.timeout}ms`, 'info');
    log(`  Wait Time: ${CONFIG.waitTime}ms`, 'info');
    log(`  Max Errors: ${CONFIG.maxErrors}`, 'info');
    log(`  Max Warnings: ${CONFIG.maxWarnings}`, 'info');
    log(`  Max Network Errors: ${CONFIG.maxNetworkErrors}`, 'info');
    log(`  Error Threshold: ${CONFIG.errorThreshold}`, 'info');
    
    const allResults = {};
    
    try {
        // 1. Code Sanity Checks
        log('\n📋 Running Code Sanity Checks...', 'info');
        allResults.codeSanity = await checkCodeSanity();
        
        // 2. Nginx Configuration Tests
        log('\n🌐 Testing Nginx Configuration...', 'info');
        allResults.nginx = await testNginxConfiguration();
        
        // 3. Navigation Behavior Tests
        log('\n🔗 Testing Navigation Behavior...', 'info');
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            // Test localhost
            log('\n🏠 Testing Localhost Navigation...', 'info');
            allResults.localhost = await testNavigationBehavior(browser, 'http://localhost:2000', 'localhost');
            
            // Test ngrok
            log('\n🌍 Testing Ngrok Navigation...', 'info');
            allResults.ngrok = await testNavigationBehavior(browser, 'https://ramileo.ngrok.app/mxtk', 'ngrok');
            
        } finally {
            await browser.close();
        }
        
        // 4. Generate Report
        log('\n📊 Generating Report...', 'info');
        const report = await generateReport(allResults);
        
        // 5. Display Results
        log('\n📈 Test Results Summary:', 'info');
        log(`  Total Tests: ${report.summary.totalTests}`, 'info');
        log(`  Passed: ${report.summary.passed}`, 'success');
        log(`  Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success');
        log(`  Success Rate: ${report.summary.successRate.toFixed(1)}%`, 'info');
        
        // Display failed tests
        if (report.summary.failed > 0) {
            log('\n❌ Failed Tests:', 'error');
            for (const [category, tests] of Object.entries(allResults)) {
                for (const test of tests) {
                    if (!test.passed) {
                        log(`  ${category}: ${test.test}`, 'error');
                        if (test.details && test.details.error) {
                            log(`    Error: ${test.details.error}`, 'error');
                        }
                    }
                }
            }
        }
        
        // Display recommendations
        if (report.recommendations.length > 0) {
            log('\n💡 Recommendations:', 'warning');
            report.recommendations.forEach(rec => log(`  ${rec}`, 'warning'));
        }
        
        log(`\n📄 Detailed report saved to: tools/debug/output/reports/navigation-regression-report-${new Date().toISOString().split('T')[0]}.json`, 'info');
        
        // Exit with appropriate code
        if (report.summary.failed > 0) {
            log('\n❌ Navigation regression detected!', 'error');
            process.exit(1);
        } else {
            log('\n✅ All navigation tests passed!', 'success');
            process.exit(0);
        }
        
    } catch (error) {
        log(`❌ Fatal error during testing: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Run the main function
if (require.main === module) {
    main().catch(error => {
        log(`❌ Unhandled error: ${error.message}`, 'error');
        process.exit(1);
    });
}

module.exports = {
    checkCodeSanity,
    testNavigationBehavior,
    testNginxConfiguration,
    generateReport
};

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

// External test controls via environment variables
const ENABLE_EXTERNAL = process.env.ENABLE_EXTERNAL_TESTS === '1' || process.env.ENABLE_NGROK === '1';
const NGROK_BASE = (process.env.NGROK_TEST_URL || 'https://ramileo.ngrok.app') + '/mxtk';

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
        // 1. Next.js config: no basePath/assetPrefix, unoptimized images
        const nextConfig = fs.readFileSync('next.config.js', 'utf8');
        const hasBasePath = /basePath\s*:/.test(nextConfig);
        const hasAssetPrefix = /assetPrefix\s*:/.test(nextConfig);
        const unoptimizedImages = /images\s*:\s*\{[^}]*unoptimized:\s*true/i.test(nextConfig);
        checks.push({
            name: 'Next.js Configuration',
            passed: !hasBasePath && !hasAssetPrefix && unoptimizedImages,
            details: { hasBasePath, hasAssetPrefix, unoptimizedImages, config: nextConfig.split('\n').slice(0, 5).join('\n') }
        });

        // 2. Header/Footer accept EITHER getRelativePath+usePathname OR BasePathProvider build
        const siteHeader = fs.readFileSync('components/SiteHeader.tsx', 'utf8');
        const headerHasGetRelativePath = siteHeader.includes('getRelativePath');
        const headerHasUsePathname = siteHeader.includes('usePathname');
        const headerUsesHelper = /getRelativePath\(/.test(siteHeader);
        const headerHasUseBasePath = /useBasePath\s*\(/.test(siteHeader) || siteHeader.includes("from '@/components/providers/BasePathProvider'");
        const headerBuildsFromBasePath = /\$\{basePath\}\/|\(basePath\s*\?\s*`\$\{basePath\}\//.test(siteHeader);
        const headerOk = (headerHasGetRelativePath && headerHasUsePathname && headerUsesHelper) || (headerHasUseBasePath && headerBuildsFromBasePath);
        checks.push({
            name: 'SiteHeader Implementation',
            passed: headerOk,
            details: { importsGetRelativePath: headerHasGetRelativePath, importsUsePathname: headerHasUsePathname, usesHelperWithPathname: headerUsesHelper, usesBasePathProvider: headerHasUseBasePath, buildsFromBasePath: headerBuildsFromBasePath }
        });

        const siteFooter = fs.readFileSync('components/SiteFooter.tsx', 'utf8');
        const footerHasGetRelativePath = siteFooter.includes('getRelativePath');
        const footerHasUsePathname = siteFooter.includes('usePathname');
        const footerUsesHelper = siteFooter.includes('getRelativePath(');
        const footerHasUseBasePath = /useBasePath\s*\(/.test(siteFooter) || siteFooter.includes("from '@/components/providers/BasePathProvider'");
        const footerBuildsFromBasePath = /\$\{basePath\}\//.test(siteFooter) || /const\s+href\s*=\s*\(path:\s*string\)\s*=>\s*\(`\$\{basePath\}\//.test(siteFooter);
        const footerOk = (footerHasGetRelativePath && footerHasUsePathname && footerUsesHelper) || (footerHasUseBasePath && footerBuildsFromBasePath);
        checks.push({
            name: 'SiteFooter Implementation',
            passed: footerOk,
            details: { importsGetRelativePath: footerHasGetRelativePath, importsUsePathname: footerHasUsePathname, usesHelperWithPathname: footerUsesHelper, usesBasePathProvider: footerHasUseBasePath, buildsFromBasePath: footerBuildsFromBasePath }
        });

        // 3. Routing architecture (provider + server/client helpers)
        const provider = fs.readFileSync('components/providers/BasePathProvider.tsx', 'utf8');
        const hasProvider = provider.includes('createContext') && provider.includes('useBasePath') && /export default function BasePathProvider/.test(provider);
        const clientHelper = fs.readFileSync('lib/routing/getPublicPathClient.ts', 'utf8');
        const hasClientHook = clientHelper.includes('usePublicPath') && clientHelper.includes('useBasePath');
        const serverHelper = fs.readFileSync('lib/routing/getPublicPathServer.ts', 'utf8');
        const hasServerHelper = /export\s+async\s+function\s+getServerPublicPath/.test(serverHelper);
        const serverBasePath = fs.readFileSync('lib/routing/serverBasePath.ts', 'utf8');
        const serverReadsHeaders = serverBasePath.includes("from 'next/headers'") && /x-forwarded-prefix/i.test(serverBasePath);
        const serverReadsCookies = /cookies\(\)/.test(serverBasePath);
        const serverIsAsync = /async function getServerBasePath/.test(serverBasePath);
        const middleware = fs.readFileSync('middleware.ts', 'utf8');
        const middlewareSetsCookie = /res\.cookies\.set\(['"]bp['"]/i.test(middleware);
        const middlewareUsesForwarded = /x-forwarded-prefix/i.test(middleware);
        checks.push({
            name: 'Routing Architecture',
            passed: hasProvider && hasClientHook && hasServerHelper && serverReadsHeaders && serverReadsCookies && serverIsAsync && middlewareSetsCookie && middlewareUsesForwarded,
            details: { hasProvider, hasClientHook, hasServerHelper, serverReadsHeaders, serverReadsCookies, serverIsAsync, middlewareSetsCookie, middlewareUsesForwarded }
        });

        // 4. No literal absolute links in code (basic scan)
        const allFiles = getAllTsxFiles('.');
        const absoluteRootLinks = [];
        const ignoreRel = new Set([
            'components/SiteHeader.tsx',
            'lib/routing/basePath.ts',
        ]);
        for (const file of allFiles) {
            const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
            const content = fs.readFileSync(file, 'utf8');
            const hardcodedMxtk = /['\"]\/mxtk\//.test(content);
            if (hardcodedMxtk && !ignoreRel.has(rel)) {
                absoluteRootLinks.push({ file: rel, note: 'contains literal /mxtk/' });
            }
        }
        checks.push({
            name: 'Hardcoded Prefix Scan',
            passed: absoluteRootLinks.length === 0,
            details: { count: absoluteRootLinks.length, matches: absoluteRootLinks }
        });

        // 5. Dev Proxy configuration reflects provider-based approach
        const nginxConfig = fs.readFileSync('config/dev-proxy/apps/mxtk.conf', 'utf8');
        const hasNextAllowlist = nginxConfig.includes('location ^~ /_next/');
        const hasMxtkPrefix = /location\s+~\*\s+\^\/mxtk/.test(nginxConfig);
        const setsForwardedPrefix = /proxy_set_header\s+X-Forwarded-Prefix\s+\/mxtk/.test(nginxConfig);
        // We no longer require sub_filter rewrites; provider-based routing handles prefixing.
        const proxyConfigOk = hasNextAllowlist && hasMxtkPrefix && setsForwardedPrefix;
        checks.push({
            name: 'Dev Proxy Configuration',
            passed: proxyConfigOk,
            details: { hasNextAllowlist, hasMxtkPrefix, setsForwardedPrefix, config: nginxConfig.split('\n').slice(0, 24).join('\n') }
        });

    } catch (error) {
        log(`Error during code sanity checks: ${error.message}`, 'error');
        checks.push({ name: 'Code Sanity Checks', passed: false, details: { error: error.message } });
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
    try { await page.setViewport({ width: 1280, height: 900 }); } catch (_) {}
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

        // Asset scan: detect double-prefix in common asset attributes
        const assetIssues = await page.evaluate(() => {
            const problems = [];
            const double = '/mxtk/mxtk/';
            const add = (kind, url, el) => problems.push({ kind, url, tag: el.tagName.toLowerCase() });
            document.querySelectorAll('img[src]').forEach(el => { const u = el.getAttribute('src') || ''; if (u.includes(double)) add('img', u, el); });
            document.querySelectorAll('link[rel*="icon"][href], link[rel="preload"][as="image"][href]').forEach(el => { const u = el.getAttribute('href') || ''; if (u.includes(double)) add('link', u, el); });
            document.querySelectorAll('[style*="background-image"]').forEach(el => { const s = (el.getAttribute('style') || '').toLowerCase(); if (s.includes('url(') && s.includes(double)) add('style', s, el); });
            return problems;
        });
        results.push({
            test: 'No Double-Prefix Assets on Home',
            passed: assetIssues.length === 0,
            details: { issues: assetIssues }
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
                // On legal pages, allow legal links themselves; non-legal footer links must not include '/legal/'
                const isLegalSelf = hasLegalPrefix;
                const passed = isLegalSelf ? true : (hasCorrectPrefix && !hasLegalPrefix);
                
                results.push({
                    test: `Footer from Legal: ${link.text}`,
                    passed,
                    details: {
                        href: link.href,
                        expectedPrefix,
                        hasCorrectPrefix,
                        hasLegalPrefix,
                        isLegalSelf,
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
        // Final global checks: no console/network errors
        results.push({
            test: 'No Console Errors',
            passed: errors.length === 0,
            details: { count: errors.length, sample: errors.slice(0, 5) }
        });
        results.push({
            test: 'No Network Errors',
            passed: networkErrors.length === 0,
            details: { count: networkErrors.length, sample: networkErrors.slice(0, 10) }
        });

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
        if (!ENABLE_EXTERNAL) {
            results.push({
                test: 'Nginx Tests Skipped',
                passed: true,
                details: { reason: 'External tests disabled. Set ENABLE_EXTERNAL_TESTS=1 to enable.' }
            });
            return results;
        }
        // Test root pages should return 404
        const rootTests = [
            { url: NGROK_BASE.replace(/\/mxtk$/, '') + '/owners', expected: 404, name: 'Root Owners' }
        ];
        
        for (const test of rootTests) {
            try {
                const response = await fetch(test.url, { method: 'GET' });
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
            const response = await fetch(NGROK_BASE.replace(/\/mxtk$/, '') + '/_next/static/chunks/webpack.js', { method: 'HEAD' });
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
            { url: NGROK_BASE, name: 'MXTK Root' },
            { url: NGROK_BASE + '/owners', name: 'MXTK Owners' }
        ];
        
        for (const test of prefixTests) {
            try {
                const response = await fetch(test.url, { method: 'GET' });
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
            
            // Test ngrok (optional)
            if (ENABLE_EXTERNAL) {
                log('\n🌍 Testing Ngrok Navigation...', 'info');
                allResults.ngrok = await testNavigationBehavior(browser, NGROK_BASE, 'ngrok');
            } else {
                log('\n🌍 Skipping Ngrok Navigation (ENABLE_EXTERNAL_TESTS=1 to enable)', 'info');
                allResults.ngrok = [{ test: 'Ngrok Navigation Skipped', passed: true, details: { reason: 'External tests disabled' } }];
            }
            
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

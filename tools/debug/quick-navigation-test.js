#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

// Configuration
const CONFIG = {
    timeout: 30000,
    waitTime: 2000
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
                hasAssetPrefix
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
        
        // 5. Check Nginx configuration
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
                hasMxtkPrefix
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

async function testNavigationLinks(browser, baseUrl, environment) {
    log(`Testing navigation links for ${environment}: ${baseUrl}`, 'info');
    
    const page = await browser.newPage();
    const results = [];
    
    try {
        // Navigate to home page
        await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        // Test 1: Check top navigation links
        const topNavLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                currentPath: window.location.pathname
            }));
        });
        
        log(`Found ${topNavLinks.length} top navigation links`, 'debug');
        
        for (const link of topNavLinks) {
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                // Links should be relative (not absolute with /mxtk prefix)
                // This is the correct behavior - the helper generates relative paths
                const isRelative = !link.href.startsWith('/');
                const isNgrok = link.currentPath.includes('/mxtk');
                
                // For both localhost and ngrok, links should be relative
                const passed = isRelative;
                
                results.push({
                    test: `Top Nav: ${link.text}`,
                    passed,
                    details: {
                        href: link.href,
                        currentPath: link.currentPath,
                        isRelative,
                        isNgrok,
                        passed
                    }
                });
            }
        }
        
        // Test 2: Navigate to legal page and check footer links
        const legalPage = `${baseUrl}/legal/terms`;
        await page.goto(legalPage, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        const footerLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('footer a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                currentPath: window.location.pathname
            }));
        });
        
        log(`Found ${footerLinks.length} footer links`, 'debug');
        
        for (const link of footerLinks) {
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                const isNgrok = link.currentPath.includes('/mxtk');
                const isRelative = !link.href.startsWith('/');
                const hasLegalPrefix = link.href.includes('/legal/');
                
                // Footer links should be relative
                // Legal links (Terms, Privacy, Disclosures) should have /legal/ prefix
                // Non-legal links should NOT have /legal/ prefix
                const isLegalLink = ['Terms', 'Privacy', 'Disclosures'].includes(link.text);
                const passed = isRelative && (isLegalLink ? hasLegalPrefix : !hasLegalPrefix);
                
                results.push({
                    test: `Footer from Legal: ${link.text}`,
                    passed,
                    details: {
                        href: link.href,
                        currentPath: link.currentPath,
                        isRelative,
                        hasLegalPrefix,
                        isLegalLink,
                        passed,
                        isNgrok
                    }
                });
            }
        }
        
        // Test 3: Check deep route navigation
        const deepRoute = `${baseUrl}/legal/disclosures`;
        await page.goto(deepRoute, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
        await delay(CONFIG.waitTime);
        
        const deepNavLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                currentPath: window.location.pathname
            }));
        });
        
        // Test first 3 deep route links
        for (const link of deepNavLinks.slice(0, 3)) {
            if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                const isNgrok = link.currentPath.includes('/mxtk');
                const isRelative = !link.href.startsWith('/');
                
                // Deep route links should also be relative
                const passed = isRelative;
                
                results.push({
                    test: `Deep Route Nav: ${link.text}`,
                    passed,
                    details: {
                        href: link.href,
                        currentPath: link.currentPath,
                        isRelative,
                        isNgrok,
                        passed
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

async function main() {
    log('🚀 Starting Quick Navigation Test', 'info');
    
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
            allResults.localhost = await testNavigationLinks(browser, 'http://localhost:2000', 'localhost');
            
            // Test ngrok
            log('\n🌍 Testing Ngrok Navigation...', 'info');
            allResults.ngrok = await testNavigationLinks(browser, 'https://ramileo.ngrok.app/mxtk', 'ngrok');
            
        } finally {
            await browser.close();
        }
        
        // 4. Display Results
        log('\n📈 Test Results Summary:', 'info');
        
        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        
        for (const [category, tests] of Object.entries(allResults)) {
            log(`\n${category.toUpperCase()}:`, 'info');
            for (const test of tests) {
                totalTests++;
                if (test.passed) {
                    passedTests++;
                    log(`  ✅ ${test.test}`, 'success');
                } else {
                    failedTests++;
                    log(`  ❌ ${test.test}`, 'error');
                    if (test.details && test.details.error) {
                        log(`    Error: ${test.details.error}`, 'error');
                    }
                }
            }
        }
        
        const successRate = (passedTests / totalTests) * 100;
        
        log(`\n📊 Summary:`, 'info');
        log(`  Total Tests: ${totalTests}`, 'info');
        log(`  Passed: ${passedTests}`, 'success');
        log(`  Failed: ${failedTests}`, failedTests > 0 ? 'error' : 'success');
        log(`  Success Rate: ${successRate.toFixed(1)}%`, 'info');
        
        if (failedTests > 0) {
            log('\n❌ Some tests failed!', 'error');
            process.exit(1);
        } else {
            log('\n✅ All tests passed!', 'success');
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
    testNavigationLinks,
    testNginxConfiguration
};

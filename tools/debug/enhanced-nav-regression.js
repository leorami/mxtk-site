#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Enhanced Configuration with more thorough testing
const CONFIG = {
    timeout: 60000,
    waitTime: 3000,
    // Fail-fast thresholds (env-configurable)
    maxErrors: parseInt(process.env.MAX_ERRORS || '5', 10),
    maxWarnings: parseInt(process.env.MAX_WARNINGS || '10', 10),
    maxNetworkErrors: parseInt(process.env.MAX_NETWORK || '6', 10),
    errorThreshold: parseInt(process.env.ERROR_THRESHOLD || '10', 10),
    // Additional test pages
    testPages: [
        '/',
        '/owners',
        '/institutions', 
        '/transparency',
        '/ecosystem',
        '/whitepaper',
        '/faq',
        '/mxtk-cares',
        '/resources',
        '/media',
        '/the-team',
        '/careers',
        '/contact-us',
        '/roadmap',
        '/legal/terms',
        '/legal/privacy',
        '/legal/disclosures'
    ],
    // API endpoints to test
    apiEndpoints: [
        '/api/health',
        '/api/debug',
        '/api/pools',
        '/api/token'
    ]
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
    pageTests: {
        localhost: { passed: 0, failed: 0, details: [] },
        ngrok: { passed: 0, failed: 0, details: [] }
    }
};

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

// Enhanced error filtering - be more permissive to catch real issues
function isRelevantError(message) {
    const ignorePatterns = [
        '__nextjs_original-stack-frames',
        'webpack-hmr',
        'only on the client',
        'Chrome extensions'
    ];
    return !ignorePatterns.some(pattern => message.includes(pattern));
}

function isRelevantWarning(message) {
    const ignorePatterns = [
        'Download the React DevTools'
    ];
    return !ignorePatterns.some(pattern => message.includes(pattern));
}

async function testPageThoroughly(page, baseUrl, pagePath, environment) {
    const fullUrl = baseUrl + pagePath;
    const results = [];
    
    log(`Testing page: ${fullUrl}`, 'debug');
    
    try {
        // Enhanced error/warning collection
        const errors = [];
        const warnings = [];
        const networkErrors = [];
        const pageErrors = [];
        
        let failFast = false;
        function checkStop() {
            if (
                errors.length >= CONFIG.maxErrors ||
                warnings.length >= CONFIG.maxWarnings ||
                networkErrors.length >= CONFIG.maxNetworkErrors
            ) {
                failFast = true;
                log(`⛔ Fail-fast triggered on ${pagePath}`, 'error');
            }
        }

        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error' && isRelevantError(text)) {
                errors.push({
                    type: 'console',
                    message: text,
                    location: msg.location()
                });
                checkStop();
            } else if (msg.type() === 'warning' && isRelevantWarning(text)) {
                warnings.push({
                    type: 'console', 
                    message: text,
                    location: msg.location()
                });
                checkStop();
            }
        });
        
        page.on('pageerror', error => {
            pageErrors.push({
                type: 'page',
                message: error.message,
                stack: error.stack
            });
        });
        
        page.on('response', response => {
            const status = response.status();
            const url = response.url();
            if (status >= 400 && isRelevantError(url)) {
                networkErrors.push({
                    status,
                    statusText: response.statusText(),
                    url,
                    headers: response.headers()
                });
                checkStop();
            }
            if (status >= 300 && status < 400) {
                networkErrors.push({ status, url, redirect: response.headers()['location'] });
                checkStop();
            }
        });
        
        // Navigate to page with extended timeout
        const response = await page.goto(fullUrl, { 
            waitUntil: 'networkidle2', 
            timeout: CONFIG.timeout 
        });
        
        await delay(CONFIG.waitTime);
        if (failFast) {
            results.push({ test: `Fail-fast: ${pagePath}`, passed: false, details: { url: fullUrl } });
            return results;
        }
        
        // Check response status
        const pageStatus = response ? response.status() : null;
        if (pageStatus && pageStatus >= 400) {
            results.push({
                test: `Page Load Status: ${pagePath}`,
                passed: false,
                details: {
                    status: pageStatus,
                    statusText: response.statusText(),
                    url: fullUrl
                }
            });
        } else {
            results.push({
                test: `Page Load Status: ${pagePath}`,
                passed: true,
                details: { status: pageStatus, url: fullUrl }
            });
        }
        
        // Check if page rendered content
        const hasContent = await page.evaluate(() => {
            const body = document.body.textContent || '';
            return body.length > 100; // At least some content
        });
        
        results.push({
            test: `Page Content: ${pagePath}`,
            passed: hasContent,
            details: { hasContent, url: fullUrl }
        });
        
        // Check for React hydration errors
        const reactErrors = await page.evaluate(() => {
            return window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.reactDevtoolsAgent?.getErrorInfo?.() || null;
        });
        
        if (reactErrors) {
            results.push({
                test: `React Errors: ${pagePath}`,
                passed: false,
                details: { reactErrors, url: fullUrl }
            });
        }
        
        // Test navigation elements
        const navElements = await page.evaluate(() => {
            return {
                headerLinks: document.querySelectorAll('header a, nav a').length,
                footerLinks: document.querySelectorAll('footer a').length,
                hasLogo: !!document.querySelector('[aria-label*="logo"], [alt*="logo"], .logo'),
                hasMenu: !!document.querySelector('nav, [role="navigation"]')
            };
        });
        
        results.push({
            test: `Navigation Elements: ${pagePath}`,
            passed: navElements.headerLinks > 0 && navElements.footerLinks > 0,
            details: { ...navElements, url: fullUrl }
        });
        
        // Check for background images and assets
        const assetIssues = await page.evaluate((env) => {
            const issues = [];
            const double = env.includes('mxtk') ? '/mxtk/mxtk/' : '//';
            
            // Check images
            document.querySelectorAll('img[src]').forEach(img => {
                const src = img.getAttribute('src') || '';
                if (src.includes(double)) {
                    issues.push({ type: 'img', src, element: img.tagName });
                }
                // Check if image failed to load
                if (!img.complete || img.naturalWidth === 0) {
                    issues.push({ type: 'img-failed', src, element: img.tagName });
                }
            });
            
            // Check CSS background images
            const elementsWithBg = Array.from(document.querySelectorAll('*')).filter(el => {
                const bg = window.getComputedStyle(el).backgroundImage;
                return bg && bg !== 'none';
            });
            
            elementsWithBg.forEach(el => {
                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg.includes(double)) {
                    issues.push({ type: 'bg-double', bg, element: el.tagName });
                }
            });
            
            return issues;
        }, environment);
        
        results.push({
            test: `Asset Loading: ${pagePath}`,
            passed: assetIssues.length === 0,
            details: { issues: assetIssues, url: fullUrl }
        });
        
        // Collect final error counts
        results.push({
            test: `Console Errors: ${pagePath}`,
            passed: errors.length === 0,
            details: { count: errors.length, errors: errors.slice(0, 10), url: fullUrl }
        });
        
        results.push({
            test: `Console Warnings: ${pagePath}`,
            passed: warnings.length === 0,
            details: { count: warnings.length, warnings: warnings.slice(0, 10), url: fullUrl }
        });
        
        results.push({
            test: `Page Errors: ${pagePath}`,
            passed: pageErrors.length === 0,
            details: { count: pageErrors.length, errors: pageErrors.slice(0, 5), url: fullUrl }
        });
        
        results.push({
            test: `Network Errors: ${pagePath}`,
            passed: networkErrors.length === 0,
            details: { count: networkErrors.length, errors: networkErrors.slice(0, 10), url: fullUrl }
        });
        
    } catch (error) {
        log(`Error testing page ${pagePath}: ${error.message}`, 'error');
        results.push({
            test: `Page Test: ${pagePath}`,
            passed: false,
            details: { error: error.message, url: fullUrl }
        });
    }
    
    return results;
}

async function testApiEndpoints(baseUrl, environment) {
    log(`Testing API endpoints for ${environment}: ${baseUrl}`, 'info');
    const results = [];
    
    for (const endpoint of CONFIG.apiEndpoints) {
        const fullUrl = baseUrl.replace('/mxtk', '') + endpoint; // APIs are at root
        
        try {
            const response = await fetch(fullUrl, { 
                method: 'GET',
                timeout: 10000 
            });
            
            const passed = response.status === 200;
            const responseText = await response.text().catch(() => 'Could not read response');
            
            results.push({
                test: `API ${endpoint}`,
                passed,
                details: {
                    status: response.status,
                    statusText: response.statusText,
                    url: fullUrl,
                    responsePreview: responseText.substring(0, 200)
                }
            });
            
        } catch (error) {
            results.push({
                test: `API ${endpoint}`,
                passed: false,
                details: {
                    error: error.message,
                    url: fullUrl
                }
            });
        }
    }
    
    return results;
}

async function runEnhancedTests(browser, baseUrl, environment) {
    log(`Running enhanced tests for ${environment}: ${baseUrl}`, 'info');
    
    const allResults = [];
    
    // Test all configured pages
    for (const pagePath of CONFIG.testPages) {
        const page = await browser.newPage();
        try {
            await page.setViewport({ width: 1280, height: 900 });
            const results = await testPageThoroughly(page, baseUrl, pagePath, environment);
            allResults.push(...results);
        } finally {
            await page.close();
        }
        
        // Small delay between pages
        await delay(500);
    }
    
    // Test API endpoints
    const apiResults = await testApiEndpoints(baseUrl, environment);
    allResults.push(...apiResults);
    
    return allResults;
}

async function generateEnhancedReport(allResults) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTests: 0,
            passed: 0,
            failed: 0,
            successRate: 0
        },
        results: allResults,
        recommendations: [],
        criticalIssues: []
    };
    
    // Calculate summary
    for (const result of allResults) {
        report.summary.totalTests++;
        if (result.passed) {
            report.summary.passed++;
        } else {
            report.summary.failed++;
            
            // Identify critical issues
            if (result.test.includes('Page Load Status') || 
                result.test.includes('Page Errors') ||
                result.test.includes('Console Errors')) {
                report.criticalIssues.push(result);
            }
        }
    }
    
    report.summary.successRate = (report.summary.passed / report.summary.totalTests) * 100;
    
    // Generate recommendations
    if (report.criticalIssues.length > 0) {
        report.recommendations.push('CRITICAL: Page loading or JavaScript errors detected');
    }
    if (report.summary.failed > 0) {
        report.recommendations.push('Review failed tests and fix navigation issues');
    }
    if (report.summary.successRate < 95) {
        report.recommendations.push('Navigation regression detected - investigate immediately');
    }
    
    // Save report
    const reportPath = `tools/debug/output/reports/enhanced-nav-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
}

async function main() {
    log('🚀 Starting Enhanced Navigation Regression Testing', 'info');
    
    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        let allResults = [];
        
        try {
            // Test localhost
            log('\n🏠 Testing Localhost Navigation...', 'info');
            const localhostResults = await runEnhancedTests(browser, 'http://localhost:2000', 'localhost');
            allResults.push(...localhostResults.map(r => ({...r, environment: 'localhost'})));
            
            // Test ngrok (if enabled)
            if (ENABLE_EXTERNAL) {
                log('\n🌍 Testing Ngrok Navigation...', 'info');
                const ngrokResults = await runEnhancedTests(browser, NGROK_BASE, 'ngrok');
                allResults.push(...ngrokResults.map(r => ({...r, environment: 'ngrok'})));
            } else {
                log('\n🌍 Skipping Ngrok Navigation (ENABLE_EXTERNAL_TESTS=1 to enable)', 'info');
            }
            
        } finally {
            await browser.close();
        }
        
        // Generate report
        log('\n📊 Generating Enhanced Report...', 'info');
        const report = await generateEnhancedReport(allResults);
        
        // Display Results
        log('\n📈 Enhanced Test Results Summary:', 'info');
        log(`  Total Tests: ${report.summary.totalTests}`, 'info');
        log(`  Passed: ${report.summary.passed}`, 'success');
        log(`  Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success');
        log(`  Success Rate: ${report.summary.successRate.toFixed(1)}%`, 'info');
        
        // Display critical issues
        if (report.criticalIssues.length > 0) {
            log('\n🚨 CRITICAL ISSUES:', 'error');
            for (const issue of report.criticalIssues) {
                log(`  ${issue.test}: ${issue.details.error || issue.details.message || 'Failed'}`, 'error');
            }
        }
        
        // Display failed tests by environment
        const failedByEnv = allResults.filter(r => !r.passed).reduce((acc, r) => {
            const env = r.environment || 'unknown';
            if (!acc[env]) acc[env] = [];
            acc[env].push(r);
            return acc;
        }, {});
        
        if (Object.keys(failedByEnv).length > 0) {
            log('\n❌ Failed Tests by Environment:', 'error');
            for (const [env, tests] of Object.entries(failedByEnv)) {
                log(`  ${env.toUpperCase()}:`, 'error');
                tests.slice(0, 10).forEach(test => {
                    log(`    ${test.test}`, 'error');
                    if (test.details.error) {
                        log(`      Error: ${test.details.error}`, 'error');
                    }
                });
                if (tests.length > 10) {
                    log(`    ... and ${tests.length - 10} more`, 'error');
                }
            }
        }
        
        // Display recommendations
        if (report.recommendations.length > 0) {
            log('\n💡 Recommendations:', 'warning');
            report.recommendations.forEach(rec => log(`  ${rec}`, 'warning'));
        }
        
        log(`\n📄 Detailed report saved to: tools/debug/output/reports/enhanced-nav-report-${new Date().toISOString().split('T')[0]}.json`, 'info');
        
        // Exit with appropriate code
        if (report.summary.failed > 0 || report.criticalIssues.length > 0) {
            log('\n❌ Enhanced navigation testing detected issues!', 'error');
            process.exit(1);
        } else {
            log('\n✅ All enhanced navigation tests passed!', 'success');
            process.exit(0);
        }
        
    } catch (error) {
        log(`❌ Fatal error during enhanced testing: ${error.message}`, 'error');
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
    testPageThoroughly,
    runEnhancedTests,
    generateEnhancedReport
};

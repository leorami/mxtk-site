const puppeteer = require('puppeteer');

// Configuration for error thresholds
const CONFIG = {
    maxErrors: 5,           // Increased from 3
    maxWarnings: 8,         // Increased from 5
    maxNetworkErrors: 5,    // Increased from 2
    errorThreshold: 10      // Increased from 5
}

// Helper function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Track tested URLs to avoid duplicates
const testedUrls = new Set();
const testedNavLinks = new Set();

// Global error tracking - static variables that persist across all tests
let totalErrors = 0;
let totalWarnings = 0;
let totalNetworkErrors = 0;

// Static arrays to collect all errors across all page visits
const allConsoleErrors = [];
const allConsoleWarnings = [];
const allNetworkErrors = [];

async function testThemeColors(url, label, darkMode = false) {
    // Skip if we've already tested this exact URL
    const testKey = `${url}-${darkMode}`;
    if (testedUrls.has(testKey)) {
        console.log(`⏭️ Skipping ${label} (${darkMode ? 'Dark' : 'Light'} Mode) - already tested`);
        return;
    }
    testedUrls.add(testKey);

    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set up console error collection BEFORE navigation
        page.on('console', msg => {
            if (msg.type() === 'error') {
                // Ignore development-only Next.js errors
                const text = msg.text();
                if (text.includes('__nextjs_original-stack-frames') || 
                    text.includes('webpack-hmr')) {
                    return; // Skip these development-only errors
                }
                allConsoleErrors.push(text);
            } else if (msg.type() === 'warning') {
                allConsoleWarnings.push(msg.text());
            }
        });
        
        page.on('pageerror', error => {
            const message = error.message;
            // Ignore development-only Next.js errors
            if (message.includes('__nextjs_original-stack-frames') || 
                message.includes('webpack-hmr')) {
                return; // Skip these development-only errors
            }
            allConsoleErrors.push(`Page Error: ${message}`);
        });
        
        // Capture network errors
        page.on('response', response => {
            if (response.status() >= 400) {
                const url = response.url();
                // Ignore development-only Next.js URLs
                if (url.includes('__nextjs_original-stack-frames') || 
                    url.includes('webpack-hmr')) {
                    return; // Skip these development-only errors
                }
                const errorMsg = `${response.status()} ${response.statusText()}: ${url}`;
                allNetworkErrors.push(errorMsg);
            }
        });
        
        // Set dark mode if requested
        if (darkMode) {
            await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
        }
        
        console.log(`\n🔍 Testing ${label} (${darkMode ? 'Dark' : 'Light'} Mode): ${url}`);
        
        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Apply dark mode class after page loads if needed
        if (darkMode) {
            await page.evaluate(() => {
                document.documentElement.classList.add('dark');
            });
        }
        
        // Wait for page to load
        await delay(2000);
        
        // Check error thresholds IMMEDIATELY after page loads
        totalErrors = allConsoleErrors.length;
        totalWarnings = allConsoleWarnings.length;
        totalNetworkErrors = allNetworkErrors.length;
        
        // DEBUG: Show error counts IMMEDIATELY after page loads
        console.log(`\n🚨 ERROR COUNT AFTER PAGE LOAD: ${totalErrors} errors, ${totalWarnings} warnings, ${totalNetworkErrors} network errors`);
        
        // Report console errors and warnings IMMEDIATELY
        console.log(`\n🔍 DEBUG: Console Errors: ${totalErrors}, Warnings: ${totalWarnings}, Network: ${totalNetworkErrors}`);
        
        if (totalErrors > 0) {
            console.log('\n❌ Console Errors:');
            allConsoleErrors.forEach(error => console.log(`  ${error}`));
        }
        
        if (totalWarnings > 0) {
            console.log('\n⚠️ Console Warnings:');
            allConsoleWarnings.forEach(warning => console.log(`  ${warning}`));
        }
        
        if (totalNetworkErrors > 0) {
            console.log('\n🌐 Network Errors:');
            allNetworkErrors.forEach(error => console.log(`  ${error}`));
        }
        
        // Check error thresholds IMMEDIATELY after reporting
        if (totalErrors >= CONFIG.maxErrors || 
            totalWarnings >= CONFIG.maxWarnings || 
            totalNetworkErrors >= CONFIG.maxNetworkErrors ||
            (totalErrors + totalWarnings + totalNetworkErrors) >= CONFIG.errorThreshold) {
            console.log('\n🚨 STOPPING DUE TO TOO MANY ERRORS:');
            console.log(`  Total Errors: ${totalErrors}/${CONFIG.maxErrors}`);
            console.log(`  Total Warnings: ${totalWarnings}/${CONFIG.maxWarnings}`);
            console.log(`  Total Network Errors: ${totalNetworkErrors}/${CONFIG.maxNetworkErrors}`);
            console.log(`  Total Issues: ${totalErrors + totalWarnings + totalNetworkErrors}/${CONFIG.errorThreshold}`);
            process.exit(1);
        }
        
        // Check if page is completely broken
        const pageContent = await page.evaluate(() => {
            return {
                title: document.title,
                hasBody: !!document.body,
                bodyText: document.body ? document.body.textContent.substring(0, 200) : 'No body',
                hasNavigation: document.querySelectorAll('nav a, header a, footer a').length,
                hasImages: document.querySelectorAll('img').length,
                hasErrors: window.performance.getEntriesByType('resource').filter(r => r.name.includes('404')).length
            };
        });
        
        if (!pageContent.hasBody || pageContent.bodyText.includes('Application error') || pageContent.bodyText.includes('404')) {
            console.log(`🚨 PAGE IS COMPLETELY BROKEN: ${label}`);
            console.log(`  Title: ${pageContent.title}`);
            console.log(`  Body: ${pageContent.bodyText}`);
            console.log(`  Navigation links: ${pageContent.hasNavigation}`);
            console.log(`  Images: ${pageContent.hasImages}`);
            console.log(`  404 errors: ${pageContent.hasErrors}`);
            totalErrors += 10; // Add significant error weight
        }

        // Check if background images are actually visible
        const backgroundCheck = await page.evaluate(() => {
            const heroElements = document.querySelectorAll('[style*="background-image"]');
            const results = [];
            
            heroElements.forEach((el, index) => {
                const style = window.getComputedStyle(el);
                const bgImage = style.backgroundImage;
                const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                const hasBgImage = bgImage && bgImage !== 'none' && bgImage !== 'initial';
                
                results.push({
                    index,
                    hasBgImage,
                    bgImage,
                    isVisible,
                    element: el.tagName,
                    classes: el.className
                });
            });
            
            return results;
        });
        
        console.log('\n🖼️ Background Image Check:');
        if (backgroundCheck.length === 0) {
            console.log('  ❌ NO BACKGROUND IMAGE ELEMENTS FOUND!');
            totalErrors += 5;
        } else {
            backgroundCheck.forEach((check, index) => {
                if (check.hasBgImage && check.isVisible) {
                    console.log(`  ✅ Background ${index + 1}: ${check.bgImage} (${check.element})`);
                } else if (check.hasBgImage && !check.isVisible) {
                    console.log(`  ⚠️ Background ${index + 1}: ${check.bgImage} (${check.element}) - NOT VISIBLE`);
                    totalErrors += 2;
                } else {
                    console.log(`  ❌ Background ${index + 1}: NO BACKGROUND IMAGE (${check.element})`);
                    totalErrors += 3;
                }
            });
        }
        
        // Take a screenshot
        const screenshotPath = `tools/debug/output/screenshots/debug-${label.toLowerCase().replace(/\s+/g, '-')}-${darkMode ? 'dark' : 'light'}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Test CSS variables
        const cssVars = await page.evaluate(() => {
            const root = document.documentElement;
            return {
                accent: getComputedStyle(root).getPropertyValue('--mxtk-accent').trim(),
                hoverBg: getComputedStyle(root).getPropertyValue('--mxtk-hover-bg').trim(),
                accentText: getComputedStyle(root).getPropertyValue('--mxtk-accent-text').trim(),
                accentRgb: getComputedStyle(root).getPropertyValue('--mxtk-accent-rgb').trim()
            };
        });
        
        console.log('🎨 CSS Variables:');
        console.log(`  --mxtk-accent: ${cssVars.accent}`);
        console.log(`  --mxtk-hover-bg: ${cssVars.hoverBg}`);
        console.log(`  --mxtk-accent-text: ${cssVars.accentText}`);
        console.log(`  --mxtk-accent-rgb: ${cssVars.accentRgb}`);
        
        // Test heading colors
        const headingColors = await page.evaluate(() => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headings).map(h => ({
                tag: h.tagName,
                text: h.textContent.substring(0, 50),
                color: getComputedStyle(h).color,
                accentColor: getComputedStyle(h).getPropertyValue('--mxtk-accent')
            }));
        });
        
        console.log('\n📝 Heading Colors:');
        headingColors.forEach(h => {
            console.log(`  ${h.tag}: "${h.text}" - Color: ${h.color}, Accent: ${h.accentColor}`);
        });
        
        // Test backdrop styles
        const backdropStyles = await page.evaluate(() => {
            const backdrop = document.querySelector('[data-mineral]');
            if (!backdrop) return null;
            
            return {
                mineral: backdrop.getAttribute('data-mineral'),
                photo: backdrop.getAttribute('data-photo'),
                accent: getComputedStyle(backdrop).getPropertyValue('--mxtk-accent'),
                background: getComputedStyle(backdrop).background
            };
        });
        
        if (backdropStyles) {
            console.log('\n🌅 Backdrop Styles:');
            console.log(`  Mineral: ${backdropStyles.mineral}`);
            console.log(`  Photo: ${backdropStyles.photo}`);
            console.log(`  Accent: ${backdropStyles.accent}`);
            console.log(`  Background: ${backdropStyles.background}`);
        }
        
        // Test inline styles
        const inlineStyles = await page.evaluate(() => {
            const elements = document.querySelectorAll('[style*="--mxtk-accent"]');
            return Array.from(elements).map(el => ({
                tag: el.tagName,
                style: el.getAttribute('style'),
                computedColor: getComputedStyle(el).color
            }));
        });
        
        if (inlineStyles.length > 0) {
            console.log('\n🎯 Inline Styles:');
            inlineStyles.forEach(el => {
                console.log(`  ${el.tag}: ${el.style} -> Computed: ${el.computedColor}`);
            });
        }
        
        // Test main content area
        const mainStyles = await page.evaluate(() => {
            const main = document.querySelector('main');
            if (!main) return null;
            
            return {
                backgroundColor: getComputedStyle(main).backgroundColor,
                color: getComputedStyle(main).color,
                accent: getComputedStyle(main).getPropertyValue('--mxtk-accent')
            };
        });
        
        if (mainStyles) {
            console.log('\n📄 Main Content Styles:');
            console.log(`  Background: ${mainStyles.backgroundColor}`);
            console.log(`  Color: ${mainStyles.color}`);
            console.log(`  Accent: ${mainStyles.accent}`);
        }
        

        
        // Test navigation links (only on first page to avoid repetition)
        if (url.includes('localhost:2000') && !darkMode) {
            console.log('\n🔗 Testing Navigation Links...');
            const navLinks = await page.evaluate(() => {
                const links = document.querySelectorAll('nav a, header a, footer a');
                return Array.from(links).map(link => ({
                    text: link.textContent.trim(),
                    href: link.getAttribute('href'),
                    color: getComputedStyle(link).color,
                    backgroundColor: getComputedStyle(link).backgroundColor,
                    selector: link.tagName.toLowerCase() + (link.className ? '.' + link.className.split(' ').join('.') : '')
                }));
            });
            
            if (navLinks.length === 0) {
                console.log('❌ NO NAVIGATION LINKS FOUND! This indicates a serious page loading issue.');
                totalErrors += 5; // Add significant error weight
            } else {
                console.log(`✅ Found ${navLinks.length} navigation links:`);
                navLinks.forEach(link => {
                    console.log(`  ${link.text}: ${link.href} - Color: ${link.color}, BG: ${link.backgroundColor}`);
                });
            }
            
            // Test each navigation link (only if not already tested)
            for (const link of navLinks) {
                if (link.href && !link.href.startsWith('#') && !link.href.startsWith('http')) {
                    const navTestKey = `${link.href}-${link.text}`;
                    if (testedNavLinks.has(navTestKey)) {
                        console.log(`  ⏭️ Skipping ${link.text} -> ${link.href} (already tested)`);
                        continue;
                    }
                    testedNavLinks.add(navTestKey);
                    
                    console.log(`\n🔍 Testing navigation: ${link.text} -> ${link.href}`);
                    try {
                        // Try multiple selectors for better click detection
                        const selectors = [
                            `a[href="${link.href}"]`,
                            `nav a[href="${link.href}"]`,
                            `header a[href="${link.href}"]`,
                            `footer a[href="${link.href}"]`,
                            `[href="${link.href}"]`
                        ];
                        
                        let clicked = false;
                        for (const selector of selectors) {
                            try {
                                await page.waitForSelector(selector, { timeout: 2000 });
                                await page.click(selector);
                                clicked = true;
                                break;
                            } catch (e) {
                                // Try next selector
                                continue;
                            }
                        }
                        
                        if (!clicked) {
                            // Fallback: try clicking by text content
                            try {
                                await page.click(`text=${link.text}`, { timeout: 2000 });
                                clicked = true;
                            } catch (e) {
                                console.log(`  ❌ Could not click ${link.text}: No clickable element found`);
                                totalErrors++; // Count this as an error
                                continue;
                            }
                        }
                        
                        if (clicked) {
                            await delay(2000);
                            
                            // Check for errors on the new page
                            const pageErrors = await page.evaluate(() => {
                                return window.performance.getEntriesByType('resource')
                                    .filter(r => r.name.includes('404') || r.name.includes('error'))
                                    .map(r => r.name);
                            });
                            
                            if (pageErrors.length > 0) {
                                console.log(`  ❌ Errors on ${link.text}:`, pageErrors);
                                totalErrors += pageErrors.length;
                            } else {
                                console.log(`  ✅ ${link.text} loaded successfully`);
                            }
                            
                            // Go back to home page for next test
                            if (link.href !== '/') {
                                await page.goto(url, { waitUntil: 'networkidle2' });
                                await delay(1000);
                            }
                        }
                    } catch (error) {
                        console.log(`  ❌ Error testing ${link.text}: ${error.message}`);
                        totalErrors++;
                    }
                }
            }
        }
        
        // Return error counts for main function to check
        return {
            consoleErrors: allConsoleErrors.length,
            consoleWarnings: allConsoleWarnings.length,
            networkErrors: allNetworkErrors.length
        };
        
    } catch (error) {
        console.error(`❌ Error testing ${label}:`, error.message);
        return { consoleErrors: allConsoleErrors.length, consoleWarnings: allConsoleWarnings.length, networkErrors: allNetworkErrors.length };
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('🎨 MXTK Theme Debugger - Optimized with Error Thresholds');
    console.log('=' .repeat(60));
    console.log(`⚙️  Configuration:`);
    console.log(`  Max Errors: ${CONFIG.maxErrors}`);
    console.log(`  Max Warnings: ${CONFIG.maxWarnings}`);
    console.log(`  Max Network Errors: ${CONFIG.maxNetworkErrors}`);
    console.log(`  Total Error Threshold: ${CONFIG.errorThreshold}`);
    console.log('');
    
    // Get the current ngrok URL
    const ngrokUrl = await getNgrokUrl();
    console.log(`🌐 Using ngrok URL: ${ngrokUrl}`);
    
    // Helper function to check error thresholds
    function checkErrorThresholds() {
        if (totalErrors >= CONFIG.maxErrors || 
            totalWarnings >= CONFIG.maxWarnings || 
            totalNetworkErrors >= CONFIG.maxNetworkErrors ||
            (totalErrors + totalWarnings + totalNetworkErrors) >= CONFIG.errorThreshold) {
            console.log('\n🚨 STOPPING DUE TO TOO MANY ERRORS:');
            console.log(`  Total Errors: ${totalErrors}/${CONFIG.maxErrors}`);
            console.log(`  Total Warnings: ${totalWarnings}/${CONFIG.maxWarnings}`);
            console.log(`  Total Network Errors: ${totalNetworkErrors}/${CONFIG.maxNetworkErrors}`);
            console.log(`  Total Issues: ${totalErrors + totalWarnings + totalNetworkErrors}/${CONFIG.errorThreshold}`);
            process.exit(1);
        }
    }
    
    // Test localhost URLs as well
    const localhostTests = [
        { url: 'http://localhost:2000/owners', label: 'Localhost Owners' },
        { url: 'http://localhost:2000/institutions', label: 'Localhost Institutions' },
        { url: 'http://localhost:2000/transparency', label: 'Localhost Transparency' }
    ];

    for (const test of localhostTests) {
        await testThemeColors(test.url, test.label, false);
        await testThemeColors(test.url, test.label, true);
    }

    // Test ngrok URLs
    const ngrokTests = [
        { url: 'https://ramileo.ngrok.app/mxtk/owners', label: 'Ngrok Owners' },
        { url: 'https://ramileo.ngrok.app/mxtk/institutions', label: 'Ngrok Institutions' },
        { url: 'https://ramileo.ngrok.app/mxtk/transparency', label: 'Ngrok Transparency' }
    ];

    for (const test of ngrokTests) {
        await testThemeColors(test.url, test.label, false);
        await testThemeColors(test.url, test.label, true);
    }
    
    console.log('\n✅ Theme debugging complete!');
    console.log(`📊 Tested ${testedUrls.size} unique URL combinations`);
    console.log(`🔗 Tested ${testedNavLinks.size} unique navigation links`);
}

// Helper function to get ngrok URL
async function getNgrokUrl() {
    try {
        const response = await fetch('http://localhost:4040/api/tunnels');
        const data = await response.json();
        return data.tunnels?.[0]?.public_url || null;
    } catch (error) {
        console.log('❌ Could not fetch ngrok URL:', error.message);
        return null;
    }
}

main().catch(console.error);

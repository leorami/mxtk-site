// tools/test/console-error-check.mjs
import puppeteer from 'puppeteer';

/**
 * Console Error Checker
 * 
 * This script uses Puppeteer to visit pages and capture console errors.
 * It helps identify issues that might not be visible during development.
 * 
 * Usage:
 *   node tools/test/console-error-check.mjs [url]
 * 
 * If no URL is provided, it defaults to http://localhost:2000
 */

// Configuration
const DEFAULT_URL = 'http://localhost:2000';
const envPaths = (process.env.PATHS || '').trim();
const cliPathsArg = process.argv[3] || '';
const parsedPaths = (envPaths || cliPathsArg)
  ? (envPaths || cliPathsArg).split(',').map(s => s.trim()).filter(Boolean)
  : null;
const PAGES_TO_CHECK = parsedPaths || [
  '/dashboard'
];

// Get URL from command line or use default
const baseUrl = process.env.TEST_URL || process.argv[2] || DEFAULT_URL;

// Store errors by page
const errorsByPage = {};
const warningsByPage = {};
const networkErrorsByPage = {};

async function checkPage(browser, path) {
    console.log(`Checking ${path}...`);
    const page = await browser.newPage();

    // Collect console messages
    page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            if (!errorsByPage[path]) errorsByPage[path] = [];
            errorsByPage[path].push(text);
        } else if (type === 'warning') {
            if (!warningsByPage[path]) warningsByPage[path] = [];
            warningsByPage[path].push(text);
        }
    });

    // Collect network errors
    page.on('requestfailed', (request) => {
        const failure = request.failure();
        if (!networkErrorsByPage[path]) networkErrorsByPage[path] = [];
        networkErrorsByPage[path].push({
            url: request.url(),
            errorText: failure ? failure.errorText : 'Unknown error',
            method: request.method()
        });
    });

    try {
        // Navigate to the page with a timeout
        await page.goto(`${baseUrl}${path}`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait a bit for any async errors
        await delay(2000);

        // Take a screenshot for reference
        await page.screenshot({ path: `error-check-${path.replace(/\//g, '-') || 'home'}.png` });

    } catch (error) {
        console.error(`Error navigating to ${path}:`, error.message);
        if (!errorsByPage[path]) errorsByPage[path] = [];
        errorsByPage[path].push(`Navigation error: ${error.message}`);
    } finally {
        await page.close();
    }
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log(`Starting console error check for ${baseUrl}`);
    const launchCfg = {
        headless: 'new',
        args: ['--no-sandbox','--disable-gpu']
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) launchCfg.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    const browser = await puppeteer.launch(launchCfg);

    try {
        // Check each page
        for (const path of PAGES_TO_CHECK) {
            await checkPage(browser, path);
        }

        // Print summary
        console.log('\n=== CONSOLE ERROR CHECK RESULTS ===');

        // Report errors
        const hasErrors = Object.keys(errorsByPage).length > 0;
        if (hasErrors) {
            console.log('\n❌ ERRORS FOUND:');
            for (const [path, errors] of Object.entries(errorsByPage)) {
                if (errors.length > 0) {
                    console.log(`\n${path}:`);
                    errors.forEach(error => console.log(`  - ${error}`));
                }
            }
        } else {
            console.log('\n✅ No console errors found!');
        }

        // Report network errors
        const hasNetworkErrors = Object.keys(networkErrorsByPage).length > 0;
        if (hasNetworkErrors) {
            console.log('\n❌ NETWORK ERRORS FOUND:');
            for (const [path, errors] of Object.entries(networkErrorsByPage)) {
                if (errors.length > 0) {
                    console.log(`\n${path}:`);
                    errors.forEach(error => console.log(`  - ${error.method} ${error.url}: ${error.errorText}`));
                }
            }
        } else {
            console.log('\n✅ No network errors found!');
        }

        // Report warnings (less critical)
        const hasWarnings = Object.values(warningsByPage).some(warnings => warnings.length > 0);
        if (hasWarnings) {
            console.log('\n⚠️ WARNINGS FOUND:');
            for (const [path, warnings] of Object.entries(warningsByPage)) {
                if (warnings.length > 0) {
                    console.log(`\n${path}:`);
                    warnings.forEach(warning => console.log(`  - ${warning}`));
                }
            }
        } else {
            console.log('\n✅ No console warnings found!');
        }

        // Exit with error code if issues found
        process.exit(hasErrors || hasNetworkErrors ? 1 : 0);

    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('Error running console error check:', error);
    process.exit(1);
});

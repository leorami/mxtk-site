#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function debugLinks() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Test localhost
        console.log('\n=== LOCALHOST ===');
        await page.goto('http://localhost:2000', { waitUntil: 'networkidle2' });
        
        const localhostLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                pathname: window.location.pathname
            }));
        });
        
        console.log('Localhost links:');
        localhostLinks.forEach(link => {
            console.log(`  ${link.text}: ${link.href} (pathname: ${link.pathname})`);
        });
        
        // Test ngrok
        console.log('\n=== NGROK ===');
        await page.goto('https://ramileo.ngrok.app/mxtk', { waitUntil: 'networkidle2' });
        
        const ngrokLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('header nav a, nav a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                pathname: window.location.pathname
            }));
        });
        
        console.log('Ngrok links:');
        ngrokLinks.forEach(link => {
            console.log(`  ${link.text}: ${link.href} (pathname: ${link.pathname})`);
        });
        
        // Test footer from legal page
        console.log('\n=== FOOTER FROM LEGAL (LOCALHOST) ===');
        await page.goto('http://localhost:2000/legal/terms', { waitUntil: 'networkidle2' });
        
        const localhostFooterLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('footer a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                pathname: window.location.pathname
            }));
        });
        
        console.log('Localhost footer links:');
        localhostFooterLinks.forEach(link => {
            console.log(`  ${link.text}: ${link.href} (pathname: ${link.pathname})`);
        });
        
        // Test footer from legal page (ngrok)
        console.log('\n=== FOOTER FROM LEGAL (NGROK) ===');
        await page.goto('https://ramileo.ngrok.app/mxtk/legal/terms', { waitUntil: 'networkidle2' });
        
        const ngrokFooterLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('footer a');
            return Array.from(links).map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
                pathname: window.location.pathname
            }));
        });
        
        console.log('Ngrok footer links:');
        ngrokFooterLinks.forEach(link => {
            console.log(`  ${link.text}: ${link.href} (pathname: ${link.pathname})`);
        });
        
    } finally {
        await browser.close();
    }
}

debugLinks().catch(console.error);

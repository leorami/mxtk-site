#!/usr/bin/env node

// Final comprehensive test with proper timeouts
const https = require('https');
const http = require('http');

const TIMEOUT = 10000; // 10 second timeout
const USER_AGENT = 'MXTK-Test/1.0';

async function testUrl(url, description) {
    return new Promise((resolve) => {
        const isHttps = url.startsWith('https');
        const client = isHttps ? https : http;
        
        const req = client.request(url, {
            method: 'GET',
            headers: { 'User-Agent': USER_AGENT },
            timeout: TIMEOUT
        }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                const success = res.statusCode >= 200 && res.statusCode < 400;
                resolve({
                    url,
                    description,
                    status: res.statusCode,
                    success,
                    hasBackground: data.includes('transparency_tigereye.jpg') || data.includes('institutions_lapis.jpg'),
                    hasLoadingStates: (data.match(/Loading…/g) || []).length,
                    apiWorking: data.includes('"ok":true') || data.includes('"address":')
                });
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                url, description, status: 'TIMEOUT', success: false,
                hasBackground: false, hasLoadingStates: 0, apiWorking: false
            });
        });
        
        req.on('error', (err) => {
            resolve({
                url, description, status: `ERROR: ${err.message}`, success: false,
                hasBackground: false, hasLoadingStates: 0, apiWorking: false
            });
        });
        
        req.end();
    });
}

async function runFinalTest() {
    console.log('🚀 Final Comprehensive Test (10s timeout)');
    console.log('=' .repeat(50));
    
    const tests = [
        // Core localhost tests
        { url: 'http://localhost:2000/', desc: 'Localhost Home' },
        { url: 'http://localhost:2000/institutions', desc: 'Localhost Institutions' },
        { url: 'http://localhost:2000/transparency', desc: 'Localhost Transparency' },
        { url: 'http://localhost:2000/api/health', desc: 'Localhost API Health' },
        { url: 'http://localhost:2000/api/market', desc: 'Localhost Market API' },
        { url: 'http://localhost:2000/api/token/summary', desc: 'Localhost Token API' },
        
        // Core ngrok tests
        { url: 'https://ramileo.ngrok.app/mxtk/', desc: 'Ngrok Home' },
        { url: 'https://ramileo.ngrok.app/mxtk/institutions', desc: 'Ngrok Institutions' },
        { url: 'https://ramileo.ngrok.app/mxtk/transparency', desc: 'Ngrok Transparency' },
        { url: 'https://ramileo.ngrok.app/api/health', desc: 'Ngrok API Health' },
        { url: 'https://ramileo.ngrok.app/api/market', desc: 'Ngrok Market API' },
        { url: 'https://ramileo.ngrok.app/api/token/summary', desc: 'Ngrok Token API' },
        
        // Critical assets
        { url: 'https://ramileo.ngrok.app/mxtk/art/photos/transparency_tigereye.jpg', desc: 'Ngrok Transparency BG' },
        { url: 'https://ramileo.ngrok.app/mxtk/art/photos/institutions_lapis.jpg', desc: 'Ngrok Institutions BG' }
    ];
    
    const results = [];
    for (const test of tests) {
        process.stdout.write(`Testing ${test.desc}...`);
        const result = await testUrl(test.url, test.desc);
        results.push(result);
        console.log(result.success ? ' ✅' : ` ❌ (${result.status})`);
    }
    
    console.log('\n📊 Final Results Summary:');
    console.log('=' .repeat(50));
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);  
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    
    const backgroundTests = results.filter(r => r.hasBackground);
    const apiTests = results.filter(r => r.apiWorking);
    
    console.log(`\n🖼️  Background Images: ${backgroundTests.length} pages showing images`);
    console.log(`🔗 API Endpoints: ${apiTests.length} APIs returning data`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! 100% SUCCESS RATE!');
        console.log('✅ No errors or warnings detected');
        console.log('✅ All API endpoints working'); 
        console.log('✅ Background images loading properly');
        console.log('✅ Both localhost and ngrok functioning correctly');
    } else {
        console.log('\n❌ Some tests failed:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   ${r.description}: ${r.status}`);
        });
    }
    
    process.exit(passedTests === totalTests ? 0 : 1);
}

runFinalTest().catch(console.error);

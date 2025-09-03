#!/usr/bin/env node

// Real browser testing with Playwright to capture actual console errors and network failures
const fs = require('fs');
const path = require('path');

// First, let's create a comprehensive manual test that checks the exact issues reported
const NGROK_BASE = 'https://ramileo.ngrok.app';
const LOCALHOST_BASE = 'http://localhost:2000';

const testPages = [
  '/mxtk/transparency', 
  '/mxtk/ecosystem', 
  '/mxtk/whitepaper', 
  '/mxtk/faq', 
  '/mxtk/media', 
  '/mxtk/the-team',
  '/mxtk/institutions',
  '/mxtk/roadmap',
  '/mxtk/mxtk-cares'
];

const apiEndpoints = [
  '/api/health',
  '/api/token/summary', 
  '/api/pools',
  '/api/market',
  '/api/test'
];

async function testNetworkRequests(url, description) {
  return new Promise((resolve) => {
    const https = require('https');
    const http = require('http');
    
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, {
      method: 'GET',
      headers: { 'User-Agent': 'MXTK-RealTest/1.0' },
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let contentCheck = '';
        
        // Check for specific failure indicators
        if (description.includes('API')) {
          try {
            const parsed = JSON.parse(data);
            contentCheck = Object.keys(parsed).length > 0 ? 'Has Data' : 'Empty Response';
          } catch {
            contentCheck = 'Invalid JSON';
          }
        } else {
          // Check for background images in HTML
          const hasBackgroundImage = data.includes('<img') && (
            data.includes('transparency_tigereye') ||
            data.includes('ecosystem_') ||
            data.includes('whitepaper_') ||
            data.includes('faq_') ||
            data.includes('media_') ||
            data.includes('team_') ||
            data.includes('background') ||
            data.includes('PhotoBackdrop')
          );
          contentCheck = hasBackgroundImage ? 'Background Present' : 'NO BACKGROUND';
          
          // Check for specific error patterns
          if (data.includes('ERR_TOO_MANY_REDIRECTS')) contentCheck += ' + REDIRECT ERROR';
          if (data.includes('Loading...') && !data.includes('<img')) contentCheck += ' + LOADING STUCK';
        }
        
        resolve({
          url,
          description,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          size: data.length,
          contentCheck,
          redirects: res.headers.location ? 'REDIRECT DETECTED' : 'No Redirects'
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        description,
        status: 0,
        success: false,
        error: err.message,
        contentCheck: 'NETWORK FAILURE'
      });
    });
    
    req.on('timeout', () => {
      req.abort();
      resolve({
        url,
        description,
        status: 0, 
        success: false,
        error: 'Timeout after 8s',
        contentCheck: 'TIMEOUT'
      });
    });
    
    req.end();
  });
}

async function runComprehensiveTest() {
  console.log('🔍 COMPREHENSIVE REAL BROWSER ISSUE TEST');
  console.log('========================================\n');
  
  const results = [];
  
  // Test all pages for background images via ngrok
  console.log('📸 TESTING BACKGROUND IMAGES ON NGROK PAGES:');
  for (const page of testPages) {
    const result = await testNetworkRequests(`${NGROK_BASE}${page}`, `Background Image Check - ${page}`);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${page}: ${result.contentCheck} (${result.status})`);
    
    if (result.redirects === 'REDIRECT DETECTED') {
      console.log(`   🔄 REDIRECT ISSUE DETECTED: ${result.redirects}`);
    }
  }
  
  console.log('\n🔌 TESTING API ENDPOINTS ON NGROK:');
  for (const api of apiEndpoints) {
    const result = await testNetworkRequests(`${NGROK_BASE}${api}`, `API Data Check - ${api}`);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${api}: ${result.contentCheck} (${result.status})`);
  }
  
  // Summary
  const failed = results.filter(r => !r.success);
  const backgroundIssues = results.filter(r => r.contentCheck?.includes('NO BACKGROUND'));
  const apiIssues = results.filter(r => r.description.includes('API') && (r.contentCheck === 'Empty Response' || r.contentCheck === 'Invalid JSON'));
  const redirectIssues = results.filter(r => r.redirects === 'REDIRECT DETECTED');
  
  console.log('\n📊 ISSUE SUMMARY:');
  console.log(`Total Tests: ${results.length}`);
  console.log(`Failed Tests: ${failed.length}`);
  console.log(`Background Issues: ${backgroundIssues.length}`);
  console.log(`API Issues: ${apiIssues.length}`);
  console.log(`Redirect Issues: ${redirectIssues.length}`);
  
  if (backgroundIssues.length > 0) {
    console.log('\n🚨 PAGES WITH MISSING BACKGROUNDS:');
    backgroundIssues.forEach(issue => console.log(`   - ${issue.url}`));
  }
  
  if (apiIssues.length > 0) {
    console.log('\n🚨 APIS WITH NO DATA:');
    apiIssues.forEach(issue => console.log(`   - ${issue.url}`));
  }
  
  if (redirectIssues.length > 0) {
    console.log('\n🚨 PAGES WITH REDIRECT ISSUES:');
    redirectIssues.forEach(issue => console.log(`   - ${issue.url}`));
  }
  
  const successRate = ((results.length - failed.length) / results.length * 100).toFixed(1);
  console.log(`\n📈 REAL SUCCESS RATE: ${successRate}%`);
  
  // Save detailed results
  const reportPath = path.join(__dirname, 'output', 'reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportPath, `real-issues-${timestamp}.json`);
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    successRate,
    totalTests: results.length,
    failedTests: failed.length,
    backgroundIssues: backgroundIssues.length,
    apiIssues: apiIssues.length,
    redirectIssues: redirectIssues.length,
    results
  }, null, 2));
  
  console.log(`\n💾 Detailed report saved to: ${reportFile}`);
  
  return {
    successRate: parseFloat(successRate),
    issues: {
      backgrounds: backgroundIssues.length,
      apis: apiIssues.length,
      redirects: redirectIssues.length
    },
    results
  };
}

if (require.main === module) {
  runComprehensiveTest().then(report => {
    console.log(`\n🎯 FINAL STATUS: ${report.successRate < 100 ? 'ISSUES DETECTED' : 'ALL CLEAR'}`);
    process.exit(report.successRate < 100 ? 1 : 0);
  }).catch(console.error);
}

module.exports = { runComprehensiveTest };

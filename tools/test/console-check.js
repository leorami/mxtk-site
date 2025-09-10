// Simple script to check for console errors
// This script can be run in the browser console

(function() {
  // Check for any console errors
  const errors = [];
  const warnings = [];
  
  // Override console methods to capture errors and warnings
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    warnings.push(args.join(' '));
    originalWarn.apply(console, args);
  };
  
  // Function to check for network errors
  function checkNetworkErrors() {
    const networkErrors = [];
    
    // Get all resources loaded by the page
    const resources = performance.getEntriesByType('resource');
    
    // Check for any failed resources
    resources.forEach(resource => {
      if (resource.responseEnd === 0) {
        networkErrors.push(`Failed to load: ${resource.name}`);
      }
    });
    
    return networkErrors;
  }
  
  // Wait for the page to fully load and then check for errors
  window.addEventListener('load', () => {
    setTimeout(() => {
      const networkErrors = checkNetworkErrors();
      
      console.log('=== Console Error Check Results ===');
      console.log(`Console Errors: ${errors.length}`);
      console.log(`Console Warnings: ${warnings.length}`);
      console.log(`Network Errors: ${networkErrors.length}`);
      
      if (errors.length > 0) {
        console.log('--- Console Errors ---');
        errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
      }
      
      if (warnings.length > 0) {
        console.log('--- Console Warnings ---');
        warnings.forEach((warn, i) => console.log(`${i + 1}. ${warn}`));
      }
      
      if (networkErrors.length > 0) {
        console.log('--- Network Errors ---');
        networkErrors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
      }
      
      if (errors.length === 0 && warnings.length === 0 && networkErrors.length === 0) {
        console.log('✅ No errors or warnings detected!');
      } else {
        console.log('❌ Errors or warnings detected!');
      }
    }, 2000); // Wait 2 seconds after load to check for any delayed errors
  });
})();

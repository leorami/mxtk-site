// Browser Console Check Script
// This can be run in the browser console to check for errors and warnings

(function() {
  console.log("🔍 Starting browser console check...");
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  // Captured errors and warnings
  const errors = [];
  const warnings = [];
  const reactHooksErrors = [];
  
  // Override console methods
  console.error = function(...args) {
    // Check for React hooks errors
    const errorStr = args.join(" ");
    if (errorStr.includes("React has detected a change in the order of Hooks") || 
        errorStr.includes("Rendered more hooks than during the previous render")) {
      reactHooksErrors.push(errorStr);
    }
    
    errors.push({
      message: args.join(" "),
      stack: new Error().stack,
      timestamp: new Date().toISOString()
    });
    
    // Call original method
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    warnings.push({
      message: args.join(" "),
      timestamp: new Date().toISOString()
    });
    
    // Call original method
    originalWarn.apply(console, args);
  };
  
  // Function to check network requests
  function checkNetworkRequests() {
    const failedRequests = [];
    
    // Check performance entries
    const resources = performance.getEntriesByType("resource");
    resources.forEach(resource => {
      // Check for failed resources (no response end time usually indicates failure)
      if (resource.responseEnd === 0) {
        failedRequests.push({
          url: resource.name,
          type: resource.initiatorType,
          duration: resource.duration
        });
      }
    });
    
    return failedRequests;
  }
  
  // Function to navigate to dashboard and check for errors
  async function testDashboard() {
    // Clear existing errors/warnings
    errors.length = 0;
    warnings.length = 0;
    reactHooksErrors.length = 0;
    
    console.log("🧪 Testing dashboard page...");
    
    try {
      // Navigate to dashboard
      if (!window.location.pathname.includes('/dashboard')) {
        console.log("📍 Navigating to dashboard...");
        window.location.href = '/dashboard';
        return; // Navigation will reload the page
      }
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for errors
      const failedRequests = checkNetworkRequests();
      
      // Report results
      console.log("📊 Test Results:");
      console.log(`- Console Errors: ${errors.length}`);
      console.log(`- Console Warnings: ${warnings.length}`);
      console.log(`- React Hooks Errors: ${reactHooksErrors.length}`);
      console.log(`- Failed Network Requests: ${failedRequests.length}`);
      
      if (errors.length > 0) {
        console.log("❌ Console Errors:");
        errors.forEach((err, i) => console.log(`  ${i+1}. ${err.message}`));
      }
      
      if (reactHooksErrors.length > 0) {
        console.log("❌ React Hooks Errors:");
        reactHooksErrors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
      }
      
      if (warnings.length > 0) {
        console.log("⚠️ Console Warnings:");
        warnings.forEach((warn, i) => console.log(`  ${i+1}. ${warn.message}`));
      }
      
      if (failedRequests.length > 0) {
        console.log("❌ Failed Network Requests:");
        failedRequests.forEach((req, i) => console.log(`  ${i+1}. ${req.url}`));
      }
      
      if (errors.length === 0 && warnings.length === 0 && reactHooksErrors.length === 0 && failedRequests.length === 0) {
        console.log("✅ All tests passed! No errors or warnings detected.");
      } else {
        console.log("❌ Tests failed! Errors or warnings were detected.");
      }
    } catch (error) {
      console.log("❌ Test execution error:", error);
    }
  }
  
  // Start the test
  testDashboard();
  
  // Restore original console methods after 5 seconds
  setTimeout(() => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog;
    console.log("🔄 Console methods restored.");
  }, 5000);
})();

// Simple test to verify background script functionality
console.log('🧪 Testing background script...');

// Test if Chrome APIs are available
if (typeof chrome !== 'undefined') {
  console.log('✅ Chrome APIs available');
  
  // Test storage API
  if (chrome.storage) {
    console.log('✅ Chrome storage API available');
    
    // Simple storage test
    chrome.storage.local.set({ test: 'hello' }, () => {
      console.log('✅ Storage write test passed');
      
      chrome.storage.local.get(['test'], (result) => {
        console.log('✅ Storage read test:', result);
      });
    });
  } else {
    console.error('❌ Chrome storage API not available');
  }
  
  // Test runtime API
  if (chrome.runtime) {
    console.log('✅ Chrome runtime API available');
  } else {
    console.error('❌ Chrome runtime API not available');
  }
} else {
  console.error('❌ Chrome APIs not available');
}

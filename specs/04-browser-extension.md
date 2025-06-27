# Browser Extension Architecture

## Overview
Technical architecture for a Chrome extension that provides text expansion functionality across all web applications with high performance and reliability.

## Extension Structure

### Core Components

#### Manifest Configuration
- **Manifest Version**: Version 3 (latest Chrome extension standard)
- **Permissions**: Required browser permissions for functionality
- **Content Security Policy**: Security restrictions and allowances
- **Background Scripts**: Service worker for persistent functionality

#### Extension Files
```
my-text-expander/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content/
│   ├── content.js         # Content script injection
│   └── content.css        # Styling for injected elements
├── popup/
│   ├── popup.html         # Extension popup interface
│   ├── popup.js           # Popup functionality
│   └── popup.css          # Popup styling
├── options/
│   ├── options.html       # Settings page
│   ├── options.js         # Settings functionality
│   └── options.css        # Settings styling
└── assets/
    ├── icons/             # Extension icons
    └── images/            # UI images
```

### Manifest.json Configuration
```json
{
  "manifest_version": 3,
  "name": "My Text Expander",
  "version": "1.0.0",
  "description": "Personal text expansion tool for productivity",
  
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content.js"],
    "css": ["content/content.css"],
    "run_at": "document_end"
  }],
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Text Expander",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "32": "assets/icons/icon32.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },
  
  "options_page": "options/options.html"
}
```

## Data Storage Architecture

### Browser Storage APIs
- **chrome.storage.sync**: Synchronize snippets across devices
- **chrome.storage.local**: Local storage for performance
- **Storage Quotas**: Manage storage limits efficiently

### Data Structure
```javascript
// Snippet data structure
{
  id: "unique_id",
  shortcut: "/greeting",
  content: "Hello, how can I help you?",
  created: timestamp,
  modified: timestamp,
  folder: "personal",
  tags: ["email", "greeting"],
  isActive: true
}

// Settings data structure
{
  triggerKey: "space",
  expansionDelay: 0,
  showPreview: false,
  enableSounds: true,
  excludedSites: ["password-site.com"]
}
```

### Storage Management
- **CRUD Operations**: Create, Read, Update, Delete snippets
- **Backup/Restore**: Export and import functionality
- **Data Validation**: Ensure data integrity
- **Migration**: Handle data structure updates

## Content Script Implementation

### Text Field Detection
```javascript
// Monitor all text input elements
const textInputs = [
  'input[type="text"]',
  'input[type="email"]',
  'input[type="search"]',
  'textarea',
  '[contenteditable="true"]',
  '[contenteditable=""]'
];

// Observe for dynamically added elements
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        initializeTextExpansion(node);
      }
    });
  });
});
```

### Expansion Engine
```javascript
class TextExpansionEngine {
  constructor() {
    this.snippets = new Map();
    this.currentInput = null;
    this.expansionInProgress = false;
  }
  
  // Monitor typing events
  handleKeyInput(event) {
    if (this.expansionInProgress) return;
    
    const input = event.target;
    const text = this.getInputText(input);
    const match = this.findSnippetMatch(text);
    
    if (match) {
      this.expandSnippet(input, match);
    }
  }
  
  // Perform text expansion
  async expandSnippet(input, snippet) {
    this.expansionInProgress = true;
    
    try {
      const expandedText = await this.processSnippet(snippet);
      this.replaceText(input, snippet.shortcut, expandedText);
    } catch (error) {
      console.error('Expansion failed:', error);
    } finally {
      this.expansionInProgress = false;
    }
  }
}
```

### Cross-Frame Support
```javascript
// Handle iframes and embedded content
function initializeFrames() {
  // Initialize main document
  initializeTextExpansion(document);
  
  // Initialize existing iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      if (iframe.contentDocument) {
        initializeTextExpansion(iframe.contentDocument);
      }
    } catch (e) {
      // Handle cross-origin restrictions
    }
  });
}
```

## Background Service Worker

### Core Responsibilities
- **Storage Management**: Handle snippet CRUD operations
- **Settings Synchronization**: Sync user preferences
- **Performance Monitoring**: Track extension performance
- **Update Management**: Handle extension updates

### Implementation
```javascript
// Service worker for background tasks
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await initializeDefaultSnippets();
    chrome.tabs.create({ url: 'options/options.html' });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SNIPPETS':
      getSnippets().then(sendResponse);
      break;
    case 'SAVE_SNIPPET':
      saveSnippet(message.snippet).then(sendResponse);
      break;
    case 'EXPAND_SNIPPET':
      processSnippetExpansion(message.data).then(sendResponse);
      break;
  }
  return true; // Async response
});
```

## User Interface Components

### Extension Popup
- **Quick Access**: Fast snippet creation and editing
- **Recent Snippets**: Show frequently used snippets
- **Search Interface**: Find snippets quickly
- **Settings Shortcut**: Access to full settings

### Options Page
- **Snippet Management**: Full CRUD interface for snippets
- **Folder Organization**: Create and manage snippet folders
- **Import/Export**: Backup and restore functionality
- **Settings Configuration**: All extension preferences

### In-Page UI Elements
- **Expansion Preview**: Show snippet content before expansion
- **Form Dialogs**: Input forms for dynamic variables
- **Error Messages**: User-friendly error notifications
- **Success Indicators**: Visual feedback for successful expansions

## Performance Optimization

### Memory Management
```javascript
// Efficient snippet storage and retrieval
class SnippetCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
    this.accessOrder = [];
  }
  
  get(key) {
    const snippet = this.cache.get(key);
    if (snippet) {
      this.updateAccessOrder(key);
    }
    return snippet;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }
    this.cache.set(key, value);
    this.updateAccessOrder(key);
  }
}
```

### Event Handling Optimization
- **Debounced Input**: Prevent excessive processing during rapid typing
- **Smart Monitoring**: Only monitor active text fields
- **Efficient Matching**: Optimized algorithm for shortcut detection
- **Lazy Loading**: Load snippets on demand

### Bundle Size Optimization
- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Image Optimization**: Optimize icons and images
- **Code Splitting**: Load components as needed

## Security Considerations

### Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';"
  }
}
```

### Data Protection
- **Local Storage**: Keep sensitive data in browser storage
- **No External Requests**: Avoid unnecessary network calls
- **Sanitization**: Clean user input to prevent XSS
- **Permission Minimization**: Request only necessary permissions

### Cross-Site Scripting Prevention
- **Input Validation**: Validate all user input
- **Content Sanitization**: Clean snippet content
- **Safe DOM Manipulation**: Use safe methods for text insertion
- **Escape Special Characters**: Handle HTML entities properly

## Browser Compatibility

### Chrome Extension APIs
- **Manifest V3**: Use latest extension standards
- **Storage API**: Reliable cross-device synchronization
- **Scripting API**: Dynamic content script injection
- **Runtime Messaging**: Communication between components

### Web Standards Compliance
- **DOM Manipulation**: Standard DOM APIs for text insertion
- **Event Handling**: Standard event listeners and handlers
- **CSS Styling**: Cross-browser compatible styles
- **Accessibility**: ARIA labels and keyboard navigation

## Error Handling & Debugging

### Error Recovery
```javascript
class ErrorHandler {
  static handle(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Log to extension storage for debugging
    this.logError(error, context);
    
    // Show user-friendly message
    this.showUserNotification(error);
    
    // Attempt recovery
    this.attemptRecovery(context);
  }
  
  static logError(error, context) {
    chrome.storage.local.get(['errorLog'], (result) => {
      const log = result.errorLog || [];
      log.push({
        error: error.message,
        context,
        timestamp: Date.now(),
        stack: error.stack
      });
      chrome.storage.local.set({ errorLog: log.slice(-100) });
    });
  }
}
```

### Development Tools
- **Debug Mode**: Enable verbose logging for development
- **Performance Monitoring**: Track expansion timing
- **Error Reporting**: Collect and analyze errors
- **Usage Analytics**: Monitor feature usage (privacy-respecting)

## Deployment & Distribution

### Build Process
- **Asset Optimization**: Minimize file sizes
- **Version Management**: Semantic versioning
- **Testing**: Automated and manual testing
- **Package Creation**: Generate extension package

### Chrome Web Store
- **Store Listing**: Description, screenshots, metadata
- **Privacy Policy**: Data handling transparency
- **Update Mechanism**: Automatic updates through store
- **User Reviews**: Monitor and respond to feedback

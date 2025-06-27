// Background service worker for My Text Expander
// Import storage and snippet processor directly without ES6 modules
importScripts('./shared/storage.js');
importScripts('./shared/snippet-processor.js');

class BackgroundService {
  constructor() {
    this.storageManager = new StorageManager();
    this.snippetProcessor = new SnippetProcessor();
    this.initialize();
    /**
     * @type {{[key: number]: { ready: Promise<void>}}}
     */
    this.pageActivated = {};
  }

  async initialize() {
    console.log('🔥 My Text Expander background service initializing...');

    // Set up event listeners
    chrome.runtime.onInstalled.addListener((...args) => this.handleInstall(...args));
    chrome.runtime.onMessage.addListener((...args) => {
      this.handleMessage(...args);
      return true;
    });
    chrome.storage.onChanged.addListener((...args) => {
      this.handleStorageChange(...args)
      return true
    });
    chrome.action.onClicked.addListener((tab) => {
      if (!this.pageActivated[tab.id]) {
        this.pageActivated[tab.id] = {
          ready: Promise.all([
            // Inject CSS
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              files: ["content/content.css"]
            }),
            // Inject JavaScript
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content/content.js"]
            }),
            chrome.action.setIcon({
              tabId: tab.id,
              path: {
                16: "assets/icons/icon16.png",
                32: "assets/icons/icon32.png",
                48: "assets/icons/icon48.png",
                128: "assets/icons/icon128.png"
              }
            }),
            chrome.action.setPopup({
              tabId: tab.id,
              popup: 'popup.html'
            })
          ])
        }

      } else {
        this.pageActivated[tab.id].ready.then(() => chrome.action.openPopup({}))
      }
      return true;
    });


    console.log('✅ Background service initialized successfully');
  }

  async handleInstall(details) {
    if (details.reason === 'install') {
      // Initialize default snippets and settings
      await this.initializeDefaultData();
      // Open options page for first-time setup
      chrome.tabs.create({ url: 'options.html' });
    }
  }

  async handleMessage(message, sender, sendResponse) {
    // console.log('📨 Received message:', message.type, message);

    try {
      let response;

      switch (message.type) {
        case 'GET_SNIPPETS':
          const snippets = await this.storageManager.getAllSnippets();
          response = { success: true, data: snippets };
          break;

        case 'SAVE_SNIPPET':
          const saved = await this.storageManager.saveSnippet(message.snippet);
          response = { success: true, data: saved };
          break;

        case 'DELETE_SNIPPET':
          await this.storageManager.deleteSnippet(message.id);
          response = { success: true };
          break;

        case 'GET_SETTINGS':
          const settings = await this.storageManager.getSettings();
          response = { success: true, data: settings };
          break;

        case 'SAVE_SETTINGS':
          await this.storageManager.saveSettings(message.settings);
          response = { success: true };
          break;

        case 'PROCESS_SNIPPET':
          const processed = await this.snippetProcessor.process(message.snippet, message.variables);
          response = { success: true, data: processed };
          break;

        case 'SEARCH_SNIPPETS':
          const results = await this.storageManager.searchSnippets(message.query);
          response = { success: true, data: results };
          break;

        default:
          response = { success: false, error: 'Unknown message type' };
      }

      sendResponse(response);
    } catch (error) {
      console.error('Background service error:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // Keep message channel open for async response
  }

  async handleStorageChange(changes, area) {
    // Notify content scripts of snippet changes
    if (area === 'local' && Object.keys(changes).some(key => key.startsWith('snippet_'))) {
      try {
        const tabs = await chrome.tabs.query({});
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SNIPPETS_UPDATED'
          }).catch(() => {
            // Tab might not have content script injected
          });
        });
      } catch (error) {
        console.error('Error notifying tabs of snippet changes:', error);
      }
    }
  }

  async initializeDefaultData() {
    // Create default settings
    const defaultSettings = {
      triggerKey: 'space',
      expansionDelay: 0,
      caseSensitive: false,
      showPreview: false,
      theme: 'light',
      enableSounds: false,
      excludedSites: [],
      enableDebugMode: false
    };

    await this.storageManager.saveSettings(defaultSettings);

    // Create default snippets
    const defaultSnippets = [
      {
        shortcut: '/ty',
        content: 'Thank you for your message. I\'ll get back to you soon.',
        folder: 'Email',
        description: 'Thank you message'
      },
      {
        shortcut: '/sig',
        content: 'Best regards,\n[Your Name]\n[Your Email]\n[Your Phone]',
        folder: 'Personal',
        description: 'Email signature'
      },
      {
        shortcut: '/date',
        content: '{time: MMMM DD, YYYY}',
        folder: 'Utilities',
        description: 'Current date'
      }
    ];

    for (const snippet of defaultSnippets) {
      await this.storageManager.createSnippet(snippet);
    }

    // Create default folders
    const defaultFolders = [
      { name: 'Email', color: '#3498db', icon: 'email' },
      { name: 'Personal', color: '#27ae60', icon: 'user' },
      { name: 'Work', color: '#f39c12', icon: 'briefcase' },
      { name: 'Utilities', color: '#9b59b6', icon: 'settings' }
    ];

    for (const folder of defaultFolders) {
      await this.storageManager.createFolder(folder);
    }
  }
}

// Initialize the background service
new BackgroundService();

// Storage management utilities
class StorageManager {
  constructor() {
    this.cache = new Map();
    this.indexes = {
      shortcuts: new Map(),
      folders: new Map(),
      tags: new Map()
    };
  }

  // Generate unique ID
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Snippet operations
  async createSnippet(snippetData) {
    const snippet = {
      id: this.generateId(),
      ...snippetData,
      created: Date.now(),
      modified: Date.now(),
      lastUsed: null,
      useCount: 0,
      isActive: true,
      tags: snippetData.tags || [],
      contentType: 'text'
    };

    await chrome.storage.local.set({ [`snippet_${snippet.id}`]: snippet });
    await this.updateIndexes();
    return snippet;
  }

  async getSnippet(id) {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const result = await chrome.storage.local.get([`snippet_${id}`]);
    const snippet = result[`snippet_${id}`] || null;
    
    if (snippet) {
      this.cache.set(id, snippet);
    }
    
    return snippet;
  }

  async saveSnippet(snippet) {
    // If no ID exists or ID is empty, generate a new one
    if (!snippet.id || snippet.id === '') {
      snippet.id = this.generateId();
    }
    
    const updatedSnippet = {
      isActive: true,
      contentType: 'text',
      ...snippet,
      modified: Date.now()
    };

    await chrome.storage.local.set({ [`snippet_${snippet.id}`]: updatedSnippet });
    this.cache.set(snippet.id, updatedSnippet);
    await this.updateIndexes();
    return updatedSnippet;
  }

  async deleteSnippet(id) {
    await chrome.storage.local.remove([`snippet_${id}`]);
    this.cache.delete(id);
    await this.updateIndexes();
  }

  async getAllSnippets() {
    const result = await chrome.storage.local.get(null);
    const snippets = {};

    Object.keys(result).forEach(key => {
      if (key.startsWith('snippet_')) {
        const id = key.replace('snippet_', '');
        snippets[id] = result[key];
        this.cache.set(id, result[key]);
      }
    });

    return snippets;
  }

  async searchSnippets(query) {
    const snippets = await this.getAllSnippets();
    const searchTerms = query.toLowerCase().split(' ');
    const results = [];

    Object.values(snippets).forEach(snippet => {
      if (!snippet.isActive) return;

      const searchableContent = [
        snippet.shortcut,
        snippet.content,
        snippet.description || '',
        snippet.folder || '',
        ...(snippet.tags || [])
      ].join(' ').toLowerCase();

      const matches = searchTerms.every(term => 
        searchableContent.includes(term)
      );

      if (matches) {
        results.push(snippet);
      }
    });

    return results.sort((a, b) => b.useCount - a.useCount);
  }

  async findSnippetByShortcut(shortcut) {
    if (this.indexes.shortcuts.has(shortcut)) {
      const id = this.indexes.shortcuts.get(shortcut);
      return await this.getSnippet(id);
    }

    // Fallback to full search if index not built
    const snippets = await this.getAllSnippets();
    return Object.values(snippets).find(s => s.shortcut === shortcut && s.isActive) || null;
  }

  // Update snippet usage statistics
  async recordSnippetUsage(id) {
    const snippet = await this.getSnippet(id);
    if (snippet) {
      snippet.useCount = (snippet.useCount || 0) + 1;
      snippet.lastUsed = Date.now();
      await this.saveSnippet(snippet);
    }
  }

  // Settings operations
  async getSettings() {
    const result = await chrome.storage.sync.get(['settings']);
    return result.settings || this.getDefaultSettings();
  }

  async saveSettings(settings) {
    await chrome.storage.sync.set({ settings });
  }

  getDefaultSettings() {
    return {
      triggerKey: 'space',
      expansionDelay: 0,
      caseSensitive: false,
      showPreview: false,
      theme: 'light',
      enableSounds: false,
      excludedSites: [],
      enableDebugMode: false
    };
  }

  // Folder operations
  async createFolder(folderData) {
    const folder = {
      id: this.generateId(),
      ...folderData,
      created: Date.now(),
      snippetCount: 0,
      order: 0
    };

    const folders = await this.getFolders();
    folders[folder.id] = folder;
    await chrome.storage.local.set({ folders });
    return folder;
  }

  async getFolders() {
    const result = await chrome.storage.local.get(['folders']);
    return result.folders || {};
  }

  async saveFolders(folders) {
    await chrome.storage.local.set({ folders });
  }

  // Index management for fast lookups
  async updateIndexes() {
    const snippets = await this.getAllSnippets();
    
    // Clear existing indexes
    this.indexes.shortcuts.clear();
    this.indexes.folders.clear();
    this.indexes.tags.clear();

    // Rebuild indexes
    Object.values(snippets).forEach(snippet => {
      if (!snippet.isActive) return;

      // Shortcut index
      this.indexes.shortcuts.set(snippet.shortcut, snippet.id);

      // Folder index
      if (snippet.folder) {
        if (!this.indexes.folders.has(snippet.folder)) {
          this.indexes.folders.set(snippet.folder, []);
        }
        this.indexes.folders.get(snippet.folder).push(snippet.id);
      }

      // Tags index
      (snippet.tags || []).forEach(tag => {
        if (!this.indexes.tags.has(tag)) {
          this.indexes.tags.set(tag, []);
        }
        this.indexes.tags.get(tag).push(snippet.id);
      });
    });
  }

  // Export/Import functionality
  async exportData() {
    const snippets = await this.getAllSnippets();
    const folders = await this.getFolders();
    const settings = await this.getSettings();

    return {
      version: '1.0',
      timestamp: Date.now(),
      snippets,
      folders,
      settings
    };
  }

  async importData(data) {
    if (!data.version || !data.snippets) {
      throw new Error('Invalid backup format');
    }

    const results = {
      snippets: 0,
      folders: 0,
      settings: false
    };

    // Import snippets
    if (data.snippets) {
      for (const snippet of Object.values(data.snippets)) {
        await this.createSnippet(snippet);
        results.snippets++;
      }
    }

    // Import folders
    if (data.folders) {
      await this.saveFolders(data.folders);
      results.folders = Object.keys(data.folders).length;
    }

    // Import settings
    if (data.settings) {
      await this.saveSettings(data.settings);
      results.settings = true;
    }

    await this.updateIndexes();
    return results;
  }

  // Storage quota management
  async getStorageUsage() {
    const usage = await chrome.storage.local.getBytesInUse();
    const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB

    return {
      used: usage,
      total: quota,
      percentage: (usage / quota) * 100,
      remaining: quota - usage
    };
  }
}

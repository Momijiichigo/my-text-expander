# Data Storage & Synchronization

## Overview
Comprehensive data management system for storing snippets, settings, and user preferences with local storage and cross-device synchronization capabilities.

## Storage Architecture

### Browser Storage APIs

#### Chrome Storage Sync
- **Purpose**: Synchronize data across user's Chrome instances
- **Capacity**: 100KB total, 8KB per item
- **Use Case**: User settings, frequently used snippets
- **Automatic Sync**: Data syncs when user signs into Chrome

#### Chrome Storage Local
- **Purpose**: Local device storage for performance
- **Capacity**: 5MB total (can request unlimited)
- **Use Case**: All snippets, cache, temporary data
- **Performance**: Faster access than sync storage

### Storage Strategy
```javascript
// Hybrid storage approach
const StorageManager = {
  // Small, critical data in sync storage
  syncData: ['settings', 'recentSnippets', 'folders'],
  
  // All data in local storage for performance
  localData: ['allSnippets', 'cache', 'statistics'],
  
  // Determine storage location based on data type
  getStorageArea(dataType) {
    return this.syncData.includes(dataType) ? 
           chrome.storage.sync : chrome.storage.local;
  }
};
```

## Data Models

### Snippet Data Structure
```javascript
const Snippet = {
  id: "uuid-v4-string",              // Unique identifier
  shortcut: "/greeting",             // Trigger text
  content: "Hello! How can I help?", // Expansion text
  folder: "work",                    // Organization folder
  tags: ["email", "customer"],       // Search tags
  created: 1640995200000,            // Creation timestamp
  modified: 1640995200000,           // Last modified timestamp
  lastUsed: 1640995200000,           // Last usage timestamp
  useCount: 42,                      // Usage statistics
  isActive: true,                    // Enable/disable status
  description: "Friendly greeting",  // Optional description
  contentType: "text"                // text, html, markdown
};
```

### Settings Data Structure
```javascript
const Settings = {
  // Expansion behavior
  triggerKey: "space",               // space, tab, enter
  expansionDelay: 0,                 // Milliseconds delay
  caseSensitive: false,              // Shortcut matching
  showPreview: false,                // Preview before expansion
  
  // UI preferences
  theme: "light",                    // light, dark, auto
  fontSize: "medium",                // small, medium, large
  animationSpeed: "normal",          // slow, normal, fast, none
  
  // Audio feedback
  enableSounds: false,               // Sound notifications
  soundVolume: 0.5,                  // Volume level (0-1)
  
  // Site exclusions
  excludedSites: [                   // Domains to exclude
    "banking-site.com",
    "secure-portal.org"
  ],
  
  // Advanced settings
  enableDebugMode: false,            // Development mode
  maxSnippets: 1000,                 // Storage limit
  backupFrequency: "weekly",         // auto, daily, weekly, never
  
  // Privacy settings
  shareUsageStats: false,            // Anonymous usage data
  enableAnalytics: false             // Extension analytics
};
```

### Folder Organization
```javascript
const Folder = {
  id: "folder-uuid",
  name: "Work Email",
  color: "#3498db",                  // Visual identifier
  icon: "email",                     // Icon identifier
  parent: null,                      // Parent folder ID (null for root)
  children: [],                      // Child folder IDs
  snippetCount: 15,                  // Number of snippets
  created: 1640995200000,
  order: 1                           // Display order
};
```

## Storage Operations

### CRUD Operations
```javascript
class SnippetStorage {
  // Create new snippet
  async createSnippet(snippetData) {
    const snippet = {
      id: this.generateId(),
      ...snippetData,
      created: Date.now(),
      modified: Date.now(),
      lastUsed: null,
      useCount: 0,
      isActive: true
    };
    
    await this.saveToStorage('snippets', snippet.id, snippet);
    await this.updateIndex();
    return snippet;
  }
  
  // Read snippet by ID
  async getSnippet(id) {
    const result = await chrome.storage.local.get([`snippet_${id}`]);
    return result[`snippet_${id}`] || null;
  }
  
  // Update existing snippet
  async updateSnippet(id, updates) {
    const snippet = await this.getSnippet(id);
    if (!snippet) throw new Error('Snippet not found');
    
    const updatedSnippet = {
      ...snippet,
      ...updates,
      modified: Date.now()
    };
    
    await this.saveToStorage('snippets', id, updatedSnippet);
    await this.updateIndex();
    return updatedSnippet;
  }
  
  // Delete snippet
  async deleteSnippet(id) {
    await chrome.storage.local.remove([`snippet_${id}`]);
    await this.updateIndex();
    return true;
  }
}
```

### Batch Operations
```javascript
class BatchOperations {
  // Get all snippets efficiently
  async getAllSnippets() {
    const result = await chrome.storage.local.get(null);
    const snippets = {};
    
    Object.keys(result).forEach(key => {
      if (key.startsWith('snippet_')) {
        const id = key.replace('snippet_', '');
        snippets[id] = result[key];
      }
    });
    
    return snippets;
  }
  
  // Bulk update multiple snippets
  async updateMultipleSnippets(updates) {
    const storage = {};
    const timestamp = Date.now();
    
    for (const [id, data] of Object.entries(updates)) {
      storage[`snippet_${id}`] = {
        ...data,
        modified: timestamp
      };
    }
    
    await chrome.storage.local.set(storage);
    await this.updateIndex();
  }
  
  // Import snippets from backup
  async importSnippets(snippetData, options = {}) {
    const { overwrite = false, preserveIds = false } = options;
    const imported = [];
    
    for (const snippet of snippetData) {
      const id = preserveIds ? snippet.id : this.generateId();
      
      if (!overwrite && await this.getSnippet(id)) {
        continue; // Skip existing if not overwriting
      }
      
      await this.createSnippet({ ...snippet, id });
      imported.push(id);
    }
    
    return imported;
  }
}
```

## Performance Optimization

### Indexing System
```javascript
class SnippetIndex {
  constructor() {
    this.shortcutIndex = new Map();    // shortcut -> snippet ID
    this.tagIndex = new Map();         // tag -> snippet IDs[]
    this.folderIndex = new Map();      // folder -> snippet IDs[]
    this.searchIndex = new Map();      // term -> snippet IDs[]
  }
  
  // Build search index for fast lookup
  async buildIndex() {
    const snippets = await this.getAllSnippets();
    
    this.clearIndex();
    
    Object.values(snippets).forEach(snippet => {
      // Index by shortcut
      this.shortcutIndex.set(snippet.shortcut, snippet.id);
      
      // Index by folder
      this.addToIndex(this.folderIndex, snippet.folder, snippet.id);
      
      // Index by tags
      snippet.tags?.forEach(tag => {
        this.addToIndex(this.tagIndex, tag, snippet.id);
      });
      
      // Index searchable content
      this.indexSearchableContent(snippet);
    });
    
    await this.saveIndex();
  }
  
  // Fast shortcut lookup
  findByShortcut(shortcut) {
    return this.shortcutIndex.get(shortcut);
  }
  
  // Search snippets by content
  search(query) {
    const terms = query.toLowerCase().split(' ');
    const results = new Set();
    
    terms.forEach(term => {
      const matches = this.searchIndex.get(term) || [];
      matches.forEach(id => results.add(id));
    });
    
    return Array.from(results);
  }
}
```

### Caching Strategy
```javascript
class SnippetCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;               // Cache most used snippets
    this.accessOrder = [];
    this.loadPromises = new Map();    // Prevent duplicate loads
  }
  
  // Get snippet with caching
  async getSnippet(id) {
    // Return from cache if available
    if (this.cache.has(id)) {
      this.updateAccessOrder(id);
      return this.cache.get(id);
    }
    
    // Prevent duplicate loading
    if (this.loadPromises.has(id)) {
      return await this.loadPromises.get(id);
    }
    
    // Load from storage
    const loadPromise = this.loadFromStorage(id);
    this.loadPromises.set(id, loadPromise);
    
    try {
      const snippet = await loadPromise;
      if (snippet) {
        this.set(id, snippet);
      }
      return snippet;
    } finally {
      this.loadPromises.delete(id);
    }
  }
  
  // Cache management
  set(id, snippet) {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }
    
    this.cache.set(id, snippet);
    this.updateAccessOrder(id);
  }
  
  // Remove least recently used items
  evictLeastUsed() {
    if (this.accessOrder.length > 0) {
      const lru = this.accessOrder.shift();
      this.cache.delete(lru);
    }
  }
}
```

## Data Synchronization

### Cross-Device Sync
```javascript
class SyncManager {
  constructor() {
    this.syncInProgress = false;
    this.lastSyncTime = 0;
    this.syncInterval = 30000; // 30 seconds
  }
  
  // Sync critical data to chrome.storage.sync
  async syncCriticalData() {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      // Get local data
      const settings = await this.getSettings();
      const recentSnippets = await this.getRecentSnippets(10);
      const folders = await this.getFolders();
      
      // Prepare sync data (must fit in 8KB per item)
      const syncData = {
        settings: this.compressSettings(settings),
        recentSnippets: this.compressSnippets(recentSnippets),
        folders: this.compressFolders(folders),
        lastSync: Date.now()
      };
      
      // Sync to cloud
      await chrome.storage.sync.set(syncData);
      this.lastSyncTime = Date.now();
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  // Restore from sync storage
  async restoreFromSync() {
    try {
      const syncData = await chrome.storage.sync.get(null);
      
      if (syncData.settings) {
        await this.restoreSettings(syncData.settings);
      }
      
      if (syncData.recentSnippets) {
        await this.restoreSnippets(syncData.recentSnippets);
      }
      
      if (syncData.folders) {
        await this.restoreFolders(syncData.folders);
      }
      
    } catch (error) {
      console.error('Restore failed:', error);
    }
  }
}
```

### Conflict Resolution
```javascript
class ConflictResolver {
  // Resolve conflicts when same snippet exists locally and in sync
  async resolveSnippetConflict(localSnippet, syncSnippet) {
    // Use most recently modified version
    if (localSnippet.modified > syncSnippet.modified) {
      return localSnippet;
    } else if (syncSnippet.modified > localSnippet.modified) {
      return syncSnippet;
    }
    
    // If same modification time, prefer version with more usage
    return localSnippet.useCount >= syncSnippet.useCount ? 
           localSnippet : syncSnippet;
  }
  
  // Merge settings with user preference priority
  async mergeSettings(localSettings, syncSettings) {
    return {
      ...syncSettings,      // Base from sync
      ...localSettings,     // Override with local preferences
      // Merge arrays
      excludedSites: [
        ...new Set([
          ...(syncSettings.excludedSites || []),
          ...(localSettings.excludedSites || [])
        ])
      ]
    };
  }
}
```

## Backup & Restore

### Export Functionality
```javascript
class BackupManager {
  // Export all data for backup
  async exportData() {
    const data = {
      version: "1.0",
      timestamp: Date.now(),
      snippets: await this.getAllSnippets(),
      folders: await this.getAllFolders(),
      settings: await this.getSettings()
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  // Import data from backup
  async importData(jsonData, options = {}) {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate backup format
      if (!this.validateBackup(data)) {
        throw new Error('Invalid backup format');
      }
      
      // Import with options
      const results = {
        snippets: 0,
        folders: 0,
        settings: false
      };
      
      if (data.snippets && options.includeSnippets !== false) {
        results.snippets = await this.importSnippets(data.snippets, options);
      }
      
      if (data.folders && options.includeFolders !== false) {
        results.folders = await this.importFolders(data.folders, options);
      }
      
      if (data.settings && options.includeSettings !== false) {
        await this.importSettings(data.settings, options);
        results.settings = true;
      }
      
      return results;
      
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }
  
  // Automatic backup
  async createAutoBackup() {
    const backupData = await this.exportData();
    const timestamp = new Date().toISOString().split('T')[0];
    
    await chrome.storage.local.set({
      [`backup_${timestamp}`]: backupData
    });
    
    // Clean old backups (keep last 5)
    await this.cleanOldBackups();
  }
}
```

## Storage Limits & Management

### Quota Management
```javascript
class QuotaManager {
  // Check storage usage
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
  
  // Clean up old data when approaching limits
  async manageQuota() {
    const usage = await this.getStorageUsage();
    
    if (usage.percentage > 80) {
      // Clean old backups
      await this.cleanOldBackups(2); // Keep only 2 most recent
      
      // Clean usage statistics older than 30 days
      await this.cleanOldStatistics(30);
      
      // Clean cached data
      await this.clearCache();
    }
  }
  
  // Estimate storage needed for new snippet
  estimateSnippetSize(snippet) {
    return JSON.stringify(snippet).length * 2; // UTF-16 bytes
  }
}
```

## Data Migration

### Version Migration
```javascript
class DataMigration {
  constructor() {
    this.migrations = {
      '1.0': this.migrateToV10,
      '1.1': this.migrateToV11,
      '2.0': this.migrateToV20
    };
  }
  
  // Run necessary migrations
  async migrate() {
    const currentVersion = await this.getCurrentDataVersion();
    const targetVersion = this.getExtensionVersion();
    
    if (currentVersion === targetVersion) {
      return; // No migration needed
    }
    
    // Run migrations in order
    for (const [version, migrationFn] of Object.entries(this.migrations)) {
      if (this.shouldRunMigration(currentVersion, version, targetVersion)) {
        await migrationFn.call(this);
      }
    }
    
    await this.setDataVersion(targetVersion);
  }
  
  // Example migration: Add new fields to snippets
  async migrateToV11() {
    const snippets = await this.getAllSnippets();
    
    for (const [id, snippet] of Object.entries(snippets)) {
      if (!snippet.contentType) {
        snippet.contentType = 'text';
        snippet.tags = snippet.tags || [];
        await this.updateSnippet(id, snippet);
      }
    }
  }
}

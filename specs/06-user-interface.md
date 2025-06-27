# User Interface & Experience

## Overview
Comprehensive user interface design for the text expansion extension, focusing on simplicity, accessibility, and efficient workflow for personal productivity use.

## Extension Popup Interface

### Popup Design
- **Compact Layout**: Fits standard extension popup constraints (300-400px width)
- **Quick Access**: Essential functions accessible within 1-2 clicks
- **Responsive Design**: Adapts to different screen densities
- **Consistent Styling**: Follows Chrome extension design guidelines

### Popup Components

#### Header Section
```
┌─────────────────────────────────────┐
│ 🔥 My Text Expander              ⚙️   │
├─────────────────────────────────────┤
│ 📝 New Snippet                     │
└─────────────────────────────────────┘
```

#### Recent Snippets List
```
┌─────────────────────────────────────┐
│ Recent Snippets                     │
├─────────────────────────────────────┤
│ /ty     Thank you for...        📝 │
│ /sig    Best regards, John...   📝 │
│ /addr   123 Main Street...      📝 │
│ /email  Dear customer...        📝 │
├─────────────────────────────────────┤
│ 👀 View All (15 snippets)          │
└─────────────────────────────────────┘
```

#### Quick Actions
```
┌─────────────────────────────────────┐
│ 🔍 Search snippets...              │
├─────────────────────────────────────┤
│ 📁 Manage Folders                  │
│ 📤 Import/Export                   │
│ ⚙️  Settings                       │
└─────────────────────────────────────┘
```

### Popup Functionality
```javascript
class PopupInterface {
  constructor() {
    this.recentSnippets = [];
    this.searchQuery = '';
    this.maxRecentItems = 5;
  }
  
  // Initialize popup content
  async initialize() {
    await this.loadRecentSnippets();
    this.setupEventListeners();
    this.renderInterface();
  }
  
  // Handle quick snippet creation
  async createQuickSnippet() {
    const shortcut = prompt('Enter shortcut (e.g., /hello):');
    const content = prompt('Enter expansion text:');
    
    if (shortcut && content) {
      await this.saveSnippet({ shortcut, content });
      this.showSuccess('Snippet created!');
      this.refreshRecentSnippets();
    }
  }
  
  // Search snippets in popup
  async searchSnippets(query) {
    this.searchQuery = query;
    const results = await this.performSearch(query);
    this.renderSearchResults(results);
  }
}
```

## Options/Settings Page

### Full Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│                     My Text Expander Settings                  │
├─────────────────────────────────────────────────────────────┤
│ [Snippets] [Folders] [Settings] [Import/Export] [About]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Main Content Area                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Snippets Management Tab
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search: [________________] 📝 New Snippet   📁 Folders  │
├─────────────────────────────────────────────────────────────┤
│ Shortcut    │ Preview              │ Folder    │ Actions    │
├─────────────┼─────────────────────┼───────────┼────────────┤
│ /ty         │ Thank you for...    │ Email     │ ✏️ 🗑️     │
│ /sig        │ Best regards...     │ Personal  │ ✏️ 🗑️     │
│ /addr       │ 123 Main Street...  │ Personal  │ ✏️ 🗑️     │
│ /meeting    │ Meeting notes...    │ Work      │ ✏️ 🗑️     │
└─────────────────────────────────────────────────────────────┘
```

### Snippet Editor Modal
```javascript
class SnippetEditor {
  constructor() {
    this.currentSnippet = null;
    this.isEditing = false;
    this.isDirty = false;
  }
  
  // Open editor for new or existing snippet
  openEditor(snippet = null) {
    this.currentSnippet = snippet;
    this.isEditing = !!snippet;
    this.renderEditor();
    this.showModal();
  }
  
  // Render editor form
  renderEditor() {
    return `
      <div class="snippet-editor">
        <h3>${this.isEditing ? 'Edit' : 'Create'} Snippet</h3>
        
        <label>
          Shortcut:
          <input type="text" id="shortcut" 
                 value="${this.currentSnippet?.shortcut || ''}"
                 placeholder="/example" required>
        </label>
        
        <label>
          Folder:
          <select id="folder">
            ${this.renderFolderOptions()}
          </select>
        </label>
        
        <label>
          Content:
          <textarea id="content" rows="10" 
                    placeholder="Enter your snippet content here..."
                    required>${this.currentSnippet?.content || ''}</textarea>
        </label>
        
        <label>
          Description (optional):
          <input type="text" id="description" 
                 value="${this.currentSnippet?.description || ''}"
                 placeholder="Brief description">
        </label>
        
        <div class="editor-actions">
          <button onclick="this.saveSnippet()">Save</button>
          <button onclick="this.testSnippet()">Test</button>
          <button onclick="this.closeEditor()">Cancel</button>
        </div>
      </div>
    `;
  }
}
```

### Settings Configuration
```javascript
class SettingsPage {
  constructor() {
    this.settings = {};
    this.settingsCategories = [
      'expansion',
      'interface',
      'advanced',
      'privacy'
    ];
  }
  
  // Render settings form
  renderSettings() {
    return `
      <div class="settings-page">
        <section class="expansion-settings">
          <h3>Expansion Behavior</h3>
          
          <label>
            Trigger Key:
            <select id="triggerKey">
              <option value="space">Space Bar</option>
              <option value="tab">Tab Key</option>
              <option value="enter">Enter Key</option>
            </select>
          </label>
          
          <label>
            <input type="checkbox" id="caseSensitive">
            Case sensitive shortcuts
          </label>
          
          <label>
            <input type="checkbox" id="showPreview">
            Show preview before expansion
          </label>
        </section>
        
        <section class="interface-settings">
          <h3>Interface</h3>
          
          <label>
            Theme:
            <select id="theme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </label>
          
          <label>
            <input type="checkbox" id="enableSounds">
            Enable sound notifications
          </label>
        </section>
        
        <section class="advanced-settings">
          <h3>Advanced</h3>
          
          <label>
            Excluded Websites:
            <textarea id="excludedSites" rows="3" 
                      placeholder="domain1.com&#10;domain2.org"></textarea>
          </label>
          
          <label>
            <input type="checkbox" id="enableDebugMode">
            Enable debug mode
          </label>
        </section>
      </div>
    `;
  }
}
```

## In-Page UI Elements

### Expansion Preview
```javascript
class ExpansionPreview {
  constructor() {
    this.previewElement = null;
    this.previewTimeout = null;
  }
  
  // Show preview of snippet before expansion
  showPreview(snippet, position) {
    this.hidePreview(); // Clear any existing preview
    
    this.previewElement = this.createPreviewElement(snippet);
    this.positionPreview(position);
    document.body.appendChild(this.previewElement);
    
    // Auto-hide after delay
    this.previewTimeout = setTimeout(() => {
      this.hidePreview();
    }, 3000);
  }
  
  createPreviewElement(snippet) {
    const preview = document.createElement('div');
    preview.className = 'text-expander-preview';
    preview.innerHTML = `
      <div class="preview-header">
        <span class="preview-shortcut">${snippet.shortcut}</span>
        <button class="preview-close">×</button>
      </div>
      <div class="preview-content">
        ${this.truncateContent(snippet.content, 100)}
      </div>
      <div class="preview-actions">
        <button class="preview-expand">Expand</button>
        <button class="preview-cancel">Cancel</button>
      </div>
    `;
    return preview;
  }
}
```

### Dynamic Form Dialogs
```javascript
class FormDialog {
  constructor() {
    this.activeDialog = null;
    this.formData = {};
  }
  
  // Show form for dynamic variables
  showForm(formCommands) {
    const dialog = this.createFormDialog(formCommands);
    this.positionDialog(dialog);
    document.body.appendChild(dialog);
    this.activeDialog = dialog;
    
    // Focus first input
    const firstInput = dialog.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }
  
  createFormDialog(commands) {
    const dialog = document.createElement('div');
    dialog.className = 'text-expander-form-dialog';
    
    const fields = commands.map(cmd => this.createFormField(cmd)).join('');
    
    dialog.innerHTML = `
      <div class="form-header">
        <h4>Complete Snippet</h4>
        <button class="close-dialog">×</button>
      </div>
      <form class="snippet-form">
        ${fields}
        <div class="form-actions">
          <button type="submit">Insert</button>
          <button type="button" onclick="this.cancelForm()">Cancel</button>
        </div>
      </form>
    `;
    
    return dialog;
  }
  
  createFormField(command) {
    switch (command.type) {
      case 'formtext':
        return `
          <label>
            ${command.label || command.name}:
            <input type="text" 
                   name="${command.name}"
                   value="${command.default || ''}"
                   placeholder="${command.placeholder || ''}">
          </label>
        `;
        
      case 'formdate':
        return `
          <label>
            ${command.label || command.name}:
            <input type="date" 
                   name="${command.name}"
                   value="${command.default || ''}">
          </label>
        `;
        
      case 'formmenu':
        const options = command.options.map(opt => 
          `<option value="${opt}">${opt}</option>`
        ).join('');
        return `
          <label>
            ${command.label || command.name}:
            <select name="${command.name}">
              ${options}
            </select>
          </label>
        `;
    }
  }
}
```

## Visual Design System

### Color Scheme
```css
:root {
  /* Primary colors */
  --primary-blue: #3498db;
  --primary-dark: #2c3e50;
  --primary-light: #ecf0f1;
  
  /* Status colors */
  --success-green: #27ae60;
  --warning-orange: #f39c12;
  --error-red: #e74c3c;
  
  /* Neutral colors */
  --gray-light: #bdc3c7;
  --gray-medium: #95a5a6;
  --gray-dark: #7f8c8d;
  
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-dark: #34495e;
}

/* Dark theme */
[data-theme="dark"] {
  --bg-primary: #2c3e50;
  --bg-secondary: #34495e;
  --primary-light: #34495e;
  --primary-dark: #ecf0f1;
}
```

### Typography
```css
.text-expander-ui {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--primary-dark);
}

.text-expander-ui h1 { font-size: 24px; font-weight: 600; }
.text-expander-ui h2 { font-size: 20px; font-weight: 600; }
.text-expander-ui h3 { font-size: 18px; font-weight: 500; }
.text-expander-ui h4 { font-size: 16px; font-weight: 500; }

.text-expander-ui .code {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
```

### Component Styles
```css
/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

/* Input fields */
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--gray-light);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Modal dialogs */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

## Accessibility Features

### Keyboard Navigation
```javascript
class KeyboardNavigation {
  constructor() {
    this.focusableElements = [
      'button',
      'input',
      'textarea',
      'select',
      '[tabindex="0"]'
    ];
  }
  
  // Handle keyboard navigation in popup
  handlePopupKeyboard(event) {
    switch (event.key) {
      case 'Escape':
        this.closePopup();
        break;
        
      case 'ArrowDown':
        this.navigateDown();
        event.preventDefault();
        break;
        
      case 'ArrowUp':
        this.navigateUp();
        event.preventDefault();
        break;
        
      case 'Enter':
        this.activateSelected();
        event.preventDefault();
        break;
    }
  }
  
  // Trap focus within modal
  trapFocus(container) {
    const focusable = container.querySelectorAll(this.focusableElements.join(','));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  }
}
```

### ARIA Labels and Screen Reader Support
```html
<!-- Popup structure with accessibility -->
<div class="text-expander-popup" role="dialog" aria-labelledby="popup-title">
  <h2 id="popup-title">Text Expander Quick Access</h2>
  
  <button aria-label="Create new snippet" onclick="createSnippet()">
    <span aria-hidden="true">📝</span> New Snippet
  </button>
  
  <div role="list" aria-label="Recent snippets">
    <div role="listitem" class="snippet-item">
      <button aria-label="Use greeting snippet: Thank you for your message">
        <span class="shortcut">/ty</span>
        <span class="preview">Thank you for...</span>
      </button>
    </div>
  </div>
  
  <input type="text" 
         placeholder="Search snippets..." 
         aria-label="Search snippets"
         role="searchbox">
</div>
```

## Responsive Design

### Mobile/Small Screen Adaptations
```css
/* Responsive popup */
@media (max-width: 480px) {
  .text-expander-popup {
    width: 100%;
    max-width: none;
    height: 100%;
    border-radius: 0;
  }
  
  .snippet-item {
    padding: 16px 12px;
    font-size: 16px; /* Larger touch targets */
  }
  
  .btn {
    padding: 12px 20px;
    font-size: 16px;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2) {
  .icon {
    /* Use high-resolution icons */
  }
}
```

### Performance Optimization
```javascript
class UIPerformance {
  constructor() {
    this.renderQueue = [];
    this.isRendering = false;
  }
  
  // Batch DOM updates for better performance
  batchUpdate(updateFn) {
    this.renderQueue.push(updateFn);
    
    if (!this.isRendering) {
      this.isRendering = true;
      requestAnimationFrame(() => {
        this.flushUpdates();
      });
    }
  }
  
  flushUpdates() {
    while (this.renderQueue.length > 0) {
      const update = this.renderQueue.shift();
      update();
    }
    this.isRendering = false;
  }
  
  // Virtualize long lists for performance
  virtualizeList(items, containerHeight, itemHeight) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(this.scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    
    return items.slice(startIndex, endIndex);
  }
}

// Create a Range and Selection:
const range = document.createRange();
const selection = window.getSelection();

// Walk the text nodes to find the offset:
function setCaret(el, offset) {
  let currentOffset = 0;
  let nodeStack = [el];
  let node;

  while ((node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent.length;
      if (currentOffset + length >= offset) {
        range.setStart(node, offset - currentOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
      }
      currentOffset += length;
    } else {
      let children = Array.from(node.childNodes);
      for (let i = children.length - 1; i >= 0; i--) {
        nodeStack.push(children[i]);
      }
    }
  }
  return false;
}

// Content script for text expansion functionality
class TextExpansionEngine {
  constructor() {
    this.snippets = new Map();
    this.settings = {};
    this.currentInput = null;
    this.expansionInProgress = false;
    this.keyBuffer = '';
    this.bufferTimeout = null;
    this.lastKeyTime = 0;
    
    this.initialize();
  }

  async initialize() {
    // Load snippets and settings
    await this.loadSnippets();
    await this.loadSettings();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Listen for updates from background
    chrome.runtime.onMessage.addListener((...args) => this.handleMessage(...args));
  }

  async loadSnippets() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_SNIPPETS' });
      if (response.success) {
        this.snippets.clear();
        Object.values(response.data).forEach(snippet => {
          if (snippet.isActive) {
            this.snippets.set(snippet.shortcut, snippet);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load snippets:', error);
    }
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (response.success) {
        this.settings = response.data;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupEventListeners() {
    // Monitor keydown events for trigger detection
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    
    // Monitor input events for real-time typing
    document.addEventListener('input', this.handleInput.bind(this), true);
    
    // Monitor focus changes
    document.addEventListener('focusin', this.handleFocusIn.bind(this), true);
    document.addEventListener('focusout', this.handleFocusOut.bind(this), true);
    
    // Handle dynamic content
    this.observeDOMChanges();
  }

  observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.initializeNewElements(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  initializeNewElements(element) {
    // Initialize text expansion on new input elements
    const textInputs = element.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="search"], textarea, [contenteditable="true"], [contenteditable=""]'
    );
    
    textInputs.forEach(input => {
      if (!input.hasAttribute('data-text-expander-initialized')) {
        input.setAttribute('data-text-expander-initialized', 'true');
      }
    });
  }

  handleMessage(message, sender, sendResponse) {
    // console.log('📨 Received message:', message.type, message);
    switch (message.type) {
      case 'SNIPPETS_UPDATED':
        this.loadSnippets();
        break;
      case 'SETTINGS_UPDATED':
        this.loadSettings();
        break;
    }
    return true; // Keep message channel open for async response
  }

  handleKeyDown(event) {
    if (this.expansionInProgress) return;
    
    const target = event.target;
    if (!this.isTextInput(target)) return;
    
    // Check if this is a trigger key
    if (this.isTriggerKey(event)) {
      this.checkForExpansion(target, event);
    }
    
    // Update key buffer for immediate mode
    if (this.settings.triggerKey === 'immediate') {
      this.updateKeyBuffer(event.key);
    }
  }

  handleInput(event) {
    if (this.expansionInProgress) return;
    
    const target = event.target;
    if (!this.isTextInput(target)) return;
    
    this.currentInput = target;
    
    // For immediate mode, check on every input
    if (this.settings.triggerKey === 'immediate') {
      this.checkForImmediateExpansion(target);
    }
  }

  handleFocusIn(event) {
    if (this.isTextInput(event.target)) {
      this.currentInput = event.target;
    }
  }

  handleFocusOut(event) {
    if (this.currentInput === event.target) {
      this.currentInput = null;
    }
  }

  isTextInput(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    const type = element.type?.toLowerCase();
    
    return (
      (tagName === 'input' && ['text', 'email', 'search', 'url'].includes(type)) ||
      tagName === 'textarea' ||
      element.contentEditable === 'true' ||
      element.contentEditable === ''
    );
  }

  isTriggerKey(event) {
    switch (this.settings.triggerKey) {
      case 'space':
        return event.code === 'Space';
      case 'tab':
        return event.code === 'Tab';
      case 'enter':
        return event.code === 'Enter';
      default:
        return false;
    }
  }

  updateKeyBuffer(key) {
    this.keyBuffer += key;
    this.lastKeyTime = Date.now();
    
    // Clear buffer after timeout
    clearTimeout(this.bufferTimeout);
    this.bufferTimeout = setTimeout(() => {
      this.keyBuffer = '';
    }, 1000);
  }

  async checkForExpansion(target, event) {
    const text = this.getInputText(target);
    const shortcut = this.extractShortcut(text);
    
    if (shortcut && this.snippets.has(shortcut)) {
      event.preventDefault();
      await this.expandSnippet(target, shortcut);
    }
  }

  async checkForImmediateExpansion(target) {
    const text = this.getInputText(target);
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    if (lastWord && this.snippets.has(lastWord)) {
      await this.expandSnippet(target, lastWord);
    }
  }

  getInputText(element) {
    if (element.contentEditable === 'true' || element.contentEditable === '') {
      return element.innerText || '';
    } else {
      return element.value || '';
    }
  }

  setInputText(element, text) {
    if (element.contentEditable === 'true' || element.contentEditable === '') {
      element.innerText = text;
    } else {
      element.value = text;
    }
  }

  extractShortcut(text) {
    // Look for shortcuts at the end of the text
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    // Check if last word is a shortcut
    if (this.snippets.has(lastWord)) {
      return lastWord;
    }
    
    return null;
  }

  async expandSnippet(target, shortcut) {
    if (this.expansionInProgress) return;
    
    this.expansionInProgress = true;
    
    try {
      const snippet = this.snippets.get(shortcut);
      if (!snippet) return;
      
      // Process the snippet
      const response = await chrome.runtime.sendMessage({
        type: 'PROCESS_SNIPPET',
        snippet: snippet
      });
      
      if (!response || !response.success) {
        console.error('Failed to process snippet:', response?.error || 'No response received');
        console.error('Snippet data:', { shortcut, snippet });
        return;
      }
      
      const processed = response.data;
      
      if (processed.needsUserInput) {
        // Show form dialog for user input
        const variables = await this.showFormDialog(processed.commands);
        if (variables) {
          // Process again with user input
          const finalResponse = await chrome.runtime.sendMessage({
            type: 'PROCESS_SNIPPET',
            snippet: snippet,
            variables: variables
          });
          
          if (finalResponse && finalResponse.success) {
            await this.performExpansion(target, shortcut, finalResponse.data.content);
          } else {
            console.error('Failed to process snippet with variables:', finalResponse?.error || 'No response received');
          }
        }
      } else {
        await this.performExpansion(target, shortcut, processed.content);
      }
      
      // Record usage
      try {
        chrome.runtime.sendMessage({
          type: 'RECORD_USAGE',
          snippetId: snippet.id
        });
      } catch (error) {
        console.warn('Failed to record usage:', error);
      }
      
    } catch (error) {
      console.error('Expansion failed:', error);
    } finally {
      this.expansionInProgress = false;
    }
  }

  async performExpansion(target, shortcut, content) {
    const currentText = this.getInputText(target);
    
    // Remove the shortcut from the text
    let newText = currentText.replace(new RegExp(shortcut + '$'), content);

    if (content.includes('{{CLIPBOARD_CONTENT}}')) {
      try {
        const clipboardText = await navigator.clipboard.readText();
        newText = newText.replace('{{CLIPBOARD_CONTENT}}', clipboardText);
      } catch (error) {
        console.error('Failed to read clipboard content:', error);
      }
    }
    
    // Handle cursor positioning
    let cursorPosition = newText.length;
    if (content.includes('{{CURSOR_POSITION}}')) {
      cursorPosition = newText.indexOf('{{CURSOR_POSITION}}');
      content = content.replace('{{CURSOR_POSITION}}', '');
      newText = newText.replace('{{CURSOR_POSITION}}', '');
    }
    
    // Set the new text
    this.setInputText(target, newText);
    
    // Trigger input event to notify other scripts
    target.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Set cursor position
    if (target.setSelectionRange) {
      target.setSelectionRange(cursorPosition, cursorPosition);
    } else if (target instanceof HTMLDivElement) {
      // For contenteditable divs, set the selection range manually
      setCaret(target, cursorPosition - newText.substring(0, cursorPosition).split(/\n/m).length + 1);
    }
    
    // Play sound if enabled
    if (this.settings.enableSounds) {
      this.playExpansionSound();
    }
  }

  async showFormDialog(commands) {
    return new Promise((resolve) => {
      const dialog = this.createFormDialog(commands, resolve);
      document.body.appendChild(dialog);
      
      // Focus first input
      const firstInput = dialog.querySelector('input, textarea, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    });
  }

  createFormDialog(commands, onComplete) {
    const overlay = document.createElement('div');
    overlay.className = 'text-expander-form-overlay';
    overlay.style.cssText = `
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const dialog = document.createElement('div');
    dialog.className = 'text-expander-form-dialog';
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    `;
    
    const form = document.createElement('form');
    form.innerHTML = `
      <h3 style="margin: 0 0 20px 0; color: #2c3e50;">Complete Snippet</h3>
      ${commands.map(cmd => this.createFormField(cmd)).join('')}
      <div style="margin-top: 20px; text-align: right;">
        <button type="button" class="cancel-btn" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button type="submit" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Insert</button>
      </div>
    `;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const variables = {};
      for (const [key, value] of formData.entries()) {
        variables[key] = value;
      }
      document.body.removeChild(overlay);
      onComplete(variables);
    });
    
    form.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
      onComplete(null);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        onComplete(null);
      }
    });
    
    dialog.appendChild(form);
    overlay.appendChild(dialog);
    
    return overlay;
  }

  createFormField(command) {
    const fieldStyle = `
      margin-bottom: 15px;
      display: block;
      width: 100%;
    `;
    
    const labelStyle = `
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #2c3e50;
    `;
    
    const inputStyle = `
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    `;
    
    switch (command.type) {
      case 'formtext':
        return `
          <div style="${fieldStyle}">
            <label style="${labelStyle}">${command.label}:</label>
            <input type="text" name="${command.name}" value="${command.default}" 
                   placeholder="${command.placeholder}" style="${inputStyle}">
          </div>
        `;
        
      case 'formdate':
        return `
          <div style="${fieldStyle}">
            <label style="${labelStyle}">${command.label}:</label>
            <input type="date" name="${command.name}" value="${command.default}" 
                   style="${inputStyle}">
          </div>
        `;
        
      case 'formmenu':
        const options = command.options.map(opt => 
          `<option value="${opt}" ${opt === command.default ? 'selected' : ''}>${opt}</option>`
        ).join('');
        return `
          <div style="${fieldStyle}">
            <label style="${labelStyle}">${command.label}:</label>
            <select name="${command.name}" style="${inputStyle}">
              ${options}
            </select>
          </div>
        `;
        
      case 'formparagraph':
        return `
          <div style="${fieldStyle}">
            <label style="${labelStyle}">${command.label}:</label>
            <textarea name="${command.name}" rows="4" 
                      placeholder="${command.placeholder}" 
                      style="${inputStyle}">${command.default}</textarea>
          </div>
        `;
        
      default:
        return '';
    }
  }

  playExpansionSound() {
    // Create a subtle sound for expansion feedback
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Ignore audio errors
    }
  }
}

// Initialize the text expansion engine
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TextExpansionEngine();
  });
} else {
  new TextExpansionEngine();
}

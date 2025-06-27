// Snippet processing and dynamic variable handling
class SnippetProcessor {
  constructor() {
    this.commandProcessors = {
      time: this.processTimeCommand.bind(this),
      formtext: this.processFormTextCommand.bind(this),
      formdate: this.processFormDateCommand.bind(this),
      formmenu: this.processFormMenuCommand.bind(this),
      formparagraph: this.processFormParagraphCommand.bind(this),
      clipboard: this.processClipboardCommand.bind(this),
      cursor: this.processCursorCommand.bind(this)
    };
  }

  // Process snippet content with dynamic variables
  async process(snippet, variables = {}) {
    let content = snippet.content;
    const commands = this.extractCommands(content);
    
    // If no commands, return content as-is
    if (commands.length === 0) {
      return { content, needsUserInput: false };
    }

    // Check if any commands need user input
    const needsUserInput = commands.some(cmd => 
      ['formtext', 'formdate', 'formmenu', 'formparagraph'].includes(cmd.type)
    );

    if (needsUserInput && Object.keys(variables).length === 0) {
      // Return commands that need user input
      return { 
        content, 
        needsUserInput: true, 
        commands: commands.filter(cmd => 
          ['formtext', 'formdate', 'formmenu', 'formparagraph'].includes(cmd.type)
        )
      };
    }

    // Process all commands
    for (const command of commands) {
      const processed = await this.processCommand(command, variables);
      content = content.replace(command.raw, processed);
    }

    return { content, needsUserInput: false };
  }

  // Extract commands from snippet content
  extractCommands(content) {
    const commandRegex = /\{([^}]+)\}/g;
    const commands = [];
    let match;

    while ((match = commandRegex.exec(content)) !== null) {
      const commandStr = match[1];
      const command = this.parseCommand(commandStr);
      command.raw = match[0];
      commands.push(command);
    }

    return commands;
  }

  // Parse individual command
  parseCommand(commandStr) {
    const parts = commandStr.split(':');
    const type = parts[0].trim();
    
    if (parts.length === 1) {
      return { type, settings: {} };
    }

    const settingsStr = parts.slice(1).join(':').trim();
    const settings = this.parseSettings(settingsStr);
    
    return { type, settings };
  }

  // Parse command settings
  parseSettings(settingsStr) {
    const settings = {};
    const parts = settingsStr.split(';');
    
    parts.forEach((part, index) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      if (trimmed.includes('=')) {
        const [key, value] = trimmed.split('=', 2);
        settings[key.trim()] = value.trim();
      } else if (index === 0) {
        // First setting without = is positional
        settings.format = trimmed;
      }
    });

    return settings;
  }

  // Process individual command
  async processCommand(command, variables) {
    const processor = this.commandProcessors[command.type];
    if (processor) {
      return await processor(command, variables);
    }
    
    // Unknown command, return as-is
    return command.raw;
  }

  // Time command processor
  async processTimeCommand(command, variables) {
    const format = command.settings.format || 'YYYY-MM-DD';
    const now = new Date();
    
    return this.formatDate(now, format);
  }

  // Form text command processor
  async processFormTextCommand(command, variables) {
    const name = command.settings.name || 'input';
    const defaultValue = command.settings.default || '';
    
    return variables[name] || defaultValue;
  }

  // Form date command processor
  async processFormDateCommand(command, variables) {
    const name = command.settings.name || 'date';
    const defaultValue = command.settings.default || this.formatDate(new Date(), 'YYYY-MM-DD');
    
    return variables[name] || defaultValue;
  }

  // Form menu command processor
  async processFormMenuCommand(command, variables) {
    const name = command.settings.name || 'menu';
    const options = command.settings.options ? command.settings.options.split(',') : [];
    const defaultValue = options[0] || '';
    
    return variables[name] || defaultValue;
  }

  // Form paragraph command processor
  async processFormParagraphCommand(command, variables) {
    const name = command.settings.name || 'paragraph';
    const defaultValue = command.settings.default || '';
    
    return variables[name] || defaultValue;
  }

  // Clipboard command processor
  async processClipboardCommand(command, variables) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.warn('Could not access clipboard:', error);
      return '[Clipboard content]';
    }
  }

  // Cursor command processor
  async processCursorCommand(command, variables) {
    // Return placeholder that will be handled by content script
    return '{{CURSOR_POSITION}}';
  }

  // Date formatting utility
  formatDate(date, format) {
    const map = {
      'YYYY': date.getFullYear(),
      'YY': date.getFullYear().toString().slice(-2),
      'MMMM': date.toLocaleString('default', { month: 'long' }),
      'MMM': date.toLocaleString('default', { month: 'short' }),
      'MM': String(date.getMonth() + 1).padStart(2, '0'),
      'M': date.getMonth() + 1,
      'DD': String(date.getDate()).padStart(2, '0'),
      'D': date.getDate(),
      'dddd': date.toLocaleString('default', { weekday: 'long' }),
      'ddd': date.toLocaleString('default', { weekday: 'short' }),
      'HH': String(date.getHours()).padStart(2, '0'),
      'H': date.getHours(),
      'hh': String(date.getHours() % 12 || 12).padStart(2, '0'),
      'h': date.getHours() % 12 || 12,
      'mm': String(date.getMinutes()).padStart(2, '0'),
      'm': date.getMinutes(),
      'ss': String(date.getSeconds()).padStart(2, '0'),
      's': date.getSeconds(),
      'A': date.getHours() >= 12 ? 'PM' : 'AM',
      'a': date.getHours() >= 12 ? 'pm' : 'am'
    };

    let result = format;
    Object.keys(map).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), map[key]);
    });

    return result;
  }

  // Validate snippet content
  validateSnippet(snippet) {
    const errors = [];

    if (!snippet.shortcut || snippet.shortcut.trim() === '') {
      errors.push('Shortcut is required');
    }

    if (!snippet.content || snippet.content.trim() === '') {
      errors.push('Content is required');
    }

    // Check for valid commands
    const commands = this.extractCommands(snippet.content);
    commands.forEach(command => {
      if (!this.commandProcessors[command.type]) {
        errors.push(`Unknown command: ${command.type}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get form fields from snippet
  getFormFields(snippet) {
    const commands = this.extractCommands(snippet.content);
    return commands
      .filter(cmd => ['formtext', 'formdate', 'formmenu', 'formparagraph'].includes(cmd.type))
      .map(cmd => ({
        type: cmd.type,
        name: cmd.settings.name || 'input',
        label: cmd.settings.label || cmd.settings.name || 'Input',
        default: cmd.settings.default || '',
        placeholder: cmd.settings.placeholder || '',
        options: cmd.settings.options ? cmd.settings.options.split(',') : undefined
      }));
  }
}

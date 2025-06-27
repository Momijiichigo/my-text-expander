# ⚠️Meh, this is not my work, but LLM's

- I just needed a text expander without the word count limit
- so I quickly made this using GitHub Copilot (Claude Sonnet 4).
- Just putting it here on GitHub so anyone with same need can save time.


https://github.com/user-attachments/assets/108397de-3cce-41dd-a84c-7cce132a5fed


# My Text Expander - Text Expansion Chrome Extension

A Chrome extension for text expansion inspired by Text Blaze, built with SolidJS and TailwindCSS.


## Features

- **Text Expansion**: Define shortcuts that expand into longer text
- **Dynamic Variables**: Use variables like `{date}`, `{time}`, `{clipboard}` in your snippets
- **Smart Forms**: Create snippets with form fields for user input
- **Folder Organization**: Organize snippets into folders
- **Import/Export**: Backup and restore your snippets
- **Search**: Quickly find snippets in the popup
- **Settings**: Customize expansion behavior and shortcuts

## Installation

### From Source (Development)

1. Clone or download this repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Build the extension:
   ```bash
   bun run build
   ```
4. Create extension icons:
   - Open `assets/create-icons.html` in your browser
   - Click on each canvas to download the PNG icons
   - Save them as `icon16.png`, `icon32.png`, `icon48.png`, and `icon128.png` in the `public/assets/icons/` folder
5. Open Chrome and navigate to `chrome://extensions/`
6. Enable "Developer mode" in the top right
7. Click "Load unpacked" and select the `dist` folder
8. The extension will appear in your extensions list

### Development Mode

For development with automatic rebuilding:
```bash
bun run dev
```

This will watch for changes and rebuild automatically. You'll need to reload the extension in Chrome after changes.

### Converting Icons

If you need to create proper PNG icons:

1. Open `assets/create-icons.html` in a web browser
2. Click on each canvas to download the PNG files
3. Save them in the `assets/icons/` folder with the correct names

Alternatively, you can use any image editor to convert the `assets/icons/icon.svg` file to PNG format at the required sizes (16x16, 32x32, 48x48, 128x128).

## Usage

### Creating Snippets

1. Click the extension icon to open the popup
2. Click "Add Snippet" or go to Settings → Manage Snippets
3. Enter a shortcut (e.g., `/email`) and the text to expand
4. Use dynamic variables like `{date}`, `{time}`, `{name}`, etc.

### Text Expansion

1. Type your shortcut anywhere on a webpage
2. Press Tab, Space, or Enter to trigger expansion
3. Fill out any form fields that appear
4. The text will be automatically inserted

### Dynamic Variables

- `{date}` - Current date
- `{time}` - Current time
- `{clipboard}` - Clipboard content
- `{name}` - Shows a form field for name input
- `{text}` - Shows a form field for text input
- `{dropdown: option1, option2, option3}` - Dropdown selection

### Folder Organization

- Create folders in the settings to organize snippets
- Drag and drop snippets between folders
- Use the search function to quickly find snippets

## Project Structure

```
my-text-expander/
├── src/                    # Source files (JSX/SolidJS)
│   ├── popup/
│   │   ├── popup.html     # Popup interface template
│   │   ├── popup.jsx      # SolidJS popup app
│   │   └── popup.css      # Popup styles
│   └── options/
│       ├── options.html   # Settings page template
│       ├── options.jsx    # SolidJS options app
│       └── options.css    # Options page styles
├── public/                 # Static files
│   ├── manifest.json      # Extension manifest
│   ├── background.js      # Service worker
│   ├── shared/            # Storage and processing utilities
│   ├── content/           # Content scripts
│   └── assets/            # Icons and static resources
├── dist/                   # Built extension (generated)
├── scripts/
│   └── post-build.sh      # Build post-processing
├── vite.config.js         # Vite build configuration
└── specs/                 # Feature specifications
```

## Technical Details

- **Framework**: SolidJS for reactive UI components
- **Styling**: TailwindCSS-inspired utility classes
- **Storage**: Chrome Storage API with sync capabilities
- **Manifest**: Version 3 with service worker
- **Content Script**: Injected into all pages for text expansion

## Development

### Build Commands

- `bun run build` - Build the extension for production
- `bun run dev` - Build and watch for changes (development)
- `bun run clean` - Clean the dist directory
- `bun run create-icons` - Instructions for creating extension icons

### Architecture

The extension follows a modern build-based architecture:

1. **Source Code** (`src/`): SolidJS components with JSX syntax
2. **Build Process**: Vite transpiles JSX and bundles assets
3. **Static Files** (`public/`): Extension scripts and manifest
4. **Output** (`dist/`): Final built extension ready for Chrome

### Key Features Implementation

- **Text Expansion**: Real-time typing detection with customizable triggers
- **Dynamic Variables**: Template engine with form generation
- **Storage**: Efficient snippet management with search and organization
- **UI**: Modern SolidJS components with accessible design
- **Build System**: Vite-powered development with hot reloading

## Contributing

This is a personal project, but feel free to fork and modify for your own use.

## License

MIT License - see the specs folder for detailed feature documentation.

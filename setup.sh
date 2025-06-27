#!/bin/bash

# My Text Expander Extension Setup Script

echo "🔥 My Text Expander Extension Setup"
echo "================================"

# Check if we're in the right directory
if [ ! -f "vite.config.js" ]; then
    echo "❌ Please run this script from the extension root directory"
    exit 1
fi

echo "✅ Found vite.config.js"

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ bun is not installed. Please install bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ bun is available"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the extension
echo "🔨 Building extension..."
bun run build

# Check if icons exist
icon_files=("icon16.png" "icon32.png" "icon48.png" "icon128.png")
missing_icons=()

for icon in "${icon_files[@]}"; do
    if [ ! -f "dist/assets/icons/$icon" ]; then
        missing_icons+=("$icon")
    fi
done

if [ ${#missing_icons[@]} -gt 0 ]; then
    echo "⚠️  Missing icon files: ${missing_icons[*]}"
    echo "   📖 To create icons:"
    echo "   1. Open assets/create-icons.html in your browser"
    echo "   2. Click each canvas to download the PNG files"
    echo "   3. Save them in public/assets/icons/ with the correct names"
    echo "   4. Run 'bun run build' again"
    echo ""
    echo "   Alternative: Convert assets/icons/icon.svg to PNG format"
else
    echo "✅ All icon files present"
fi

echo ""
echo "🚀 Extension Setup Complete!"
echo ""
echo "To install the extension:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (top right toggle)"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. The extension will appear in your browser toolbar"
echo ""
echo "To test the extension:"
echo "1. Click the extension icon to open the popup"
echo "2. Create a test snippet (e.g., shortcut: '//test', content: 'Hello World!')"
echo "3. Go to any website and type '//test' followed by Tab or Space"
echo "4. The text should expand to 'Hello World!'"
echo ""
echo "Development commands:"
echo "- bun run dev    # Build and watch for changes"
echo "- bun run build  # Build for production"
echo "- bun run clean  # Clean build directory"
echo ""
echo "📖 See README.md for detailed usage instructions"

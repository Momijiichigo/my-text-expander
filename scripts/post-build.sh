#!/bin/bash

# Post-build script for Chrome extension

echo "🔧 Post-processing build files..."

# Move HTML files to root
mv dist/src/popup/popup.html dist/ 2>/dev/null || true
mv dist/src/options/options.html dist/ 2>/dev/null || true

# Remove src directory
rm -rf dist/src

# Fix asset paths in HTML files (remove leading slashes)
if [ -f "dist/popup.html" ]; then
    sed -i 's|="/assets/|="./assets/|g' dist/popup.html
    echo "✅ Fixed popup.html asset paths"
fi

if [ -f "dist/options.html" ]; then
    sed -i 's|="/assets/|="./assets/|g' dist/options.html
    echo "✅ Fixed options.html asset paths"
fi

echo "✅ Post-build processing complete!"

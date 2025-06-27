# Project Overview

## My Text Expander Chrome Extension

A personal text expansion Chrome extension built with modern web technologies.

### Tech Stack
- **Frontend**: SolidJS with JSX
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Styling**: TailwindCSS-inspired utility classes
- **Extension**: Chrome Manifest V3

### Development Rules

#### Error Handling Standards
- **Always check for undefined responses** from Chrome runtime messaging
- **Use optional chaining (`?.`)** when accessing response properties
- **Provide fallback values** for failed operations
- **Show user-friendly error messages** for failed operations
- **Log detailed errors to console** for debugging

#### Chrome Extension Messaging
- **Return `true` from message handlers** to keep async channels open
- **Use consistent response format**: `{ success: boolean, data?: any, error?: string }`
- **Handle both successful and failed responses** in UI components
- **Set proper manifest paths** without leading `./` for better compatibility

#### Chrome Extension Debugging Standards
- **Always add console logging** to background scripts for message handling
- **Use simplified fallback implementations** when complex dependencies fail
- **Provide step-by-step debugging instructions** for extension issues:
  1. Check extension loading in `chrome://extensions/`
  2. Inspect popup/options page consoles for frontend errors
  3. Check service worker console for background script errors
  4. Test with simplified background script if complex version fails
- **Use `importScripts()` instead of ES6 modules** in service workers for better compatibility
- **Test storage operations** separately from business logic

#### SolidJS Reactivity Standards
- **Pass signals as references** to child components for reactive updates
- **Call signals as functions** (`signal()`) to access values in conditions and expressions
- **Use `createEffect()` for debugging** signal changes during development
- **Avoid passing signal values directly** when reactivity is needed
- **NEVER destructure props in SolidJS components** - use `props.propName` instead of `{ propName }`
  - Props are reactive proxy objects and destructuring breaks reactivity
  - Always use `function Component(props)` instead of `function Component({ prop1, prop2 })`
  - Access props as `props.propName` throughout the component

#### Code Organization Standards
- **Split large files into smaller, focused modules** for better maintainability
- **Use TypeScript (.tsx/.ts)** for type safety and better development experience
- **Organize components in dedicated directories** with index.ts files for clean imports
- **Define shared types** in a central types file
- **Use consistent naming conventions** (PascalCase for components, camelCase for functions)
- **Group related functionality** into logical component hierarchies

#### Build System
- **Use Vite for JSX transpilation** and modern bundling
- **Post-build scripts** to fix Chrome extension compatibility issues
- **Clean separation** between source (`src/`) and static files (`public/`)
- **Output to `dist/`** for extension installation

### Current Status
- ✅ Project structure cleaned and modernized
- ✅ Build system with Vite and Bun configured
- ✅ Error handling improved throughout codebase
- ✅ Chrome extension messaging fixed
- ✅ Ready for development and testing

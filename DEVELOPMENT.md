# Development Checklist

## ✅ Recent Completions

### Background Script Unification (Completed)
- **Issue**: Extension had two background scripts with inconsistent ID/key logic
  - `background-simple.js` (legacy, used in manifest)
  - `background.js` (robust, with migration system)
- **Solution**: 
  - Updated manifest.json to use robust `background.js`
  - Removed legacy `background-simple.js` to prevent confusion
  - Ensured consistent snippet ID/key generation across all components
- **Result**: All snippets (old and new) now use consistent storage format and work properly for text expansion
- **Documentation**: See `SNIPPET_ID_CONSISTENCY_FIX.md` and `BACKGROUND_SCRIPTS_STATUS.md`

## Pre-Installation

- [ ] Icons created (run `assets/create-icons.html` to generate PNG files)
- [ ] All files present in project structure
- [ ] Chrome browser available for testing

## Installation & Basic Testing

- [ ] Extension loads without errors in Chrome
- [ ] Popup opens when clicking extension icon
- [ ] Options page accessible from popup settings
- [ ] No console errors in background script

## Core Functionality Testing

### Text Expansion
- [ ] Create a simple snippet (e.g., `//test` → `Hello World!`)
- [ ] Test expansion with Tab trigger
- [ ] Test expansion with Space trigger
- [ ] Test expansion with Enter trigger
- [ ] Verify text replacement works correctly

### Dynamic Variables
- [ ] Test `{date}` variable
- [ ] Test `{time}` variable
- [ ] Test `{clipboard}` variable (copy some text first)
- [ ] Test form fields like `{name}` or `{text}`
- [ ] Test dropdown: `{dropdown: option1, option2, option3}`

### Storage & Management
- [ ] Create multiple snippets
- [ ] Edit existing snippets
- [ ] Delete snippets
- [ ] Test search functionality
- [ ] Test folder organization

### Import/Export
- [ ] Export snippets to JSON file
- [ ] Import snippets from JSON file
- [ ] Verify data integrity after import/export

### Settings
- [ ] Test trigger key customization
- [ ] Test expansion delay settings
- [ ] Test sound preferences
- [ ] Test case sensitivity options

## Cross-Browser Compatibility

### Text Field Types
- [ ] Standard input fields
- [ ] Textarea elements
- [ ] Contenteditable divs
- [ ] Rich text editors (if available)

### Popular Websites
- [ ] Gmail compose window
- [ ] Google search box
- [ ] Twitter compose
- [ ] GitHub issue/comment fields
- [ ] Local HTML test page

## Error Handling
- [ ] Invalid shortcut characters
- [ ] Duplicate shortcuts
- [ ] Malformed import files
- [ ] Storage quota exceeded
- [ ] Network/sync issues

## Performance
- [ ] No noticeable typing lag
- [ ] Fast expansion response (<100ms)
- [ ] Minimal memory usage
- [ ] No CPU spikes during typing

## UI/UX
- [ ] Dark mode support works
- [ ] Responsive design in popup
- [ ] Keyboard navigation works
- [ ] Accessibility features function
- [ ] Visual feedback for actions

## Edge Cases
- [ ] Very long snippets (>1000 characters)
- [ ] Special characters in shortcuts
- [ ] Unicode content in snippets
- [ ] Multiple rapid expansions
- [ ] Expansion in password fields (should be disabled)

## Documentation
- [ ] README.md is complete and accurate
- [ ] Setup instructions work
- [ ] Example snippets are helpful
- [ ] Troubleshooting section is clear

## Ready for Distribution
- [ ] All features working as specified
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Icons are properly formatted
- [ ] Version number is set correctly

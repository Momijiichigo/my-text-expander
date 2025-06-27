# Testing Instructions - Background Script Unification

## What Was Changed

1. **Updated manifest.json**: Now uses `background.js` instead of `background-simple.js`
2. **Removed legacy file**: Deleted `background-simple.js` to prevent confusion
3. **Unified ID/key logic**: All snippets now use consistent format

## Critical Testing Required

### 1. Extension Reload & Migration
```bash
# 1. Load the extension in Chrome
# 2. Check background script console for migration logs:
```
Expected logs:
```
🔄 Starting snippet ID migration...
📝 Migrating snippet: snippet_1750984... → snippet_id_1750984...
✅ Updated X snippets
✅ Snippet ID migration completed
```

### 2. Existing Snippets Test
- [ ] All existing snippets appear in options page
- [ ] All existing snippets work for text expansion
- [ ] No duplicates or missing snippets

### 3. New Snippet Creation Test
- [ ] Create a new snippet (e.g., `//test` → `Test content`)
- [ ] Verify it appears in snippet list
- [ ] Test text expansion works immediately
- [ ] Check storage format is correct: `snippet_id_timestamp_random`

### 4. CRUD Operations Test
- [ ] Edit an existing snippet - changes save properly
- [ ] Delete a snippet - removes completely
- [ ] Search functionality works
- [ ] Import/export still functions

### 5. Storage Inspection
1. Go to `chrome://extensions`
2. Find "My Text Expander" → "Inspect views: background page"
3. In DevTools: Application → Storage → Local Storage
4. Verify all keys follow format: `snippet_id_timestamp_random`

## Expected Results

✅ **All snippets work**: Both old (migrated) and new snippets expand text properly  
✅ **Consistent format**: All storage keys use `snippet_id_` prefix  
✅ **No errors**: No console errors in background script or UI  
✅ **Full functionality**: All CRUD operations work as expected  

## If Issues Found

1. **Check console logs** in background script for error details
2. **Verify storage** to see if migration completed properly
3. **Test basic operations** (create, edit, delete) to isolate the issue
4. **Compare storage format** with expected pattern

## Success Criteria

🎯 **The unification is successful if:**
- All existing snippets work for text expansion
- New snippets use consistent ID/key format
- No console errors or functional regressions
- Single background script handles all operations properly

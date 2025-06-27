# Snippet Creation & Management

## Overview
The core functionality for creating, editing, and organizing text snippets with custom shortcuts for personal productivity.

## Basic Snippet Creation

### Snippet Structure
Every snippet consists of two main components:
- **Shortcut**: The trigger text that will be typed (e.g., `/ty`, `/sig`, `/email`)
- **Expansion Text**: The full text that replaces the shortcut when triggered

### Creating a New Snippet
1. **Access Creation Interface**
   - Click the extension icon in Chrome toolbar
   - Select "New Snippet" or "Create Snippet" button
   - Open the dashboard for more detailed creation

2. **Define Shortcut**
   - Enter a unique shortcut identifier (e.g., `/greeting`, `/address`)
   - Shortcuts typically start with `/` for easy recognition
   - Keep shortcuts short and memorable
   - Avoid conflicts with existing shortcuts

3. **Enter Expansion Text**
   - Type or paste the content that will replace the shortcut
   - Support for plain text and basic formatting
   - Can include multiple lines and paragraphs
   - Support for special characters and symbols

### Snippet Examples
```
Shortcut: /ty
Expansion: Thank you for your email. I'll get back to you soon.

Shortcut: /sig
Expansion: Best regards,
John Smith
john.smith@email.com
(555) 123-4567

Shortcut: /addr
Expansion: 123 Main Street
New York, NY 10001
United States
```

## Snippet Management

### Editing Snippets
- **Access**: Click on existing snippet in dashboard or extension popup
- **Modify Shortcut**: Change the trigger text
- **Update Content**: Edit the expansion text
- **Save Changes**: Automatically saved or manual save button

### Organizing Snippets
- **Labels/Categories**: Group snippets by type (Email, Personal, Work, etc.)
- **Folder Structure**: Organize snippets into logical folders
- **Search Functionality**: Find snippets by shortcut or content
- **Alphabetical Sorting**: List snippets in order for easy browsing

### Snippet Operations
- **Delete**: Remove unwanted snippets
- **Duplicate**: Copy existing snippet as template for new one
- **Export**: Backup snippets to file
- **Import**: Restore snippets from backup

## Rich Text Support

### Formatting Options
- **Bold** and *italic* text
- Bullet points and numbered lists
- Hyperlinks to websites
- Line breaks and paragraphs
- Special characters and symbols

### HTML Support
- Basic HTML tags for formatting
- Links: `<a href="url">text</a>`
- Emphasis: `<strong>`, `<em>`
- Lists: `<ul>`, `<ol>`, `<li>`

## Shortcut Best Practices

### Naming Conventions
- Use forward slash prefix: `/greeting`, `/addr`
- Keep shortcuts short but descriptive
- Use consistent patterns: `/email-` for email templates
- Avoid special characters that might conflict

### Organization Tips
- Group related shortcuts with common prefixes
- Use descriptive names: `/email-followup` vs `/ef`
- Create categories: personal, work, technical
- Regular cleanup of unused snippets

## Testing Snippets

### Verification Process
1. Create the snippet in dashboard
2. Navigate to any text field (Gmail, Google Docs, etc.)
3. Type the shortcut exactly as defined
4. Verify the expansion works correctly
5. Test in multiple applications to ensure compatibility

### Troubleshooting
- Check for typos in shortcut
- Ensure unique shortcut (no duplicates)
- Verify extension is enabled
- Test in different websites/applications
- Check if expansion text is correct

## Integration Points

### Browser Integration
- Works in all Chrome tabs and websites
- Compatible with web forms, text areas, and input fields
- Integration with popular web applications
- No interference with normal typing

### Application Compatibility
- Gmail and email clients
- Google Docs and Google Sheets
- Social media platforms
- Chat applications (Slack, Discord)
- CRM systems and business tools
- Form fields on any website

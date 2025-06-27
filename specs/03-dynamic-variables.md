# Dynamic Variables & Commands

## Overview
Dynamic variables allow snippets to include automatically generated content like dates, times, clipboard data, and user input fields, making snippets more flexible and personalized.

## Basic Dynamic Commands

### Time and Date Commands
Insert current date and time information in various formats.

#### {time} Command
- **Purpose**: Insert current date/time in specified format
- **Syntax**: `{time: format}`
- **Examples**:
  ```
  {time: MMMM D, YYYY}     → June 26, 2025
  {time: MM/DD/YYYY}       → 06/26/2025
  {time: YYYY-MM-DD}       → 2025-06-26
  {time: hh:mm AM}         → 02:30 PM
  {time: dddd}             → Thursday
  ```

#### Common Date Formats
- **Full Date**: `{time: MMMM D, YYYY}` → June 26, 2025
- **Short Date**: `{time: M/D/YY}` → 6/26/25
- **ISO Format**: `{time: YYYY-MM-DD}` → 2025-06-26
- **Time Only**: `{time: h:mm A}` → 2:30 PM
- **Day of Week**: `{time: dddd}` → Thursday

### Clipboard Integration

#### {clipboard} Command
- **Purpose**: Insert current clipboard contents
- **Syntax**: `{clipboard}`
- **Use Cases**:
  - Paste recently copied text
  - Include copied URLs or data
  - Reference copied content in templates

#### Example Usage
```
Shortcut: /paste
Expansion: Here's the information you requested: {clipboard}

Shortcut: /url
Expansion: Please visit this link: {clipboard}
```

### Cursor Positioning

#### {cursor} Command
- **Purpose**: Position cursor after snippet expansion
- **Syntax**: `{cursor}`
- **Behavior**: Moves cursor to specified location after text insertion

#### Example Usage
```
Shortcut: /email
Expansion: Dear {cursor},

Thank you for your message. I'll respond within 24 hours.

Best regards,
John Smith
```

## Form Input Commands

### Text Input Fields

#### {formtext} Command
- **Purpose**: Create interactive text input during expansion
- **Syntax**: `{formtext: name=fieldname; default=defaultvalue}`
- **Parameters**:
  - `name`: Identifier for the field
  - `default`: Pre-filled default value

#### Examples
```
Basic text input:
{formtext: name=name; default=Enter name here}

Email template with input:
Dear {formtext: name=recipient; default=Customer},

Thank you for contacting us about {formtext: name=subject; default=your inquiry}.

Best regards,
Support Team
```

### Multi-line Text Input

#### {formparagraph} Command
- **Purpose**: Create multi-line text input field
- **Syntax**: `{formparagraph: name=fieldname; default=defaulttext}`
- **Use Cases**: Comments, descriptions, detailed responses

#### Example Usage
```
Shortcut: /feedback
Expansion: Feedback Summary:

Issue: {formtext: name=issue; default=Describe the issue}

Details:
{formparagraph: name=details; default=Provide detailed explanation}

Next Steps: {formtext: name=action; default=Required action}
```

### Date Input Fields

#### {formdate} Command
- **Purpose**: Create date picker input
- **Syntax**: `{formdate: name=fieldname; default=datevalue}`
- **Features**: Calendar picker interface

#### Example Usage
```
Shortcut: /meeting
Expansion: Meeting Scheduled

Date: {formdate: name=meetingdate; default={time: YYYY-MM-DD}}
Time: {formtext: name=meetingtime; default=2:00 PM}
Location: {formtext: name=location; default=Conference Room A}
```

### Selection Menus

#### {formmenu} Command
- **Purpose**: Create dropdown selection menu
- **Syntax**: `{formmenu: name=fieldname; options=option1,option2,option3}`
- **Features**: Pre-defined choices for consistent selection

#### Example Usage
```
Shortcut: /priority
Expansion: Issue Priority: {formmenu: name=level; options=Low,Medium,High,Critical}

Estimated Resolution: {formmenu: name=timeline; options=1-2 hours,Same day,1-2 days,Next week}
```

## Advanced Variable Features

### Nested Commands
Combine multiple commands within each other for complex functionality.

#### Examples
```
Text field with default current date:
{formtext: name=deadline; default={time: YYYY-MM-DD}}

Conditional content based on input:
{if: {formtext: name=urgency} = "high"}
This requires immediate attention.
{else}
This can be handled in normal workflow.
{endif}
```

### Variable Persistence
Variables can be reused within the same snippet expansion.

#### Example
```
Shortcut: /invoice
Expansion: Invoice #{formtext: name=invoicenum; default=INV-001}

Invoice Date: {time: MMMM D, YYYY}
Invoice Number: {=invoicenum}
Due Date: {formdate: name=duedate; default={time: YYYY-MM-DD}}

Thank you for using invoice #{=invoicenum}.
```

## Command Syntax Rules

### Basic Structure
- Commands are enclosed in curly braces: `{command}`
- Settings follow the command name with a colon: `{command: setting}`
- Multiple settings are separated by semicolons: `{command: setting1; setting2}`

### Setting Types
1. **Positional Settings**: Come immediately after the colon
2. **Named Settings**: Use name=value format
3. **Optional Settings**: Can be omitted if not needed

### Examples
```
Simple command:
{time}

Command with positional setting:
{time: YYYY-MM-DD}

Command with named settings:
{formtext: name=email; default=user@example.com}

Command with multiple settings:
{time: YYYY; at=2025-01-01; shift=+1Y}
```

## Practical Use Cases

### Email Templates
```
Shortcut: /followup
Expansion: Hi {formtext: name=name; default=Name},

Following up on our conversation about {formtext: name=topic; default=project topic}.

I'll have the {formtext: name=deliverable; default=proposal} ready by {formdate: name=deadline; default={time: YYYY-MM-DD}}.

Let me know if you have any questions.

Best,
{formtext: name=sender; default=Your Name}
```

### Personal Information
```
Shortcut: /contact
Expansion: Name: {formtext: name=fullname; default=John Smith}
Email: {formtext: name=email; default=john@example.com}
Phone: {formtext: name=phone; default=(555) 123-4567}
Date: {time: MMMM D, YYYY}
```

### Form Filling
```
Shortcut: /address
Expansion: Street: {formtext: name=street; default=123 Main St}
City: {formtext: name=city; default=New York}
State: {formmenu: name=state; options=NY,CA,TX,FL}
ZIP: {formtext: name=zip; default=10001}
```

### Meeting Notes
```
Shortcut: /notes
Expansion: Meeting Notes - {time: MMMM D, YYYY}

Attendees: {formtext: name=attendees; default=List attendees}
Topic: {formtext: name=topic; default=Meeting topic}

Discussion Points:
{formparagraph: name=discussion; default=Key discussion points}

Action Items:
{formparagraph: name=actions; default=Next steps and assignments}
```

## Error Handling

### Input Validation
- Handle empty form fields gracefully
- Provide meaningful default values
- Validate date and time inputs
- Check for required fields

### Fallback Behavior
- Use default values when user skips input
- Graceful handling of cancelled form dialogs
- Maintain snippet functionality even with missing inputs
- Clear error messages for invalid input

## Performance Considerations

### Form Rendering
- Fast form display and interaction
- Minimal delay in showing input dialogs
- Responsive input handling
- Efficient form data processing

### Memory Usage
- Clean up form data after expansion
- Efficient variable storage and retrieval
- Minimal memory footprint for dynamic content
- Garbage collection of unused variables

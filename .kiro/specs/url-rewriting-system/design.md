# Design Document

## Overview

This design document outlines the architecture for implementing the URL rewriting system in the Chrome extension. This advanced feature provides regex-based URL transformation capabilities for bulk bookmark URL standardisation and cleanup, with comprehensive validation and safety measures.

The design emphasises user safety through validation, warnings, and confirmation mechanisms whilst providing powerful regex-based transformation capabilities for advanced users.

## Architecture

### Component Architecture

The URL rewriting system follows a pattern-based architecture with emphasis on validation and safety:

- **RewriteRules**: Main container component for rule management and execution
- **RewriteRule**: Individual rule component for pattern and replacement configuration
- **Rewrite Store**: Centralised state management for rules and rewriting operations
- **Validation System**: Comprehensive regex validation and error handling
- **Safety Mechanisms**: Warnings, confirmations, and error recovery

### Data Flow Architecture

```
User Interface ↔ Rewrite Store ↔ Chrome Storage API
                      ↕
Regex Validation ↔ Pattern Compilation ↔ Bookmark Processing
                      ↕
Chrome Bookmarks API ↔ URL Transformation ↔ Error Handling
```

### Pattern Processing Pipeline

The system uses a multi-stage processing approach:
- **Pattern Validation**: Regex syntax validation and compilation testing
- **Rule Compilation**: Pre-compilation of regex patterns for performance
- **Bookmark Iteration**: Efficient processing of all bookmark URLs
- **URL Transformation**: Pattern matching and replacement execution
- **API Updates**: Batch updates to Chrome's bookmark API

## Components and Interfaces

### Rewrite Store (Pinia)

**State Structure:**
- `rules`: Record mapping regex patterns to replacement strings
- `updated`: Boolean flag indicating unsaved changes
- `running`: Boolean flag indicating rewriting operation in progress

**Rule Processing:**
- Dynamic regex compilation from pattern strings
- Validation of regex syntax before storage
- Efficient pattern matching during URL transformation

**Safety Features:**
- Duplicate pattern prevention
- Regex syntax validation
- Operation state tracking to prevent concurrent executions

### RewriteRules Container Component

**User Interface Elements:**
- Warning badges indicating advanced feature and caution requirements
- Dynamic list of configured rewrite rules
- Action buttons for rule execution and persistence

**Safety Mechanisms:**
- Prominent warning displays about permanent nature of changes
- Disabled state management during active rewriting operations
- Clear visual indicators for advanced feature usage

**Execution Logic:**
- Pre-compilation of all valid regex patterns
- Iteration through all bookmark URLs for pattern matching
- Console logging of URL transformations for user review
- Error handling and graceful continuation on failures

### RewriteRule Individual Component

**Props Interface:**
- `pattern`: Optional regex pattern string for existing rules
- `replace`: Optional replacement string for existing rules

**Form Controls:**
- **Pattern Input**: Text field with regex validation and compilation testing
- **Replace Input**: Text field for replacement string with capture group support

**Validation Logic:**
- Real-time regex syntax validation using try-catch compilation
- Duplicate pattern detection and prevention
- Custom validity messages for user guidance
- Placeholder text with regex syntax hints

### Chrome Storage Integration

**Storage Schema:**
- `rewriterules`: Record mapping regex patterns to replacement strings

**Synchronisation Behaviour:**
- Cross-device rule synchronisation via Chrome sync storage
- Automatic loading of saved rules on component initialisation
- Real-time updates when storage changes occur

### Bookmark Processing Engine

**URL Transformation Logic:**
```typescript
// Pattern compilation for performance
const compiled = new Array<[RegExp, string]>();
for (const pattern in rules) {
  compiled.push([new RegExp(`^${pattern}$`, "v"), replace]);
}

// Bookmark URL processing
for (const bookmark of bookmarks) {
  for (const [pattern, replace] of compiled) {
    const newUrl = bookmark.url.replace(pattern, replace);
    if (newUrl !== bookmark.url) {
      await chrome.bookmarks.update(bookmark.id, { url: newUrl });
      break; // Apply only first matching rule
    }
  }
}
```

**Processing Features:**
- First-match rule application to prevent conflicts
- Comprehensive error handling for invalid URLs
- Console logging for transformation tracking
- Graceful continuation on individual bookmark failures

## Data Models

### Rewrite Rule Structure

**Rule Properties:**
- **Pattern**: Regular expression string for URL matching
- **Replacement**: String with optional capture group references ($1, $2, etc.)

**Validation Requirements:**
- Valid JavaScript regex syntax
- Compilation testing before storage
- Duplicate pattern prevention
- Non-empty replacement string requirement

### URL Transformation Model

**Processing Pipeline:**
1. **Pattern Compilation**: Convert string patterns to RegExp objects
2. **URL Matching**: Test bookmark URLs against compiled patterns
3. **Replacement Execution**: Apply replacement strings with capture groups
4. **API Update**: Update bookmark URL via Chrome API
5. **Result Logging**: Console output for user review

### Error Handling Model

**Validation Errors:**
- Regex syntax errors with descriptive messages
- Duplicate pattern detection and prevention
- Empty replacement string validation

**Runtime Errors:**
- Chrome API failures during bookmark updates
- Invalid URL generation from transformations
- Network or permission errors during operations

## Error Handling

### Regex Validation

**Syntax Validation:**
- Try-catch blocks around regex compilation
- Custom validity messages for syntax errors
- Real-time validation feedback in form fields

**Pattern Validation:**
- Duplicate pattern detection across all rules
- Empty pattern prevention
- Regex flag validation and standardisation

### URL Transformation Errors

**Chrome API Error Handling:**
- Try-catch blocks around bookmark update operations
- Console error logging with bookmark ID and URL details
- Graceful continuation when individual updates fail

**URL Validation:**
- Validation of transformed URLs before API calls
- Error handling for malformed URL generation
- Fallback mechanisms for transformation failures

### User Safety Measures

**Warning Systems:**
- Prominent visual warnings about permanent changes
- Badge indicators for advanced feature usage
- Clear documentation of risks and limitations

**Confirmation Mechanisms:**
- Explicit user action required for rule execution
- Disabled states during active operations
- Clear feedback on operation progress and results

## Testing Strategy

### Component Testing

**RewriteRules Testing:**
- Rule loading from Chrome storage
- Rewriting operation execution and progress tracking
- Save functionality and state management

**RewriteRule Testing:**
- Regex pattern validation and compilation
- Replacement string handling and validation
- Form submission and error handling

### Regex Testing

**Pattern Validation Testing:**
- Valid regex syntax acceptance
- Invalid regex syntax rejection
- Edge cases and complex patterns

**Transformation Testing:**
- URL matching accuracy
- Capture group replacement functionality
- Multiple rule interaction and precedence

### Integration Testing

**Chrome API Integration:**
- Bookmark URL update operations
- Storage synchronisation across devices
- Error handling for API failures

**Performance Testing:**
- Large bookmark collection processing
- Complex regex pattern performance
- Memory usage during bulk operations

## Implementation Phases

### Phase 1: Core Rule Management
- Implement RewriteRule component with validation
- Set up Pinia store for rule state management
- Create rule persistence with Chrome storage

### Phase 2: Regex Validation System
- Implement comprehensive regex syntax validation
- Add duplicate pattern detection
- Create user-friendly error messages

### Phase 3: URL Transformation Engine
- Build bookmark processing pipeline
- Implement pattern compilation and matching
- Add Chrome API integration for URL updates

### Phase 4: Safety and User Experience
- Add warning systems and confirmation mechanisms
- Implement operation progress tracking
- Create comprehensive error handling

### Phase 5: Advanced Features
- Add rule testing and preview functionality
- Implement transformation statistics and reporting
- Create rule templates and common patterns

## Security Considerations

### Input Validation

**Regex Pattern Security:**
- Prevention of catastrophic backtracking patterns
- Validation of regex flags and modifiers
- Sanitisation of user input before compilation

**URL Validation:**
- Validation of transformed URLs before API calls
- Prevention of malicious URL generation
- Sanitisation of replacement strings

### Permission Management

**Chrome API Permissions:**
- Proper handling of bookmark modification permissions
- Error handling for insufficient permissions
- User feedback for permission-related failures

### Data Protection

**Storage Security:**
- Secure handling of regex patterns in storage
- Prevention of code injection through patterns
- Validation of stored data integrity
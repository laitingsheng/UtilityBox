# Design Document

## Overview

This design document outlines the architecture for implementing the bookmark and history cleaning system in the Chrome extension. The system provides hostname-based rule management for bulk removal of unwanted bookmarks and browser history entries, with cross-device synchronisation and background processing capabilities.

The design focuses on creating an efficient cleaning system that can handle large datasets whilst providing user control over cleaning operations and maintaining data integrity.

## Architecture

### Component Architecture

The cleaning system follows a modular architecture with clear separation between rule management and execution:

- **CleaningRules**: Main container component for rule management interface
- **CleaningRule**: Individual rule component for hostname pattern configuration
- **Cleaning Store**: Centralised state management for rules and cleaning operations
- **Background Script**: Service worker for popup-triggered cleaning operations
- **Popup Interface**: Quick access buttons for immediate cleaning actions

### Data Flow Architecture

```
User Interface ↔ Cleaning Store ↔ Chrome Storage API
                      ↕
Background Script ↔ Chrome Bookmarks/History APIs
                      ↕
Popup Interface ↔ Message Passing ↔ Background Operations
```

### Rule Processing Pattern

The system uses a pattern-based matching approach:
- **Hostname Patterns**: User-defined hostname strings for matching
- **Subdomain Matching**: Optional wildcard matching for subdomains
- **Regex Generation**: Dynamic regex creation from hostname patterns
- **Bulk Processing**: Efficient iteration through bookmarks and history

## Components and Interfaces

### Cleaning Store (Pinia)

**State Structure:**
- `ruledefault`: Default properties for new cleaning rules
- `rules`: Record mapping hostnames to cleaning rule properties
- `updated`: Boolean flag indicating unsaved changes
- `bookmarks`: Boolean flag indicating bookmark cleaning in progress
- `history`: Boolean flag indicating history cleaning in progress

**Rule Properties:**
- `subdomains`: Boolean for subdomain matching
- `bookmarks`: Boolean to enable bookmark cleaning
- `history`: Boolean to enable history cleaning

**Cleaning Operations:**
- Pattern-based URL matching using dynamically generated regex
- Bulk processing with Chrome API integration
- Progress tracking and duplicate operation prevention

### CleaningRules Container Component

**Rule Management Interface:**
- Display of default rule template for new entries
- Dynamic list of configured hostname rules
- Action buttons for cleaning operations and rule persistence

**User Interactions:**
- Clean Bookmarks: Executes bookmark cleaning for all enabled rules
- Clean History: Executes history cleaning for all enabled rules
- Save: Persists rule changes to Chrome sync storage

**State Management:**
- Loading rules from Chrome storage on component initialisation
- Real-time updates to cleaning store when rules change
- Disabled state management during active cleaning operations

### CleaningRule Individual Component

**Props Interface:**
- `hostname`: Optional hostname string for existing rules
- Partial `CleaningRuleProperties` for rule configuration

**Form Controls:**
- **Hostname Input**: Text field with regex validation pattern
- **Subdomains Toggle**: Checkbox for subdomain matching
- **Bookmarks Toggle**: Checkbox to enable bookmark cleaning
- **History Toggle**: Checkbox to enable history cleaning

**Validation Logic:**
- Hostname pattern validation using regex
- Duplicate hostname prevention
- Custom validity messages for user feedback

### Background Script Integration

**Message Handling:**
- `clean.bookmarks`: Triggers bookmark cleaning operation
- `clean.history`: Triggers history cleaning operation

**Response States:**
- `started`: Cleaning operation initiated successfully
- `running`: Cleaning operation already in progress

**Cleaning Logic:**
- Loads rules from Chrome sync storage
- Processes each enabled rule with pattern matching
- Handles errors gracefully with console logging

### Popup Interface Integration

**Quick Action Buttons:**
- Clean Bookmarks: Sends message to background script
- Clean History: Sends message to background script
- Options: Opens full options page

**User Feedback:**
- Console logging for operation status
- Warning messages for duplicate operations
- Error handling for unexpected responses

## Data Models

### Cleaning Rule Properties

**Core Properties:**
- `subdomains`: Boolean flag for subdomain pattern matching
- `bookmarks`: Boolean flag to enable bookmark cleaning
- `history`: Boolean flag to enable history cleaning

**Pattern Matching Logic:**
```typescript
// Regex pattern generation
const pattern = new RegExp(
  `^https?://${properties.subdomains ? "(?:.+\\.)?" : ""}${hostname}(?:$|[/?#:])`
);
```

### Chrome Storage Integration

**Storage Keys:**
- `cleaningrules`: Record of hostname to rule properties mapping
- `cleaningruledefault`: Default properties for new rules

**Synchronisation Behaviour:**
- Cross-device rule synchronisation via Chrome sync storage
- Automatic loading of saved rules on extension startup
- Real-time updates when storage changes occur

## Error Handling

### Rule Validation

**Hostname Validation:**
- Regex pattern validation for proper hostname format
- Duplicate hostname detection and prevention
- Custom validity messages for user guidance

**Form Validation:**
- HTML5 validation with custom patterns
- Real-time validation feedback
- Graceful handling of invalid input

### Cleaning Operation Errors

**Chrome API Error Handling:**
- Try-catch blocks around all Chrome API calls
- Console error logging with descriptive messages
- Graceful continuation when individual operations fail

**Concurrency Control:**
- Prevention of duplicate cleaning operations
- State flags to track operation progress
- User feedback for operation status

### Storage Errors

**Chrome Storage Failures:**
- Error handling for storage read/write operations
- Fallback to default values when storage fails
- Console logging for debugging storage issues

## Testing Strategy

### Component Testing

**CleaningRules Testing:**
- Rule loading from Chrome storage
- Cleaning operation execution
- Save functionality and state management

**CleaningRule Testing:**
- Hostname validation and duplicate detection
- Toggle functionality for rule properties
- Form submission and validation

### Integration Testing

**Chrome API Integration:**
- Bookmark search and removal operations
- History search and removal operations
- Storage synchronisation across devices

**Background Script Testing:**
- Message handling and response generation
- Cleaning operation execution
- Error handling and logging

### Performance Testing

**Large Dataset Handling:**
- Cleaning operations with thousands of bookmarks
- History cleaning with extensive browsing data
- Memory usage during bulk operations

## Implementation Phases

### Phase 1: Core Rule Management
- Implement CleaningRule component with validation
- Set up Pinia store for rule state management
- Create rule persistence with Chrome storage

### Phase 2: Cleaning Operations
- Implement bookmark cleaning with pattern matching
- Add history cleaning functionality
- Create progress tracking and error handling

### Phase 3: Background Integration
- Set up background script message handling
- Implement popup interface for quick actions
- Add concurrency control and status reporting

### Phase 4: User Experience Enhancements
- Add bulk rule operations
- Implement rule import/export functionality
- Create cleaning operation scheduling

### Phase 5: Advanced Features
- Add rule testing and preview functionality
- Implement cleaning statistics and reporting
- Create rule templates and presets
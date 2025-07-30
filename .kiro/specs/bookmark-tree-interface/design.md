# Design Document

## Overview

This design document outlines the architecture for implementing the bookmark tree view and editing functionality in the Chrome extension. The system provides a hierarchical display of bookmarks with real-time synchronisation and editing capabilities, built using Vue.js 3 with reactive state management through Pinia.

The design focuses on creating an intuitive tree interface that mirrors Chrome's bookmark structure whilst providing enhanced editing capabilities and visual organisation features.

## Architecture

### Component Architecture

The bookmark tree interface follows a component-based architecture with clear separation of concerns:

- **BookmarkTreeRow**: Recursive component for rendering individual tree nodes
- **BookmarkDetails**: Modal dialogue for editing bookmark properties
- **Bookmarks Store**: Centralised state management for bookmark data
- **Preferences State**: Reactive state for user interface preferences

### Data Flow Architecture

```
Chrome Bookmarks API ↔ Bookmarks Store ↔ Vue Components ↔ User Interface
                           ↕
                    Event Listeners ↔ Real-time Updates
```

### State Management Pattern

The system uses Pinia for reactive state management with the following pattern:
- **Centralised Store**: Single source of truth for bookmark data
- **Reactive Updates**: Automatic UI updates when data changes
- **Event-Driven Synchronisation**: Chrome API events trigger store updates

## Components and Interfaces

### Bookmarks Store (Pinia)

**State Structure:**
- `parent`: ID of the "Bookmarks Bar" root folder
- `others`: ID of the "Other Bookmarks" root folder  
- `selected`: Currently selected bookmark ID for editing
- `bookmarks`: Record mapping bookmark IDs to bookmark objects

**Key Actions:**
- `traverse(node)`: Recursively processes Chrome bookmark tree nodes into store format

**Reactive Behaviour:**
- Automatic UI updates when bookmark data changes
- Real-time synchronisation with Chrome's bookmark changes

### BookmarkTreeRow Component

**Props Interface:**
- `id`: Bookmark ID to render
- `folderonly`: Boolean flag to hide individual bookmarks

**Rendering Logic:**
- **Folders**: Rendered as expandable `<details>` elements with folder icons
- **Bookmarks**: Rendered as links with bookmark icons and external link buttons
- **Loading States**: Skeleton placeholders for undefined bookmarks

**Interaction Patterns:**
- Click on icon to select bookmark for editing
- Expandable folders for hierarchical navigation
- External link buttons for direct bookmark access

### BookmarkDetails Modal Component

**Modal Behaviour:**
- Opens when a bookmark is selected in the store
- Closes when user clicks backdrop or completes editing
- Prevents accidental modifications when editing is disabled

**Form Fields:**
- **Title**: Editable text input with validation
- **URL**: Editable URL input for bookmarks (read-only for folders)
- **Added Date**: Read-only timestamp display
- **Last Modified/Used**: Read-only timestamp display

**Validation and Updates:**
- Client-side validation before API calls
- Asynchronous updates to Chrome's bookmark API
- Error handling with console logging

### Preferences State Management

**Reactive Preferences:**
- `enableediting`: Controls whether bookmark modifications are allowed
- `folderonly`: Controls visibility of individual bookmarks in tree view

**Synchronisation:**
- Stored in Chrome's sync storage for cross-device consistency
- Reactive updates when storage changes occur
- Automatic loading of saved preferences on startup

## Data Models

### Bookmark Type System

**Base Bookmark Interface:**
- `immutable`: Boolean indicating if bookmark can be modified
- `id`: Unique Chrome bookmark identifier
- `title`: Display name of the bookmark
- `added`: Optional creation timestamp

**Folder-Specific Properties:**
- `folder`: Boolean flag set to true
- `children`: Array of child bookmark IDs
- `last_modified`: Optional last modification timestamp

**Bookmark-Specific Properties:**
- `folder`: Boolean flag set to false
- `url`: Target URL string
- `last_used`: Optional last access timestamp

### Chrome API Integration

**Bookmark Tree Node Processing:**
- Recursive traversal of Chrome's bookmark tree structure
- Conversion from Chrome's format to internal bookmark objects
- Handling of special properties like `unmodifiable` flag

**Event Handling:**
- `onChanged`: Updates bookmark title and URL properties
- `onChildrenReordered`: Updates folder child order
- `onCreated`: Adds new bookmarks to tree structure
- `onMoved`: Updates bookmark position in hierarchy
- `onRemoved`: Removes bookmarks from tree structure

## Error Handling

### Chrome API Error Handling

**Bookmark Operations:**
- Try-catch blocks around all Chrome API calls
- Console error logging with descriptive messages
- Graceful degradation when operations fail

**Event Listener Errors:**
- Validation of bookmark existence before operations
- Error logging for unexpected bookmark states
- Defensive programming against malformed data

### UI Error Handling

**Form Validation:**
- HTML5 validation for title and URL fields
- Client-side validation before API submission
- Visual feedback for validation errors

**Loading States:**
- Skeleton placeholders for loading bookmarks
- Graceful handling of undefined bookmark references
- Progressive loading of bookmark tree structure

## Testing Strategy

### Component Testing

**BookmarkTreeRow Testing:**
- Rendering of folders vs bookmarks
- Proper icon display and interaction
- Folder expansion/collapse behaviour
- Folder-only mode filtering

**BookmarkDetails Testing:**
- Modal open/close behaviour
- Form field validation and submission
- Read-only state enforcement
- Proper data binding and updates

### Store Testing

**State Management Testing:**
- Bookmark tree traversal accuracy
- Reactive updates when data changes
- Proper handling of Chrome API events
- State persistence and restoration

### Integration Testing

**Chrome API Integration:**
- Real-time synchronisation with Chrome bookmarks
- Event listener registration and handling
- Cross-device synchronisation via Chrome sync
- Permission handling and error scenarios

## Implementation Phases

### Phase 1: Core Tree Structure
- Implement recursive BookmarkTreeRow component
- Set up basic Pinia store with bookmark data
- Create tree traversal and rendering logic

### Phase 2: Real-time Synchronisation
- Implement Chrome bookmark event listeners
- Add reactive updates to store when bookmarks change
- Handle bookmark creation, deletion, and movement

### Phase 3: Editing Interface
- Create BookmarkDetails modal component
- Implement form validation and submission
- Add editing mode controls and permissions

### Phase 4: User Experience Enhancements
- Add folder-only viewing mode
- Implement loading states and error handling
- Optimise performance for large bookmark collections

### Phase 5: Advanced Features
- Add keyboard navigation support
- Implement drag-and-drop reordering
- Add bulk operations and selection modes
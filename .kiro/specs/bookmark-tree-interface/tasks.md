# Implementation Plan

- [x] 1. Create bookmark data type definitions

  - Define TypeScript interfaces for BookmarkBase, BookmarkFolder, and BookmarkItem
  - Set up union type for Bookmark with proper discriminated union pattern
  - Create type guards for distinguishing folders from bookmarks
  - _Requirements: 3.4, 3.5_

- [x] 2. Implement Pinia bookmarks store with state management

  - Create bookmarks store with state properties for parent, others, selected, and bookmarks
  - Implement traverse action for recursive bookmark tree processing
  - Set up reactive state management for bookmark data updates
  - _Requirements: 1.4, 2.4_

- [x] 3. Create preferences state management system

  - Implement reactive refs for enableediting and folderonly preferences
  - Set up Chrome storage sync integration for preference persistence
  - Add storage change listeners for cross-device synchronisation
  - _Requirements: 1.3, 2.1, 2.2_

- [x] 4. Build BookmarkTreeRow recursive component

  - Create Vue component with props for id and folderonly mode
  - Implement conditional rendering for folders vs bookmarks
  - Add folder expansion/collapse functionality with details/summary elements
  - Integrate bookmark selection handling for editing modal
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 5. Implement BookmarkDetails modal component

  - Create modal dialogue component with form fields for bookmark properties
  - Add conditional fields for folders (last_modified) vs bookmarks (url, last_used)
  - Implement form validation for title and URL fields
  - Set up modal open/close behaviour based on selected bookmark state
  - _Requirements: 2.3, 2.4_

- [x] 6. Add bookmark editing functionality

  - Implement update_title function with Chrome bookmarks API integration
  - Create update_url function for bookmark URL modifications
  - Add validation and error handling for bookmark updates
  - Integrate editing permissions based on enableediting state and immutable flag
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 7. Set up Chrome bookmark tree initialisation

  - Implement bookmark tree loading from Chrome bookmarks API
  - Set up parent and others root folder identification
  - Add error handling for bookmark tree loading failures
  - Integrate tree traversal with store population
  - _Requirements: 1.5, 3.1_

- [x] 8. Implement real-time bookmark synchronisation

  - Add Chrome bookmarks.onChanged event listener for title/URL updates
  - Implement bookmarks.onChildrenReordered handler for folder reordering
  - Create bookmarks.onCreated listener for new bookmark additions
  - Set up bookmarks.onMoved handler for bookmark position changes
  - Add bookmarks.onRemoved listener for bookmark deletions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9. Create main options page integration

  - Integrate BookmarkTreeRow components into OptionsApp.vue
  - Add header controls for editing and folder-only toggles
  - Set up BookmarkDetails modal in main application layout
  - Configure proper component hierarchy and data flow
  - _Requirements: 1.1, 1.3, 2.3_

- [x] 10. Add loading states and error handling

  - Implement skeleton loading states for undefined bookmarks
  - Add error handling for Chrome API failures
  - Create defensive programming patterns for malformed bookmark data
  - Set up console logging for debugging and error tracking
  - _Requirements: 1.4, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 11. Implement folder-only viewing mode

  - Add conditional rendering logic to hide bookmarks when folderonly is enabled
  - Ensure folder structure remains navigable in folder-only mode
  - Test folder expansion/collapse behaviour with hidden bookmarks
  - _Requirements: 1.3_

- [x] 12. Test and validate complete bookmark tree functionality

  - Verify recursive tree rendering with nested folder structures
  - Test real-time synchronisation with Chrome bookmark changes
  - Validate editing functionality with proper permission handling
  - Ensure cross-device preference synchronisation works correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_
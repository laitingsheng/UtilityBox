# Requirements Document

## Introduction

This document outlines the requirements for implementing the bookmark and history cleaning system in the Chrome extension. This system allows users to define hostname-based rules for removing unwanted bookmarks and browser history entries in bulk.

## Requirements

### Requirement 1

**User Story:** As a user, I want to create cleaning rules based on hostname patterns, so that I can define which sites should be cleaned from my bookmarks and history.

#### Acceptance Criteria

1. WHEN I create a cleaning rule THEN the system SHALL allow me to specify a hostname pattern
2. WHEN I configure a rule THEN the system SHALL let me enable subdomain matching for broader pattern coverage
3. WHEN I set up a rule THEN the system SHALL allow me to choose whether to clean bookmarks, history, or both
4. WHEN I save cleaning rules THEN the system SHALL store them persistently in Chrome's sync storage
5. WHEN I modify existing rules THEN the system SHALL update the stored configuration immediately

### Requirement 2

**User Story:** As a user, I want to execute bookmark cleaning operations, so that I can remove unwanted bookmarks matching my defined patterns.

#### Acceptance Criteria

1. WHEN I trigger bookmark cleaning THEN the system SHALL search for bookmarks matching all enabled hostname patterns
2. WHEN a bookmark URL matches a pattern THEN the system SHALL remove it from Chrome's bookmarks
3. WHEN subdomain matching is enabled THEN the system SHALL match all subdomains of the specified hostname
4. WHEN cleaning is in progress THEN the system SHALL prevent duplicate cleaning operations from starting
5. WHEN bookmark cleaning completes THEN the system SHALL log the results for user review

### Requirement 3

**User Story:** As a user, I want to execute history cleaning operations, so that I can remove unwanted browser history entries matching my defined patterns.

#### Acceptance Criteria

1. WHEN I trigger history cleaning THEN the system SHALL search for history entries matching all enabled hostname patterns
2. WHEN a history URL matches a pattern THEN the system SHALL remove it from Chrome's browsing history
3. WHEN subdomain matching is enabled THEN the system SHALL match all subdomains of the specified hostname
4. WHEN cleaning is in progress THEN the system SHALL prevent duplicate cleaning operations from starting
5. WHEN history cleaning completes THEN the system SHALL log the results for user review

### Requirement 4

**User Story:** As a user, I want quick access to cleaning functions through the extension popup, so that I can perform maintenance tasks without opening the full options page.

#### Acceptance Criteria

1. WHEN I click the extension icon THEN the system SHALL show a popup with cleaning action buttons
2. WHEN I click "Clean Bookmarks" THEN the system SHALL execute bookmark cleaning using all saved rules
3. WHEN I click "Clean History" THEN the system SHALL execute history cleaning using all saved rules
4. WHEN cleaning is already running THEN the system SHALL display a message indicating the operation is in progress
5. WHEN I access the popup THEN the system SHALL provide a link to open the full options page

### Requirement 5

**User Story:** As a user, I want my cleaning rules to synchronise across devices, so that I can maintain consistent cleaning behaviour on all my Chrome installations.

#### Acceptance Criteria

1. WHEN I create rules on one device THEN the system SHALL synchronise them to all my Chrome instances
2. WHEN I modify rules THEN the system SHALL update them across all devices automatically
3. WHEN I start the extension THEN the system SHALL load my saved rules from Chrome's sync storage
4. WHEN storage changes occur THEN the system SHALL update the interface to reflect the new settings
5. WHEN sync conflicts occur THEN the system SHALL use the most recent rule configuration
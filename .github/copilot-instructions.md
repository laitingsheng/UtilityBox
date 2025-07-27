# GitHub Copilot Instructions

## Project Overview
BookmarkManager is a Chrome browser extension for advanced bookmark management with automated organisation, cleaning, and URL rewriting capabilities.

### Technology Stack & Architecture
- **Platform**: Chrome Extension Manifest V3 (minimum Chrome 95)
- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **State Management**: Pinia stores with reactive refs
- **UI**: TailwindCSS with DaisyUI components and FontAwesome icons
- **Build**: Vite with custom manifest generation
- **APIs**: Chrome bookmarks, history, and storage with cross-device sync

### Core Components
- `OptionsApp.vue` - Main application entry point
- `BookmarkTreeRow.vue` - Recursive tree view component for bookmark hierarchy
- `BookmarkDetails.vue` - Modal dialog for bookmark editing
- `CleaningRules.vue` / `RewriteRules.vue` - Rule management interfaces
- Store modules: bookmarks, cleaning, rewrite state management

## Development Standards

### Language & Localisation
- Use British English (en-GB) spelling in all code, comments, and commit messages
- Use general language codes (`en`, `zh`) in markup and configuration files

### Git Commit Requirements
Use conventional commit format with mandatory attribution:
```
<type>: <description>

- <detailed change 1>
- <detailed change 2>

Co-authored-by: GitHub Copilot <github-copilot[bot]@users.noreply.github.com>
```

**Content Guidelines:**
- Focus on technical changes and functional improvements
- Avoid mentioning linguistic, spelling, or documentation changes unless no code changes made
- Keep messages professional and implementation-focused
- Document architectural decisions and rationale
- Use `git commit --signoff` or `-s` parameter for required signoff

**Pre-Commit Checklist:**
- Review and update documentation to reflect changes
- Update README.md for new features or architectural modifications
- Revise Copilot instructions when project structure changes
- Fix unknown Unicode characters for proper encoding

**Post-Commit Validation:**
- Verify conventional commit format compliance with `git log -1`
- Check proper Co-authored-by attribution
- Ensure alignment with documented standards

### Code Style & Architecture
**General Standards:**
- Sort imports before making changes for consistent module organisation
- Prefer snake_case, then kebab-case over camelCase for naming
- Follow Prettier and ESLint configuration for formatting and linting
- Explicit `undefined` and `null` comparisons (`=== undefined`, `!== null`)
- Use nullish coalescing (`??`) and optional chaining (`?.`) when possible
- Add non-null postfix (`!`) for globals TypeScript cannot recognise as non-null
- Maintain consistency with existing codebase patterns

**Vue.js Patterns:**
- Use Composition API with `<script setup>` syntax
- PascalCase for component names when importing and in templates
- Keep imported component names consistent (except main entry `App` components)
- Proper TypeScript typing for props, emits, and computed properties
- Reactive data patterns with `ref()` and `reactive()`
- Prefer `v-model` for two-way data binding over traditional emit patterns

**Chrome Extension Practices:**
- Follow Manifest V3 requirements and limitations
- Proper error handling for Chrome API calls
- Appropriate Chrome storage API usage (sync vs local)
- Maintain proper permissions scope and cross-device synchronisation

**State Management:**
- Pinia stores for complex state logic
- Reactive refs for component-local state
- Separation between UI state and business logic
- Chrome API integration within store actions

### Documentation Standards
- Update documentation to reflect technical changes
- Focus on functionality and architecture in explanations
- Maintain consistency across codebase
- Use third person or passive voice for professional objectivity

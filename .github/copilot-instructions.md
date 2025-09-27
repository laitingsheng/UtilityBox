# GitHub Copilot Instructions

## Project Overview
Utility Box is a Chromium extension for synchronised hostname-based bookmark and history cleaning with a lightweight rule management interface.

### Technology Stack & Architecture
- **Platform**: Chrome Extension Manifest V3 (minimum Chrome 99)
- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **State Management**: Pinia stores with reactive refs
- **UI**: TailwindCSS with DaisyUI components and emoji icons (via `src/assets/icons.ts`)
- **Build**: Vite with EJS templating, custom manifest generation, and icon processing
- **Utilities**: es-toolkit for efficient string manipulation functions
- **APIs**: Chrome bookmarks, history, and storage with cross-device sync

**Build Configuration:**
- **Entry Points**: `options.html`, `popup.html`, `background.ts`
- **Assets**: Inlined disabled, separate hash-based naming for cache busting
- **Icons**: Auto-generated from `favicon.png` at multiple resolutions (16x16, 32x32, 48x48, 96x96), plus webstore icon (96x96 with padding)
- **Manifest**: Dynamic generation with package.json metadata integration
- **Templates**: EJS templating for HTML files with dynamic title injection
- **Dev Tools**: Vue DevTools integration for development builds

### Core Components
- `OptionsApp.vue` – Options UI wrapper with navbar and controls
- `components/CleaningRules.vue` – Rule list, storage sync, and cleaning actions
- `components/CleaningRule.vue` – Single hostname rule row with validation
- `PopupApp.vue` – Toolbar popup for one-click cleaning actions
- `states/preferences.ts` – Reactive editing toggle backed by Chrome sync storage
- `stores/cleaning.ts` – Pinia store tracking rules and cleaning state
- `background.ts` – Service worker executing bookmark/history deletions

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
- Update README.md project structure and component descriptions
- Revise feature lists to match actual functionality
- Update technical stack section for dependency changes
- Add new features to the Features section with descriptions and usage
- Update project structure diagram for new files/directories
- Modify installation or usage instructions for workflow changes
- Update Copilot instructions if configuration files have changed (package.json, eslint.config.ts, vite.config.ts, tsconfig.*.json, .prettierrc.json, .editorconfig)
- Fix unknown Unicode characters for proper encoding
- Check extension manifest description in vite.config.ts reflects all current features and capabilities

**Post-Commit Validation:**
- Verify conventional commit format compliance with `git log -1`
- Check proper Co-authored-by attribution
- Ensure alignment with documented standards

### Code Style & Architecture
**General Standards:**
- Sort imports before making changes for consistent module organisation
- Use `@` prefix for all internal imports instead of relative paths (`@/assets/icons` not `../assets/icons`)
- Group imports: external libraries first, then internal imports with `@` prefix, sorted alphabetically within groups
- Explicit `undefined` and `null` comparisons (`=== undefined`, `!== null`)
- Use nullish coalescing (`??`) and optional chaining (`?.`) when possible
- Add non-null postfix (`!`) for globals TypeScript cannot recognise as non-null

**Naming Conventions:**
- **snake_case** for all variables and functions (`cleaning_store`, `clean_bookmarks`)
- **PascalCase** for all classes, types, interfaces and Vue components (`CleaningRule`, `CleaningRules`, `PopupApp`)
- **kebab-case** for TypeScript and JavaScript file names when multiple words are needed (`background-service.ts`, `cleaning-store.ts`)

**Formatting & Linting Standards:**
- **Prettier**: 120 character line width, 2-space indentation, double quotes, trailing commas, LF line endings
- **ESLint**: Vue 3 essential rules with TypeScript support, skip formatting conflicts with Prettier
- **TypeScript**: Strict DOM environment with Chrome API types, path aliases (`@/*` → `./src/*`)
- **EditorConfig**: Tab indentation by default (4-width), space indentation for web files (2-space)
- Use `npm run format` for Prettier and `npm run lint` for ESLint with auto-fix

**Vue.js Patterns:**
- Use Composition API with `<script setup>` syntax
- PascalCase for component names when importing and in templates
- Keep imported component names consistent (except main entry `App` components)
- Proper TypeScript typing for props, emits, and computed properties
- Prefer `v-model` for two-way data binding over traditional emit patterns

**Chrome Extension Practices:**
- Follow Manifest V3 requirements and limitations
- Proper error handling for Chrome API calls
- Appropriate Chrome storage API usage (sync vs local)
- Maintain proper permissions scope and cross-device synchronisation

**State Management:**
- Pinia stores for complex state logic
- Reactive refs for component-local state
- Chrome API integration within store actions

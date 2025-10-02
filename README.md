# Utility Box

Utility Box is a Chromium extension for keeping bookmarks and browsing history tidy with synchronised hostname rules and one-click cleaning tools.

## Features

### 🧹 Hostname-based cleaning
- Maintain a library of hostnames with per-host toggles for bookmarks, history, and subdomain matching
- Apply rules immediately from the options page or the popup without reloading the browser
- Background service worker performs deletions without blocking the UI
- Automatic real-time history deletion as you browse—visited URLs matching active rules are removed instantly

### 🔐 Safeguarded editing
- "Enable Editing" toggle in the Cleaning Rules card prevents accidental rule changes during day-to-day use
- Default rule row defines the settings applied to any new hostname you add
- Validation catches duplicate hostnames before they make it into storage

### 🔄 Sync-friendly storage
- All rules are saved in Chrome sync storage for cross-device continuity
- Automatic storage updates keep the interface aligned with remote changes

### ⚡ Quick actions popup
- Toolbar popup triggers bookmark or history cleaning in a single click
- Shortcut to open the full options page when you need to adjust rules

## Technical stack

- **Framework**: Vue 3 (Composition API + TypeScript)
- **State management**: Pinia stores
- **Styling**: Tailwind CSS 4 with DaisyUI components
- **Utilities**: es-toolkit for lightweight string helpers
- **Build tooling**: Vite 7 with EJS templating, icon generation, and Vue DevTools integration
- **Browser APIs**: Chrome Extensions Manifest V3 (bookmarks, history, storage)

## Installation

### From source
1. Clone the repository:
   ```bash
   git clone https://github.com/laitingsheng/UtilityBox.git
   cd UtilityBox
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the build output into Chromium:
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Choose **Load unpacked** and select the `dist` directory
   - Pin the Utility Box icon for quick access to popup actions

## Development workflow

### Prerequisites
- Node.js 22 or newer
- npm 10+
- Native dependencies for [Sharp](https://sharp.pixelplumbing.com/) (used for icon generation)

### Common commands
```bash
# Install dependencies
npm install

# Run Vite in watch mode for extension development
npm run dev

# Type-check the project
npm run type-check

# Lint and auto-fix issues
npm run lint

# Format Vue and TypeScript sources
npm run format

# Build production assets
npm run build

# Preview the production bundle
npm run preview
```

### Code quality guidelines
- ESLint (Vue 3 essential rules) and Prettier are configured with British English conventions
- Path aliases require `@/` for internal modules
- Strict TypeScript configuration targets the Chrome extensions environment
- Conventional commits with documented co-authors keep history consistent

## Usage

### Managing cleaning rules
1. Open **chrome://extensions/** → Utility Box → **Options**
2. Toggle **Enable Editing** in the Cleaning Rules card when you intend to make changes
3. Use the first row to adjust default values applied to new hostnames
4. Add hostnames to create rules; choose whether to target bookmarks, history, and/or subdomains
5. Click **Save** to persist updates to Chrome sync storage

### Running cleaning jobs
- Press **Clean Bookmarks** or **Clean History** in the options page to apply the current rules immediately
- From the popup, trigger the same actions without leaving the current tab
- The background service worker skips hostnames that are disabled for the requested mode and logs its progress in the console
- History entries are also deleted automatically in real-time whenever you visit a URL that matches an active history cleaning rule

### Staying in sync
- Storage changes from other devices are mirrored into the interface automatically
- Disable **Enable Editing** when you are done to avoid stray modifications

## Permissions

The extension requests the following Chrome permissions:
- `bookmarks` – required to locate and remove saved bookmarks
- `history` – required to search and delete browsing history entries
- `storage` – used for synchronised rule and preference storage

## Browser compatibility

- **Minimum Chromium version**: 99
- **Manifest version**: 3
- **Incognito mode**: Not supported

## Project structure
```
├── src/
│   ├── assets/
│   │   ├── base.css            # Tailwind and DaisyUI configuration
│   │   └── icons.ts            # Centralised emoji icon map
│   ├── components/
│   │   ├── CleaningRule.vue    # Single hostname rule row
│   │   └── CleaningRules.vue   # Rule list with editing toggle and cleaning actions
│   ├── stores/
│   │   └── cleaning.ts         # Pinia store for rules and request state
│   ├── types/
│   │   ├── cleaning.ts         # Cleaning rule types
│   │   └── messages.ts         # Background message contracts
│   ├── background.ts           # Service worker handling cleaning jobs and real-time history deletion
│   ├── options.ts              # Options page entry (Vue + Pinia bootstrapping)
│   ├── OptionsApp.vue          # Options page layout with navbar
│   ├── popup.ts                # Popup entry point
│   └── PopupApp.vue            # Popup actions for quick cleaning
├── options.html                # Options page template with EJS placeholders
├── popup.html                  # Popup template
├── vite.config.ts              # Manifest, icon pipeline, locale generation, and build setup
├── eslint.config.ts            # Shared linting rules
├── tsconfig*.json              # TypeScript project references
└── favicon.png                 # Source icon used for all generated sizes
```

## Notes

### Microsoft Edge store listing description

#### English (en)
Utility Box keeps your Microsoft Edge profiles tidy by automatically pruning bookmarks and browsing history entries that match hostname rules you configure once and sync everywhere. History is deleted in real-time as you browse, and you can also trigger manual clean-ups for bookmarks and history from the options dashboard or Edge toolbar. Configure granular filters, toggle safety prompts, and monitor live clean-up status without manual review hurdles.

## Licence

ISC Licence – see [LICENCE.md](LICENCE.md) for the full text.

## Credits

- Icon sourced from [Free Icons PNG](https://www.freeiconspng.com/img/12327)
- Utility Box is built with Vue 3, TypeScript, Tailwind CSS, DaisyUI, and the Chrome Extensions APIs. Icon assets are generated automatically from `favicon.png` via Sharp during the build.

# Bookmark Manager

Advanced bookmark management with automated organisation, cleaning, and URL rewriting capabilities for Chromium-based browsers.

## Features

### 📁 Smart Bookmark Organisation
- **Interactive bookmark tree view** with expandable folders
- **Folder-only view mode** to hide individual bookmarks and focus on organisation
- **Live bookmark synchronisation** with Chrome's bookmark API
- **Edit bookmark properties** (title, URL) directly in the interface

### 🎛️ Flexible Interface Controls
- **Enable Editing** toggle to prevent accidental modifications
- **Protected system folders** (Bookmarks Bar and Other Bookmarks)
- **Modal dialogue** for detailed bookmark attribute editing
- **Real-time bookmark synchronisation** with Chrome's API

### 🔧 Advanced URL Rewriting
- **Regular expression-based URL rewriting** for bookmark cleanup
- **Batch URL transformation** across all bookmarks
- **Pattern-based replacement** with full regex support
- **Advanced feature** with appropriate warnings for careful use

### 🧹 Intelligent Cleaning System
- **Hostname-based cleaning rules** for targeted bookmark and history removal
- **Separate controls** for bookmarks and browser history
- **Subdomain matching** for comprehensive cleanup
- **Bulk cleaning operations** with configurable rules
- **Background service worker** for efficient processing
- **Quick popup actions** for immediate cleaning operations

### ⚙️ Persistent Configuration
- **Rule persistence** using Chrome's sync storage
- **Cross-device synchronisation** of all settings and rules
- **Automatic rule loading** on extension startup
- **Real-time rule updates** and validation

## Technical Stack

- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **State Management**: Pinia stores with reactive refs
- **UI Framework**: TailwindCSS with DaisyUI components
- **Icons**: Unicode characters and FontAwesome icons
- **Build System**: Vite with custom manifest generation and icon processing
- **Browser APIs**: Chrome Extensions Manifest V3

## Installation

### From Source
1. Clone the repository:
   ```bash
   git clone https://github.com/laitingsheng/BookmarkManager.git
   cd BookmarkManager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder
   - The extension icon will appear in the toolbar for quick actions
   - Access full options through right-click → "Options" or Chrome's extension management

## Development

### Prerequisites
- Node.js 22+
- npm or yarn
- Sharp (for favicon generation)

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

### Code Quality Standards
- **ESLint**: Vue 3 essential rules with TypeScript support
- **Prettier**: 120-character line width, consistent formatting across project
- **TypeScript**: Strict type checking with Chrome API types
- **Conventional Commits**: Required commit message format with co-author attribution
- **GitHub Actions**: Automated build verification on main branch pushes
- **Icon Generation**: Automated multi-resolution icon creation from `favicon.png`
- **Manifest Generation**: Dynamic Chrome extension manifest creation from package.json

### Project Structure
```
src/
├── background.ts          # Service worker with cleaning operations
├── options.ts            # Options page entry point
├── OptionsApp.vue        # Main application component
├── popup.ts              # Popup entry point
├── PopupApp.vue          # Popup application component
├── assets/               # Static assets
│   ├── base.css          # TailwindCSS configuration
│   └── icons.ts          # Unicode icon definitions
├── components/           # Vue components
│   ├── BookmarkDetails.vue     # Modal dialog for bookmark editing
│   ├── BookmarkTreeRow.vue     # Tree view row component
│   ├── CleaningRule.vue        # Individual cleaning rule component
│   ├── CleaningRules.vue       # Cleaning rules management
│   ├── RewriteRule.vue         # Individual rewrite rule component
│   └── RewriteRules.vue        # URL rewriting rules management
├── states/               # Reactive state management
│   └── preferences.ts    # User preferences (editing, folder-only mode)
├── stores/               # Pinia state management
│   ├── bookmarks.ts      # Bookmark data and operations
│   ├── cleaning.ts       # Cleaning rules and operations
│   └── rewrite.ts        # URL rewriting rules
└── types/                # TypeScript type definitions
    ├── bookmarks.ts      # Bookmark-related types
    ├── cleaning.ts       # Cleaning rule types
    └── messages.ts       # Background script message types
```

## Usage

### Basic Bookmark Management
1. Open the extension options page from Chrome's extension management
2. Browse bookmarks in the tree view
3. Toggle "Enable Editing" to allow modifications
4. Click on any bookmark or folder to view/edit its properties in the modal dialog
5. Toggle "Folder Only" mode to focus on organisational structure

### Quick Actions via Popup
1. Click the extension icon in the toolbar to access quick actions
2. Use "Clean Bookmarks" for immediate bookmark cleaning based on saved rules
3. Use "Clean History" for immediate browser history cleaning
4. Click "Options" to open the full options page for detailed management

### Setting Up Grouping Rules
**Note**: Grouping functionality has been removed in the current version due to cross-device synchronisation limitations. Storing rules per bookmark ID creates sync conflicts when bookmark IDs differ across devices.
1. Use the cleaning and rewriting features to organise bookmarks
2. Manual organisation through the tree view interface
3. Future versions may implement device-agnostic grouping solutions

### URL Rewriting (Advanced)
1. Navigate to the "Bookmarks URL Rewrite Rules" section
2. Add regular expression patterns and replacement strings
3. Click "Run" to apply transformations to all matching bookmark URLs
4. **Use with caution** - this feature can modify bookmark URLs permanently

### Cleaning Rules
1. Add hostname patterns in the "Cleaning Rules" section
2. Configure whether to clean bookmarks, history, or both
3. Set subdomain matching preferences
4. Use "Clean Bookmarks" or "Clean History" to execute removal operations

## Permissions

The extension requires the following Chrome permissions:
- `bookmarks` - Read and modify browser bookmarks
- `history` - Access and modify browser history (for cleaning features)
- `storage` - Store configuration and rules

## Browser Compatibility

- **Minimum Chrome version**: 99
- **Manifest version**: V3
- **Incognito mode**: Not allowed

## License

ISC License - see [LICENCE.md](LICENCE.md) for details.

## Credits

- Icons auto-generated from `favicon.png` using Sharp image processing
- Built with modern web technologies and Chrome Extensions Manifest V3 API
- Vue.js 3 with Composition API and TypeScript for robust development

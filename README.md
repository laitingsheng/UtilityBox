# Bookmark Manager

A powerful Chrome extension for advanced bookmark organization and management with automated grouping, URL rewriting, and cleaning capabilities.

## Features

### 📁 Smart Bookmark Organization
- **Folder-only mode**: Toggle to show only bookmark folders for cleaner navigation
- **Interactive bookmark tree**: Browse and manage your entire bookmark hierarchy
- **Real-time sync**: Automatically updates when bookmarks change in Chrome

### 🎯 Automated Grouping Rules
- **Domain-based grouping**: Automatically move bookmarks to specific folders based on hostname patterns
- **Subdomain support**: Configure rules to include or exclude subdomains
- **Bulk operations**: Run grouping rules across your entire bookmark collection
- **Per-folder configuration**: Set different grouping rules for each bookmark folder

### 🔄 URL Rewrite Rules
- **Pattern-based rewriting**: Transform bookmark URLs using regex patterns
- **Bulk URL updates**: Apply rewrite rules to all matching bookmarks at once
- **Advanced regex support**: Full regular expression support for complex URL transformations

### 🧹 Cleaning & Maintenance
- **Bookmark cleaning**: Remove bookmarks matching specific domain patterns
- **History cleaning**: Clear browsing history for specified domains
- **Subdomain filtering**: Clean both main domains and their subdomains
- **Selective cleaning**: Configure which domains to clean from bookmarks vs history

### ⚙️ Configuration Management
- **Persistent settings**: All rules and preferences saved to Chrome sync storage
- **Import/Export ready**: Settings sync across Chrome installations
- **Real-time validation**: Immediate feedback on rule changes
- **Backup-friendly**: JSON-based configuration storage

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Lint and format
npm run lint
npm run format
```

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Tailwind CSS** + **DaisyUI** for styling
- **Vite** for build tooling
- **Chrome Extensions Manifest V3**

## Permissions

This extension requires the following Chrome permissions:
- `bookmarks`: Read and modify bookmarks
- `history`: Access and modify browsing history
- `storage`: Save settings and rules

## Attribution

Icon sourced from [Free Icons PNG](https://www.freeiconspng.com/img/12327).

# Design Document

## Overview

This design document outlines the architecture and implementation approach for initialising a Chrome extension project for bookmark management. The project uses a modern web development stack with Vue.js 3, TypeScript, Vite, and Chrome Extensions Manifest V3 API to create a sophisticated bookmark management tool.

The design focuses on establishing a robust development environment, proper project structure, and build system that supports both development and production workflows whilst maintaining code quality standards.

## Architecture

### Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript with strict type checking
- **Build System**: Vite with custom plugins for Chrome extension development
- **Templating**: EJS for HTML template processing with dynamic content
- **State Management**: Pinia for reactive state management
- **Styling**: TailwindCSS 4.x with DaisyUI components
- **Code Quality**: ESLint + Prettier with Vue.js and TypeScript configurations
- **Browser API**: Chrome Extensions Manifest V3

### Project Structure

```
project-root/
├── .kiro/                          # Kiro configuration and specs
│   ├── specs/                      # Feature specifications
│   └── steering/                   # Development guidelines
├── src/                            # Source code
│   ├── assets/                     # Static assets and styles
│   ├── components/                 # Vue components
│   ├── states/                     # Reactive state management
│   ├── stores/                     # Pinia stores
│   ├── types/                      # TypeScript type definitions
│   ├── background.ts               # Service worker entry point
│   ├── options.ts                  # Options page entry point
│   ├── popup.ts                    # Popup entry point
│   ├── OptionsApp.vue              # Main options application
│   └── PopupApp.vue                # Popup application
├── dist/                           # Build output directory
├── node_modules/                   # Dependencies
├── options.html                    # Options page HTML template with EJS syntax
├── popup.html                      # Popup HTML template with EJS syntax
├── favicon.png                     # Base icon for generation
├── package.json                    # Project configuration
├── vite.config.ts                  # Build configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.ts                # Linting configuration
└── .prettierrc.json                # Code formatting configuration
```

### Build System Architecture

The build system uses Vite with custom plugins to handle Chrome extension-specific requirements:

1. **Manifest Generation**: Dynamic creation of manifest.json from package.json metadata
2. **Icon Processing**: Automated multi-resolution icon generation from base favicon
3. **Template Processing**: EJS-based HTML template compilation with dynamic content injection
4. **Multi-Entry Build**: Separate entry points for background, options, and popup
5. **Asset Management**: Proper handling of static assets and chunking

## Components and Interfaces

### Package Configuration

**package.json Structure:**
- Project metadata (name, version, description)
- Development and build scripts
- Dependencies for Vue.js ecosystem and Chrome extension development
- DevDependencies for build tools, linting, and type checking

**Key Scripts:**
- `dev`: Development server with hot reload
- `build`: Production build with optimisation
- `type-check`: TypeScript compilation verification
- `lint`: Code linting with automatic fixes
- `format`: Code formatting with Prettier

### TypeScript Configuration

**Multi-Configuration Setup:**
- `tsconfig.json`: Root configuration with project references
- `tsconfig.app.json`: Application code configuration with DOM types
- `tsconfig.node.json`: Build tools configuration with Node.js types

**Key Features:**
- Strict type checking enabled
- Chrome API types included
- Path aliases for clean imports
- Separate build info files for performance

### Build Configuration (Vite)

**Custom Plugin Architecture:**
```typescript
// Icon Generation and Manifest Plugin
{
  name: "generate-icons",
  buildStart() {
    // Generate multiple icon sizes from favicon.png
    // Create manifest.json with proper metadata
  }
}
```

**EJS Template Processing:**
- Uses `vite-plugin-ejs` for HTML template compilation
- Processes `.html` files containing EJS syntax with project metadata injection
- Supports dynamic content like project name, version, and descriptions

**Build Optimisation:**
- Asset inlining disabled for Chrome extension compatibility
- Custom output naming for predictable file structure
- Multi-entry configuration for different extension contexts
- PNG compression using Sharp with maximum compression level (9)
- Source file minification for production builds
- Tree shaking for unused code elimination

### Code Quality Configuration

**ESLint Setup:**
- Vue.js essential rules
- TypeScript recommended configuration
- Prettier integration for formatting
- Global ignores for build directories

**Prettier Configuration:**
- 120-character line width
- Consistent formatting across file types
- LF line endings for cross-platform compatibility
- Trailing commas for cleaner diffs

**EditorConfig:**
- Tab-based indentation (4 spaces) for most files
- Space-based indentation for JSON/YAML/Markdown
- Consistent line endings and character encoding

## Data Models

### Project Configuration References

- **Package.json Schema**: [npm package.json documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- **Vite Build Configuration**: [Vite build options documentation](https://vitejs.dev/config/build-options.html)
- **Chrome Extension Manifest V3**: [Chrome Extensions Manifest V3 documentation](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- **TypeScript Configuration**: [TSConfig reference documentation](https://www.typescriptlang.org/tsconfig)
- **EJS Template Variables**: [EJS syntax documentation](https://ejs.co/#docs)

## Error Handling

### Build Process Error Handling

1. **TypeScript Compilation Errors**
   - Strict type checking catches errors at build time
   - Clear error messages with file locations
   - Incremental compilation for performance

2. **Asset Processing Errors**
   - Icon generation failures with fallback handling
   - Missing asset detection and reporting
   - Build process continuation with warnings

3. **Dependency Resolution Errors**
   - Clear error messages for missing dependencies
   - Version compatibility checking
   - Lock file consistency validation

### Development Environment Error Handling

1. **Hot Reload Errors**
   - Graceful handling of compilation failures
   - Error overlay in development mode
   - Automatic recovery on file changes

2. **Linting and Formatting Errors**
   - Non-blocking warnings for style issues
   - Automatic fixing where possible
   - Clear reporting of unfixable issues

## Testing Strategy

### Static Analysis Testing

1. **Type Checking**
   - Comprehensive TypeScript compilation
   - Chrome API type validation
   - Interface consistency verification

2. **Code Quality Testing**
   - ESLint rule enforcement
   - Prettier formatting validation
   - Import/export consistency checking

### Build Process Testing

1. **Build Verification**
   - Successful compilation of all entry points
   - Proper asset generation and copying
   - Manifest.json validation

2. **Development Server Testing**
   - Hot reload functionality
   - Asset serving correctness
   - Source map generation

### Integration Testing

1. **Chrome Extension Loading**
   - Manifest validation in Chrome
   - Extension installation testing
   - Permission verification

2. **Cross-Platform Compatibility**
   - Build process on different operating systems
   - File path handling consistency
   - Line ending normalisation

## Implementation Phases

### Phase 1: Core Project Setup
- Package.json configuration with dependencies
- TypeScript configuration files
- Basic directory structure creation

### Phase 2: Build System Configuration
- Vite configuration with custom plugins
- EJS template processing setup
- Icon generation system
- Manifest generation system

### Phase 3: Code Quality Setup
- ESLint configuration and rules
- Prettier formatting setup
- EditorConfig for consistency

### Phase 4: Development Workflow
- Development server configuration
- Hot reload setup
- Build scripts and automation

### Phase 5: Production Optimisation
- Build output optimisation
- Asset management
- Extension packaging preparation
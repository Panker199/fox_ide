# FOX IDE

A VS Code-inspired code editor built with React, Monaco Editor, and Node.js backend. Clean, minimalist design with glassmorphism UI.

## Features

- **Monaco Editor** — Full VS Code editing experience with syntax highlighting, IntelliSense, and snippets
- **Real File Explorer** — Browse, create, rename, delete files and folders
- **20+ Themes** — Default Dark/Light, Nord, Dracula, GitHub, iPhone, macOS, and custom Theme Studio
- **Git Integration** — Branch display, changed files list, git status
- **Integrated Terminal** — Terminal emulator with theme-aware styling
- **AI Copilot** — AI chat sidebar for code assistance
- **Command Palette** — Quick access to all commands (Ctrl+Shift+P)
- **Settings Panel** — 20+ configuration categories with search, social media style UI
- **30+ Language Support** — JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, Markdown, and more
- **Code Snippets** — Pre-built snippets for JS/TS, HTML, CSS, Python
- **Theme Studio** — Create, edit, and preview custom themes
- **Debug Panel** — Breakpoint and debug controls
- **Problem & Output Panels** — Error reporting and log output
- **File Icon Themes** — Seti, Modern, Minimal, None + custom icon pack import
- **Electron Support** — Desktop app packaging via Electron

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Editor | Monaco Editor (local, not CDN) |
| Backend | Express.js (port 3001) |
| Icons | Lucide React |
| State | React Context + localStorage |
| Desktop | Electron 28 |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 5173) + backend (port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start backend only
npm run server

# Electron dev mode
npm run electron:dev

# Electron production build
npm run electron:build
```

## Project Structure

```
FOX IDE/
├── index.html                    # Entry HTML (CSP headers, meta tags)
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite config (Monaco chunks, proxy, optimizeDeps)
├── server.js                     # Express backend API (port 3001)
├── .gitignore                    # Git ignore rules
│
├── assets/                       # Static assets (not in src/)
│   ├── extensions/               # VS Code extension folders (TextMate grammars)
│   ├── fonts/                    # Font files
│   ├── icons/                    # SVG icons
│   │   ├── file-types/           # File type icons (c, cpp, css, go, js, py, etc.)
│   │   ├── fileicons/            # File icon themes
│   │   │   ├── theme-defaults/   # Default icon theme (dark/light variants)
│   │   │   ├── theme-modern-icons/ # Modern minimal icon theme
│   │   │   └── theme-seti/       # Seti icon theme (colorful)
│   │   ├── kro_icons/            # FOX IDE custom icons (arrows, git, file ops)
│   │   ├── ui/                   # UI feature icons (autosave, debugger, minimap)
│   │   ├── favicon.svg           # Browser tab icon
│   │   ├── logo.svg              # App logo
│   │   ├── splash.svg            # Splash screen
│   │   └── tray-icon.svg         # System tray icon
│   ├── images/                   # Logo variants (dark/light)
│   └── svg/                      # Lucide SVG icons (2000+ icons)
│
├── config/
│   └── settings.json             # Default app settings
│
├── electron/                     # Electron desktop app
│   ├── main.js                   # Main process (window creation, IPC)
│   └── preload.js                # Preload script (context bridge)
│
├── public/
│   └── fonts/                    # Public font files (Pyra font)
│
└── src/                          # Source code
    ├── App.jsx                   # Main app (layout, panels, state, menu actions)
    ├── main.jsx                  # React entry point
    │
    ├── components/               # React components
    │   ├── ActivityBar.jsx/css   # Left sidebar icons (Files, Search, Git, Extensions)
    │   ├── AIChat.jsx/css        # AI chat panel (fox AI branding)
    │   ├── CodeEditor.jsx/css    # Code editor wrapper (tabs, save, language select)
    │   ├── CommandPalette.jsx/css # Command palette (Ctrl+Shift+P)
    │   ├── Copilot.jsx/css       # AI copilot sidebar (VS Code Chat style)
    │   ├── Debug.jsx/css         # Debug panel (Stop, Restart, Step)
    │   ├── ErrorBoundary.jsx     # Error boundary component
    │   ├── FileManager.jsx/css   # File manager component
    │   ├── LayoutToggle.jsx/css  # Layout toggle component
    │   ├── MenuBar.jsx/css       # Menu bar component
    │   ├── OutputPanel.jsx/css   # Output/log panel
    │   ├── ProblemsPanel.jsx/css # Problems/error panel
    │   ├── SettingsPanel.jsx/css # Settings (20+ sections, search, card UI)
    │   ├── Sidebar.jsx/css       # File tree, search, git, extensions panels
    │   ├── Spinner.jsx/css       # Loading spinner + save indicator
    │   ├── StartPage.jsx/css     # Start/welcome page
    │   ├── StatusBar.jsx/css     # Bottom status bar (branch, language, line)
    │   ├── Terminal.jsx/css      # Terminal emulator
    │   ├── TitleBar.jsx/css      # Top titlebar with menus and search
    │   │
    │   ├── MonacoEditor/         # Monaco editor module
    │   │   ├── index.js          # Barrel export
    │   │   ├── MonacoEditor.jsx  # Monaco wrapper (themes, language configs)
    │   │   ├── MonacoEditor.css  # Editor loading spinner styles
    │   │   └── languages/        # Language configurations
    │   │       ├── index.js      # Exports registerLanguageConfigs + registerSnippets
    │   │       ├── registerConfigs.js # 30+ language configs (comments, brackets, folding)
    │   │       └── snippets.js   # Code snippets (JS/TS, HTML, CSS, Python)
    │   │
    │   └── ThemeStudio/          # Theme creator module
    │       ├── index.js          # Barrel export
    │       ├── ThemeStudio.jsx   # Main theme studio UI
    │       ├── ThemeStudio.css   # Theme studio styles
    │       ├── ProjectCreator.jsx # Project creator component
    │       ├── ThemeLoader.jsx   # Theme loader/importer
    │       └── UIDesigner.jsx    # UI designer component
    │
    ├── assets/                   # Source assets
    │   ├── index.js              # Asset exports
    │   └── theme-previews/       # Theme preview SVG thumbnails
    │       ├── default-dark.svg
    │       ├── default-light.svg
    │       ├── dracula.svg
    │       ├── github.svg
    │       ├── iphone-dark.svg
    │       ├── iphone-light.svg
    │       ├── macos-dark.svg
    │       ├── macos-light.svg
    │       └── nord.svg
    │
    ├── contexts/                 # React contexts
    │   └── ThemeContext.jsx       # Theme provider context
    │
    ├── hooks/                    # Custom React hooks
    │   ├── useCopilot.js         # AI copilot state and API calls
    │   ├── useFileSystem.js      # File tree, CRUD operations, git status
    │   ├── useSettings.js        # Settings state with localStorage persistence
    │   └── useThemeManager.js    # Theme install/uninstall/apply
    │
    ├── styles/                   # Global CSS
    │   ├── animations.css        # Animations (empty - removed)
    │   ├── fonts.css             # Font imports (Pyra, JetBrains, Fira, Cascadia, etc.)
    │   ├── global.css            # Layout CSS (panels, toggles, copilot sidebar)
    │   ├── seti-icons.css        # Seti file icon mappings
    │   └── themes.css            # Theme CSS variables (dark, light, dracula, nord, etc.)
    │
    ├── themes/                   # Theme system
    │   ├── fileIcons.js          # Seti file icon font mappings
    │   ├── modernIcons.js        # Modern file icon SVG mappings
    │   └── themes/               # Theme JSON files
    │       ├── default-dark.kro-theme.json
    │       ├── default-light.kro-theme.json
    │       ├── dracula.kro-theme.json
    │       ├── github.kro-theme.json
    │       ├── iphone-dark.kro-theme.json
    │       ├── iphone-light.kro-theme.json
    │       ├── macos-dark.kro-theme.json
    │       ├── macos-light.kro-theme.json
    │       └── nord.kro-theme.json
    │
    └── types/                    # Type definitions
        ├── ai.js                 # AI model types (OpenAI, Anthropic, Mistral, etc.)
        ├── networking.js         # Network request types
        └── tools.js              # Tool/function call types
```

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tree` | GET | Get file tree structure |
| `/api/file` | GET | Read file content |
| `/api/file` | POST | Create new file |
| `/api/file` | PUT | Save file content |
| `/api/file` | DELETE | Delete file |
| `/api/file/rename` | POST | Rename file |
| `/api/git/status` | GET | Get git status (branch, changed files) |
| `/api/search` | GET | Search files by name |

## Settings Categories

| Category | Description |
|----------|-------------|
| General | Auto save, format on save, confirm delete |
| Appearance | Color theme, icon theme, font size, font family, word wrap, smooth scrolling, mouse wheel zoom, accent color, layout |
| Editor | Cursor style, tab size, font ligatures, minimap, line numbers, render line highlight, multi-cursor modifier, bracket pair colorization |
| Terminal | Shell selection, font, cursor, cursor blink |
| AI Fusion | AI model configuration |
| Copilot | AI copilot settings |
| Breadcrumb | Breadcrumb navigation toggle |
| Status Bar | Status bar visibility and items |
| Keybindings | Keyboard shortcuts viewer |
| Git | Git integration toggle |
| Debug | Debug panel settings |
| Extensions | Extension management |
| Security | Security settings |
| Network | Proxy and connection settings |
| Performance | Hardware acceleration, memory limits |
| Notifications | Notification preferences |
| Language | Display language selection |
| Accessibility | Screen reader, high contrast |
| Workspace | Workspace-specific settings |
| About | App version and info |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+S` | Save File |
| `Ctrl+P` | Quick Open File |
| `Ctrl+`` ` | Toggle Terminal |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+,` | Open Settings |

## State Persistence

All app state is saved to `localStorage` under the `fox-app-state` key:
- Active panel and sidebar states
- Theme selection and installed themes
- Editor settings and preferences
- Open files and active file
- Window layout

## License

MIT

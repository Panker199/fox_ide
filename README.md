# KRO IDE

A VS Code-inspired code editor built with React, Monaco Editor, and Node.js backend.

## Features

- **Monaco Editor** — Full VS Code editing experience with syntax highlighting, IntelliSense, and snippets
- **Real File Explorer** — Browse, create, rename, delete files and folders
- **20+ Themes** — Default Dark/Light, Nord, Dracula, GitHub, iPhone, macOS, and custom Theme Studio
- **Git Integration** — Branch display, changed files list, git status
- **Integrated Terminal** — Terminal emulator with theme-aware styling
- **AI Copilot** — AI chat sidebar for code assistance
- **Command Palette** — Quick access to all commands (Ctrl+Shift+P)
- **Settings Panel** — 20+ configuration categories with search
- **30+ Language Support** — JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, Markdown, and more
- **Code Snippets** — Pre-built snippets for JS/TS, HTML, CSS, Python
- **Theme Studio** — Create, edit, and preview custom themes
- **Debug Panel** — Breakpoint and debug controls
- **Problem & Output Panels** — Error reporting and log output

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Editor | Monaco Editor (local) |
| Backend | Express.js (port 3001) |
| Icons | Lucide React |
| State | React Context + localStorage |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 5173) + backend (port 3001)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/        # React components
    MonacoEditor/    # Monaco editor wrapper with language configs
    ThemeStudio/     # Theme creator and editor
  contexts/          # React contexts (ThemeContext)
  hooks/             # Custom hooks (useFileSystem, useSettings, useCopilot)
  styles/            # Global CSS, themes, fonts, seti-icons
  themes/            # Theme JSON files
  types/             # Type definitions
server.js            # Express backend API
vite.config.js       # Vite configuration with Monaco chunks
```

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tree` | GET | Get file tree |
| `/api/file` | GET | Read file content |
| `/api/file` | POST | Create new file |
| `/api/file` | PUT | Save file content |
| `/api/file` | DELETE | Delete file |
| `/api/file/rename` | POST | Rename file |
| `/api/git/status` | GET | Get git status |
| `/api/search` | GET | Search files |

## License

MIT

import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export const COLOR_THEMES = {
  default: {
    name: 'Default Dark',
    type: 'dark',
    colors: {
      '--bg-primary': '#0d1117',
      '--bg-secondary': '#161b22',
      '--bg-tertiary': '#21262d',
      '--bg-hover': '#30363d',
      '--bg-active': '#1f6feb22',
      '--border': '#30363d',
      '--text-primary': '#e6edf3',
      '--text-secondary': '#8b949e',
      '--text-muted': '#6e7681',
      '--accent': '#58a6ff',
      '--accent-hover': '#79c0ff',
      '--success': '#3fb950',
      '--warning': '#d29922',
      '--error': '#f85149',
      '--info': '#58a6ff',
      '--scrollbar': '#484f58',
      '--scrollbar-hover': '#6e7681',
    }
  },
  'default-light': {
    name: 'Default Light',
    type: 'light',
    colors: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f6f8fa',
      '--bg-tertiary': '#eaeef2',
      '--bg-hover': '#d0d7de',
      '--bg-active': '#0969da22',
      '--border': '#d0d7de',
      '--text-primary': '#1f2328',
      '--text-secondary': '#656d76',
      '--text-muted': '#8c959f',
      '--accent': '#0969da',
      '--accent-hover': '#0550ae',
      '--success': '#1a7f37',
      '--warning': '#9a6700',
      '--error': '#cf222e',
      '--info': '#0969da',
      '--scrollbar': '#afb8c1',
      '--scrollbar-hover': '#8c959f',
    }
  },
  monokai: {
    name: 'Monokai',
    type: 'dark',
    colors: {
      '--bg-primary': '#272822',
      '--bg-secondary': '#3e3d32',
      '--bg-tertiary': '#49483e',
      '--bg-hover': '#555549',
      '--bg-active': '#a6e22e22',
      '--border': '#49483e',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#a6a598',
      '--text-muted': '#75715e',
      '--accent': '#a6e22e',
      '--accent-hover': '#c6e22e',
      '--success': '#a6e22e',
      '--warning': '#e6db74',
      '--error': '#f92672',
      '--info': '#66d9ef',
      '--scrollbar': '#555549',
      '--scrollbar-hover': '#75715e',
    }
  },
  nord: {
    name: 'Nord',
    type: 'dark',
    colors: {
      '--bg-primary': '#2e3440',
      '--bg-secondary': '#3b4252',
      '--bg-tertiary': '#434c5e',
      '--bg-hover': '#4c566a',
      '--bg-active': '#88c0d022',
      '--border': '#4c566a',
      '--text-primary': '#eceff4',
      '--text-secondary': '#d8dee9',
      '--text-muted': '#4c566a',
      '--accent': '#88c0d0',
      '--accent-hover': '#8fbcbb',
      '--success': '#a3be8c',
      '--warning': '#ebcb8b',
      '--error': '#bf616a',
      '--info': '#5e81ac',
      '--scrollbar': '#4c566a',
      '--scrollbar-hover': '#d8dee9',
    }
  },
  dracula: {
    name: 'Dracula',
    type: 'dark',
    colors: {
      '--bg-primary': '#282a36',
      '--bg-secondary': '#343746',
      '--bg-tertiary': '#44475a',
      '--bg-hover': '#565869',
      '--bg-active': '#bd93f922',
      '--border': '#44475a',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#cccce0',
      '--text-muted': '#6272a4',
      '--accent': '#bd93f9',
      '--accent-hover': '#caa8ff',
      '--success': '#50fa7b',
      '--warning': '#f1fa8c',
      '--error': '#ff5555',
      '--info': '#8be9fd',
      '--scrollbar': '#44475a',
      '--scrollbar-hover': '#6272a4',
    }
  },
  solarized: {
    name: 'Solarized',
    type: 'dark',
    colors: {
      '--bg-primary': '#002b36',
      '--bg-secondary': '#073642',
      '--bg-tertiary': '#0a3d4c',
      '--bg-hover': '#1a5266',
      '--bg-active': '#2aa19822',
      '--border': '#1a5266',
      '--text-primary': '#fdf6e3',
      '--text-secondary': '#eee8d5',
      '--text-muted': '#586e75',
      '--accent': '#2aa198',
      '--accent-hover': '#42b8a9',
      '--success': '#859900',
      '--warning': '#b58900',
      '--error': '#dc322f',
      '--info': '#268bd2',
      '--scrollbar': '#1a5266',
      '--scrollbar-hover': '#586e75',
    }
  },
  sepia: {
    name: 'Sepia',
    type: 'dark',
    colors: {
      '--bg-primary': '#1e1914',
      '--bg-secondary': '#2a2420',
      '--bg-tertiary': '#352e29',
      '--bg-hover': '#403932',
      '--bg-active': '#c9a56e22',
      '--border': '#403932',
      '--text-primary': '#f5e6d3',
      '--text-secondary': '#c9a56e',
      '--text-muted': '#8b7355',
      '--accent': '#c9a56e',
      '--accent-hover': '#d4b57e',
      '--success': '#8fa870',
      '--warning': '#c9a56e',
      '--error': '#bf6f5f',
      '--info': '#7eaab5',
      '--scrollbar': '#403932',
      '--scrollbar-hover': '#8b7355',
    }
  },
}

export const ICON_THEMES = {
  seti: 'Seti (Default)',
  minimal: 'Minimal',
  none: 'None',
}

export const FONT_FAMILIES = {
  'Ubuntu Mono': 'Ubuntu Mono',
  'JetBrains Mono': 'JetBrains Mono',
  'Fira Code': 'Fira Code',
  'Cascadia Code': 'Cascadia Code',
  'Source Code Pro': 'Source Code Pro',
  'IBM Plex Mono': 'IBM Plex Mono',
}

const DEFAULT_SETTINGS = {
  colorTheme: 'default',
  iconTheme: 'seti',
  font: 'Ubuntu Mono',
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  bracketMatching: true,
  autoSave: false,
  formatOnSave: false,
  showIndentGuides: true,
  cursorBlinking: 'smooth',
  cursorStyle: 'line',
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('fox-theme-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    localStorage.setItem('fox-theme-settings', JSON.stringify(settings))
    applyTheme(settings)
  }, [settings])

  function applyTheme(s) {
    const theme = COLOR_THEMES[s.colorTheme] || COLOR_THEMES.default
    const root = document.documentElement

    root.setAttribute('data-theme', theme.type)
    root.setAttribute('data-color-theme', s.colorTheme)
    root.setAttribute('data-icon-theme', s.iconTheme)

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    root.style.setProperty('--font-mono', `'${s.font}', monospace`)
    root.style.setProperty('--font-sans', `'${s.font}', monospace`)
    root.style.setProperty('--font-size', `${s.fontSize}px`)
    root.style.setProperty('--tab-size', `${s.tabSize}`)
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSetting, COLOR_THEMES, ICON_THEMES, FONT_FAMILIES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

import { useState, useCallback, useRef, useEffect } from 'react'

const SETTINGS_KEY = 'kro-settings'

const defaultSettings = {
  general: {
    autoSave: true,
    formatOnSave: true,
    formatOnPaste: false,
    trimAutoWhitespace: true,
    detectIndentation: true,
    insertSpaces: true,
    tabSize: 4,
    notifications: true,
    sound: true,
    zoomLevel: 1,
    language: 'English'
  },
  appearance: {
    colorTheme: 'default-dark',
    iconTheme: 'seti',
    fontFamily: 'Ubuntu Mono',
    fontSize: 14,
    wordWrap: false,
    smoothScrolling: true,
    mouseWheelZoom: true,
    accentColor: '#0066cc',
    isDarkMode: true
  },
  editor: {
    fontSize: 14,
    fontFamily: 'Ubuntu Mono',
    lineNumbers: true,
    minimap: true,
    bracketMatching: true,
    autoCloseBrackets: true,
    intelliSense: true,
    quickSuggestions: true,
    parameterHints: true,
    tabCompletion: true,
    autoIndent: true,
    renderWhitespace: false,
    showIndentGuides: true,
    highlightActiveLine: true,
    highlightSelectedWord: true,
    codeFolding: true,
    colorizeBracketPairs: true,
    links: true,
    scrollPastEnd: false,
    cursorStyle: 'line',
    cursorBlinking: true,
    renderLineHighlight: 'all',
    multiCursorModifier: 'ctrl'
  },
  terminal: {
    shell: 'powershell',
    fontSize: 14,
    fontFamily: 'Ubuntu Mono',
    cursorStyle: 'block',
    cursorBlinking: true,
    scrollback: 1000,
    bellStyle: 'sound',
    enableBell: true,
    copyOnSelection: false,
    rightClickCopyPaste: true
  },
  git: {
    enabled: true,
    autofetch: true,
    confirmSync: false,
    enableSmartCommit: false,
    decorationsEnabled: true,
    branchSorting: 'asc'
  },
  debug: {
    showInStatusbar: true,
    openExplorerOnBreak: true,
    allowBreakpointsEverywhere: false,
    inlineBreakpointThreshold: 3
  },
  extensions: {
    autoUpdate: true,
    showRecommendations: true,
    ignoreRecommendations: false
  },
  security: {
    telemetry: false,
    experimentalFeatures: false
  },
  accessibility: {
    enabled: true,
    highContrast: false,
    screenReader: true,
    reduceMotion: false,
    focusIndicators: true,
    fontSize: 14,
    announceSelections: true
  },
  workspace: {
    restoreSession: true,
    saveSession: true,
    excludeFiles: false,
    trustEnabled: true,
    autoSaveDelay: 1000,
    hotExit: true
  },
  ai: {
    model: 'gpt-4',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 2048,
    streamResponse: true,
    showTokenCount: true,
    autoSaveChats: true,
    contextLength: 8192
  },
  breadcrumb: {
    enabled: true,
    separator: '›',
    showIcons: true,
    showFiles: true,
    showSymbols: true
  },
  statusBar: {
    enabled: true,
    showLineCol: true,
    showIndentation: true,
    showEncoding: true,
    showEOL: true,
    showLanguage: true,
    showNotifications: true
  },
  fileAssociations: {
    '*.js': 'JavaScript',
    '*.ts': 'TypeScript',
    '*.jsx': 'React',
    '*.tsx': 'React TypeScript',
    '*.py': 'Python',
    '*.json': 'JSON',
    '*.md': 'Markdown',
    '*.css': 'CSS',
    '*.html': 'HTML'
  },
  keybindings: {},
  aiFusion: {
    enabled: true,
    routingLevel: 'auto',
    primaryModel: 'GPT-4o',
    crossVerify: true,
    conflictResolution: true,
    ideVerify: true,
    maxConcurrent: 3
  },
  copilot: {
    enabled: true,
    chatEnabled: true,
    inlineEnabled: true,
    tabAutocomplete: true,
    deepAnalysis: true,
    suggestionDelay: 300,
    showRecent: true
  },
  network: {
    apiBaseUrl: 'https://api.openai.com/v1',
    openaiKey: '',
    anthropicKey: '',
    googleKey: '',
    useProxy: false,
    proxyUrl: '',
    timeout: 30
  },
  performance: {
    hardwareAcceleration: true,
    maxMemory: 2048,
    cacheSize: 250,
    autoSaveDelay: 1000,
    renderBuffer: 10,
    virtualRendering: true
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimeout = useRef(null)
  const saveCount = useRef(0)

  const saveToStorage = useCallback((newSettings) => {
    saveCount.current++
    const currentCount = saveCount.current

    setSaving(true)
    setSaved(false)

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(() => {
      if (currentCount === saveCount.current) {
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
          setSaving(false)
          setSaved(true)

          setTimeout(() => {
            setSaved(false)
          }, 2000)
        } catch (err) {
          console.error('Failed to save settings:', err)
          setSaving(false)
        }
      }
    }, 500)
  }, [])

  const updateSetting = useCallback((section, key, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }
      saveToStorage(newSettings)
      return newSettings
    })
  }, [saveToStorage])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings }
      saveToStorage(merged)
      return merged
    })
  }, [saveToStorage])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    saveToStorage(defaultSettings)
  }, [saveToStorage])

  const getSetting = useCallback((section, key) => {
    if (key) return settings[section]?.[key]
    return settings[section]
  }, [settings])

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current)
      }
    }
  }, [])

  return {
    settings,
    saving,
    saved,
    updateSetting,
    updateSettings,
    resetSettings,
    getSetting,
  }
}

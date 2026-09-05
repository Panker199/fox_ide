import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'fox-installed-themes'
const ACTIVE_THEME_KEY = 'fox-active-theme'

const themeFiles = import.meta.glob('../themes/themes/*.kro-theme.json', { eager: true })

function loadThemesFromDisk() {
  const themes = []
  Object.values(themeFiles).forEach(mod => {
    const data = mod.default || mod
    if (data && data.id && data.colors && data.name) {
      themes.push({ ...data, builtin: true })
    }
  })
  return themes
}

const DISK_THEMES = loadThemesFromDisk()
const DEFAULT_THEME_IDS = ['default-dark', 'default-light']
const BUILTIN_THEME_IDS = [...DEFAULT_THEME_IDS, ...DISK_THEMES.filter(t => !DEFAULT_THEME_IDS.includes(t.id)).map(t => t.id)]

function getAllThemesData() {
  const custom = []

  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('fox-theme-')) {
        const themeId = key.replace('fox-theme-', '')
        if (!BUILTIN_THEME_IDS.includes(themeId)) {
          try {
            const data = JSON.parse(localStorage.getItem(key))
            if (data && data.id && data.colors) {
              custom.push({ ...data, builtin: false })
            }
          } catch {}
        }
      }
    })
  } catch {}

  const all = [...DISK_THEMES, ...custom]
  all.sort((a, b) => {
    const aDefault = DEFAULT_THEME_IDS.includes(a.id)
    const bDefault = DEFAULT_THEME_IDS.includes(b.id)
    if (aDefault && !bDefault) return -1
    if (!aDefault && bDefault) return 1
    return 0
  })
  return all
}

export function applySavedTheme() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('fox-settings') || '{}')
    const savedThemeId = savedSettings?.appearance?.colorTheme || localStorage.getItem(ACTIVE_THEME_KEY) || 'default-dark'
    const isDark = savedSettings?.appearance?.isDarkMode

    const root = document.documentElement

    const builtinThemes = {}
    DISK_THEMES.forEach(t => { builtinThemes[t.id] = t })

    let theme = builtinThemes[savedThemeId]

    if (!theme) {
      const customThemeRaw = localStorage.getItem(`fox-theme-${savedThemeId}`)
      if (customThemeRaw) {
        const customTheme = JSON.parse(customThemeRaw)
        if (customTheme && customTheme.colors) {
          theme = customTheme
        }
      }
    }

    if (!theme) return

    const themeType = isDark !== undefined ? (isDark ? 'dark' : 'light') : (theme.type || 'dark')
    root.setAttribute('data-theme', themeType)
    root.setAttribute('data-color-theme', savedThemeId)

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    const c = theme.colors
    const isLight = themeType === 'light'
    const alias = {
      '--scrollbar-thumb': c['--scrollbar'] || c['--bg-scrollbar'] || (isLight ? '#afb8c1' : '#666'),
      '--scrollbar-thumb-hover': c['--scrollbar-hover'] || c['--bg-scrollbar-hover'] || (isLight ? '#8c959f' : '#888'),
      '--selection-bg': c['--selection'] || (isLight ? 'rgba(9,105,218,0.2)' : 'rgba(0,102,204,0.3)'),
      '--hover-bg': c['--bg-hover'] || (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(128,128,128,0.1)'),
      '--text-tertiary': c['--text-muted'] || (isLight ? '#8c959f' : '#999'),
      '--text-active': c['--text-primary'] || (isLight ? '#1f2328' : '#fff'),
      '--bg-activity': c['--bg-hover'] || c['--bg-tertiary'] || (isLight ? '#f6f8fa' : '#333'),
      '--font-sans': c['--font-sans'] || "'Ubuntu Mono', monospace",
      '--font-mono': c['--font-mono'] || "'Ubuntu Mono', monospace",
      '--radius-sm': c['--radius-sm'] || '4px',
      '--radius-md': c['--radius-md'] || '6px',
      '--radius': c['--radius-md'] || '8px',
      '--active-line-bg': c['--selection'] || (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(128,128,128,0.05)'),
      '--badge-bg': c['--accent'] || (isLight ? '#0969da' : '#0066cc'),
      '--badge-text': c['--text-primary'] || (isLight ? '#ffffff' : '#fff'),
      '--success-bg': c['--success-bg'] || (c['--success'] ? c['--success'] + '22' : (isLight ? '#1a7f3722' : '#3fb95022')),
      '--warning-bg': c['--warning-bg'] || (c['--warning'] ? c['--warning'] + '22' : (isLight ? '#9a670022' : '#d2992222')),
      '--error-bg': c['--error-bg'] || (c['--error'] ? c['--error'] + '22' : (isLight ? '#cf222e22' : '#f8514922')),
      '--info-bg': c['--info-bg'] || (c['--info'] ? c['--info'] + '22' : (isLight ? '#0969da22' : '#58a6ff22')),
      '--k-bg-void': c['--bg-primary'] || (isLight ? '#f8f8fc' : '#0d1117'),
      '--k-bg-deep': c['--bg-primary'] || (isLight ? '#f0f0f6' : '#0d1117'),
      '--k-bg-surface': c['--bg-secondary'] || (isLight ? '#ffffff' : '#161b22'),
      '--k-bg-raised': c['--bg-tertiary'] || (isLight ? '#fafafe' : '#21262d'),
      '--k-bg-float': c['--bg-tertiary'] || (isLight ? '#ffffff' : '#21262d'),
      '--k-bg-input': c['--bg-input'] || c['--bg-primary'] || (isLight ? '#ffffff' : '#0d1117'),
      '--k-border-ghost': c['--border'] || (isLight ? 'rgba(0,0,0,0.04)' : '#30363d'),
      '--k-border-faint': c['--border'] || (isLight ? 'rgba(0,0,0,0.06)' : '#30363d'),
      '--k-border-dim': c['--border'] || (isLight ? 'rgba(0,0,0,0.09)' : '#30363d'),
      '--k-border-soft': c['--border'] || (isLight ? 'rgba(0,0,0,0.12)' : '#30363d'),
      '--k-border-focus': c['--border-focus'] || c['--accent'] || (isLight ? '#0969da' : '#1f6feb'),
      '--k-text-bright': c['--text-primary'] || (isLight ? '#1f2328' : '#e6edf3'),
      '--k-text-normal': c['--text-primary'] || (isLight ? '#1f2328' : '#e6edf3'),
      '--k-text-dim': c['--text-secondary'] || (isLight ? '#656d76' : '#8b949e'),
      '--k-text-ghost': c['--text-muted'] || (isLight ? '#8c959f' : '#484f58'),
      '--k-accent': c['--accent'] || (isLight ? '#0969da' : '#1f6feb'),
      '--k-accent-dim': c['--accent-hover'] || c['--accent'] || (isLight ? '#0550ae' : '#1f6feb'),
      '--k-accent-bright': c['--accent-hover'] || c['--accent'] || (isLight ? '#0550ae' : '#1f6feb'),
      '--k-accent-ghost': (c['--accent'] || (isLight ? '#0969da' : '#1f6feb')) + '18',
      '--k-accent-glow': (c['--accent'] || (isLight ? '#0969da' : '#1f6feb')) + '40',
      '--k-green': c['--success'] || (isLight ? '#1a7f37' : '#3fb950'),
      '--k-amber': c['--warning'] || (isLight ? '#9a6700' : '#d29922'),
      '--k-red': c['--error'] || (isLight ? '#cf222e' : '#f85149'),
    }
    Object.entries(alias).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  } catch {}
}

export function useThemeManager(onThemeChange) {
  const onThemeChangeRef = useRef(onThemeChange)
  onThemeChangeRef.current = onThemeChange

  const [installedThemeIds, setInstalledThemeIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedIds = saved ? JSON.parse(saved) : []
      const merged = [...new Set([...BUILTIN_THEME_IDS, ...savedIds])]
      return merged
    } catch {
      return [...BUILTIN_THEME_IDS]
    }
  })

  const [activeThemeId, setActiveThemeId] = useState(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem('fox-settings') || '{}')
      return savedSettings?.appearance?.colorTheme || localStorage.getItem(ACTIVE_THEME_KEY) || 'default-dark'
    } catch {
      return 'default-dark'
    }
  })

  const [allThemes, setAllThemes] = useState(() => getAllThemesData())
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      const root = document.documentElement
      const theme = allThemes.find(t => t.id === activeThemeId)
      if (theme) {
        root.setAttribute('data-theme', theme.type)
        root.setAttribute('data-color-theme', activeThemeId)
        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(key, value)
        })
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installedThemeIds))
  }, [installedThemeIds])

  const refreshThemes = useCallback(() => {
    setAllThemes(getAllThemesData())
  }, [])

  const applyTheme = useCallback((themeId) => {
    const theme = allThemes.find(t => t.id === themeId)
    if (!theme) return

    const root = document.documentElement
    root.setAttribute('data-theme', theme.type)
    root.setAttribute('data-color-theme', themeId)

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    const c = theme.colors
    const isLight = theme.type === 'light'
    const alias = {
      '--scrollbar-thumb': c['--scrollbar'] || c['--bg-scrollbar'] || (isLight ? '#afb8c1' : '#666'),
      '--scrollbar-thumb-hover': c['--scrollbar-hover'] || c['--bg-scrollbar-hover'] || (isLight ? '#8c959f' : '#888'),
      '--selection-bg': c['--selection'] || (isLight ? 'rgba(9,105,218,0.2)' : 'rgba(0,102,204,0.3)'),
      '--hover-bg': c['--bg-hover'] || (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(128,128,128,0.1)'),
      '--text-tertiary': c['--text-muted'] || (isLight ? '#8c959f' : '#999'),
      '--text-active': c['--text-primary'] || (isLight ? '#1f2328' : '#fff'),
      '--bg-activity': c['--bg-hover'] || c['--bg-tertiary'] || (isLight ? '#f6f8fa' : '#333'),
      '--font-sans': c['--font-sans'] || "'Ubuntu Mono', monospace",
      '--font-mono': c['--font-mono'] || "'Ubuntu Mono', monospace",
      '--radius-sm': c['--radius-sm'] || '4px',
      '--radius-md': c['--radius-md'] || '6px',
      '--radius': c['--radius-md'] || '8px',
      '--active-line-bg': c['--selection'] || (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(128,128,128,0.05)'),
      '--badge-bg': c['--accent'] || (isLight ? '#0969da' : '#0066cc'),
      '--badge-text': c['--text-primary'] || (isLight ? '#ffffff' : '#fff'),
      '--success-bg': c['--success-bg'] || (c['--success'] ? c['--success'] + '22' : (isLight ? '#1a7f3722' : '#3fb95022')),
      '--warning-bg': c['--warning-bg'] || (c['--warning'] ? c['--warning'] + '22' : (isLight ? '#9a670022' : '#d2992222')),
      '--error-bg': c['--error-bg'] || (c['--error'] ? c['--error'] + '22' : (isLight ? '#cf222e22' : '#f8514922')),
      '--info-bg': c['--info-bg'] || (c['--info'] ? c['--info'] + '22' : (isLight ? '#0969da22' : '#58a6ff22')),
      '--k-bg-void': c['--bg-primary'] || (isLight ? '#f8f8fc' : '#0d1117'),
      '--k-bg-deep': c['--bg-primary'] || (isLight ? '#f0f0f6' : '#0d1117'),
      '--k-bg-surface': c['--bg-secondary'] || (isLight ? '#ffffff' : '#161b22'),
      '--k-bg-raised': c['--bg-tertiary'] || (isLight ? '#fafafe' : '#21262d'),
      '--k-bg-float': c['--bg-tertiary'] || (isLight ? '#ffffff' : '#21262d'),
      '--k-bg-input': c['--bg-input'] || c['--bg-primary'] || (isLight ? '#ffffff' : '#0d1117'),
      '--k-border-ghost': c['--border'] || (isLight ? 'rgba(0,0,0,0.04)' : '#30363d'),
      '--k-border-faint': c['--border'] || (isLight ? 'rgba(0,0,0,0.06)' : '#30363d'),
      '--k-border-dim': c['--border'] || (isLight ? 'rgba(0,0,0,0.09)' : '#30363d'),
      '--k-border-soft': c['--border'] || (isLight ? 'rgba(0,0,0,0.12)' : '#30363d'),
      '--k-border-focus': c['--border-focus'] || c['--accent'] || (isLight ? '#0969da' : '#1f6feb'),
      '--k-text-bright': c['--text-primary'] || (isLight ? '#1f2328' : '#e6edf3'),
      '--k-text-normal': c['--text-primary'] || (isLight ? '#1f2328' : '#e6edf3'),
      '--k-text-dim': c['--text-secondary'] || (isLight ? '#656d76' : '#8b949e'),
      '--k-text-ghost': c['--text-muted'] || (isLight ? '#8c959f' : '#484f58'),
      '--k-accent': c['--accent'] || (isLight ? '#0969da' : '#1f6feb'),
      '--k-accent-dim': c['--accent-hover'] || c['--accent'] || (isLight ? '#0550ae' : '#1f6feb'),
      '--k-accent-bright': c['--accent-hover'] || c['--accent'] || (isLight ? '#0550ae' : '#1f6feb'),
      '--k-accent-ghost': (c['--accent'] || (isLight ? '#0969da' : '#1f6feb')) + '18',
      '--k-accent-glow': (c['--accent'] || (isLight ? '#0969da' : '#1f6feb')) + '40',
      '--k-green': c['--success'] || (isLight ? '#1a7f37' : '#3fb950'),
      '--k-amber': c['--warning'] || (isLight ? '#9a6700' : '#d29922'),
      '--k-red': c['--error'] || (isLight ? '#cf222e' : '#f85149'),
    }
    Object.entries(alias).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    setActiveThemeId(themeId)
    localStorage.setItem(ACTIVE_THEME_KEY, themeId)

    if (onThemeChangeRef.current) {
      onThemeChangeRef.current(themeId, theme.type)
    }
  }, [allThemes])

  const installTheme = useCallback((themeData) => {
    if (!themeData || !themeData.id || !themeData.colors || !themeData.name) return false
    if (BUILTIN_THEME_IDS.includes(themeData.id)) return false

    localStorage.setItem(`fox-theme-${themeData.id}`, JSON.stringify(themeData))

    setInstalledThemeIds(prev => {
      if (prev.includes(themeData.id)) return prev
      return [...prev, themeData.id]
    })

    refreshThemes()
    applyTheme(themeData.id)
    return true
  }, [refreshThemes, applyTheme])

  const uninstallTheme = useCallback((themeId) => {
    if (BUILTIN_THEME_IDS.includes(themeId)) return false

    localStorage.removeItem(`fox-theme-${themeId}`)
    setInstalledThemeIds(prev => prev.filter(id => id !== themeId))
    refreshThemes()

    if (activeThemeId === themeId) {
      applyTheme('default-dark')
    }
    return true
  }, [activeThemeId, refreshThemes, applyTheme])

  const importTheme = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result)
          if (!themeData.id || !themeData.colors || !themeData.name) {
            reject(new Error('Invalid theme file. Must have id, name, and colors.'))
            return
          }
          const success = installTheme(themeData)
          resolve(success)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [installTheme])

  const exportTheme = useCallback((themeId) => {
    const theme = allThemes.find(t => t.id === themeId)
    if (!theme) return false

    const data = JSON.stringify(theme, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${theme.id}.kro-theme.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  }, [allThemes])

  const setPreview = useCallback((themeId) => {
    const theme = allThemes.find(t => t.id === themeId)
    if (!theme) return

    const root = document.documentElement
    root.setAttribute('data-theme', theme.type)
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [allThemes])

  const clearPreview = useCallback(() => {
    const theme = allThemes.find(t => t.id === activeThemeId)
    if (!theme) return

    const root = document.documentElement
    root.setAttribute('data-theme', theme.type)
    root.setAttribute('data-color-theme', activeThemeId)
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [activeThemeId, allThemes])

  return {
    installedThemeIds,
    activeThemeId,
    allThemes,
    applyTheme,
    installTheme,
    uninstallTheme,
    importTheme,
    exportTheme,
    setPreview,
    clearPreview,
    refreshThemes,
  }
}

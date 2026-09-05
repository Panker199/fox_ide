import React, { useState, useEffect, useCallback } from 'react'
import {
  Palette,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Wand2,
  Download,
  Upload,
  RefreshCcw,
  Sparkles,
  Sun,
  Moon,
  Zap,
} from 'lucide-react'

const AUTO_THEME_SOURCES = [
  {
    id: 'time',
    name: 'Time-Based',
    icon: Sun,
    description: 'Auto switch dark/light based on time of day',
    getValue: () => {
      const hour = new Date().getHours()
      return hour >= 18 || hour < 6 ? 'dark' : 'light'
    },
  },
  {
    id: 'system',
    name: 'System Theme',
    icon: Zap,
      description: 'Follow system dark/light preference',
    getValue: () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },
  },
]

const THEME_PRESETS = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      '--bg-primary': '#0f0f1a',
      '--bg-secondary': '#1a1a2e',
      '--bg-tertiary': '#16213e',
      '--accent': '#0f3460',
      '--accent-bright': '#533483',
      '--text-primary': '#e6e6e6',
      '--text-secondary': '#a6a6a6',
      '--success': '#00b894',
      '--warning': '#fdcb6e',
      '--error': '#e17055',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      '--bg-primary': '#1a1a2e',
      '--bg-secondary': '#16213e',
      '--bg-tertiary': '#0f3460',
      '--accent': '#e94560',
      '--accent-bright': '#533483',
      '--text-primary': '#eee2dc',
      '--text-secondary': '#bab2b5',
      '--success': '#00b894',
      '--warning': '#fdcb6e',
      '--error': '#e17055',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      '--bg-primary': '#1b2e1b',
      '--bg-secondary': '#2d4a2d',
      '--bg-tertiary': '#3d6b3d',
      '--accent': '#4caf50',
      '--accent-bright': '#81c784',
      '--text-primary': '#e8f5e9',
      '--text-secondary': '#a5d6a7',
      '--success': '#66bb6a',
      '--warning': '#ffca28',
      '--error': '#ef5350',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      '--bg-primary': '#0a192f',
      '--bg-secondary': '#112240',
      '--bg-tertiary': '#1d3557',
      '--accent': '#64ffda',
      '--accent-bright': '#ccd6f6',
      '--text-primary': '#ccd6f6',
      '--text-secondary': '#8892b0',
      '--success': '#64ffda',
      '--warning': '#ffca28',
      '--error': '#ff6b6b',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      '--bg-primary': '#2d1b2e',
      '--bg-secondary': '#4a2c4d',
      '--bg-tertiary': '#6b3a6e',
      '--accent': '#ff6b6b',
      '--accent-bright': '#feca57',
      '--text-primary': '#fff5f5',
      '--text-secondary': '#ffb8b8',
      '--success': '#51cf66',
      '--warning': '#fcc419',
      '--error': '#ff6b6b',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      '--bg-primary': '#2e3440',
      '--bg-secondary': '#3b4252',
      '--bg-tertiary': '#434c5e',
      '--accent': '#88c0d0',
      '--accent-bright': '#81a1c1',
      '--text-primary': '#eceff4',
      '--text-secondary': '#d8dee9',
      '--success': '#a3be8c',
      '--warning': '#ebcb8b',
      '--error': '#bf616a',
    },
  },
]

export default function ThemeLoader({
  colors,
  setColors,
  autoLoad,
  setAutoLoad,
  onPreview,
  onNext,
  onBack,
}) {
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [autoSource, setAutoSource] = useState('time')
  const [autoEnabled, setAutoEnabled] = useState(false)
  const [previewTheme, setPreviewTheme] = useState(null)
  const [customColors, setCustomColors] = useState(colors)

  useEffect(() => {
    if (autoEnabled) {
      const source = AUTO_THEME_SOURCES.find(s => s.id === autoSource)
      if (source) {
        const themeType = source.getValue()
        const matchingPreset = THEME_PRESETS.find(p => {
          const bg = p.colors['--bg-primary'] || ''
          const brightness = getBrightness(bg)
          return themeType === 'dark' ? brightness < 50 : brightness >= 50
        })
        if (matchingPreset) {
          applyPreset(matchingPreset)
        }
      }
    }
  }, [autoEnabled, autoSource])

  const getBrightness = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000
  }

  const applyPreset = (preset) => {
    setSelectedPreset(preset.id)
    setCustomColors(preset.colors)
    setColors(preset.colors)
  }

  const handleColorChange = (key, value) => {
    setCustomColors(prev => ({ ...prev, [key]: value }))
    setColors(prev => ({ ...prev, [key]: value }))
    setSelectedPreset(null)
  }

  const randomizeTheme = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 60 + Math.floor(Math.random() * 30)
    const newColors = {
      '--bg-primary': `hsl(${hue}, ${saturation}%, 8%)`,
      '--bg-secondary': `hsl(${hue}, ${saturation}%, 12%)`,
      '--accent': `hsl(${hue}, ${saturation}%, 60%)`,
    }
    setCustomColors(newColors)
    setColors(newColors)
    setSelectedPreset(null)
  }

  const exportTheme = () => {
    const data = {
      name: 'Custom Theme',
      id: 'custom-theme',
      type: 'dark',
      colors: customColors,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-theme.kro-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tl-loader">
      <div className="tl-header">
        <button className="ts-btn ts-btn-ghost" onClick={onBack}>
          <ChevronLeft size={14} /> Back
        </button>
        <h2>Theme Configuration</h2>
        <button className="ts-btn ts-btn-primary" onClick={onNext}>
          Continue <ChevronRight size={14} />
        </button>
      </div>

      <div className="tl-body">
        <div className="tl-section">
          <h3>
            <Wand2 size={16} />
            Auto Theme
          </h3>
          <div className="tl-auto-options">
            <label className="tl-toggle">
              <input
                type="checkbox"
                checked={autoEnabled}
                onChange={(e) => setAutoEnabled(e.target.checked)}
              />
              <span className="tl-toggle-slider" />
              <span>Enable Auto Theme</span>
            </label>
            {autoEnabled && (
              <div className="tl-auto-sources">
                {AUTO_THEME_SOURCES.map(source => {
                  const Icon = source.icon
                  return (
                    <button
                      key={source.id}
                      className={`tl-source-btn ${autoSource === source.id ? 'active' : ''}`}
                      onClick={() => setAutoSource(source.id)}
                    >
                      <Icon size={14} />
                      <div>
                        <span className="tl-source-name">{source.name}</span>
                        <span className="tl-source-desc">{source.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="tl-section">
          <h3>
            <Palette size={16} />
            Theme Presets
          </h3>
          <div className="tl-presets-grid">
            {THEME_PRESETS.map(preset => (
              <button
                key={preset.id}
                className={`tl-preset-card ${selectedPreset === preset.id ? 'selected' : ''}`}
                onClick={() => applyPreset(preset)}
                onMouseEnter={() => setPreviewTheme(preset)}
                onMouseLeave={() => setPreviewTheme(null)}
              >
                <div className="tl-preset-preview" style={{ background: preset.colors['--bg-primary'] }}>
                  <div className="tl-preset-dots">
                    <span style={{ background: preset.colors['--accent'] }} />
                    <span style={{ background: preset.colors['--success'] || '#3fb950' }} />
                    <span style={{ background: preset.colors['--warning'] || '#d29922' }} />
                  </div>
                  <div className="tl-preset-lines">
                    <div style={{ background: preset.colors['--accent'] + '60' }} />
                    <div style={{ background: (preset.colors['--text-primary'] || '#fff') + '20' }} />
                  </div>
                </div>
                <span className="tl-preset-name">{preset.name}</span>
                {selectedPreset === preset.id && (
                  <div className="tl-preset-check"><Check size={12} /></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="tl-section">
          <div className="tl-section-header">
            <h3>
              <Palette size={16} />
              Custom Colors
            </h3>
            <div className="tl-section-actions">
              <button className="ts-btn ts-btn-ghost" onClick={randomizeTheme}>
                <Sparkles size={14} /> Randomize
              </button>
              <button className="ts-btn ts-btn-ghost" onClick={exportTheme}>
                <Download size={14} /> Export
              </button>
            </div>
          </div>
          <div className="tl-color-grid">
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key} className="tl-color-item">
                <label>{key.replace('--', '')}</label>
                <div className="tl-color-input">
                  <input
                    type="color"
                    value={value.startsWith('#') ? value : '#000000'}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

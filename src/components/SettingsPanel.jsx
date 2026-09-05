import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Settings,
  Palette,
  Code2,
  Search,
  Keyboard,
  Shield,
  Bell,
  Globe,
  Sun,
  Moon,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Save,
  Terminal,
  GitBranch,
  Bug,
  Puzzle,
  Monitor,
  FileText,
  Zap,
  Eye,
  Pipette,
  Type,
  Layout,
  Mouse,
  Scroll,
  Columns,
  Rows,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  HardDrive,
  SaveAll,
  FileCode,
  Clipboard,
  Eraser,
  Hash,
  AlignLeft,
  WrapText,
  Highlighter,
  Braces,
  Link,
  ArrowUpDown,
  List,
  Target,
  GitCommit,
  GitMerge,
  GitPullRequest,
  RefreshCw,
  Wifi,
  WifiOff,
  Smartphone,
  MonitorSpeaker,
  Accessibility,
  Contrast,
  Ear,
  Hand,
  Focus,
  UnfoldHorizontal,
  TextCursorInput,
  CornerDownRight,
  Scissors,
  Copy,
  Trash2,
  MoreHorizontal,
  Settings2,
  Wrench,
  Cog,
  Sliders,
  SlidersHorizontal,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Database,
  Server,
  Cloud,
  CloudOff,
  RotateCw,
  History,
  Clock,
  Calendar,
  Timer,
  Hourglass,
  ZapOff,
  Lightbulb,
  Flame,
  Droplet,
  Wind,
  Snowflake,
  Leaf,
  TreePine,
  Mountain,
  Globe2,
  Map,
  Compass,
  Navigation,
  MapPin,
  Satellite,
  Radar,
  FlaskConical,
  FolderSearch,
  RefreshCcw,
  PaintBucket,
  Download,
  Upload,
  Plus,
  Star,
  Sparkles,
  Package,
  Cpu,
  CircuitBoard,
  Gauge,
  Network,
  Info,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Send,
  Bot,
  Workflow,
  Layers,
  Boxes,
  Blend,
  Atom,
  Binary,
  BrainCircuit,
  ScanLine,
  Shell
} from 'lucide-react'
import { useThemeManager } from '../hooks/useThemeManager'
import { useSettings } from '../hooks/useSettings'
import { SaveIndicator } from './Spinner'
import './SettingsPanel.css'

import defaultDarkPreview from '../assets/theme-previews/default-dark.svg?url'
import defaultLightPreview from '../assets/theme-previews/default-light.svg?url'
import iphoneDarkPreview from '../assets/theme-previews/iphone-dark.svg?url'
import iphoneLightPreview from '../assets/theme-previews/iphone-light.svg?url'
import macosDarkPreview from '../assets/theme-previews/macos-dark.svg?url'
import macosLightPreview from '../assets/theme-previews/macos-light.svg?url'
import nordPreview from '../assets/theme-previews/nord.svg?url'
import draculaPreview from '../assets/theme-previews/dracula.svg?url'
import githubPreview from '../assets/theme-previews/github.svg?url'

const themePreviews = {
  'default-dark': defaultDarkPreview,
  'default-light': defaultLightPreview,
  'iphone-dark': iphoneDarkPreview,
  'iphone-light': iphoneLightPreview,
  'macos-dark': macosDarkPreview,
  'macos-light': macosLightPreview,
  'nord': nordPreview,
  'dracula': draculaPreview,
  'github': githubPreview,
}

const settingsSections = [
  { id: 'general', icon: Settings, label: 'General' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'editor', icon: Code2, label: 'Editor' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'aifusion', icon: BrainCircuit, label: 'AI Fusion' },
  { id: 'copilot', icon: Bot, label: 'Copilot' },
  { id: 'breadcrumb', icon: ChevronRight, label: 'Breadcrumb' },
  { id: 'statusbar', icon: BarChart3, label: 'Status Bar' },
  { id: 'keybindings', icon: Keyboard, label: 'Keybindings' },
  { id: 'git', icon: GitBranch, label: 'Git' },
  { id: 'debug', icon: Bug, label: 'Debug' },
  { id: 'extensions', icon: Puzzle, label: 'Extensions' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'network', icon: Network, label: 'Network' },
  { id: 'performance', icon: Gauge, label: 'Performance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'language', icon: Globe, label: 'Language' },
  { id: 'accessibility', icon: Eye, label: 'Accessibility' },
  { id: 'workspace', icon: Layout, label: 'Workspace' },
  { id: 'about', icon: Info, label: 'About' },
]

const fontSizes = [10, 11, 12, 13, 14, 15, 16, 18, 20]
const fontFamilies = [
  'Ubuntu Mono',
  'JetBrains Mono',
  'Fira Code',
  'Cascadia Code',
  'Source Code Pro',
  'IBM Plex Mono'
]
const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Korean']
const tabSizes = [2, 4, 8]
const cursorStyles = ['Line', 'Block', 'Underline']
const scrollSnapOptions = ['None', 'Top', 'Center', 'Bottom']

function Slider({ label, value, min, max, step = 1, unit = '', onChange }) {
  const numVal = typeof value === 'number' && !isNaN(value) ? value : min
  return (
    <div className="slider-setting">
      {label && (
        <div className="slider-header">
          <span className="slider-label">{label}</span>
        </div>
      )}
      <div className="settings-slider-row">
        <input
          type="range"
          className="settings-slider"
          min={min}
          max={max}
          step={step}
          value={numVal}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <span className="settings-slider-val">{numVal}{unit}</span>
      </div>
    </div>
  )
}

function Dropdown({ label, value, options, onChange }) {
  const normalizedOptions = options.map((opt, i) => {
    const val = typeof opt === 'object' ? (opt.value ?? i) : opt
    const lbl = typeof opt === 'object' ? (opt.label ?? val) : opt
    return {
      val: String(val ?? i),
      lbl: String(lbl ?? val ?? i),
    }
  })
  const isObject = value != null && typeof value === 'object'
  const safeValue = isObject ? '' : (value != null && value !== '' ? String(value) : (normalizedOptions[0]?.val ?? ''))
  return (
    <div className="dropdown-setting">
      {label && <label className="dropdown-label">{label}</label>}
      <select
        className="settings-select"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {normalizedOptions.map((opt) => (
          <option key={opt.val} value={opt.val}>
            {opt.lbl}
          </option>
        ))}
      </select>
    </div>
  )
}

function SettingsPanel({ onBack, onNavigate }) {
  const [activeSection, setActiveSection] = useState('general')
  const [navSearch, setNavSearch] = useState('')
  const { settings, saving, saved, updateSetting, updateSettings, resetSettings, getSetting } = useSettings()

  const handleThemeChange = useCallback((themeId, themeType) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        colorTheme: themeId,
        isDarkMode: themeType === 'dark'
      }
    })
  }, [updateSettings, settings.appearance])

  const {
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
  } = useThemeManager(handleThemeChange)

  const fileInputRef = useRef(null)
  const iconPackInputRef = useRef(null)

  useEffect(() => {
    const accent = settings.appearance?.accentColor
    if (!accent) return
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--k-accent', accent)
    root.style.setProperty('--border-focus', accent)
    root.style.setProperty('--bg-active', accent + '22')
    root.style.setProperty('--accent-bg', accent + '22')
    root.style.setProperty('--accent-hover', accent + 'cc')
  }, [settings.appearance?.accentColor])

  const isDarkMode = settings.appearance?.isDarkMode ?? true
  const colorTheme = settings.appearance?.colorTheme ?? 'default-dark'

  const setIsDarkMode = (val) => updateSetting('appearance', 'isDarkMode', val)

  const renderGeneralSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">General</h2>
        <p className="settings-hero-desc">Configure general IDE behavior and file handling preferences.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings (e.g. 'auto save')" />
      </div>
      
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <HardDrive size={16} className="setting-icon" />
              <span className="setting-label">Auto Save</span>
            </div>
            <span className="setting-desc">Automatically save files after delay</span>
          </div>
          <button
            className={`toggle ${settings.general?.autoSave ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'autoSave', !settings.general?.autoSave)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <SaveAll size={16} className="setting-icon" />
              <span className="setting-label">Format On Save</span>
            </div>
            <span className="setting-desc">Format code automatically on save</span>
          </div>
          <button
            className={`toggle ${settings.general?.formatOnSave ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'formatOnSave', !settings.general?.formatOnSave)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Clipboard size={16} className="setting-icon" />
              <span className="setting-label">Format On Paste</span>
            </div>
            <span className="setting-desc">Format code automatically on paste</span>
          </div>
          <button
            className={`toggle ${settings.general?.formatOnPaste ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'formatOnPaste', !settings.general?.formatOnPaste)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eraser size={16} className="setting-icon" />
              <span className="setting-label">Trim Auto Whitespace</span>
            </div>
            <span className="setting-desc">Remove trailing whitespace on save</span>
          </div>
          <button
            className={`toggle ${settings.general?.trimAutoWhitespace ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'trimAutoWhitespace', !settings.general?.trimAutoWhitespace)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Hash size={16} className="setting-icon" />
              <span className="setting-label">Detect Indentation</span>
            </div>
            <span className="setting-desc">Auto-detect indentation from file</span>
          </div>
          <button
            className={`toggle ${settings.general?.detectIndentation ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'detectIndentation', !settings.general?.detectIndentation)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <CornerDownRight size={16} className="setting-icon" />
              <span className="setting-label">Insert Spaces</span>
            </div>
            <span className="setting-desc">Use spaces instead of tabs</span>
          </div>
          <button
            className={`toggle ${settings.general?.insertSpaces ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'insertSpaces', !settings.general?.insertSpaces)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Bell size={16} className="setting-icon" />
              <span className="setting-label">Notifications</span>
            </div>
            <span className="setting-desc">Enable desktop notifications</span>
          </div>
          <button
            className={`toggle ${settings.general?.notifications ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'notifications', !settings.general?.notifications)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Volume2 size={16} className="setting-icon" />
              <span className="setting-label">Sound</span>
            </div>
            <span className="setting-desc">Play sound for notifications</span>
          </div>
          <button
            className={`toggle ${settings.general?.sound ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'sound', !settings.general?.sound)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <Slider
          label="Tab Size"
          value={settings.general?.tabSize ?? 4}
          min={2}
          max={8}
          step={2}
          onChange={(v) => updateSetting('general', 'tabSize', v)}
        />
      </div>

      <div className="setting-group">
        <Dropdown
          label="Language"
          value={settings.general?.language ?? 'English'}
          options={languages}
          onChange={(v) => updateSetting('general', 'language', v)}
        />
      </div>

      <div className="setting-group">
        <Slider
          label="Zoom Level"
          value={settings.general?.zoomLevel ?? 1.0}
          min={0.5}
          max={2.0}
          step={0.1}
          unit="x"
          onChange={(v) => updateSetting('general', 'zoomLevel', v)}
        />
      </div>

      <div className="setting-group">
        <h4 className="group-label">Reset Settings</h4>
        <button className="reset-btn" onClick={resetSettings}>
          <RotateCcw size={16} />
          Reset to Defaults
        </button>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => {
    const installed = allThemes.filter(t => installedThemeIds.includes(t.id))

    const handleImport = async (e) => {
      const file = e.target.files[0]
      if (file) {
        try {
          await importTheme(file)
        } catch (err) {
          console.error('Failed to import theme:', err)
        }
      }
      e.target.value = ''
    }

    const handleIconPackImport = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const pack = JSON.parse(ev.target.result)
            const id = pack.id || file.name.replace(/\.json$/, '')
            const iconTheme = {
              id,
              name: pack.name || id,
              type: pack.type || 'custom',
              colors: pack.colors || ['#808080', '#606060', '#a0a0a0'],
              icons: pack.icons || {},
            }
            const saved = JSON.parse(localStorage.getItem('fox-custom-icon-themes') || '[]')
            if (!saved.find(t => t.id === id)) {
              saved.push(iconTheme)
              localStorage.setItem('fox-custom-icon-themes', JSON.stringify(saved))
            }
            updateSetting('appearance', 'iconTheme', id)
          } catch (err) {
            console.error('Failed to import icon pack:', err)
          }
        }
        reader.readAsText(file)
      }
      e.target.value = ''
    }

    return (
      <div className="settings-content">
        <div className="settings-hero">
          <h2 className="settings-hero-title">Appearance</h2>
          <p className="settings-hero-desc">Customize the look and feel of your IDE. Choose themes, icons, fonts, and layout.</p>
        </div>
        
        <div className="settings-search-box">
          <Search size={16} />
          <input type="text" placeholder="Search settings (e.g. 'theme', 'font')" />
        </div>

        <div className="setting-group">
          <h4 className="group-label">Color Theme</h4>
          <div className="theme-grid">
            {installed.map(theme => {
              const isActive = activeThemeId === theme.id
              const accent = theme.colors?.['--accent'] || '#58a6ff'
              const bg1 = theme.colors?.['--bg-primary'] || '#1a1a1a'
              const bg2 = theme.colors?.['--bg-secondary'] || '#2a2a2a'
              const txt = theme.colors?.['--text-primary'] || '#ffffff'
              const ok = theme.colors?.['--success'] || '#3fb950'
              const warn = theme.colors?.['--warning'] || '#d29922'

              return (
                <div key={theme.id} className={`theme-card-wrapper ${isActive ? 'active' : ''}`}>
                  <div
                    className="theme-card"
                    onClick={() => applyTheme(theme.id)}
                    onMouseEnter={() => setPreview(theme.id)}
                    onMouseLeave={() => clearPreview()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        applyTheme(theme.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="theme-preview">
                      {themePreviews[theme.id] ? (
                        <img src={themePreviews[theme.id]} alt={theme.name} className="theme-preview-img" />
                      ) : (
                        <>
                          <div className="preview-bar" style={{ background: bg2 }}>
                            <div className="preview-dot" style={{ background: accent }}></div>
                            <div className="preview-dot" style={{ background: ok }}></div>
                            <div className="preview-dot" style={{ background: warn }}></div>
                          </div>
                          <div className="preview-content" style={{ background: bg1 }}>
                            <div className="preview-line" style={{ background: accent + '60' }}></div>
                            <div className="preview-line short" style={{ background: txt + '30' }}></div>
                            <div className="preview-line" style={{ background: ok + '40' }}></div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="theme-card-info">
                      <span className="theme-name">{theme.name}</span>
                      <span className="theme-type">{theme.type}</span>
                    </div>
                    {isActive ? (
                      <span className="theme-active-badge"><Check size={10} /> Active</span>
                    ) : (
                      <button
                        className="theme-apply-btn"
                        onClick={(e) => { e.stopPropagation(); applyTheme(theme.id) }}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  <div className="theme-card-actions">
                    <button
                      className="theme-export-btn"
                      onClick={(e) => { e.stopPropagation(); exportTheme(theme.id) }}
                      title="Export Theme"
                    >
                      <Download size={12} />
                    </button>
                    {!theme.builtin && (
                      <button
                        className="theme-delete-btn"
                        onClick={(e) => { e.stopPropagation(); uninstallTheme(theme.id) }}
                        title="Uninstall Theme"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            <button
              className="theme-card-add"
              onClick={() => fileInputRef.current?.click()}
              title="Import Theme"
            >
              <Plus size={24} />
              <span>Add Theme</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.kro-theme.json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="setting-group">
          <h4 className="group-label">File Icon Theme</h4>
          <div className="icon-theme-grid">
            {[
              { id: 'seti', name: 'Seti (Default)', type: 'colorful', colors: ['#e8d44d', '#519aba', '#4ec9b0'] },
              { id: 'modern', name: 'Modern', type: 'minimal', colors: ['#6d8086', '#519aba', '#c586c0'] },
              { id: 'minimal', name: 'Minimal', type: 'mono', colors: ['#808080', '#a0a0a0', '#606060'] },
              { id: 'none', name: 'None', type: 'none', colors: ['#404040', '#303030', '#505050'] }
            ].map(theme => (
              <div
                key={theme.id}
                className={`icon-theme-card ${settings.appearance?.iconTheme === theme.id ? 'active' : ''}`}
                onClick={() => updateSetting('appearance', 'iconTheme', theme.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    updateSetting('appearance', 'iconTheme', theme.id)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="icon-theme-preview-box">
                  <div className="preview-bar" style={{ background: '#2a2a2a' }}>
                    {theme.colors.map((c, i) => (
                      <div key={i} className="preview-dot" style={{ background: c }}></div>
                    ))}
                  </div>
                  <div className="preview-content" style={{ background: '#1a1a1a' }}>
                    {theme.id === 'seti' && (
                      <div className="icon-theme-seti-preview">
                        {['javascript', 'typescript', 'react', 'python'].map(icon => (
                          <span key={icon} className="seti-icon" data-icon={icon} style={{ fontSize: '14px' }} />
                        ))}
                      </div>
                    )}
                    {theme.id === 'modern' && (
                      <div className="icon-theme-modern-preview">
                        {['javascript', 'typescript', 'react', 'python'].map(icon => (
                          <img
                            key={icon}
                            src={`/src/assets/icons/fileicons/theme-modern-icons/fileicons/images/${icon === 'react' ? 'react' : icon}.svg`}
                            alt={icon}
                            className="modern-icon-preview"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ))}
                      </div>
                    )}
                    {theme.id === 'minimal' && (
                      <div className="icon-theme-minimal-preview">
                        {['JS', 'TS', 'JX', 'PY'].map((label, i) => (
                          <span key={i} className="minimal-icon-preview">{label}</span>
                        ))}
                      </div>
                    )}
                    {theme.id === 'none' && (
                      <div className="icon-theme-none-preview">
                        {Array(4).fill(0).map((_, i) => (
                          <span key={i} className="none-icon-preview">-</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="theme-card-info">
                  <span className="theme-name">{theme.name}</span>
                  <span className="theme-type">{theme.type}</span>
                </div>
                {settings.appearance?.iconTheme === theme.id ? (
                  <span className="theme-active-badge"><Check size={10} /> Active</span>
                ) : (
                  <button
                    className="theme-apply-btn"
                    onClick={(e) => { e.stopPropagation(); updateSetting('appearance', 'iconTheme', theme.id) }}
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
            <button className="theme-card-add" title="Import File Icon Pack" onClick={() => iconPackInputRef.current?.click()}>
              <Plus size={24} />
              <span>Add File Icon Pack</span>
            </button>
            <input
              ref={iconPackInputRef}
              type="file"
              accept=".json"
              onChange={handleIconPackImport}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="setting-group">
          <Slider
            label="Font Size"
            value={settings.appearance?.fontSize ?? 14}
            min={10}
            max={24}
            step={1}
            unit="px"
            onChange={(v) => updateSetting('appearance', 'fontSize', v)}
          />
        </div>

        <div className="setting-group">
          <Dropdown
            label="Font Family"
            value={settings.appearance?.fontFamily ?? 'JetBrains Mono'}
            options={fontFamilies}
            onChange={(v) => updateSetting('appearance', 'fontFamily', v)}
          />
        </div>

        <div className="setting-group">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label-row">
                <WrapText size={16} className="setting-icon" />
                <span className="setting-label">Word Wrap</span>
              </div>
              <span className="setting-desc">Wrap long lines to fit the editor width</span>
            </div>
            <button
              className={`toggle ${settings.appearance?.wordWrap ? 'active' : ''}`}
              onClick={() => updateSetting('appearance', 'wordWrap', !settings.appearance?.wordWrap)}
            >
              <span className="toggle-knob"></span>
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label-row">
                <Scroll size={16} className="setting-icon" />
                <span className="setting-label">Smooth Scrolling</span>
              </div>
              <span className="setting-desc">Enable smooth scrolling animation</span>
            </div>
            <button
              className={`toggle ${settings.appearance?.smoothScrolling ? 'active' : ''}`}
              onClick={() => updateSetting('appearance', 'smoothScrolling', !settings.appearance?.smoothScrolling)}
            >
              <span className="toggle-knob"></span>
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label-row">
                <Mouse size={16} className="setting-icon" />
                <span className="setting-label">Mouse Wheel Zoom</span>
              </div>
              <span className="setting-desc">Zoom with Ctrl + Mouse Wheel</span>
            </div>
            <button
              className={`toggle ${settings.appearance?.mouseWheelZoom ? 'active' : ''}`}
              onClick={() => updateSetting('appearance', 'mouseWheelZoom', !settings.appearance?.mouseWheelZoom)}
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
        </div>

        <div className="setting-group">
          <h4 className="group-label">Accent Color</h4>
          <div className="color-picker-grid">
            {[
              '#0066cc', '#00a651', '#ff6600', '#cc0066',
              '#6633cc', '#009999', '#e63946', '#2ec4b6',
              '#ff006e', '#8338ec', '#3a86ff', '#fb5607'
            ].map(color => (
              <button
                key={color}
                className={`color-swatch ${settings.appearance?.accentColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => updateSetting('appearance', 'accentColor', color)}
              />
            ))}
            <div className="color-wheel-wrap">
              <button
                className="color-wheel-btn"
                onClick={() => document.getElementById('accent-color-input').click()}
                title="Custom Color"
              >
                <Pipette size={14} />
              </button>
              <input
                id="accent-color-input"
                type="color"
                className="color-wheel-input"
                value={settings.appearance?.accentColor || '#0066cc'}
                onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
              />
              <span className="color-wheel-label">Custom</span>
            </div>
          </div>
        </div>

        <div className="setting-group">
          <h4 className="group-label">Layout</h4>
          <div className="layout-grid">
            {[
              { id: 'default', name: 'Default', icon: '[]', desc: 'Sidebar left, panel bottom' },
              { id: 'centered', name: 'Centered', icon: '>[<', desc: 'Centered editor, minimal UI' },
              { id: 'wide', name: 'Wide', icon: '[  ]', desc: 'Full width editor' },
              { id: 'compact', name: 'Compact', icon: '<>', desc: 'Collapsed panels, more code' },
              { id: 'split', name: 'Split', icon: '| |', desc: 'Side by side editors' },
              { id: 'zen', name: 'Zen', icon: '~', desc: 'Distraction free coding' },
            ].map(layout => (
              <button
                key={layout.id}
                className={`layout-card ${(settings.appearance?.layout ?? 'default') === layout.id ? 'active' : ''}`}
                onClick={() => updateSetting('appearance', 'layout', layout.id)}
              >
                <span className="layout-icon">{layout.icon}</span>
                <span className="layout-name">{layout.name}</span>
                <span className="layout-desc">{layout.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderEditorSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Editor</h2>
        <p className="settings-hero-desc">Configure editor behavior, cursor, font, indentation, and code editing features.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings (e.g. 'font size', 'tab')" />
      </div>
      
      <div className="setting-group">
        <h4 className="group-label">Cursor</h4>
        <div className="option-list">
          {cursorStyles.map(style => (
            <button
              key={style}
              className={`option-item ${settings.editor?.cursorStyle === style ? 'active' : ''}`}
              onClick={() => updateSetting('editor', 'cursorStyle', style)}
            >
              <span>{style}</span>
              {settings.editor?.cursorStyle === style && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <TextCursorInput size={16} className="setting-icon" />
              <span className="setting-label">Cursor Blinking</span>
            </div>
            <span className="setting-desc">Enable cursor blinking animation</span>
          </div>
          <button
            className={`toggle ${settings.editor?.cursorBlinking ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'cursorBlinking', !settings.editor?.cursorBlinking)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <List size={16} className="setting-icon" />
              <span className="setting-label">Line Numbers</span>
            </div>
            <span className="setting-desc">Show line numbers in the gutter</span>
          </div>
          <button
            className={`toggle ${settings.editor?.lineNumbers ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'lineNumbers', !settings.editor?.lineNumbers)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Minimap</span>
            </div>
            <span className="setting-desc">Show code overview minimap</span>
          </div>
          <button
            className={`toggle ${settings.editor?.minimap ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'minimap', !settings.editor?.minimap)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Braces size={16} className="setting-icon" />
              <span className="setting-label">Bracket Matching</span>
            </div>
            <span className="setting-desc">Highlight matching brackets</span>
          </div>
          <button
            className={`toggle ${settings.editor?.bracketMatching ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'bracketMatching', !settings.editor?.bracketMatching)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Code2 size={16} className="setting-icon" />
              <span className="setting-label">Auto Close Brackets</span>
            </div>
            <span className="setting-desc">Automatically close brackets and quotes</span>
          </div>
          <button
            className={`toggle ${settings.editor?.autoCloseBrackets ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'autoCloseBrackets', !settings.editor?.autoCloseBrackets)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Zap size={16} className="setting-icon" />
              <span className="setting-label">IntelliSense</span>
            </div>
            <span className="setting-desc">Show code suggestions and completions</span>
          </div>
          <button
            className={`toggle ${settings.editor?.intelliSense ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'intelliSense', !settings.editor?.intelliSense)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Zap size={16} className="setting-icon" />
              <span className="setting-label">Quick Suggestions</span>
            </div>
            <span className="setting-desc">Show suggestions while typing</span>
          </div>
          <button
            className={`toggle ${settings.editor?.quickSuggestions ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'quickSuggestions', !settings.editor?.quickSuggestions)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Type size={16} className="setting-icon" />
              <span className="setting-label">Parameter Hints</span>
            </div>
            <span className="setting-desc">Show function parameter hints</span>
          </div>
          <button
            className={`toggle ${settings.editor?.parameterHints ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'parameterHints', !settings.editor?.parameterHints)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Keyboard size={16} className="setting-icon" />
              <span className="setting-label">Tab Completion</span>
            </div>
            <span className="setting-desc">Enable tab completion</span>
          </div>
          <button
            className={`toggle ${settings.editor?.tabCompletion ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'tabCompletion', !settings.editor?.tabCompletion)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <AlignLeft size={16} className="setting-icon" />
              <span className="setting-label">Auto Indent</span>
            </div>
            <span className="setting-desc">Auto-indent new lines</span>
          </div>
          <button
            className={`toggle ${settings.editor?.autoIndent ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'autoIndent', !settings.editor?.autoIndent)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Render Whitespace</span>
            </div>
            <span className="setting-desc">Show whitespace characters</span>
          </div>
          <button
            className={`toggle ${settings.editor?.renderWhitespace ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'renderWhitespace', !settings.editor?.renderWhitespace)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Columns size={16} className="setting-icon" />
              <span className="setting-label">Show Indent Guides</span>
            </div>
            <span className="setting-desc">Show indentation guidelines</span>
          </div>
          <button
            className={`toggle ${settings.editor?.showIndentGuides ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'showIndentGuides', !settings.editor?.showIndentGuides)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Highlighter size={16} className="setting-icon" />
              <span className="setting-label">Highlight Active Line</span>
            </div>
            <span className="setting-desc">Highlight the current line</span>
          </div>
          <button
            className={`toggle ${settings.editor?.highlightActiveLine ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'highlightActiveLine', !settings.editor?.highlightActiveLine)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Highlighter size={16} className="setting-icon" />
              <span className="setting-label">Highlight Selected Word</span>
            </div>
            <span className="setting-desc">Highlight all occurrences of selected word</span>
          </div>
          <button
            className={`toggle ${settings.editor?.highlightSelectedWord ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'highlightSelectedWord', !settings.editor?.highlightSelectedWord)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <UnfoldHorizontal size={16} className="setting-icon" />
              <span className="setting-label">Code Folding</span>
            </div>
            <span className="setting-desc">Enable code folding</span>
          </div>
          <button
            className={`toggle ${settings.editor?.codeFolding ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'codeFolding', !settings.editor?.codeFolding)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Braces size={16} className="setting-icon" />
              <span className="setting-label">Colorize Bracket Pairs</span>
            </div>
            <span className="setting-desc">Colorize matching bracket pairs</span>
          </div>
          <button
            className={`toggle ${settings.editor?.colorizeBracketPairs ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'colorizeBracketPairs', !settings.editor?.colorizeBracketPairs)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Link size={16} className="setting-icon" />
              <span className="setting-label">Links</span>
            </div>
            <span className="setting-desc">Enable clickable links in editor</span>
          </div>
          <button
            className={`toggle ${settings.editor?.links ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'links', !settings.editor?.links)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <ArrowUpDown size={16} className="setting-icon" />
              <span className="setting-label">Scroll Past End</span>
            </div>
            <span className="setting-desc">Allow scrolling past the end of file</span>
          </div>
          <button
            className={`toggle ${settings.editor?.scrollPastEnd ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'scrollPastEnd', !settings.editor?.scrollPastEnd)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <h4 className="group-label">Render Line Highlight</h4>
        <div className="option-list">
          {['none', 'gutter', 'line', 'all'].map(mode => (
            <button
              key={mode}
              className={`option-item ${settings.editor?.renderLineHighlight === mode ? 'active' : ''}`}
              onClick={() => updateSetting('editor', 'renderLineHighlight', mode)}
            >
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              {settings.editor?.renderLineHighlight === mode && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <h4 className="group-label">Multi Cursor Modifier</h4>
        <div className="option-list">
          {['ctrl', 'alt'].map(mod => (
            <button
              key={mod}
              className={`option-item ${settings.editor?.multiCursorModifier === mod ? 'active' : ''}`}
              onClick={() => updateSetting('editor', 'multiCursorModifier', mod)}
            >
              <span>{mod.toUpperCase()}</span>
              {settings.editor?.multiCursorModifier === mod && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Code2 size={16} className="setting-icon" />
              <span className="setting-label">Font Ligatures</span>
            </div>
            <span className="setting-desc">Enable programming ligatures (e.g. !=, {">="})</span>
          </div>
          <button
            className={`toggle ${settings.editor?.fontLigatures ? 'active' : ''}`}
            onClick={() => updateSetting('editor', 'fontLigatures', !settings.editor?.fontLigatures)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Type size={16} className="setting-icon" />
              <span className="setting-label">Font Weight</span>
            </div>
            <span className="setting-desc">Set editor font weight</span>
          </div>
          <Dropdown
            label=""
            value={settings.editor?.fontWeight ?? 400}
            options={[
              { value: 300, label: '300 - Light' },
              { value: 400, label: '400 - Regular' },
              { value: 500, label: '500 - Medium' },
              { value: 600, label: '600 - Semi Bold' },
              { value: 700, label: '700 - Bold' }
            ]}
            onChange={(v) => updateSetting('editor', 'fontWeight', parseInt(v))}
          />
        </div>
      </div>

      <div className="setting-group">
        <Slider
          label="Line Height"
          value={settings.editor?.lineHeight ?? 1.5}
          min={1.0}
          max={2.5}
          step={0.1}
          onChange={(v) => updateSetting('editor', 'lineHeight', v)}
        />
      </div>

      <div className="setting-group">
        <Slider
          label="Letter Spacing"
          value={settings.editor?.letterSpacing ?? 0}
          min={-2}
          max={4}
          step={0.5}
          unit="px"
          onChange={(v) => updateSetting('editor', 'letterSpacing', v)}
        />
      </div>
    </div>
  )

  const renderTerminalSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Terminal</h2>
        <p className="settings-hero-desc">Configure the integrated terminal shell, font, cursor, and behavior.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings (e.g. 'shell', 'font')" />
      </div>
      
      <div className="setting-group">
        <Dropdown
          label="Shell"
          value={settings.terminal?.shell ?? 'powershell'}
          options={['bash', 'zsh', 'powershell', 'cmd', 'fish']}
          onChange={(v) => updateSetting('terminal', 'shell', v)}
        />
      </div>

      <div className="setting-group">
        <Slider
          label="Font Size"
          value={settings.terminal?.fontSize ?? 14}
          min={10}
          max={24}
          step={1}
          unit="px"
          onChange={(v) => updateSetting('terminal', 'fontSize', v)}
        />
      </div>

      <div className="setting-group">
        <Dropdown
          label="Font Family"
          value={settings.terminal?.fontFamily ?? 'Ubuntu Mono'}
          options={fontFamilies}
          onChange={(v) => updateSetting('terminal', 'fontFamily', v)}
        />
      </div>

      <div className="setting-group">
        <Dropdown
          label="Cursor Style"
          value={settings.terminal?.cursorStyle ?? 'block'}
          options={['block', 'underline', 'line']}
          onChange={(v) => updateSetting('terminal', 'cursorStyle', v)}
        />
      </div>

      <div className="setting-group">
        <Slider
          label="Scrollback Lines"
          value={settings.terminal?.scrollback ?? 1000}
          min={500}
          max={50000}
          step={500}
          onChange={(v) => updateSetting('terminal', 'scrollback', v)}
        />
      </div>

      <div className="setting-group">
        <Dropdown
          label="Bell Style"
          value={settings.terminal?.bellStyle ?? 'none'}
          options={['none', 'sound', 'notification']}
          onChange={(v) => updateSetting('terminal', 'bellStyle', v)}
        />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <TextCursorInput size={16} className="setting-icon" />
              <span className="setting-label">Cursor Blinking</span>
            </div>
            <span className="setting-desc">Enable terminal cursor blinking</span>
          </div>
          <button
            className={`toggle ${settings.terminal?.cursorBlinking ? 'active' : ''}`}
            onClick={() => updateSetting('terminal', 'cursorBlinking', !settings.terminal?.cursorBlinking)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Volume2 size={16} className="setting-icon" />
              <span className="setting-label">Enable Bell</span>
            </div>
            <span className="setting-desc">Enable terminal bell sound</span>
          </div>
          <button
            className={`toggle ${settings.terminal?.enableBell ? 'active' : ''}`}
            onClick={() => updateSetting('terminal', 'enableBell', !settings.terminal?.enableBell)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Copy size={16} className="setting-icon" />
              <span className="setting-label">Copy on Selection</span>
            </div>
            <span className="setting-desc">Copy selected text to clipboard</span>
          </div>
          <button
            className={`toggle ${settings.terminal?.copyOnSelection ? 'active' : ''}`}
            onClick={() => updateSetting('terminal', 'copyOnSelection', !settings.terminal?.copyOnSelection)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Clipboard size={16} className="setting-icon" />
              <span className="setting-label">Right Click Paste</span>
            </div>
            <span className="setting-desc">Paste on right click</span>
          </div>
          <button
            className={`toggle ${settings.terminal?.rightClickCopyPaste ? 'active' : ''}`}
            onClick={() => updateSetting('terminal', 'rightClickCopyPaste', !settings.terminal?.rightClickCopyPaste)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderGitSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Git</h2>
        <p className="settings-hero-desc">Configure Git integration, commit behavior, and version control features.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings (e.g. 'commit', 'branch')" />
      </div>
      
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <GitBranch size={16} className="setting-icon" />
              <span className="setting-label">Enable Git</span>
            </div>
            <span className="setting-desc">Enable Git integration</span>
          </div>
          <button
            className={`toggle ${settings.git?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('git', 'enabled', !settings.git?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <RefreshCw size={16} className="setting-icon" />
              <span className="setting-label">Autofetch</span>
            </div>
            <span className="setting-desc">Auto-fetch from remote repositories</span>
          </div>
          <button
            className={`toggle ${settings.git?.autofetch ? 'active' : ''}`}
            onClick={() => updateSetting('git', 'autofetch', !settings.git?.autofetch)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <RefreshCw size={16} className="setting-icon" />
              <span className="setting-label">Confirm Sync</span>
            </div>
            <span className="setting-desc">Confirm before sync</span>
          </div>
          <button
            className={`toggle ${settings.git?.confirmSync ? 'active' : ''}`}
            onClick={() => updateSetting('git', 'confirmSync', !settings.git?.confirmSync)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <GitCommit size={16} className="setting-icon" />
              <span className="setting-label">Enable Smart Commit</span>
            </div>
            <span className="setting-desc">Auto-stage all changes when committing</span>
          </div>
          <button
            className={`toggle ${settings.git?.enableSmartCommit ? 'active' : ''}`}
            onClick={() => updateSetting('git', 'enableSmartCommit', !settings.git?.enableSmartCommit)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Decorations</span>
            </div>
            <span className="setting-desc">Show Git decorations in sidebar</span>
          </div>
          <button
            className={`toggle ${settings.git?.decorationsEnabled ? 'active' : ''}`}
            onClick={() => updateSetting('git', 'decorationsEnabled', !settings.git?.decorationsEnabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <Dropdown
          label="Branch Sorting"
          value={settings.git?.branchSorting ?? 'asc'}
          options={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' }
          ]}
          onChange={(v) => updateSetting('git', 'branchSorting', v)}
        />
      </div>
    </div>
  )

  const renderDebugSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Debug</h2>
        <p className="settings-hero-desc">Configure debugging options and breakpoints.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>
      
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <BarChart3 size={16} className="setting-icon" />
              <span className="setting-label">Show in Status Bar</span>
            </div>
            <span className="setting-desc">Show debug status in status bar</span>
          </div>
          <button
            className={`toggle ${settings.debug?.showInStatusbar ? 'active' : ''}`}
            onClick={() => updateSetting('debug', 'showInStatusbar', !settings.debug?.showInStatusbar)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Target size={16} className="setting-icon" />
              <span className="setting-label">Open Explorer on Break</span>
            </div>
            <span className="setting-desc">Auto-open explorer on breakpoint</span>
          </div>
          <button
            className={`toggle ${settings.debug?.openExplorerOnBreak ? 'active' : ''}`}
            onClick={() => updateSetting('debug', 'openExplorerOnBreak', !settings.debug?.openExplorerOnBreak)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Bug size={16} className="setting-icon" />
              <span className="setting-label">Allow Breakpoints Everywhere</span>
            </div>
            <span className="setting-desc">Allow breakpoints in any file</span>
          </div>
          <button
            className={`toggle ${settings.debug?.allowBreakpointsEverywhere ? 'active' : ''}`}
            onClick={() => updateSetting('debug', 'allowBreakpointsEverywhere', !settings.debug?.allowBreakpointsEverywhere)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <Slider
          label="Inline Breakpoint Threshold"
          value={settings.debug?.inlineBreakpointThreshold ?? 3}
          min={1}
          max={20}
          step={1}
          onChange={(v) => updateSetting('debug', 'inlineBreakpointThreshold', v)}
        />
      </div>
    </div>
  )

  const renderExtensionsSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Extensions</h2>
        <p className="settings-hero-desc">Manage and configure your installed extensions.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>
      
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <RefreshCw size={16} className="setting-icon" />
              <span className="setting-label">Auto Update</span>
            </div>
            <span className="setting-desc">Auto-update extensions</span>
          </div>
          <button
            className={`toggle ${settings.extensions?.autoUpdate ? 'active' : ''}`}
            onClick={() => updateSetting('extensions', 'autoUpdate', !settings.extensions?.autoUpdate)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Zap size={16} className="setting-icon" />
              <span className="setting-label">Show Recommendations</span>
            </div>
            <span className="setting-desc">Show extension recommendations</span>
          </div>
          <button
            className={`toggle ${settings.extensions?.showRecommendations ? 'active' : ''}`}
            onClick={() => updateSetting('extensions', 'showRecommendations', !settings.extensions?.showRecommendations)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Ignore Recommendations</span>
            </div>
            <span className="setting-desc">Hide extension recommendations</span>
          </div>
          <button
            className={`toggle ${settings.extensions?.ignoreRecommendations ? 'active' : ''}`}
            onClick={() => updateSetting('extensions', 'ignoreRecommendations', !settings.extensions?.ignoreRecommendations)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Security</h2>
        <p className="settings-hero-desc">Configure security settings and permissions.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Activity size={16} className="setting-icon" />
              <span className="setting-label">Telemetry</span>
            </div>
            <span className="setting-desc">Send anonymous usage data</span>
          </div>
          <button
            className={`toggle ${settings.security?.telemetry ? 'active' : ''}`}
            onClick={() => updateSetting('security', 'telemetry', !settings.security?.telemetry)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <FlaskConical size={16} className="setting-icon" />
              <span className="setting-label">Experimental Features</span>
            </div>
            <span className="setting-desc">Enable experimental features</span>
          </div>
          <button
            className={`toggle ${settings.security?.experimentalFeatures ? 'active' : ''}`}
            onClick={() => updateSetting('security', 'experimentalFeatures', !settings.security?.experimentalFeatures)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderNotificationsSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Notifications</h2>
        <p className="settings-hero-desc">Configure notification preferences and alerts.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Bell size={16} className="setting-icon" />
              <span className="setting-label">Show Notifications</span>
            </div>
            <span className="setting-desc">Enable desktop notifications</span>
          </div>
          <button
            className={`toggle ${settings.general?.notifications ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'notifications', !settings.general?.notifications)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Volume2 size={16} className="setting-icon" />
              <span className="setting-label">Sound</span>
            </div>
            <span className="setting-desc">Play sound for notifications</span>
          </div>
          <button
            className={`toggle ${settings.general?.sound ? 'active' : ''}`}
            onClick={() => updateSetting('general', 'sound', !settings.general?.sound)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderLanguageSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Language & Region</h2>
        <p className="settings-hero-desc">Set your preferred display language and regional formats.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <Dropdown
          label="Display Language"
          value={settings.general?.language ?? 'English'}
          options={['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Korean']}
          onChange={(v) => updateSetting('general', 'language', v)}
        />
      </div>
    </div>
  )

  const renderAccessibilitySettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Accessibility</h2>
        <p className="settings-hero-desc">Configure accessibility features for a better experience.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Accessibility size={16} className="setting-icon" />
              <span className="setting-label">Enable Accessibility</span>
            </div>
            <span className="setting-desc">Enable accessibility features</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'enabled', !settings.accessibility?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Contrast size={16} className="setting-icon" />
              <span className="setting-label">High Contrast</span>
            </div>
            <span className="setting-desc">Enable high contrast mode</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.highContrast ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'highContrast', !settings.accessibility?.highContrast)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Ear size={16} className="setting-icon" />
              <span className="setting-label">Screen Reader</span>
            </div>
            <span className="setting-desc">Optimize for screen readers</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.screenReader ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'screenReader', !settings.accessibility?.screenReader)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Wind size={16} className="setting-icon" />
              <span className="setting-label">Reduce Motion</span>
            </div>
            <span className="setting-desc">Reduce animations and motion</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.reduceMotion ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'reduceMotion', !settings.accessibility?.reduceMotion)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Focus size={16} className="setting-icon" />
              <span className="setting-label">Focus Indicators</span>
            </div>
            <span className="setting-desc">Show focus indicators on UI elements</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.focusIndicators ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'focusIndicators', !settings.accessibility?.focusIndicators)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <span className="setting-label">Announce Selections</span>
            </div>
            <span className="setting-desc">Announce text selections to screen reader</span>
          </div>
          <button
            className={`toggle ${settings.accessibility?.announceSelections ? 'active' : ''}`}
            onClick={() => updateSetting('accessibility', 'announceSelections', !settings.accessibility?.announceSelections)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <Slider
          label="Accessibility Font Size"
          value={settings.accessibility?.fontSize ?? 14}
          min={10}
          max={32}
          step={1}
          unit="px"
          onChange={(v) => updateSetting('accessibility', 'fontSize', v)}
        />
      </div>
    </div>
  )

  const renderWorkspaceSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Workspace</h2>
        <p className="settings-hero-desc">Configure workspace-specific settings and folders.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <History size={16} className="setting-icon" />
              <span className="setting-label">Restore Session</span>
            </div>
            <span className="setting-desc">Restore previous session on startup</span>
          </div>
          <button
            className={`toggle ${settings.workspace?.restoreSession ? 'active' : ''}`}
            onClick={() => updateSetting('workspace', 'restoreSession', !settings.workspace?.restoreSession)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Save size={16} className="setting-icon" />
              <span className="setting-label">Save Session</span>
            </div>
            <span className="setting-desc">Auto-save session state</span>
          </div>
          <button
            className={`toggle ${settings.workspace?.saveSession ? 'active' : ''}`}
            onClick={() => updateSetting('workspace', 'saveSession', !settings.workspace?.saveSession)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <FileText size={16} className="setting-icon" />
              <span className="setting-label">Exclude Files</span>
            </div>
            <span className="setting-desc">Files to exclude from workspace</span>
          </div>
          <button
            className={`toggle ${settings.workspace?.excludeFiles ? 'active' : ''}`}
            onClick={() => updateSetting('workspace', 'excludeFiles', !settings.workspace?.excludeFiles)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Lock size={16} className="setting-icon" />
              <span className="setting-label">Hot Exit</span>
            </div>
            <span className="setting-desc">Restore unsaved files when reopening</span>
          </div>
          <button
            className={`toggle ${settings.workspace?.hotExit ? 'active' : ''}`}
            onClick={() => updateSetting('workspace', 'hotExit', !settings.workspace?.hotExit)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
      <div className="setting-group">
        <Slider
          label="Auto Save Delay"
          value={settings.workspace?.autoSaveDelay ?? 1000}
          min={0}
          max={5000}
          step={100}
          unit="ms"
          onChange={(v) => updateSetting('workspace', 'autoSaveDelay', v)}
        />
      </div>
      <div className="setting-group">
        <h4 className="group-label">Workspace Trust</h4>
        <div className="option-list">
          {['enabled', 'disabled'].map(trust => (
            <button
              key={trust}
              className={`option-item ${settings.workspace?.trustEnabled === (trust === 'enabled') ? 'active' : ''}`}
              onClick={() => updateSetting('workspace', 'trustEnabled', trust === 'enabled')}
            >
              <span>{trust.charAt(0).toUpperCase() + trust.slice(1)}</span>
              {settings.workspace?.trustEnabled === (trust === 'enabled') && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderKeybindingsSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Keyboard Shortcuts</h2>
        <p className="settings-hero-desc">View and customize keyboard shortcuts.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="shortcuts-list">
        {[
          { action: 'Save File', keys: 'Ctrl + S' },
          { action: 'Open File', keys: 'Ctrl + O' },
          { action: 'Find', keys: 'Ctrl + F' },
          { action: 'Replace', keys: 'Ctrl + H' },
          { action: 'Toggle Terminal', keys: 'Ctrl + `' },
          { action: 'Toggle Sidebar', keys: 'Ctrl + B' },
          { action: 'Command Palette', keys: 'Ctrl + Shift + P' },
          { action: 'Go to Line', keys: 'Ctrl + G' },
          { action: 'Duplicate Line', keys: 'Ctrl + D' },
          { action: 'Delete Line', keys: 'Ctrl + Shift + K' },
          { action: 'Move Line Up', keys: 'Alt + Arrow Up' },
          { action: 'Move Line Down', keys: 'Alt + Arrow Down' },
          { action: 'Copy Line Up', keys: 'Shift + Alt + Arrow Up' },
          { action: 'Copy Line Down', keys: 'Shift + Alt + Arrow Down' },
          { action: 'Indent Line', keys: 'Tab' },
          { action: 'Outdent Line', keys: 'Shift + Tab' },
          { action: 'Toggle Comment', keys: 'Ctrl + /' },
          { action: 'Toggle Block Comment', keys: 'Shift + Alt + A' },
          { action: 'Select All Occurrences', keys: 'Ctrl + Shift + L' },
          { action: 'Add Selection To Next Find Match', keys: 'Ctrl + D' },
        ].map((shortcut, i) => (
          <div key={i} className="shortcut-item">
            <span className="shortcut-action">{shortcut.action}</span>
            <div className="shortcut-keys">
              {shortcut.keys.split(' + ').map((key, j) => (
                <kbd key={j}>{key}</kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderBreadcrumbSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Breadcrumb</h2>
        <p className="settings-hero-desc">Configure breadcrumb navigation in the editor.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Enable Breadcrumb</span>
            </div>
            <span className="setting-desc">Show breadcrumb navigation above editor</span>
          </div>
          <button
            className={`toggle ${settings.breadcrumb?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('breadcrumb', 'enabled', !settings.breadcrumb?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Icons</span>
            </div>
            <span className="setting-desc">Show file/folder icons in breadcrumb</span>
          </div>
          <button
            className={`toggle ${settings.breadcrumb?.showIcons ? 'active' : ''}`}
            onClick={() => updateSetting('breadcrumb', 'showIcons', !settings.breadcrumb?.showIcons)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Files</span>
            </div>
            <span className="setting-desc">Show file names in breadcrumb</span>
          </div>
          <button
            className={`toggle ${settings.breadcrumb?.showFiles ? 'active' : ''}`}
            onClick={() => updateSetting('breadcrumb', 'showFiles', !settings.breadcrumb?.showFiles)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Code2 size={16} className="setting-icon" />
              <span className="setting-label">Show Symbols</span>
            </div>
            <span className="setting-desc">Show function/class names in breadcrumb</span>
          </div>
          <button
            className={`toggle ${settings.breadcrumb?.showSymbols ? 'active' : ''}`}
            onClick={() => updateSetting('breadcrumb', 'showSymbols', !settings.breadcrumb?.showSymbols)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>

      <div className="setting-group">
        <h4 className="group-label">Separator</h4>
        <div className="option-list">
          {['›', '>', '/', '·', '|'].map(sep => (
            <button
              key={sep}
              className={`option-item ${settings.breadcrumb?.separator === sep ? 'active' : ''}`}
              onClick={() => updateSetting('breadcrumb', 'separator', sep)}
            >
              <span style={{ fontSize: '16px' }}>{sep}</span>
              {settings.breadcrumb?.separator === sep && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStatusBarSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Status Bar</h2>
        <p className="settings-hero-desc">Customize the status bar visibility and items.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Status Bar</span>
            </div>
            <span className="setting-desc">Show the bottom status bar</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'enabled', !settings.statusBar?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Line & Column</span>
            </div>
            <span className="setting-desc">Show cursor position (line:column)</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showLineCol ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showLineCol', !settings.statusBar?.showLineCol)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Indentation</span>
            </div>
            <span className="setting-desc">Show current indentation settings</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showIndentation ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showIndentation', !settings.statusBar?.showIndentation)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Encoding</span>
            </div>
            <span className="setting-desc">Show file encoding (UTF-8)</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showEncoding ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showEncoding', !settings.statusBar?.showEncoding)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show End of Line</span>
            </div>
            <span className="setting-desc">Show line ending style (LF/CRLF)</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showEOL ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showEOL', !settings.statusBar?.showEOL)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Eye size={16} className="setting-icon" />
              <span className="setting-label">Show Language</span>
            </div>
            <span className="setting-desc">Show detected language mode</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showLanguage ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showLanguage', !settings.statusBar?.showLanguage)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Bell size={16} className="setting-icon" />
              <span className="setting-label">Show Notifications</span>
            </div>
            <span className="setting-desc">Show notification icon in status bar</span>
          </div>
          <button
            className={`toggle ${settings.statusBar?.showNotifications ? 'active' : ''}`}
            onClick={() => updateSetting('statusBar', 'showNotifications', !settings.statusBar?.showNotifications)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAIFusionSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">AI Fusion</h2>
        <p className="settings-hero-desc">Configure AI-powered code assistance and suggestions.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Zap size={16} className="setting-icon" />
              <span className="setting-label">Enable AI Fusion</span>
            </div>
            <span className="setting-desc">Use multiple AI models in parallel for better results</span>
          </div>
          <button
            className={`toggle ${settings.aiFusion?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('aiFusion', 'enabled', !settings.aiFusion?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Target size={16} className="setting-icon" />
              <span className="setting-label">Routing Level</span>
            </div>
            <span className="setting-desc">How aggressively to use multi-model verification</span>
          </div>
          <Dropdown
            label=""
            value={settings.aiFusion?.routingLevel || 'auto'}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'instant', label: 'Instant' },
              { value: 'intelligent', label: 'Intelligent' },
              { value: 'multi-ai', label: 'Multi-AI' },
              { value: 'critical', label: 'Critical' }
            ]}
            onChange={(val) => updateSetting('aiFusion', 'routingLevel', val)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Cpu size={16} className="setting-icon" />
              <span className="setting-label">Primary Model</span>
            </div>
            <span className="setting-desc">Main AI model for generation tasks</span>
          </div>
          <select
            className="settings-input settings-select"
            value={settings.aiFusion?.primaryModel || 'GPT-4o'}
            onChange={(e) => updateSetting('aiFusion', 'primaryModel', e.target.value)}
          >
            <optgroup label="OpenAI">
              <option value="GPT-4o">GPT-4o</option>
              <option value="GPT-4o Mini">GPT-4o Mini</option>
              <option value="GPT-4 Turbo">GPT-4 Turbo</option>
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
              <option value="o1">o1</option>
              <option value="o1 Mini">o1 Mini</option>
              <option value="o1 Pro">o1 Pro</option>
              <option value="o3 Mini">o3 Mini</option>
            </optgroup>
            <optgroup label="Anthropic">
              <option value="Claude Opus 4">Claude Opus 4</option>
              <option value="Claude Sonnet 4">Claude Sonnet 4</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Claude 3.5 Haiku">Claude 3.5 Haiku</option>
              <option value="Claude 3 Opus">Claude 3 Opus</option>
              <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
              <option value="Claude 3 Haiku">Claude 3 Haiku</option>
            </optgroup>
            <optgroup label="Google">
              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
              <option value="Gemini 2.0 Flash">Gemini 2.0 Flash</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
              <option value="Gemini 1.0 Pro">Gemini 1.0 Pro</option>
            </optgroup>
            <optgroup label="Meta">
              <option value="Llama 3.1 405B">Llama 3.1 405B</option>
              <option value="Llama 3.1 70B">Llama 3.1 70B</option>
              <option value="Llama 3.1 8B">Llama 3.1 8B</option>
              <option value="Llama 3 70B">Llama 3 70B</option>
              <option value="Llama 3 8B">Llama 3 8B</option>
            </optgroup>
            <optgroup label="DeepSeek">
              <option value="DeepSeek V3">DeepSeek V3</option>
              <option value="DeepSeek Coder V2">DeepSeek Coder V2</option>
              <option value="DeepSeek R1">DeepSeek R1</option>
              <option value="DeepSeek V2.5">DeepSeek V2.5</option>
            </optgroup>
            <optgroup label="Mistral">
              <option value="Mistral Large 2">Mistral Large 2</option>
              <option value="Mistral Medium">Mistral Medium</option>
              <option value="Mistral Small">Mistral Small</option>
              <option value="Mistral Nemo">Mistral Nemo</option>
              <option value="Codestral">Codestral</option>
              <option value="Pixtral Large">Pixtral Large</option>
            </optgroup>
            <optgroup label="Groq">
              <option value="Llama 3.1 405B (Groq)">Llama 3.1 405B</option>
              <option value="Llama 3.1 70B (Groq)">Llama 3.1 70B</option>
              <option value="Llama 3.1 8B (Groq)">Llama 3.1 8B</option>
              <option value="Mixtral 8x7B">Mixtral 8x7B</option>
              <option value="Gemma 2 9B">Gemma 2 9B</option>
            </optgroup>
            <optgroup label="Cohere">
              <option value="Command R+">Command R+</option>
              <option value="Command R">Command R</option>
              <option value="Command">Command</option>
            </optgroup>
            <optgroup label="xAI">
              <option value="Grok 2">Grok 2</option>
              <option value="Grok Beta">Grok Beta</option>
            </optgroup>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Layers size={16} className="setting-icon" />
              <span className="setting-label">Cross-Verification</span>
            </div>
            <span className="setting-desc">Compare responses from multiple models</span>
          </div>
          <button
            className={`toggle ${settings.aiFusion?.crossVerify ? 'active' : ''}`}
            onClick={() => updateSetting('aiFusion', 'crossVerify', !settings.aiFusion?.crossVerify)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Workflow size={16} className="setting-icon" />
              <span className="setting-label">Conflict Resolution</span>
            </div>
            <span className="setting-desc">Auto-resolve disagreements between models</span>
          </div>
          <button
            className={`toggle ${settings.aiFusion?.conflictResolution ? 'active' : ''}`}
            onClick={() => updateSetting('aiFusion', 'conflictResolution', !settings.aiFusion?.conflictResolution)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <ShieldCheck size={16} className="setting-icon" />
              <span className="setting-label">IDE Verification</span>
            </div>
            <span className="setting-desc">Validate code with compiler, linter, and tests</span>
          </div>
          <button
            className={`toggle ${settings.aiFusion?.ideVerify ? 'active' : ''}`}
            onClick={() => updateSetting('aiFusion', 'ideVerify', !settings.aiFusion?.ideVerify)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <Activity size={16} className="setting-icon" />
              <span className="setting-label">Parallel Execution</span>
            </div>
            <span className="setting-desc">Number of models to call simultaneously</span>
          </div>
          <Slider
            label=""
            value={settings.aiFusion?.maxConcurrent ?? 3}
            min={1}
            max={8}
            step={1}
            onChange={(v) => updateSetting('aiFusion', 'maxConcurrent', v)}
          />
        </div>
      </div>
    </div>
  )

  const renderCopilotSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Copilot</h2>
        <p className="settings-hero-desc">Configure GitHub Copilot integration.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Sparkles size={16} className="setting-icon" />
              <span className="setting-label">Enable Copilot</span>
            </div>
            <span className="setting-desc">Enable AI code suggestions and assistance</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.enabled ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'enabled', !settings.copilot?.enabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Key size={16} className="setting-icon" />
              <span className="setting-label">Use API Key</span>
            </div>
            <span className="setting-desc">Authenticate with your own API key</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.useApiKey ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'useApiKey', !settings.copilot?.useApiKey)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        {settings.copilot?.useApiKey && (
          <>
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label-row">
                  <Key size={16} className="setting-icon" />
                  <span className="setting-label">Provider</span>
                </div>
                <span className="setting-desc">Select your AI provider</span>
              </div>
              <Dropdown
                label=""
                value={settings.copilot?.apiKeyProvider || 'OpenAI'}
                options={['OpenAI', 'Anthropic', 'Google', 'Mistral', 'Cohere', 'Groq', 'DeepSeek', 'xAI']}
                onChange={(val) => updateSetting('copilot', 'apiKeyProvider', val)}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label-row">
                  <Lock size={16} className="setting-icon" />
                  <span className="setting-label">API Key</span>
                </div>
                <span className="setting-desc">Your {settings.copilot?.apiKeyProvider || 'OpenAI'} API key</span>
              </div>
              <input
                type="password"
                className="settings-input"
                value={settings.copilot?.apiKey || ''}
                onChange={(e) => updateSetting('copilot', 'apiKey', e.target.value)}
                placeholder={settings.copilot?.apiKeyProvider === 'Anthropic' ? 'sk-ant-...' : settings.copilot?.apiKeyProvider === 'Google' ? 'AIza...' : 'sk-...'}
              />
            </div>
          </>
        )}

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <MessageSquare size={16} className="setting-icon" />
              <span className="setting-label">Chat Panel</span>
            </div>
            <span className="setting-desc">Enable the AI chat sidebar</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.chatEnabled ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'chatEnabled', !settings.copilot?.chatEnabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Code2 size={16} className="setting-icon" />
              <span className="setting-label">Inline Suggestions</span>
            </div>
            <span className="setting-desc">Show code suggestions as you type</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.inlineEnabled ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'inlineEnabled', !settings.copilot?.inlineEnabled)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <ScanLine size={16} className="setting-icon" />
              <span className="setting-label">Tab Autocomplete</span>
            </div>
            <span className="setting-desc">Accept suggestions with Tab key</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.tabAutocomplete ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'tabAutocomplete', !settings.copilot?.tabAutocomplete)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <BrainCircuit size={16} className="setting-icon" />
              <span className="setting-label">Deep Analysis</span>
            </div>
            <span className="setting-desc">Enable deep code analysis and reasoning</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.deepAnalysis ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'deepAnalysis', !settings.copilot?.deepAnalysis)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Cpu size={16} className="setting-icon" />
              <span className="setting-label">Model</span>
            </div>
            <span className="setting-desc">Select the AI model for code generation</span>
          </div>
          <select
            className="settings-input settings-select"
            value={settings.copilot?.selectedModel || 'GPT-4o'}
            onChange={(e) => updateSetting('copilot', 'selectedModel', e.target.value)}
          >
            <optgroup label="OpenAI">
              <option value="GPT-4o">GPT-4o</option>
              <option value="GPT-4o Mini">GPT-4o Mini</option>
              <option value="GPT-4 Turbo">GPT-4 Turbo</option>
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
              <option value="o1">o1</option>
              <option value="o1 Mini">o1 Mini</option>
              <option value="o1 Pro">o1 Pro</option>
              <option value="o3 Mini">o3 Mini</option>
            </optgroup>
            <optgroup label="Anthropic">
              <option value="Claude Opus 4">Claude Opus 4</option>
              <option value="Claude Sonnet 4">Claude Sonnet 4</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Claude 3.5 Haiku">Claude 3.5 Haiku</option>
              <option value="Claude 3 Opus">Claude 3 Opus</option>
              <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
              <option value="Claude 3 Haiku">Claude 3 Haiku</option>
            </optgroup>
            <optgroup label="Google">
              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
              <option value="Gemini 2.0 Flash">Gemini 2.0 Flash</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
              <option value="Gemini 1.0 Pro">Gemini 1.0 Pro</option>
            </optgroup>
            <optgroup label="Meta">
              <option value="Llama 3.1 405B">Llama 3.1 405B</option>
              <option value="Llama 3.1 70B">Llama 3.1 70B</option>
              <option value="Llama 3.1 8B">Llama 3.1 8B</option>
              <option value="Llama 3 70B">Llama 3 70B</option>
              <option value="Llama 3 8B">Llama 3 8B</option>
            </optgroup>
            <optgroup label="DeepSeek">
              <option value="DeepSeek V3">DeepSeek V3</option>
              <option value="DeepSeek Coder V2">DeepSeek Coder V2</option>
              <option value="DeepSeek R1">DeepSeek R1</option>
              <option value="DeepSeek V2.5">DeepSeek V2.5</option>
            </optgroup>
            <optgroup label="Mistral">
              <option value="Mistral Large 2">Mistral Large 2</option>
              <option value="Mistral Medium">Mistral Medium</option>
              <option value="Mistral Small">Mistral Small</option>
              <option value="Mistral Nemo">Mistral Nemo</option>
              <option value="Codestral">Codestral</option>
              <option value="Pixtral Large">Pixtral Large</option>
            </optgroup>
            <optgroup label="Groq">
              <option value="Llama 3.1 405B (Groq)">Llama 3.1 405B</option>
              <option value="Llama 3.1 70B (Groq)">Llama 3.1 70B</option>
              <option value="Llama 3.1 8B (Groq)">Llama 3.1 8B</option>
              <option value="Mixtral 8x7B">Mixtral 8x7B</option>
              <option value="Gemma 2 9B">Gemma 2 9B</option>
            </optgroup>
            <optgroup label="Cohere">
              <option value="Command R+">Command R+</option>
              <option value="Command R">Command R</option>
              <option value="Command">Command</option>
            </optgroup>
            <optgroup label="xAI">
              <option value="Grok 2">Grok 2</option>
              <option value="Grok Beta">Grok Beta</option>
            </optgroup>
          </select>
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <Gauge size={16} className="setting-icon" />
              <span className="setting-label">Suggestion Delay</span>
            </div>
            <span className="setting-desc">Delay before showing suggestions (ms)</span>
          </div>
          <Slider
            label=""
            value={settings.copilot?.suggestionDelay ?? 300}
            min={0}
            max={1000}
            step={50}
            unit="ms"
            onChange={(v) => updateSetting('copilot', 'suggestionDelay', v)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <History size={16} className="setting-icon" />
              <span className="setting-label">Show Recent</span>
            </div>
            <span className="setting-desc">Show recently used suggestions</span>
          </div>
          <button
            className={`toggle ${settings.copilot?.showRecent ? 'active' : ''}`}
            onClick={() => updateSetting('copilot', 'showRecent', !settings.copilot?.showRecent)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderNetworkSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Network</h2>
        <p className="settings-hero-desc">Configure network proxy and connection settings.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Server size={16} className="setting-icon" />
              <span className="setting-label">API Base URL</span>
            </div>
            <span className="setting-desc">Base URL for AI model APIs</span>
          </div>
          <input
            type="text"
            className="settings-input"
            value={settings.network?.apiBaseUrl || 'https://api.openai.com/v1'}
            onChange={(e) => updateSetting('network', 'apiBaseUrl', e.target.value)}
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Key size={16} className="setting-icon" />
              <span className="setting-label">OpenAI API Key</span>
            </div>
            <span className="setting-desc">Your OpenAI API key</span>
          </div>
          <input
            type="password"
            className="settings-input"
            value={settings.network?.openaiKey || ''}
            onChange={(e) => updateSetting('network', 'openaiKey', e.target.value)}
            placeholder="sk-..."
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Key size={16} className="setting-icon" />
              <span className="setting-label">Anthropic API Key</span>
            </div>
            <span className="setting-desc">Your Anthropic API key</span>
          </div>
          <input
            type="password"
            className="settings-input"
            value={settings.network?.anthropicKey || ''}
            onChange={(e) => updateSetting('network', 'anthropicKey', e.target.value)}
            placeholder="sk-ant-..."
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Key size={16} className="setting-icon" />
              <span className="setting-label">Google API Key</span>
            </div>
            <span className="setting-desc">Your Google AI API key</span>
          </div>
          <input
            type="password"
            className="settings-input"
            value={settings.network?.googleKey || ''}
            onChange={(e) => updateSetting('network', 'googleKey', e.target.value)}
            placeholder="AIza..."
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Globe size={16} className="setting-icon" />
              <span className="setting-label">Use Proxy</span>
            </div>
            <span className="setting-desc">Route API requests through a proxy</span>
          </div>
          <button
            className={`toggle ${settings.network?.useProxy ? 'active' : ''}`}
            onClick={() => updateSetting('network', 'useProxy', !settings.network?.useProxy)}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        {settings.network?.useProxy && (
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label-row">
                <Link size={16} className="setting-icon" />
                <span className="setting-label">Proxy URL</span>
              </div>
              <span className="setting-desc">HTTP proxy server address</span>
            </div>
            <input
              type="text"
              className="settings-input"
              value={settings.network?.proxyUrl || ''}
              onChange={(e) => updateSetting('network', 'proxyUrl', e.target.value)}
              placeholder="http://proxy:8080"
            />
          </div>
        )}

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <Timer size={16} className="setting-icon" />
              <span className="setting-label">Request Timeout</span>
            </div>
            <span className="setting-desc">Maximum time for API requests (seconds)</span>
          </div>
          <Slider
            label=""
            value={settings.network?.timeout ?? 30}
            min={5}
            max={120}
            step={5}
            unit="s"
            onChange={(v) => updateSetting('network', 'timeout', v)}
          />
        </div>
      </div>
    </div>
  )

  const renderPerformanceSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">Performance</h2>
        <p className="settings-hero-desc">Optimize performance and resource usage.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Zap size={16} className="setting-icon" />
              <span className="setting-label">Hardware Acceleration</span>
            </div>
            <span className="setting-desc">Use GPU for rendering when available</span>
          </div>
          <button
            className={`toggle ${settings.performance?.hardwareAcceleration !== false ? 'active' : ''}`}
            onClick={() => updateSetting('performance', 'hardwareAcceleration', !(settings.performance?.hardwareAcceleration !== false))}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <Activity size={16} className="setting-icon" />
              <span className="setting-label">Max Memory</span>
            </div>
            <span className="setting-desc">Maximum memory usage (MB)</span>
          </div>
          <Slider
            label=""
            value={settings.performance?.maxMemory ?? 2048}
            min={256}
            max={8192}
            step={256}
            unit="MB"
            onChange={(v) => updateSetting('performance', 'maxMemory', v)}
          />
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <HardDrive size={16} className="setting-icon" />
              <span className="setting-label">Cache Size</span>
            </div>
            <span className="setting-desc">Maximum disk cache size (MB)</span>
          </div>
          <Slider
            label=""
            value={settings.performance?.cacheSize ?? 250}
            min={50}
            max={2000}
            step={50}
            unit="MB"
            onChange={(v) => updateSetting('performance', 'cacheSize', v)}
          />
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <RefreshCw size={16} className="setting-icon" />
              <span className="setting-label">Auto-save Delay</span>
            </div>
            <span className="setting-desc">Delay before auto-saving (ms)</span>
          </div>
          <Slider
            label=""
            value={settings.performance?.autoSaveDelay ?? 1000}
            min={100}
            max={5000}
            step={100}
            unit="ms"
            onChange={(v) => updateSetting('performance', 'autoSaveDelay', v)}
          />
        </div>

        <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div className="setting-info">
            <div className="setting-label-row">
              <Layers size={16} className="setting-icon" />
              <span className="setting-label">Render Buffer</span>
            </div>
            <span className="setting-desc">Number of off-screen lines to render</span>
          </div>
          <Slider
            label=""
            value={settings.performance?.renderBuffer ?? 10}
            min={1}
            max={100}
            step={1}
            onChange={(v) => updateSetting('performance', 'renderBuffer', v)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Boxes size={16} className="setting-icon" />
              <span className="setting-label">Virtual Rendering</span>
            </div>
            <span className="setting-desc">Only render visible lines in large files</span>
          </div>
          <button
            className={`toggle ${settings.performance?.virtualRendering !== false ? 'active' : ''}`}
            onClick={() => updateSetting('performance', 'virtualRendering', !(settings.performance?.virtualRendering !== false))}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAboutSettings = () => (
    <div className="settings-content">
      <div className="settings-hero">
        <h2 className="settings-hero-title">About</h2>
        <p className="settings-hero-desc">About FOX IDE.</p>
      </div>
      
      <div className="settings-search-box">
        <Search size={16} />
        <input type="text" placeholder="Search settings..." />
      </div>

      <div className="setting-group">
        <div className="about-card">
          <div className="about-logo">
            <Cpu size={48} />
          </div>
          <h2 className="about-title">FOX IDE</h2>
          <p className="about-version">Version 1.0.0</p>
          <p className="about-desc">Built with passion by Muneeb Alam — a developer who believes in clean code, powerful tools, and AI-driven workflows. Designed to make coding faster, smarter, and more enjoyable.</p>
        </div>

        <div className="about-grid">
          <div className="about-item">
            <span className="about-label">Electron</span>
            <span className="about-value">28.2.0</span>
          </div>
          <div className="about-item">
            <span className="about-label">Chrome</span>
            <span className="about-value">120.0.6099.199</span>
          </div>
          <div className="about-item">
            <span className="about-label">Node.js</span>
            <span className="about-value">18.18.2</span>
          </div>
          <div className="about-item">
            <span className="about-label">V8</span>
            <span className="about-value">12.0.267.8</span>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <HardDrive size={16} className="setting-icon" />
              <span className="setting-label">Memory Usage</span>
            </div>
            <span className="setting-desc">Current memory consumption</span>
          </div>
          <span className="about-stat">~128 MB</span>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label-row">
              <Database size={16} className="setting-icon" />
              <span className="setting-label">Cache Size</span>
            </div>
            <span className="setting-desc">Local storage and cache usage</span>
          </div>
          <span className="about-stat">~24 MB</span>
        </div>

        <div className="about-links">
          <a href="#" className="about-link">
            <ExternalLink size={14} />
            <span>Documentation</span>
          </a>
          <a href="#" className="about-link">
            <ExternalLink size={14} />
            <span>Release Notes</span>
          </a>
          <a href="#" className="about-link">
            <ExternalLink size={14} />
            <span>Report Issue</span>
          </a>
          <a href="#" className="about-link">
            <ExternalLink size={14} />
            <span>License</span>
          </a>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings()
      case 'appearance': return renderAppearanceSettings()
      case 'editor': return renderEditorSettings()
      case 'terminal': return renderTerminalSettings()
      case 'aifusion': return renderAIFusionSettings()
      case 'copilot': return renderCopilotSettings()
      case 'breadcrumb': return renderBreadcrumbSettings()
      case 'statusbar': return renderStatusBarSettings()
      case 'keybindings': return renderKeybindingsSettings()
      case 'git': return renderGitSettings()
      case 'debug': return renderDebugSettings()
      case 'extensions': return renderExtensionsSettings()
      case 'security': return renderSecuritySettings()
      case 'network': return renderNetworkSettings()
      case 'performance': return renderPerformanceSettings()
      case 'notifications': return renderNotificationsSettings()
      case 'language': return renderLanguageSettings()
      case 'accessibility': return renderAccessibilitySettings()
      case 'workspace': return renderWorkspaceSettings()
      case 'about': return renderAboutSettings()
      default: return renderGeneralSettings()
    }
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <button className="settings-back" onClick={() => onBack && onBack()}>
          <ChevronLeft size={20} />
        </button>
        <div className="settings-title">
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div className="settings-header-right">
          <SaveIndicator saving={saving} saved={saved} />
        </div>
      </div>

      <div className="settings-body">
        <nav className="settings-nav">
          <div className="settings-search">
            <Search size={14} className="settings-search-icon" />
            <input
              type="text"
              className="settings-search-input"
              placeholder="Search..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
          </div>
          <div className="settings-nav-list">
            {settingsSections
              .filter(s => s.label.toLowerCase().includes(navSearch.toLowerCase()))
              .map(section => (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon size={16} />
                  <span>{section.label}</span>
                </button>
              ))
            }
          </div>
        </nav>

        <div className="settings-main">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
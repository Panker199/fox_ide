import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import TitleBar from './components/TitleBar'
import ActivityBar from './components/ActivityBar'
import Sidebar from './components/Sidebar'
const CodeEditor = lazy(() => import('./components/CodeEditor'))
import AIChat from './components/AIChat'
import Copilot from './components/Copilot'
import SettingsPanel from './components/SettingsPanel'
import CommandPalette from './components/CommandPalette'
import StartPage from './components/StartPage'
import Terminal from './components/Terminal'
import Debug from './components/Debug'
import OutputPanel from './components/OutputPanel'
import ProblemsPanel from './components/ProblemsPanel'
import StatusBar from './components/StatusBar'
import { ThemeStudio } from './components/ThemeStudio'
import { applySavedTheme } from './hooks/useThemeManager'
import { useSettings } from './hooks/useSettings'
import { useFileSystem } from './hooks/useFileSystem'
import { X } from 'lucide-react'
import './styles/fonts.css'
import './styles/global.css'
import './styles/themes.css'
import './styles/seti-icons.css'

const STORAGE_KEY = 'kro-app-state'

function loadState(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return saved[key] !== undefined ? saved[key] : fallback
  } catch { return fallback }
}

function saveState(partial) {
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...partial }))
  } catch {}
}

function App() {
  const [activePanel, setActivePanel] = useState(() => loadState('activePanel', 'start'))
  const [sidebarOpen, setSidebarOpen] = useState(() => loadState('sidebarOpen', true))
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(() => loadState('bottomPanelOpen', true))
  const [bottomPanelTab, setBottomPanelTab] = useState(() => loadState('bottomPanelTab', 'terminal'))
  const [sidebarTab, setSidebarTab] = useState(() => loadState('sidebarTab', 'files'))
  const [copilotOpen, setCopilotOpen] = useState(() => loadState('copilotOpen', false))
  const [editorContext, setEditorContext] = useState({ text: '', fileName: 'workspace', language: 'javascript' })

  const fs = useFileSystem()
  const { settings } = useSettings()
  const layout = settings.appearance?.layout ?? 'default'

  useEffect(() => {
    try { applySavedTheme() } catch(e) { console.error('Theme init error:', e) }
    try {
      const saved = JSON.parse(localStorage.getItem('kro-settings') || '{}')
      const accent = saved?.appearance?.accentColor
      if (accent) {
        const root = document.documentElement
        root.style.setProperty('--accent', accent)
        root.style.setProperty('--k-accent', accent)
        root.style.setProperty('--border-focus', accent)
        root.style.setProperty('--bg-active', accent + '22')
        root.style.setProperty('--accent-bg', accent + '22')
        root.style.setProperty('--accent-hover', accent + 'cc')
      }
    } catch {}
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false)
        } else if (copilotOpen) {
          setCopilotOpen(false)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, copilotOpen])

  useEffect(() => { saveState({ activePanel }) }, [activePanel])
  useEffect(() => { saveState({ sidebarOpen }) }, [sidebarOpen])
  useEffect(() => { saveState({ bottomPanelOpen }) }, [bottomPanelOpen])
  useEffect(() => { saveState({ bottomPanelTab }) }, [bottomPanelTab])
  useEffect(() => { saveState({ sidebarTab }) }, [sidebarTab])
  useEffect(() => { saveState({ copilotOpen }) }, [copilotOpen])

  const handleFileOpen = useCallback(async (filePath) => {
    const ok = await fs.openFile(filePath)
    if (ok) setActivePanel('editor')
  }, [fs])

  const handlePanelChange = (panel) => {
    if (panel === 'settings') {
      setActivePanel('settings')
    } else if (panel === 'chat') {
      setActivePanel('chat')
    } else if (panel === 'copilot') {
      setCopilotOpen(v => !v)
    } else if (panel === 'terminal') {
      setBottomPanelOpen(true)
      setBottomPanelTab('terminal')
    } else if (panel === 'debug') {
      setBottomPanelOpen(true)
      setBottomPanelTab('debug')
    } else if (panel === 'files' || panel === 'search' || panel === 'git' || panel === 'extensions') {
      setSidebarTab(panel)
      if (!sidebarOpen) setSidebarOpen(true)
    } else if (panel === 'editor') {
      setActivePanel('editor')
    }
  }

  const handleCommandSelect = useCallback((commandId) => {
    setCommandPaletteOpen(false)
    if (commandId === 'theme') return
    handlePanelChange(commandId)
  }, [])

  const handleMenuAction = useCallback((action) => {
    if (action === 'commandPalette') {
      setCommandPaletteOpen(true)
    } else if (action === 'openSettings') {
      setActivePanel('settings')
    } else if (action === 'file.newFile') {
      const name = prompt('File name:', 'new-file.js')
      if (name) { fs.createFile(name); handleFileOpen(name) }
    } else if (action === 'file.save') {
      if (fs.activeFile && fs.fileContents[fs.activeFile] !== undefined) {
        fs.saveFile(fs.activeFile, fs.fileContents[fs.activeFile])
      }
    } else if (action === 'view.toggleSidebar') {
      setSidebarOpen(v => !v)
    } else if (action === 'view.togglePanel') {
      setBottomPanelOpen(v => !v)
    } else if (action === 'view.explorer') {
      setSidebarTab('files'); if (!sidebarOpen) setSidebarOpen(true)
    } else if (action === 'view.search') {
      setSidebarTab('search'); if (!sidebarOpen) setSidebarOpen(true)
    } else if (action === 'view.git') {
      setSidebarTab('git'); if (!sidebarOpen) setSidebarOpen(true)
    } else if (action === 'view.debug') {
      setSidebarTab('extensions'); if (!sidebarOpen) setSidebarOpen(true)
    } else if (action === 'view.extensions') {
      setSidebarTab('extensions'); if (!sidebarOpen) setSidebarOpen(true)
    } else if (action === 'terminal.new' || action === 'terminal.split') {
      setBottomPanelOpen(true); setBottomPanelTab('terminal')
    } else if (action === 'run.start' || action === 'run.restart') {
      setBottomPanelOpen(true); setBottomPanelTab('debug')
    } else if (action === 'run.stop') {
      setBottomPanelTab('debug')
    } else if (action === 'help.welcome') {
      setActivePanel('start')
    }
  }, [sidebarOpen, fs])

  const renderPanel = () => {
    switch (activePanel) {
      case 'start':
        return <StartPage onOpenFile={() => setActivePanel('editor')} onNavigate={setActivePanel} />
      case 'editor':
        return <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--k-text-ghost)', fontSize: 13 }}>Loading editor...</div>}>
          <CodeEditor
            onSelectionChange={setEditorContext}
            fs={fs}
          />
        </Suspense>
      case 'chat':
        return <AIChat onBack={() => setActivePanel('start')} />
      case 'settings':
        return <SettingsPanel onBack={() => setActivePanel('start')} onNavigate={setActivePanel} />
      case 'theme-studio':
        return <ThemeStudio onClose={() => setActivePanel('start')} />
      default:
        return <StartPage onOpenFile={() => setActivePanel('editor')} />
    }
  }

  const renderBottomPanel = () => {
    switch (bottomPanelTab) {
      case 'terminal':
        return <Terminal />
      case 'debug':
        return <Debug />
      case 'output':
        return <OutputPanel />
      case 'problems':
        return <ProblemsPanel />
      default:
        return <Terminal />
    }
  }

  const isFullscreenPanel = activePanel === 'settings' || activePanel === 'chat' || activePanel === 'theme-studio'

  return (
    <div className={`app layout-${layout}`}>
      <TitleBar
        commandPaletteOpen={commandPaletteOpen}
        setCommandPaletteOpen={setCommandPaletteOpen}
        onOpenSettings={() => setActivePanel('settings')}
        onMenuAction={handleMenuAction}
      />

      <div className="app-body">
        {!isFullscreenPanel && (
          <ActivityBar
            activePanel={sidebarTab}
            onPanelChange={handlePanelChange}
          />
        )}

        <div className="main-layout">
          {!isFullscreenPanel && sidebarOpen && (
            <Sidebar
              activePanel={sidebarTab}
              onPanelChange={handlePanelChange}
              fs={fs}
              onFileOpen={handleFileOpen}
            />
          )}

          <div className="editor-area">
            <div className="content-area">
              {renderPanel()}
            </div>

            {!isFullscreenPanel && bottomPanelOpen && (
              <div className="bottom-panel">
                <div className="panel-tabs">
                  <div className="panel-tabs-left">
                    <button
                      className={`panel-tab ${bottomPanelTab === 'terminal' ? 'active' : ''}`}
                      onClick={() => setBottomPanelTab('terminal')}
                    >
                      Terminal
                    </button>
                    <button
                      className={`panel-tab ${bottomPanelTab === 'debug' ? 'active' : ''}`}
                      onClick={() => setBottomPanelTab('debug')}
                    >
                      Debug
                    </button>
                    <button
                      className={`panel-tab ${bottomPanelTab === 'output' ? 'active' : ''}`}
                      onClick={() => setBottomPanelTab('output')}
                    >
                      Output
                    </button>
                    <button
                      className={`panel-tab ${bottomPanelTab === 'problems' ? 'active' : ''}`}
                      onClick={() => setBottomPanelTab('problems')}
                    >
                      Problems
                    </button>
                  </div>
                  <button className="panel-tabs-close" onClick={() => setBottomPanelOpen(false)}>
                    <X size={14} />
                  </button>
                </div>
                <div className="panel-content">
                  {renderBottomPanel()}
                </div>
              </div>
            )}
          </div>
        </div>

        {copilotOpen && !isFullscreenPanel && (
          <div className="copilot-sidebar" onClick={(e) => e.stopPropagation()}>
            <Copilot onClose={() => setCopilotOpen(false)} context={editorContext} />
          </div>
        )}
      </div>

      <StatusBar
        bottomPanelOpen={bottomPanelOpen}
        onTogglePanel={() => setBottomPanelOpen(v => !v)}
        copilotOpen={copilotOpen}
        onToggleCopilot={() => setCopilotOpen(v => !v)}
      />

      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} onSelect={handleCommandSelect} />
      )}
    </div>
  )
}

export default App

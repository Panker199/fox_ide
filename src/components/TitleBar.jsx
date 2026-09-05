import React, { useState, useRef, useEffect } from 'react'
import {
  FileText,
  Edit3,
  Eye,
  Terminal,
  HelpCircle,
  Search,
  Settings,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Save,
  FolderOpen,
  FilePlus,
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Columns,
  Rows,
  Layout,
  Palette,
  Keyboard,
  Info,
  BookOpen,
  Bug,
  MessageSquare,
  Cpu,
  Minus,
  Square,
  Command,
  Trash2,
  Pause,
  ChevronRight,
  ChevronLeft,
  Replace,
  List,
  GitBranch,
  Wand2,
  PenLine,
  Play,
  SkipForward,
  Hash,
} from 'lucide-react'
import './TitleBar.css'

const menuItems = [
  {
    label: 'File',
    items: [
      { label: 'New File', icon: FilePlus, shortcut: 'Ctrl+N', action: 'file.newFile' },
      { label: 'New Window', icon: FilePlus, shortcut: 'Ctrl+Shift+N', action: 'file.newWindow' },
      { type: 'separator' },
      { label: 'Open File...', icon: FolderOpen, shortcut: 'Ctrl+O', action: 'file.openFile' },
      { label: 'Open Folder...', icon: FolderOpen, shortcut: 'Ctrl+K Ctrl+O', action: 'file.openFolder' },
      { type: 'separator' },
      { label: 'Save', icon: Save, shortcut: 'Ctrl+S', action: 'file.save' },
      { label: 'Save As...', icon: Save, shortcut: 'Ctrl+Shift+S', action: 'file.saveAs' },
      { label: 'Save All', icon: Save, shortcut: 'Ctrl+K S', action: 'file.saveAll' },
      { type: 'separator' },
      { label: 'Preferences', icon: Settings, action: 'openSettings' },
      { type: 'separator' },
      { label: 'Close Editor', icon: X, shortcut: 'Ctrl+W', action: 'file.closeEditor' },
      { label: 'Close Window', icon: X, shortcut: 'Ctrl+Shift+W', action: 'file.closeWindow' },
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z', action: 'edit.undo' },
      { label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y', action: 'edit.redo' },
      { type: 'separator' },
      { label: 'Cut', icon: Scissors, shortcut: 'Ctrl+X', action: 'edit.cut' },
      { label: 'Copy', icon: Copy, shortcut: 'Ctrl+C', action: 'edit.copy' },
      { label: 'Paste', icon: Clipboard, shortcut: 'Ctrl+V', action: 'edit.paste' },
      { type: 'separator' },
      { label: 'Find', icon: Search, shortcut: 'Ctrl+F', action: 'edit.find' },
      { label: 'Find in Files', icon: Search, shortcut: 'Ctrl+Shift+F', action: 'edit.findInFiles' },
      { label: 'Replace', icon: Replace, shortcut: 'Ctrl+H', action: 'edit.replace' },
      { type: 'separator' },
      { label: 'Go to Line', icon: Hash, shortcut: 'Ctrl+G', action: 'edit.goToLine' },
      { label: 'Go to Symbol', icon: List, shortcut: 'Ctrl+Shift+O', action: 'edit.goToSymbol' },
      { type: 'separator' },
      { label: 'Select All', icon: Copy, shortcut: 'Ctrl+A', action: 'edit.selectAll' },
      { type: 'separator' },
      { label: 'Toggle Line Comment', icon: PenLine, shortcut: 'Ctrl+/', action: 'edit.toggleComment' },
      { label: 'Format Document', icon: Wand2, shortcut: 'Shift+Alt+F', action: 'edit.format' },
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Command Palette...', icon: Search, shortcut: 'Ctrl+Shift+P', action: 'commandPalette' },
      { type: 'separator' },
      { label: 'Explorer', icon: FileText, shortcut: 'Ctrl+Shift+E', action: 'view.explorer' },
      { label: 'Search', icon: Search, shortcut: 'Ctrl+Shift+F', action: 'view.search' },
      { label: 'Source Control', icon: GitBranch, shortcut: 'Ctrl+Shift+G', action: 'view.git' },
      { label: 'Run and Debug', icon: Bug, shortcut: 'Ctrl+Shift+D', action: 'view.debug' },
      { label: 'Extensions', icon: Layout, shortcut: 'Ctrl+Shift+X', action: 'view.extensions' },
      { type: 'separator' },
      { label: 'Zoom In', icon: ZoomIn, shortcut: 'Ctrl+=', action: 'view.zoomIn' },
      { label: 'Zoom Out', icon: ZoomOut, shortcut: 'Ctrl+-', action: 'view.zoomOut' },
      { label: 'Reset Zoom', icon: RotateCcw, shortcut: 'Ctrl+0', action: 'view.resetZoom' },
      { type: 'separator' },
      { label: 'Toggle Fullscreen', icon: Maximize2, shortcut: 'F11', action: 'view.fullscreen' },
      { label: 'Toggle Sidebar', icon: Columns, shortcut: 'Ctrl+B', action: 'view.toggleSidebar' },
      { label: 'Toggle Panel', icon: Rows, shortcut: 'Ctrl+`', action: 'view.togglePanel' },
      { type: 'separator' },
      { label: 'Word Wrap', icon: Edit3, shortcut: 'Alt+Z', action: 'view.wordWrap' },
      { label: 'Minimap', icon: Eye, action: 'view.minimap' },
    ]
  },
  {
    label: 'Run',
    items: [
      { label: 'Start Debugging', icon: Play, shortcut: 'F5', action: 'run.start' },
      { label: 'Run Without Debugging', icon: Play, shortcut: 'Ctrl+F5', action: 'run.runWithoutDebug' },
      { type: 'separator' },
      { label: 'Stop Debugging', icon: Square, shortcut: 'Shift+F5', action: 'run.stop' },
      { label: 'Restart Debugging', icon: RotateCcw, shortcut: 'Ctrl+Shift+F5', action: 'run.restart' },
      { type: 'separator' },
      { label: 'Step Over', icon: SkipForward, shortcut: 'F10', action: 'run.stepOver' },
      { label: 'Step Into', icon: SkipForward, shortcut: 'F11', action: 'run.stepInto' },
      { label: 'Step Out', icon: SkipForward, shortcut: 'Shift+F11', action: 'run.stepOut' },
      { type: 'separator' },
      { label: 'Toggle Breakpoint', icon: Bug, shortcut: 'F9', action: 'run.toggleBreakpoint' },
      { type: 'separator' },
      { label: 'Open Configurations', icon: Settings, action: 'run.openConfig' },
    ]
  },
  {
    label: 'Terminal',
    items: [
      { label: 'New Terminal', icon: Terminal, shortcut: 'Ctrl+`', action: 'terminal.new' },
      { label: 'Split Terminal', icon: Columns, action: 'terminal.split' },
      { type: 'separator' },
      { label: 'Run Task...', icon: Terminal, action: 'terminal.runTask' },
      { label: 'Run Build Task...', icon: Terminal, shortcut: 'Ctrl+Shift+B', action: 'terminal.build' },
      { type: 'separator' },
      { label: 'Clear Terminal', icon: Trash2, action: 'terminal.clear' },
      { label: 'Kill Terminal', icon: X, action: 'terminal.kill' },
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Welcome', icon: Info, action: 'help.welcome' },
      { label: 'Documentation', icon: BookOpen, action: 'help.docs' },
      { label: 'Release Notes', icon: Info, action: 'help.releaseNotes' },
      { type: 'separator' },
      { label: 'Keyboard Shortcuts', icon: Keyboard, shortcut: 'Ctrl+K Ctrl+S', action: 'help.shortcuts' },
      { type: 'separator' },
      { label: 'Report Issue', icon: Bug, action: 'help.reportIssue' },
      { label: 'Send Feedback', icon: MessageSquare, action: 'help.feedback' },
      { type: 'separator' },
      { label: 'Show All Commands', icon: Command, shortcut: 'Ctrl+Shift+P', action: 'commandPalette' },
      { type: 'separator' },
      { label: 'About', icon: Info, action: 'help.about' },
    ]
  }
]

function TitleBar({ commandPaletteOpen, setCommandPaletteOpen, onOpenSettings, onMenuAction }) {
  const [activeMenu, setActiveMenu] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index)
  }

  const handleMenuHover = (index) => {
    if (activeMenu !== null) {
      setActiveMenu(index)
    }
  }

  const handleItemClick = (item) => {
    setActiveMenu(null)
    if (!item.action) return

    if (item.action === 'openSettings') {
      onOpenSettings?.()
    } else if (item.action === 'commandPalette') {
      setCommandPaletteOpen?.(true)
    } else if (onMenuAction) {
      onMenuAction(item.action)
    }
  }

  return (
    <div className="titlebar" ref={menuRef}>
      <div className="titlebar-left">
        <div className="titlebar-brand">
          <Cpu size={16} className="brand-icon" />
          <span className="brand-name">KRO</span>
          <span className="brand-tag">IDE</span>
        </div>

        <div className="menu-items">
          {menuItems.map((menu, index) => (
            <div
              key={menu.label}
              className={`menu-item ${activeMenu === index ? 'active' : ''}`}
              onClick={() => handleMenuClick(index)}
              onMouseEnter={() => handleMenuHover(index)}
            >
              <span className="menu-label">{menu.label}</span>

              {activeMenu === index && (
                <div className="menu-dropdown">
                  {menu.items.map((item, itemIndex) => {
                    if (item.type === 'separator') {
                      return <div key={itemIndex} className="menu-separator" />
                    }
                    const Icon = item.icon
                    return (
                      <button
                        key={itemIndex}
                        className="menu-dropdown-item"
                        onClick={() => handleItemClick(item)}
                      >
                        <Icon size={14} />
                        <span className="item-label">{item.label}</span>
                        {item.shortcut && (
                          <span className="item-shortcut">{item.shortcut}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="titlebar-search" onClick={() => setCommandPaletteOpen?.(true)}>
          <Search size={14} />
          <span>Search</span>
          <div className="search-kbd">
            <kbd>Ctrl</kbd>
            <kbd>K</kbd>
          </div>
        </button>
      </div>

      <div className="titlebar-right">
        <div className="titlebar-controls">
          <button className="control-btn minimize">
            <Minus size={14} />
          </button>
          <button className="control-btn maximize">
            <Square size={12} />
          </button>
          <button className="control-btn close">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TitleBar

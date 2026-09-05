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
  Palette,
  Keyboard,
  Info,
  BookOpen,
  Bug,
  MessageSquare,
  Play,
  Debug,
  SkipForward,
  Square,
  Replace,
  GoToLine,
  GitBranch,
  Wand2,
  PenLine,
  Layout,
  List,
} from 'lucide-react'
import './MenuBar.css'

const menuItems = [
  {
    label: 'File',
    items: [
      { label: 'New File', icon: FilePlus, shortcut: 'Ctrl+N' },
      { label: 'New Window', icon: FilePlus, shortcut: 'Ctrl+Shift+N' },
      { type: 'separator' },
      { label: 'Open File...', icon: FolderOpen, shortcut: 'Ctrl+O' },
      { label: 'Open Folder...', icon: FolderOpen, shortcut: 'Ctrl+K Ctrl+O' },
      { type: 'separator' },
      { label: 'Save', icon: Save, shortcut: 'Ctrl+S' },
      { label: 'Save As...', icon: Save, shortcut: 'Ctrl+Shift+S' },
      { label: 'Save All', icon: Save, shortcut: 'Ctrl+K S' },
      { type: 'separator' },
      { label: 'Preferences', icon: Settings, shortcut: 'Ctrl+,' },
      { type: 'separator' },
      { label: 'Close Editor', icon: X, shortcut: 'Ctrl+W' },
      { label: 'Close Window', icon: X, shortcut: 'Ctrl+Shift+W' },
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z' },
      { label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y' },
      { type: 'separator' },
      { label: 'Cut', icon: Scissors, shortcut: 'Ctrl+X' },
      { label: 'Copy', icon: Copy, shortcut: 'Ctrl+C' },
      { label: 'Paste', icon: Clipboard, shortcut: 'Ctrl+V' },
      { type: 'separator' },
      { label: 'Find', icon: Search, shortcut: 'Ctrl+F' },
      { label: 'Find in Files', icon: Search, shortcut: 'Ctrl+Shift+F' },
      { label: 'Replace', icon: Replace, shortcut: 'Ctrl+H' },
      { label: 'Replace in Files', icon: Replace, shortcut: 'Ctrl+Shift+H' },
      { type: 'separator' },
      { label: 'Find Next', icon: Search, shortcut: 'F3' },
      { label: 'Find Previous', icon: Search, shortcut: 'Shift+F3' },
      { type: 'separator' },
      { label: 'Go to Line', icon: GoToLine, shortcut: 'Ctrl+G' },
      { label: 'Go to Symbol', icon: List, shortcut: 'Ctrl+Shift+O' },
      { type: 'separator' },
      { label: 'Toggle Line Comment', icon: PenLine, shortcut: 'Ctrl+/' },
      { label: 'Toggle Block Comment', icon: PenLine, shortcut: 'Shift+Alt+A' },
      { label: 'Format Document', icon: Wand2, shortcut: 'Shift+Alt+F' },
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Command Palette...', icon: Search, shortcut: 'Ctrl+Shift+P' },
      { label: 'Open View...', icon: Eye },
      { type: 'separator' },
      { label: 'Explorer', icon: FileText, shortcut: 'Ctrl+Shift+E' },
      { label: 'Search', icon: Search, shortcut: 'Ctrl+Shift+F' },
      { label: 'Source Control', icon: GitBranch, shortcut: 'Ctrl+Shift+G' },
      { label: 'Debug', icon: Bug, shortcut: 'Ctrl+Shift+D' },
      { label: 'Extensions', icon: Layout, shortcut: 'Ctrl+Shift+X' },
      { type: 'separator' },
      { label: 'Zoom In', icon: ZoomIn, shortcut: 'Ctrl+=' },
      { label: 'Zoom Out', icon: ZoomOut, shortcut: 'Ctrl+-' },
      { label: 'Reset Zoom', icon: RotateCcw, shortcut: 'Ctrl+0' },
      { type: 'separator' },
      { label: 'Toggle Fullscreen', icon: Maximize2, shortcut: 'F11' },
      { label: 'Toggle Sidebar', icon: Columns, shortcut: 'Ctrl+B' },
      { label: 'Toggle Panel', icon: Rows, shortcut: 'Ctrl+`' },
      { type: 'separator' },
      { label: 'Split Left', icon: Columns },
      { label: 'Split Right', icon: Columns },
      { label: 'Split Up', icon: Rows },
      { label: 'Split Down', icon: Rows },
    ]
  },
  {
    label: 'Run',
    items: [
      { label: 'Start Debugging', icon: Play, shortcut: 'F5' },
      { label: 'Run Without Debugging', icon: Play, shortcut: 'Ctrl+F5' },
      { type: 'separator' },
      { label: 'Stop Debugging', icon: Square, shortcut: 'Shift+F5' },
      { label: 'Restart Debugging', icon: RotateCcw, shortcut: 'Ctrl+Shift+F5' },
      { type: 'separator' },
      { label: 'Step Over', icon: SkipForward, shortcut: 'F10' },
      { label: 'Step Into', icon: SkipForward, shortcut: 'F11' },
      { label: 'Step Out', icon: SkipForward, shortcut: 'Shift+F11' },
      { type: 'separator' },
      { label: 'Toggle Breakpoint', icon: Bug, shortcut: 'F9' },
      { label: 'New Breakpoint', icon: Bug },
      { type: 'separator' },
      { label: 'Open Configurations', icon: Settings },
    ]
  },
  {
    label: 'Terminal',
    items: [
      { label: 'New Terminal', icon: Terminal, shortcut: 'Ctrl+`' },
      { label: 'Split Terminal', icon: Columns },
      { type: 'separator' },
      { label: 'Run Task...', icon: Terminal },
      { label: 'Run Build Task...', icon: Terminal, shortcut: 'Ctrl+Shift+B' },
      { label: 'Run Active File', icon: Play },
      { type: 'separator' },
      { label: 'Clear Terminal', icon: X },
      { label: 'Kill Terminal', icon: X },
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Welcome', icon: Info },
      { label: 'Documentation', icon: BookOpen },
      { label: 'Release Notes', icon: Info },
      { type: 'separator' },
      { label: 'Keyboard Shortcuts', icon: Keyboard, shortcut: 'Ctrl+K Ctrl+S' },
      { label: 'Color Theme', icon: Palette },
      { type: 'separator' },
      { label: 'Report Issue', icon: Bug },
      { label: 'Send Feedback', icon: MessageSquare },
      { type: 'separator' },
      { label: 'About', icon: Info },
    ]
  },
]

function MenuBar() {
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
  }

  return (
    <div className="menu-bar" ref={menuRef}>
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
    </div>
  )
}

export default MenuBar

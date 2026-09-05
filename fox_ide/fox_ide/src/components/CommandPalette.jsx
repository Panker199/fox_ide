import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  FileCode,
  FolderOpen,
  MessageSquare,
  Settings,
  GitBranch,
  Terminal,
  Palette,
  Command
} from 'lucide-react'
import './CommandPalette.css'

const commands = [
  { id: 'files', icon: FileCode, label: 'Open Explorer', category: 'Navigation' },
  { id: 'editor', icon: FileCode, label: 'Open Editor', category: 'Navigation' },
  { id: 'chat', icon: MessageSquare, label: 'Open AI Chat', category: 'Navigation' },
  { id: 'settings', icon: Settings, label: 'Open Settings', category: 'Navigation' },
  { id: 'git', icon: GitBranch, label: 'Open Git Panel', category: 'Navigation' },
  { id: 'terminal', icon: Terminal, label: 'Toggle Terminal', category: 'View' },
  { id: 'theme', icon: Palette, label: 'Change Theme', category: 'Preferences' },
  { id: 'format', icon: FileCode, label: 'Format Document', category: 'Editor' },
  { id: 'save', icon: FileCode, label: 'Save File', category: 'File' },
]

function CommandPalette({ onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      if (filteredCommands[selectedIndex]) {
        onSelect(filteredCommands[selectedIndex].id)
      }
    }
  }

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Command size={16} className="command-icon" />
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="command-list">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => onSelect(cmd.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <cmd.icon size={16} />
              <span className="command-label">{cmd.label}</span>
              <span className="command-category">{cmd.category}</span>
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="command-empty">No commands found</div>
          )}
        </div>

        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette

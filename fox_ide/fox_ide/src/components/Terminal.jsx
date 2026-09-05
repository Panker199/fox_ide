import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Plus,
  X,
  ChevronDown,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react'
import './Terminal.css'

const initialOutput = [
  { type: 'system', text: 'FOX IDE Terminal v1.0.0' },
  { type: 'system', text: 'Type "help" for available commands' },
  { type: 'system', text: '' },
]

const commands = {
  help: 'Available commands: help, clear, ls, cd, pwd, echo, date, node, npm, git',
  ls: 'src/  public/  package.json  vite.config.js  node_modules/  README.md',
  pwd: 'F:/IDE',
  date: () => new Date().toLocaleString(),
  clear: '__CLEAR__',
  whoami: 'developer',
  echo: (args) => args.join(' '),
  node: 'Node.js v20.11.0',
  npm: 'npm 10.2.4',
  git: 'git version 2.43.0',
}

function Terminal() {
  const [tabs, setTabs] = useState([{ id: 1, name: 'powershell' }])
  const [activeTab, setActiveTab] = useState(1)
  const [history, setHistory] = useState(initialOutput)
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    const newHistory = [...history, { type: 'input', text: `$ ${trimmed}` }]
    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    if (command === 'clear') {
      setHistory([])
    } else if (commands[command]) {
      const result = typeof commands[command] === 'function' 
        ? commands[command](args) 
        : commands[command]
      newHistory.push({ type: 'output', text: result })
    } else {
      newHistory.push({ type: 'error', text: `'${command}' is not recognized as a command` })
    }

    setHistory(newHistory)
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = Object.keys(commands).filter(c => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setHistory([])
    }
  }

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1
    setTabs([...tabs, { id: newId, name: 'powershell' }])
    setActiveTab(newId)
  }

  const closeTab = (id, e) => {
    e.stopPropagation()
    if (tabs.length > 1) {
      const newTabs = tabs.filter(t => t.id !== id)
      setTabs(newTabs)
      if (activeTab === id) {
        setActiveTab(newTabs[0].id)
      }
    }
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`terminal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TerminalIcon size={14} />
              <span>{tab.name}</span>
              <button className="tab-close" onClick={(e) => closeTab(tab.id, e)}>
                <X size={12} />
              </button>
            </div>
          ))}
          <button className="tab-add" onClick={addTab}>
            <Plus size={14} />
          </button>
        </div>
        <div className="terminal-actions">
          <button title="Clear" onClick={() => setHistory([])}>
            <Trash2 size={14} />
          </button>
          <button title="Maximize">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="terminal-body" ref={outputRef} onClick={() => inputRef.current?.focus()}>
        {history.map((item, index) => (
          <div key={index} className={`terminal-line ${item.type}`}>
            {item.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">PS F:\IDE&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal

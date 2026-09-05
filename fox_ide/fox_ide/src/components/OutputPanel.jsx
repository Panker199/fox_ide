import React, { useState, useEffect } from 'react'
import { Terminal, Trash2, Copy, Check, Search, Filter, ChevronDown } from 'lucide-react'
import './OutputPanel.css'

const MOCK_OUTPUT = [
  { time: '14:32:01', level: 'info', source: 'build', message: 'Starting build...' },
  { time: '14:32:02', level: 'info', source: 'build', message: 'Compiling 1562 modules...' },
  { time: '14:32:08', level: 'info', source: 'build', message: '✓ built in 8.19s' },
  { time: '14:32:08', level: 'warn', source: 'build', message: 'Some chunks are larger than 500 kB after minification.' },
  { time: '14:32:15', level: 'info', source: 'typescript', message: 'Found 0 errors. Watching for file changes.' },
  { time: '14:32:20', level: 'info', source: 'git', message: 'On branch main' },
  { time: '14:32:20', level: 'info', source: 'git', message: 'Your branch is up to date with \'origin/main\'.' },
  { time: '14:32:25', level: 'error', source: 'eslint', message: 'Unexpected unused variable \'e\' at line 42 in App.jsx' },
  { time: '14:32:25', level: 'warn', source: 'eslint', message: ' Prefer optional chaining at line 15 in Sidebar.jsx' },
  { time: '14:32:30', level: 'info', source: 'server', message: 'Vite dev server running at http://localhost:5173' },
  { time: '14:32:31', level: 'info', source: 'server', message: 'Local:   http://localhost:5173/' },
  { time: '14:32:31', level: 'info', source: 'server', message: 'Network: http://192.168.1.5:5173/' },
]

const LEVEL_COLORS = {
  info: 'var(--k-text-normal)',
  warn: '#d29922',
  error: '#f85149',
}

function OutputPanel() {
  const [output, setOutput] = useState(MOCK_OUTPUT)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = output.filter(line => {
    if (filter !== 'all' && line.level !== filter) return false
    if (searchTerm && !line.message.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleCopy = () => {
    const text = filtered.map(l => `[${l.time}] [${l.source}] ${l.message}`).join('\n')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => setOutput([])

  return (
    <div className="output-panel">
      <div className="output-toolbar">
        <div className="output-toolbar-left">
          <div className="output-filter-group">
            <button className={`output-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={`output-filter-btn ${filter === 'info' ? 'active' : ''}`} onClick={() => setFilter('info')}>
              Info
            </button>
            <button className={`output-filter-btn ${filter === 'warn' ? 'active' : ''}`} onClick={() => setFilter('warn')}>
              Warnings
            </button>
            <button className={`output-filter-btn ${filter === 'error' ? 'active' : ''}`} onClick={() => setFilter('error')}>
              Errors
            </button>
          </div>
        </div>
        <div className="output-toolbar-right">
          <button className="output-tool-btn" title="Search" onClick={() => {}}>
            <Search size={13} />
          </button>
          <button className="output-tool-btn" title="Clear" onClick={handleClear}>
            <Trash2 size={13} />
          </button>
          <button className="output-tool-btn" title="Copy" onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
      <div className="output-content">
        {filtered.length === 0 ? (
          <div className="output-empty">
            <Terminal size={20} />
            <span>No output</span>
          </div>
        ) : (
          filtered.map((line, i) => (
            <div key={i} className={`output-line ${line.level}`}>
              <span className="output-time">{line.time}</span>
              <span className="output-source">[{line.source}]</span>
              <span className="output-msg">{line.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OutputPanel

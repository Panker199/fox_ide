import React, { useState } from 'react'
import { AlertCircle, AlertTriangle, Info, X, ChevronRight, ChevronDown, FileCode, Filter } from 'lucide-react'
import './ProblemsPanel.css'

const MOCK_PROBLEMS = [
  { severity: 'error', source: 'eslint', message: 'Unexpected unused variable \'e\'', file: 'App.jsx', line: 42, col: 12 },
  { severity: 'error', source: 'typescript', message: 'Type \'string\' is not assignable to type \'number\'', file: 'utils.ts', line: 18, col: 5 },
  { severity: 'warning', source: 'eslint', message: 'Prefer optional chaining over logical AND', file: 'Sidebar.jsx', line: 15, col: 8 },
  { severity: 'warning', source: 'typescript', message: 'Implicit any type', file: 'hooks/useSettings.js', line: 88, col: 3 },
  { severity: 'info', source: 'eslint', message: 'Fixable with --fix', file: 'Terminal.jsx', line: 33, col: 1 },
  { severity: 'info', source: 'typescript', message: 'File is a CommonJS module', file: 'package.json', line: 1, col: 1 },
]

const SEVERITY_CONFIG = {
  error: { icon: AlertCircle, color: '#f85149', label: 'Error' },
  warning: { icon: AlertTriangle, color: '#d29922', label: 'Warning' },
  info: { icon: Info, color: '#58a6ff', label: 'Info' },
}

function ProblemsPanel() {
  const [filter, setFilter] = useState('all')
  const [collapsed, setCollapsed] = useState({})

  const filtered = MOCK_PROBLEMS.filter(p => filter === 'all' || p.severity === filter)

  const counts = {
    error: MOCK_PROBLEMS.filter(p => p.severity === 'error').length,
    warning: MOCK_PROBLEMS.filter(p => p.severity === 'warning').length,
    info: MOCK_PROBLEMS.filter(p => p.severity === 'info').length,
  }

  const toggleCollapse = (sev) => {
    setCollapsed(prev => ({ ...prev, [sev]: !prev[sev] }))
  }

  const grouped = ['error', 'warning', 'info'].map(sev => ({
    severity: sev,
    config: SEVERITY_CONFIG[sev],
    items: filtered.filter(p => p.severity === sev),
    count: counts[sev],
  })).filter(g => g.items.length > 0)

  return (
    <div className="problems-panel">
      <div className="problems-toolbar">
        <div className="problems-toolbar-left">
          <span className="problems-count">
            {counts.error > 0 && <span className="count error">{counts.error} Errors</span>}
            {counts.warning > 0 && <span className="count warning">{counts.warning} Warnings</span>}
            {counts.info > 0 && <span className="count info">{counts.info} Info</span>}
          </span>
        </div>
        <div className="problems-toolbar-right">
          <button className={`problems-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`problems-filter-btn ${filter === 'error' ? 'active' : ''}`} onClick={() => setFilter('error')}>Errors</button>
          <button className={`problems-filter-btn ${filter === 'warning' ? 'active' : ''}`} onClick={() => setFilter('warning')}>Warnings</button>
        </div>
      </div>
      <div className="problems-content">
        {grouped.length === 0 ? (
          <div className="problems-empty">
            <AlertCircle size={20} />
            <span>No problems</span>
          </div>
        ) : (
          grouped.map(group => {
            const Icon = group.config.icon
            return (
              <div key={group.severity} className="problems-group">
                <button className="problems-group-header" onClick={() => toggleCollapse(group.severity)}>
                  {collapsed[group.severity] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  <Icon size={14} style={{ color: group.config.color }} />
                  <span className="group-label">{group.config.label}s</span>
                  <span className="group-count" style={{ color: group.config.color }}>{group.count}</span>
                </button>
                {!collapsed[group.severity] && group.items.map((problem, i) => (
                  <div key={i} className="problem-item">
                    <FileCode size={13} className="problem-file-icon" />
                    <span className="problem-message">{problem.message}</span>
                    <span className="problem-location">
                      [{problem.file}:{problem.line}:{problem.col}]
                    </span>
                    <span className="problem-source">{problem.source}</span>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ProblemsPanel

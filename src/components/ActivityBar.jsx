import React from 'react'
import {
  Files,
  Search,
  GitBranch,
  Bug,
  Blocks,
  Settings,
  User,
  Terminal
} from 'lucide-react'
import './ActivityBar.css'

const topItems = [
  { id: 'files', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'git', icon: GitBranch, label: 'Source Control' },
  { id: 'debug', icon: Bug, label: 'Run & Debug' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'extensions', icon: Blocks, label: 'Extensions' },
]

const bottomItems = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'account', icon: User, label: 'Account' },
]

function ActivityBar({ activePanel, onPanelChange }) {
  return (
    <aside className="activity-bar">
      <nav className="activity-nav">
        {topItems.map((item) => (
          <button
            key={item.id}
            className={`activity-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => onPanelChange(item.id)}
            title={item.label}
          >
            <item.icon size={22} />
          </button>
        ))}
      </nav>

      <nav className="activity-nav activity-bottom">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`activity-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => onPanelChange(item.id)}
            title={item.label}
          >
            <item.icon size={22} />
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default ActivityBar

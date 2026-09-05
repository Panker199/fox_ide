import React from 'react'
import {
  GitBranch,
  Check,
  AlertCircle,
  Terminal,
  Zap,
  Layout,
  Cpu
} from 'lucide-react'
import './StatusBar.css'

function StatusBar({ onTogglePanel, bottomPanelOpen, copilotOpen, onToggleCopilot }) {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="status-item">
          <Check size={12} />
          <span>0 errors</span>
        </div>
        <div className="status-item">
          <AlertCircle size={12} />
          <span>2 warnings</span>
        </div>
      </div>

      <div className="status-right">
        <div className="status-item">
          <span>Ln 24, Col 18</span>
        </div>
        <div className="status-item">
          <span>UTF-8</span>
        </div>
        <div className="status-item">
          <span>JavaScript</span>
        </div>
        <div className="status-item clickable" onClick={(e) => { e.stopPropagation(); onTogglePanel() }} title="Toggle Terminal">
          <Terminal size={12} />
          <span>Terminal</span>
        </div>
        <div className="status-item">
          <Zap size={12} />
          <span>Prettier</span>
        </div>
        <div
          className={`status-item clickable copilot-toggle ${copilotOpen ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleCopilot() }}
          title="Toggle Copilot"
        >
          <Cpu size={12} />
          <span>Copilot</span>
        </div>
      </div>
    </footer>
  )
}

export default StatusBar

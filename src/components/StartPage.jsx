import React from 'react'
import {
  FileCode,
  FolderOpen,
  Clock,
  Star,
  ArrowRight,
  Search,
  Command,
  Sparkles,
  GitBranch,
  Zap,
  Cpu,
  Palette
} from 'lucide-react'
import './StartPage.css'

const recentFiles = [
  { name: 'app.jsx', path: '/src/components/app.jsx', time: '2 min ago' },
  { name: 'styles.css', path: '/src/styles/styles.css', time: '15 min ago' },
  { name: 'utils.js', path: '/src/utils/utils.js', time: '1 hour ago' },
  { name: 'index.html', path: '/public/index.html', time: '3 hours ago' },
  { name: 'package.json', path: '/package.json', time: 'Yesterday' },
]

const templates = [
  { name: 'React Component', icon: FileCode, color: '#61dafb' },
  { name: 'Node.js Server', icon: Zap, color: '#68a063' },
  { name: 'Python Script', icon: FileCode, color: '#3776ab' },
  { name: 'CSS Module', icon: FileCode, color: '#264de4' },
]

function StartPage({ onOpenFile, onNavigate }) {
  return (
    <div className="start-page">
      <div className="start-content">
        <div className="start-hero">
          <div className="hero-logo">
            <Cpu size={48} />
          </div>
          <h1 className="hero-title">Welcome to KRO</h1>
          <p className="hero-subtitle">A clean, minimalist glassmorphism IDE</p>
          
          <div className="hero-search">
            <Search size={18} />
            <input type="text" placeholder="Search files, commands, or documentation..." onClick={(e) => e.stopPropagation()} />
            <div className="search-shortcut">
              <kbd>Ctrl</kbd>
              <kbd>K</kbd>
            </div>
          </div>
        </div>

        <div className="start-grid">
          <div className="start-section">
            <div className="section-header">
              <Clock size={16} />
              <h3>Recent Files</h3>
            </div>
            <div className="recent-list">
              {recentFiles.map((file, index) => (
                <button
                  key={index}
                  className="recent-item"
                  onClick={onOpenFile}
                >
                  <FileCode size={16} className="file-icon" />
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-path">{file.path}</span>
                  </div>
                  <span className="file-time">{file.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="start-section">
            <div className="section-header">
              <Star size={16} />
              <h3>Quick Start</h3>
            </div>
            <div className="template-grid">
              {templates.map((template, index) => (
                <button
                  key={index}
                  className="template-card"
                  onClick={onOpenFile}
                >
                  <div className="template-icon" style={{ background: template.color + '20', color: template.color }}>
                    <template.icon size={20} />
                  </div>
                  <span className="template-name">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="start-section">
            <div className="section-header">
              <Command size={16} />
              <h3>Quick Actions</h3>
            </div>
            <div className="actions-list">
              <button className="action-item" onClick={onOpenFile}>
                <FolderOpen size={16} />
                <span>Open Folder</span>
                <ArrowRight size={14} />
              </button>
              <button className="action-item" onClick={onOpenFile}>
                <FileCode size={16} />
                <span>New File</span>
                <ArrowRight size={14} />
              </button>
              <button className="action-item" onClick={onOpenFile}>
                <GitBranch size={16} />
                <span>Clone Repository</span>
                <ArrowRight size={14} />
              </button>
              {onNavigate && (
                <button className="action-item" onClick={() => onNavigate('theme-studio')}>
                  <Palette size={16} />
                  <span>Theme Studio</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="start-footer">
          <span>Press</span>
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>Shift</kbd>
          <span>+</span>
          <kbd>P</kbd>
          <span>to open Command Palette</span>
        </div>
      </div>
    </div>
  )
}

export default StartPage

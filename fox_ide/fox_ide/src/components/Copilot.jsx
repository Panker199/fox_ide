import React, { useState, useRef, useEffect } from 'react'
import {
  Cpu,
  Send,
  Code2,
  Copy,
  Check,
  Plus,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Maximize2,
  RefreshCw,
  Search,
  Filter,
  PanelRightOpen,
  Mic,
  ArrowUp,
  Paperclip,
  Globe,
  Shield,
  Sparkles,
  Wand2,
  ShieldCheck,
  Rocket,
  FileCode,
  Terminal,
  Bug,
  Layers,
  Lightbulb,
  X,
} from 'lucide-react'
import useCopilot from '../hooks/useCopilot'
import './Copilot.css'

const MODES = [
  { id: 'agent', label: 'Agent', icon: Cpu },
  { id: 'ask', label: 'Ask', icon: Sparkles },
  { id: 'review', label: 'Review', icon: ShieldCheck },
  { id: 'build', label: 'Build', icon: Rocket },
]

const MOCK_SESSIONS = [
  { id: 1, title: 'Code missing components', additions: 361, deletions: 174, time: '11 mins ago' },
  { id: 2, title: 'Fix white screen issue', additions: 1, deletions: 2, time: '22 mins ago' },
]

function Copilot({ onClose, context = null }) {
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [mode, setMode] = useState('agent')
  const [showSessions, setShowSessions] = useState(true)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const modeMenuRef = useRef(null)

  const {
    messages,
    isTyping,
    sendMessage,
    explainCode,
    refactorCode,
    fixCode,
    generateCode,
    clearMessages
  } = useCopilot()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target)) {
        setShowModeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input, context, mode)
    setInput('')
    setShowSessions(false)
  }

  const handleKeyDown = (e) => {
    e.stopPropagation()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleNewChat = () => {
    clearMessages()
    setShowSessions(true)
  }

  const renderMessageContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '')
        const codeId = `code-${i}`
        return (
          <div key={i} className="cp-code-block">
            <div className="cp-code-header">
              <Code2 size={12} />
              <span>Code</span>
              <button className="cp-code-copy" onClick={() => handleCopy(code, codeId)}>
                {copiedId === codeId ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>
            <pre><code>{code}</code></pre>
          </div>
        )
      }
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={i} className="cp-inline-code">{part.slice(1, -1)}</code>
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i}>{part.slice(2, -2)}</strong>
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </React.Fragment>
      ))
    })
  }

  const activeMode = MODES.find(m => m.id === mode)

  return (
    <div className="cp-panel" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-left">
          <span className="cp-title">Chat</span>
        </div>
        <div className="cp-header-right">
          <button className="cp-header-btn" title="New Chat" onClick={handleNewChat}>
            <Plus size={14} />
          </button>
          <button className="cp-header-btn" title="Settings">
            <Settings size={14} />
          </button>
          <button className="cp-header-btn" title="More">
            <MoreHorizontal size={14} />
          </button>
          <button className="cp-header-btn" title="Fullscreen">
            <Maximize2 size={14} />
          </button>
          <button className="cp-header-btn" title="Close" onClick={onClose}>
            <span className="cp-close-x">&times;</span>
          </button>
        </div>
      </div>

      {/* Sessions Bar */}
      <div className="cp-sessions-bar">
        <span className="cp-sessions-label">Sessions</span>
        <div className="cp-sessions-actions">
          <button className="cp-sessions-btn" title="Refresh"><RefreshCw size={12} /></button>
          <button className="cp-sessions-btn" title="Search"><Search size={12} /></button>
          <button className="cp-sessions-btn" title="Filter"><Filter size={12} /></button>
          <button className="cp-sessions-btn" title="Toggle Sidebar"><PanelRightOpen size={12} /></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="cp-content">
        {showSessions ? (
          <div className="cp-sessions-list">
            {MOCK_SESSIONS.map((session) => (
              <div key={session.id} className="cp-session-item">
                <div className="cp-session-dot" />
                <div className="cp-session-info">
                  <span className="cp-session-title">{session.title}</span>
                  <span className="cp-session-meta">
                    <span className="cp-session-add">+{session.additions}</span>
                    <span className="cp-session-del">-{session.deletions}</span>
                    <span className="cp-session-time">&middot; {session.time}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cp-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`cp-msg ${msg.role}`}>
                <div className={`cp-avatar ${msg.role}`}>
                  {msg.role === 'assistant' ? <Cpu size={14} /> : <span>U</span>}
                </div>
                <div className="cp-msg-body">
                  <div className="cp-msg-content">
                    {renderMessageContent(msg.content)}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="cp-msg-actions">
                      <button onClick={() => handleCopy(msg.content, msg.id)} title="Copy">
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="cp-msg assistant">
                <div className="cp-avatar assistant"><Cpu size={14} /></div>
                <div className="cp-msg-body">
                  <div className="cp-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="cp-tip">
        <span>Tip: Try the </span>
        <span className="cp-tip-link">Plan agent</span>
        <span> to research and plan before implementing changes.</span>
      </div>

      {/* Input Area */}
      <div className="cp-input-area">
        <div className="cp-input-box">
          <textarea
            ref={inputRef}
            className="cp-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what to build"
            rows={1}
          />
        </div>
        <div className="cp-input-toolbar">
          <div className="cp-toolbar-left">
            <button className="cp-toolbar-btn" title="Add Context">
              <Plus size={14} />
            </button>
            <div className="cp-mode-select" ref={modeMenuRef}>
              <button className="cp-toolbar-btn cp-mode-trigger" onClick={() => setShowModeMenu(!showModeMenu)}>
                {activeMode && <activeMode.icon size={13} />}
                <span>{activeMode?.label}</span>
                <ChevronDown size={12} />
              </button>
              {showModeMenu && (
                <div className="cp-mode-menu">
                  {MODES.map((m) => {
                    const Icon = m.icon
                    return (
                      <button
                        key={m.id}
                        className={`cp-mode-menu-item ${mode === m.id ? 'active' : ''}`}
                        onClick={() => { setMode(m.id); setShowModeMenu(false) }}
                      >
                        <Icon size={13} />
                        <span>{m.label}</span>
                        {mode === m.id && <Check size={12} />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <button className="cp-toolbar-btn" title="Auto">
              <Sparkles size={13} />
              <span>Auto</span>
            </button>
            <button className="cp-toolbar-btn" title="Settings">
              <Settings size={13} />
            </button>
          </div>
          <div className="cp-toolbar-right">
            <button className="cp-toolbar-btn" title="Voice Input">
              <Mic size={14} />
            </button>
            <button
              className={`cp-send-btn ${input.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!input.trim()}
              title="Send"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cp-footer">
        <span className="cp-footer-badge">
          <Globe size={10} />
          Local
        </span>
        <span className="cp-footer-badge">
          <Shield size={10} />
          Default permissions
        </span>
      </div>
    </div>
  )
}

export default Copilot

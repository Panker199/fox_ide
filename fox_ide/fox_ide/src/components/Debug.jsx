import React, { useState } from 'react'
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RotateCcw,
  Bug,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Variable,
  Layers,
  Circle,
  Eye,
  AlertCircle
} from 'lucide-react'
import './Debug.css'

const callStack = [
  { name: 'fibonacci', file: 'app.js', line: 5 },
  { name: 'calculateSequence', file: 'app.js', line: 15 },
  { name: 'main', file: 'app.js', line: 25 },
]

const variables = [
  { name: 'n', value: '5', type: 'number' },
  { name: 'results', value: '[0, 1, 1, 2, 3]', type: 'array' },
  { name: 'i', value: '4', type: 'number' },
]

const breakpoints = [
  { file: 'app.js', line: 5, enabled: true },
  { file: 'app.js', line: 15, enabled: true },
  { file: 'utils.js', line: 12, enabled: false },
]

const watches = [
  { expression: 'n > 1', value: 'true' },
  { expression: 'fibonacci(3)', value: '2' },
]

function Debug({ onBack }) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentLine, setCurrentLine] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    callstack: true,
    variables: true,
    breakpoints: true,
    watches: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="debug-container">
      <div className="debug-header">
        <div className="debug-title">
          {onBack && (
            <button className="debug-back-btn" onClick={onBack} title="Back">
              <ChevronLeft size={16} />
            </button>
          )}
          <Bug size={16} />
          <span>Run and Debug</span>
        </div>
        <div className="debug-controls">
          <button 
            className={`debug-btn play ${isRunning ? 'running' : ''}`}
            onClick={() => setIsRunning(!isRunning)}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button className="debug-btn stop" title="Stop" onClick={() => { setIsRunning(false); setCurrentLine(null) }}>
            <Square size={14} />
          </button>
          <button className="debug-btn" title="Restart" onClick={() => { setIsRunning(true); setCurrentLine(callStack[0]?.line || 1) }}>
            <RotateCcw size={14} />
          </button>
          <button className="debug-btn" title="Step Over" onClick={() => {
            if (!isRunning) return
            setCurrentLine(prev => (prev || callStack[0]?.line || 1) + 1)
          }}>
            <SkipForward size={14} />
          </button>
          <button className="debug-btn" title="Step Into" onClick={() => {
            if (!isRunning) return
            setCurrentLine(prev => (prev || callStack[0]?.line || 1) + 1)
          }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="debug-body">
        {/* Call Stack */}
        <div className="debug-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('callstack')}
          >
            <div className="section-label">
              <Layers size={14} />
              <span>Call Stack</span>
            </div>
            {expandedSections.callstack ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {expandedSections.callstack && (
            <div className="section-content">
              {callStack.map((frame, index) => (
                <div key={index} className="debug-item">
                  <span className="item-name">{frame.name}</span>
                  <span className="item-location">{frame.file}:{frame.line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variables */}
        <div className="debug-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('variables')}
          >
            <div className="section-label">
              <Variable size={14} />
              <span>Variables</span>
            </div>
            {expandedSections.variables ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {expandedSections.variables && (
            <div className="section-content">
              {variables.map((v, index) => (
                <div key={index} className="debug-item">
                  <span className="item-name">{v.name}</span>
                  <span className="item-value">{v.value}</span>
                  <span className="item-type">{v.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watch */}
        <div className="debug-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('watches')}
          >
            <div className="section-label">
              <Eye size={14} />
              <span>Watch</span>
            </div>
            {expandedSections.watches ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {expandedSections.watches && (
            <div className="section-content">
              {watches.map((w, index) => (
                <div key={index} className="debug-item">
                  <span className="item-expression">{w.expression}</span>
                  <span className="item-value">{w.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Breakpoints */}
        <div className="debug-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('breakpoints')}
          >
            <div className="section-label">
              <Circle size={14} />
              <span>Breakpoints</span>
            </div>
            {expandedSections.breakpoints ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {expandedSections.breakpoints && (
            <div className="section-content">
              {breakpoints.map((bp, index) => (
                <div key={index} className="debug-item breakpoint">
                  <div className={`bp-dot ${bp.enabled ? 'enabled' : 'disabled'}`}></div>
                  <span className="item-name">{bp.file}</span>
                  <span className="item-location">Line {bp.line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="debug-status">
        <AlertCircle size={12} />
        <span>{isRunning ? 'Running' : 'Ready'}</span>
      </div>
    </div>
  )
}

export default Debug

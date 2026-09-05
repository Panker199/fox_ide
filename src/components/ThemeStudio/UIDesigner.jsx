import React, { useState, useEffect } from 'react'
import {
  Palette,
  Plus,
  Trash2,
  Move,
  Copy,
  Eye,
  EyeOff,
  Code,
  Layers,
  Settings,
  Mouse,
  Type,
  Square,
  Circle,
  Minus,
  Image,
  Table,
  FormInput,
  Layout,
  Navigation,
  Columns,
  PanelLeft,
  PanelRight,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Undo,
  Redo,
  Wand2,
  Sparkles,
  Bell,
} from 'lucide-react'

const ELEMENT_CATEGORIES = [
  {
    name: 'Basic',
    items: [
      { id: 'button', name: 'Button', icon: Square },
      { id: 'input', name: 'Input', icon: Type },
      { id: 'badge', name: 'Badge', icon: Circle },
      { id: 'avatar', name: 'Avatar', icon: Circle },
      { id: 'divider', name: 'Divider', icon: Minus },
    ],
  },
  {
    name: 'Layout',
    items: [
      { id: 'container', name: 'Container', icon: Layout },
      { id: 'grid', name: 'Grid', icon: Columns },
      { id: 'card', name: 'Card', icon: Square },
      { id: 'tabs', name: 'Tabs', icon: PanelLeft },
    ],
  },
  {
    name: 'Navigation',
    items: [
      { id: 'navbar', name: 'Navbar', icon: Navigation },
      { id: 'sidebar', name: 'Sidebar', icon: PanelLeft },
      { id: 'breadcrumb', name: 'Breadcrumb', icon: ChevronRight },
      { id: 'pagination', name: 'Pagination', icon: ChevronRight },
    ],
  },
  {
    name: 'Data',
    items: [
      { id: 'table', name: 'Table', icon: Table },
      { id: 'list', name: 'List', icon: Layers },
      { id: 'stat', name: 'Stat Card', icon: Square },
    ],
  },
  {
    name: 'Feedback',
    items: [
      { id: 'modal', name: 'Modal', icon: Square },
      { id: 'toast', name: 'Toast', icon: Bell },
      { id: 'alert', name: 'Alert', icon: Square },
      { id: 'tooltip', name: 'Tooltip', icon: Type },
    ],
  },
]

function ElementRenderer({ element, colors }) {
  const bgColor = colors['--bg-primary'] || '#0d1117'
  const surfaceColor = colors['--bg-secondary'] || '#161b22'
  const accentColor = colors['--accent'] || '#58a6ff'
  const textColor = colors['--text-primary'] || '#e6edf3'

  switch (element.type) {
    case 'button':
      return (
        <button style={{
          background: accentColor,
          color: bgColor,
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          {element.props?.text || 'Button'}
        </button>
      )
    case 'input':
      return (
        <input
          type="text"
          placeholder={element.props?.placeholder || 'Enter text...'}
          style={{
            background: surfaceColor,
            border: `1px solid ${accentColor}40`,
            color: textColor,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            width: '200px',
          }}
        />
      )
    case 'card':
      return (
        <div style={{
          background: surfaceColor,
          border: `1px solid ${accentColor}20`,
          borderRadius: '8px',
          padding: '16px',
          minWidth: '200px',
        }}>
          <div style={{ color: textColor, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            {element.props?.title || 'Card Title'}
          </div>
          <div style={{ color: `${textColor}99`, fontSize: '12px' }}>
            {element.props?.content || 'Card content goes here'}
          </div>
        </div>
      )
    case 'navbar':
      return (
        <div style={{
          background: surfaceColor,
          borderBottom: `1px solid ${accentColor}20`,
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}>
          <span style={{ color: accentColor, fontWeight: '700', fontSize: '16px' }}>Logo</span>
          <span style={{ color: textColor, fontSize: '13px' }}>Home</span>
          <span style={{ color: `${textColor}66`, fontSize: '13px' }}>About</span>
          <span style={{ color: `${textColor}66`, fontSize: '13px' }}>Contact</span>
        </div>
      )
    case 'table':
      return (
        <table style={{
          background: surfaceColor,
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '12px',
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${accentColor}20` }}>
              <th style={{ padding: '8px', textAlign: 'left', color: textColor }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left', color: textColor }}>Status</th>
              <th style={{ padding: '8px', textAlign: 'left', color: textColor }}>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${accentColor}10` }}>
              <td style={{ padding: '8px', color: textColor }}>John</td>
              <td style={{ padding: '8px', color: '#3fb950' }}>Active</td>
              <td style={{ padding: '8px', color: `${textColor}99` }}>Admin</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: textColor }}>Jane</td>
              <td style={{ padding: '8px', color: '#d29922' }}>Pending</td>
              <td style={{ padding: '8px', color: `${textColor}99` }}>User</td>
            </tr>
          </tbody>
        </table>
      )
    case 'hero':
      return (
        <div style={{
          background: `linear-gradient(135deg, ${bgColor}, ${surfaceColor})`,
          padding: '40px 20px',
          textAlign: 'center',
          width: '100%',
          borderRadius: '8px',
        }}>
          <h2 style={{ color: textColor, fontSize: '24px', marginBottom: '12px' }}>
            {element.props?.title || 'Hero Title'}
          </h2>
          <p style={{ color: `${textColor}99`, fontSize: '14px', marginBottom: '20px' }}>
            {element.props?.subtitle || 'Subtitle text goes here'}
          </p>
          <button style={{
            background: accentColor,
            color: bgColor,
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Get Started
          </button>
        </div>
      )
    default:
      return (
        <div style={{
          background: surfaceColor,
          border: `1px dashed ${accentColor}40`,
          padding: '12px',
          borderRadius: '6px',
          color: `${textColor}66`,
          fontSize: '12px',
          textAlign: 'center',
        }}>
          {element.type}
        </div>
      )
  }
}

export default function UIDesigner({
  project,
  colors,
  setColors,
  elements,
  setElements,
  showPreview,
  setShowPreview,
  onSave,
  onExport,
  onApply,
  onBack,
}) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [draggedElement, setDraggedElement] = useState(null)
  const [history, setHistory] = useState([elements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Basic')
  const [previewMode, setPreviewMode] = useState('desktop')

  useEffect(() => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), elements])
    setHistoryIndex(prev => prev + 1)
  }, [elements])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const addElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      props: {},
      order: elements.length,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const removeElement = (id) => {
    setElements(elements.filter(e => e.id !== id))
    if (selectedElement === id) setSelectedElement(null)
  }

  const duplicateElement = (id) => {
    const element = elements.find(e => e.id === id)
    if (element) {
      const newElement = { ...element, id: Date.now().toString(), order: elements.length }
      setElements([...elements, newElement])
    }
  }

  const updateElementProps = (id, props) => {
    setElements(elements.map(e =>
      e.id === id ? { ...e, props: { ...e.props, ...props } } : e
    ))
  }

  const moveElement = (id, direction) => {
    const idx = elements.findIndex(e => e.id === id)
    if (idx === -1) return
    const newElements = [...elements]
    if (direction === 'up' && idx > 0) {
      [newElements[idx - 1], newElements[idx]] = [newElements[idx], newElements[idx - 1]]
    } else if (direction === 'down' && idx < elements.length - 1) {
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]]
    }
    setElements(newElements)
  }

  const generateCode = () => {
    const bgColor = colors['--bg-primary'] || '#0d1117'
    const surfaceColor = colors['--bg-secondary'] || '#161b22'
    const accentColor = colors['--accent'] || '#58a6ff'
    const textColor = colors['--text-primary'] || '#e6edf3'

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project?.name || 'My Project'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${bgColor};
      color: ${textColor};
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
${elements.map(el => `    <!-- ${el.type} -->\n    <div class="${el.type}">${el.props?.text || el.type}</div>`).join('\n\n')}
  </div>
</body>
</html>`
  }

  const selectedEl = elements.find(e => e.id === selectedElement)
  const activeCategoryData = ELEMENT_CATEGORIES.find(c => c.name === activeCategory)

  return (
    <div className="ud-designer">
      <div className="ud-toolbar">
        <div className="ud-toolbar-left">
          <button className="ts-btn ts-btn-ghost" onClick={onBack}>
            ← Projects
          </button>
          <div className="ud-history-btns">
            <button className="ts-btn-icon" onClick={undo} disabled={historyIndex === 0}>
              <Undo size={14} />
            </button>
            <button className="ts-btn-icon" onClick={redo} disabled={historyIndex === history.length - 1}>
              <Redo size={14} />
            </button>
          </div>
        </div>
        <div className="ud-toolbar-center">
          <div className="ud-preview-modes">
            <button className={`ud-mode-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => setPreviewMode('desktop')}>
              Desktop
            </button>
            <button className={`ud-mode-btn ${previewMode === 'tablet' ? 'active' : ''}`} onClick={() => setPreviewMode('tablet')}>
              Tablet
            </button>
            <button className={`ud-mode-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => setPreviewMode('mobile')}>
              Mobile
            </button>
          </div>
        </div>
        <div className="ud-toolbar-right">
          <button className={`ts-btn ts-btn-ghost ${showCode ? 'active' : ''}`} onClick={() => setShowCode(!showCode)}>
            <Code size={14} /> Code
          </button>
          <button className="ts-btn ts-btn-ghost" onClick={onSave}>
            Save
          </button>
          <button className="ts-btn ts-btn-primary" onClick={onApply}>
            Apply Theme
          </button>
        </div>
      </div>

      <div className="ud-workspace">
        <div className="ud-panel ud-elements-panel">
          <div className="ud-panel-header">
            <Layers size={14} />
            <span>Elements</span>
          </div>
          <div className="ud-categories">
            {ELEMENT_CATEGORIES.map(cat => (
              <button
                key={cat.name}
                className={`ud-cat-btn ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="ud-elements-grid">
            {activeCategoryData?.items.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className="ud-element-btn"
                  onClick={() => addElement(item.id)}
                  draggable
                  onDragStart={() => setDraggedElement(item.id)}
                >
                  <Icon size={14} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="ud-canvas-wrap">
          {showCode ? (
            <div className="ud-code-panel">
              <div className="ud-code-header">
                <Code size={14} />
                <span>Generated HTML</span>
                <button className="ts-btn ts-btn-ghost" onClick={() => navigator.clipboard.writeText(generateCode())}>
                  Copy
                </button>
              </div>
              <pre className="ud-code">{generateCode()}</pre>
            </div>
          ) : (
            <div className={`ud-canvas ud-canvas-${previewMode}`}>
              <div
                className="ud-canvas-inner"
                style={{
                  background: colors['--bg-primary'] || '#0d1117',
                  minHeight: '400px',
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedElement) {
                    addElement(draggedElement)
                    setDraggedElement(null)
                  }
                }}
              >
                {elements.length === 0 ? (
                  <div className="ud-empty-canvas">
                    <Sparkles size={32} />
                    <p>Drag elements here or click to add</p>
                  </div>
                ) : (
                  elements.map(element => (
                    <div
                      key={element.id}
                      className={`ud-canvas-element ${selectedElement === element.id ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedElement(element.id) }}
                    >
                      <div className="ud-element-actions">
                        <button onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'up') }}>
                          ↑
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'down') }}>
                          ↓
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); duplicateElement(element.id) }}>
                          <Copy size={10} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeElement(element.id) }}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                      <ElementRenderer element={element} colors={colors} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ud-panel ud-properties-panel">
          <div className="ud-panel-header">
            <Settings size={14} />
            <span>Properties</span>
          </div>
          {selectedEl ? (
            <div className="ud-props-content">
              <div className="ud-prop-group">
                <label>Type</label>
                <span className="ud-prop-type">{selectedEl.type}</span>
              </div>
              {selectedEl.type === 'button' && (
                <div className="ud-prop-group">
                  <label>Text</label>
                  <input
                    type="text"
                    value={selectedEl.props?.text || ''}
                    onChange={(e) => updateElementProps(selectedEl.id, { text: e.target.value })}
                  />
                </div>
              )}
              {selectedEl.type === 'input' && (
                <div className="ud-prop-group">
                  <label>Placeholder</label>
                  <input
                    type="text"
                    value={selectedEl.props?.placeholder || ''}
                    onChange={(e) => updateElementProps(selectedEl.id, { placeholder: e.target.value })}
                  />
                </div>
              )}
              {selectedEl.type === 'card' && (
                <>
                  <div className="ud-prop-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={selectedEl.props?.title || ''}
                      onChange={(e) => updateElementProps(selectedEl.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="ud-prop-group">
                    <label>Content</label>
                    <textarea
                      value={selectedEl.props?.content || ''}
                      onChange={(e) => updateElementProps(selectedEl.id, { content: e.target.value })}
                    />
                  </div>
                </>
              )}
              {selectedEl.type === 'hero' && (
                <>
                  <div className="ud-prop-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={selectedEl.props?.title || ''}
                      onChange={(e) => updateElementProps(selectedEl.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="ud-prop-group">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={selectedEl.props?.subtitle || ''}
                      onChange={(e) => updateElementProps(selectedEl.id, { subtitle: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="ud-props-empty">
              <Mouse size={24} />
              <p>Select an element to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

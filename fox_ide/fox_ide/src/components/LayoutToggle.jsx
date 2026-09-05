import React from 'react'
import {
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
  PanelBottom,
  PanelBottomClose,
  Columns2,
  Rows2,
  Maximize2
} from 'lucide-react'
import './LayoutToggle.css'

const layouts = [
  { id: 'sidebar-left', icon: PanelLeft, label: 'Sidebar Left' },
  { id: 'sidebar-right', icon: PanelRight, label: 'Sidebar Right' },
  { id: 'panel-bottom', icon: PanelBottom, label: 'Bottom Panel' },
  { id: 'split-horizontal', icon: Columns2, label: 'Split Horizontal' },
  { id: 'split-vertical', icon: Rows2, label: 'Split Vertical' },
  { id: 'fullscreen', icon: Maximize2, label: 'Fullscreen' },
]

function LayoutToggle({ activeLayout, onLayoutChange }) {
  return (
    <div className="layout-toggle">
      {layouts.map(layout => (
        <button
          key={layout.id}
          className={`layout-btn ${activeLayout === layout.id ? 'active' : ''}`}
          onClick={() => onLayoutChange(layout.id)}
          title={layout.label}
        >
          <layout.icon size={14} />
        </button>
      ))}
    </div>
  )
}

export default LayoutToggle

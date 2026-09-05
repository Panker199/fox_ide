import React, { useState } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  FileCode,
  Crown,
  Layout,
  Package,
  Zap,
  Paintbrush,
  Check,
} from 'lucide-react'

const TEMPLATE_ICONS = {
  blank: FileCode,
  portfolio: Crown,
  dashboard: Layout,
  ecommerce: Package,
  blog: FileCode,
  saas: Zap,
}

const COLOR_PRESETS = [
  { name: 'Ocean', colors: { '--accent': '#0ea5e9', '--bg-primary': '#0c4a6e', '--bg-secondary': '#082f49' } },
  { name: 'Forest', colors: { '--accent': '#22c55e', '--bg-primary': '#14532d', '--bg-secondary': '#052e16' } },
  { name: 'Sunset', colors: { '--accent': '#f97316', '--bg-primary': '#7c2d12', '--bg-secondary': '#431407' } },
  { name: 'Purple', colors: { '--accent': '#a855f7', '--bg-primary': '#581c87', '--bg-secondary': '#3b0764' } },
  { name: 'Rose', colors: { '--accent': '#f43f5e', '--bg-primary': '#881337', '--bg-secondary': '#4c0519' } },
  { name: 'Slate', colors: { '--accent': '#64748b', '--bg-primary': '#1e293b', '--bg-secondary': '#0f172a' } },
  { name: 'Amber', colors: { '--accent': '#f59e0b', '--bg-primary': '#78350f', '--bg-secondary': '#451a03' } },
  { name: 'Teal', colors: { '--accent': '#14b8a6', '--bg-primary': '#134e4a', '--bg-secondary': '#042f2e' } },
]

export default function ProjectCreator({
  templates,
  projectName,
  setProjectName,
  selectedTemplate,
  setSelectedTemplate,
  customColors,
  setCustomColors,
  onNext,
  onBack,
}) {
  const [step, setStep] = useState('name')
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.name)
    setCustomColors(preset.colors)
  }

  const handleColorChange = (key, value) => {
    setCustomColors(prev => ({ ...prev, [key]: value }))
    setSelectedPreset(null)
  }

  return (
    <div className="pc-creator">
      <div className="pc-header">
        <button className="ts-btn ts-btn-ghost" onClick={onBack}>
          <ChevronLeft size={14} /> Back
        </button>
        <h2>New Project</h2>
        <div className="pc-steps">
          <span className={`pc-step ${step === 'name' ? 'active' : ''}`}>1. Name</span>
          <ChevronRight size={12} />
          <span className={`pc-step ${step === 'template' ? 'active' : ''}`}>2. Template</span>
          <ChevronRight size={12} />
          <span className={`pc-step ${step === 'colors' ? 'active' : ''}`}>3. Colors</span>
        </div>
      </div>

      <div className="pc-body">
        {step === 'name' && (
          <div className="pc-step-content">
            <h3>What's your project name?</h3>
            <p>Choose a name for your project</p>
            <input
              type="text"
              className="pc-name-input"
              placeholder="My Awesome Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
            />
            <div className="pc-step-actions">
              <button className="ts-btn ts-btn-primary" onClick={() => setStep('template')}>
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 'template' && (
          <div className="pc-step-content">
            <h3>Choose a template</h3>
            <p>Select a starting point for your project</p>
            <div className="pc-templates">
              {templates.map(template => {
                const Icon = TEMPLATE_ICONS[template.id] || FileCode
                return (
                  <div
                    key={template.id}
                    className={`pc-template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="pc-template-preview" style={{ background: template.colors['--bg-primary'] }}>
                      <div className="pc-template-dots">
                        <span style={{ background: '#ff5f57' }} />
                        <span style={{ background: '#febc2e' }} />
                        <span style={{ background: '#28c840' }} />
                      </div>
                      <div className="pc-template-accent" style={{ background: template.colors['--accent'] }} />
                    </div>
                    <div className="pc-template-info">
                      <Icon size={16} />
                      <span className="pc-template-name">{template.name}</span>
                      <span className="pc-template-desc">{template.description}</span>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="pc-template-check">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="pc-step-actions">
              <button className="ts-btn ts-btn-ghost" onClick={() => setStep('name')}>
                <ChevronLeft size={14} /> Back
              </button>
              <button
                className="ts-btn ts-btn-primary"
                onClick={() => setStep('colors')}
                disabled={!selectedTemplate}
              >
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 'colors' && (
          <div className="pc-step-content">
            <h3>Customize colors</h3>
            <p>Pick a color preset or customize manually</p>

            <div className="pc-presets">
              <h4>Color Presets</h4>
              <div className="pc-preset-grid">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    className={`pc-preset-btn ${selectedPreset === preset.name ? 'selected' : ''}`}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <div className="pc-preset-colors">
                      <span style={{ background: preset.colors['--bg-primary'] }} />
                      <span style={{ background: preset.colors['--bg-secondary'] }} />
                      <span style={{ background: preset.colors['--accent'] }} />
                    </div>
                    <span className="pc-preset-name">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pc-custom-colors">
              <h4>Custom Colors</h4>
              <div className="pc-color-inputs">
                <div className="pc-color-field">
                  <label>Background Primary</label>
                  <div className="pc-color-input-wrap">
                    <input
                      type="color"
                      value={customColors['--bg-primary'] || '#0d1117'}
                      onChange={(e) => handleColorChange('--bg-primary', e.target.value)}
                    />
                    <input
                      type="text"
                      value={customColors['--bg-primary'] || '#0d1117'}
                      onChange={(e) => handleColorChange('--bg-primary', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pc-color-field">
                  <label>Background Secondary</label>
                  <div className="pc-color-input-wrap">
                    <input
                      type="color"
                      value={customColors['--bg-secondary'] || '#161b22'}
                      onChange={(e) => handleColorChange('--bg-secondary', e.target.value)}
                    />
                    <input
                      type="text"
                      value={customColors['--bg-secondary'] || '#161b22'}
                      onChange={(e) => handleColorChange('--bg-secondary', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pc-color-field">
                  <label>Accent</label>
                  <div className="pc-color-input-wrap">
                    <input
                      type="color"
                      value={customColors['--accent'] || '#58a6ff'}
                      onChange={(e) => handleColorChange('--accent', e.target.value)}
                    />
                    <input
                      type="text"
                      value={customColors['--accent'] || '#58a6ff'}
                      onChange={(e) => handleColorChange('--accent', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pc-step-actions">
              <button className="ts-btn ts-btn-ghost" onClick={() => setStep('template')}>
                <ChevronLeft size={14} /> Back
              </button>
              <button className="ts-btn ts-btn-primary" onClick={onNext}>
                <Paintbrush size={14} /> Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

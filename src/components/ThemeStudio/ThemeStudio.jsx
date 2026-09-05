import React, { useState, useEffect, useCallback } from 'react'
import {
  Palette,
  Plus,
  FolderOpen,
  Save,
  Download,
  Upload,
  Trash2,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Wand2,
  Paintbrush,
  Layout,
  Layers,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Copy,
  FileCode,
  Folder,
  Package,
  Zap,
  Sparkles,
  Crown,
} from 'lucide-react'
import ProjectCreator from './ProjectCreator'
import UIDesigner from './UIDesigner'
import ThemeLoader from './ThemeLoader'
import './ThemeStudio.css'

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Project',
    icon: FileCode,
    description: 'Start from scratch with a clean slate',
    colors: {
      '--bg-primary': '#0d1117',
      '--bg-secondary': '#161b22',
      '--accent': '#58a6ff',
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: Crown,
    description: 'Personal portfolio with dark theme',
    colors: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#14141f',
      '--accent': '#a78bfa',
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Layout,
    description: 'Admin dashboard with sidebar layout',
    colors: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--accent': '#38bdf8',
    },
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    icon: Package,
    description: 'Online store with product cards',
    colors: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--accent': '#f97316',
    },
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: FileCode,
    description: 'Clean blog with reading focus',
    colors: {
      '--bg-primary': '#fefce8',
      '--bg-secondary': '#fef9c3',
      '--accent': '#ca8a04',
    },
  },
  {
    id: 'saas',
    name: 'SaaS App',
    icon: Zap,
    description: 'Modern SaaS landing page',
    colors: {
      '--bg-primary': '#030712',
      '--bg-secondary': '#111827',
      '--accent': '#6366f1',
    },
  },
]

const UI_ELEMENTS = [
  { id: 'button', name: 'Button', category: 'basic' },
  { id: 'input', name: 'Input', category: 'basic' },
  { id: 'card', name: 'Card', category: 'basic' },
  { id: 'navbar', name: 'Navbar', category: 'layout' },
  { id: 'sidebar', name: 'Sidebar', category: 'layout' },
  { id: 'modal', name: 'Modal', category: 'overlay' },
  { id: 'table', name: 'Table', category: 'data' },
  { id: 'form', name: 'Form', category: 'data' },
  { id: 'hero', name: 'Hero Section', category: 'sections' },
  { id: 'footer', name: 'Footer', category: 'sections' },
]

export default function ThemeStudio({ onClose }) {
  const [step, setStep] = useState('landing')
  const [projectName, setProjectName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customColors, setCustomColors] = useState({})
  const [uiElements, setUiElements] = useState([])
  const [activeTheme, setActiveTheme] = useState(null)
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [autoLoad, setAutoLoad] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kro-projects')
      if (saved) setProjects(JSON.parse(saved))
    } catch {}
  }, [])

  const saveProjects = (updated) => {
    setProjects(updated)
    localStorage.setItem('kro-projects', JSON.stringify(updated))
  }

  const createProject = () => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    const project = {
      id: Date.now().toString(),
      name: projectName || 'Untitled Project',
      template: selectedTemplate,
      colors: { ...template?.colors, ...customColors },
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const updated = [...projects, project]
    saveProjects(updated)
    setActiveProject(project)
    setStep('designer')
  }

  const loadProject = (project) => {
    setActiveProject(project)
    setProjectName(project.name)
    setSelectedTemplate(project.template)
    setCustomColors(project.colors)
    setUiElements(project.elements || [])
    setStep('designer')
  }

  const deleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id)
    saveProjects(updated)
    if (activeProject?.id === id) {
      setActiveProject(null)
      setStep('landing')
    }
  }

  const saveProject = () => {
    if (!activeProject) return
    const updated = projects.map(p =>
      p.id === activeProject.id
        ? { ...p, colors: customColors, elements: uiElements, updatedAt: Date.now() }
        : p
    )
    saveProjects(updated)
    setActiveProject(updated.find(p => p.id === activeProject.id))
  }

  const exportProject = () => {
    const data = {
      project: activeProject,
      colors: customColors,
      elements: uiElements,
      exportedAt: Date.now(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeProject?.name || 'project'}.kro-studio.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importProject = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.project) {
          const project = { ...data.project, id: Date.now().toString(), createdAt: Date.now() }
          const updated = [...projects, project]
          saveProjects(updated)
          loadProject(project)
        }
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const applyThemeToIDE = () => {
    const root = document.documentElement
    Object.entries(customColors).forEach(([key, value]) => {
      const cssVar = key.startsWith('--') ? key : `--${key}`
      root.style.setProperty(cssVar, value)
    })
  }

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return (
          <div className="ts-landing">
            <div className="ts-landing-hero">
              <div className="ts-logo">
                <Sparkles size={32} />
              </div>
              <h1>Theme Studio</h1>
              <p>Create, design, and customize themes for your projects</p>
            </div>

            <div className="ts-landing-actions">
              <button className="ts-action-card" onClick={() => setStep('new-project')}>
                <Plus size={24} />
                <h3>New Project</h3>
                <p>Start fresh with a template</p>
              </button>
              <button className="ts-action-card" onClick={() => setStep('load')}>
                <FolderOpen size={24} />
                <h3>Load Project</h3>
                <p>Open an existing project</p>
              </button>
              <label className="ts-action-card">
                <Upload size={24} />
                <h3>Import</h3>
                <p>Import a .kro-studio file</p>
                <input type="file" accept=".json" onChange={importProject} hidden />
              </label>
            </div>

            {projects.length > 0 && (
              <div className="ts-recent">
                <h3>Recent Projects</h3>
                <div className="ts-recent-list">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="ts-recent-item" onClick={() => loadProject(project)}>
                      <div className="ts-recent-swatch" style={{ background: project.colors?.['--bg-secondary'] || '#1a1a2e' }}>
                        <div className="ts-recent-accent" style={{ background: project.colors?.['--accent'] || '#58a6ff' }} />
                      </div>
                      <div className="ts-recent-info">
                        <span className="ts-recent-name">{project.name}</span>
                        <span className="ts-recent-date">{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <button className="ts-recent-delete" onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'new-project':
        return (
          <ProjectCreator
            templates={TEMPLATES}
            projectName={projectName}
            setProjectName={setProjectName}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            customColors={customColors}
            setCustomColors={setCustomColors}
            onNext={() => setStep('customize')}
            onBack={() => setStep('landing')}
          />
        )

      case 'customize':
        return (
          <ThemeLoader
            colors={customColors}
            setColors={setCustomColors}
            autoLoad={autoLoad}
            setAutoLoad={setAutoLoad}
            onPreview={applyThemeToIDE}
            onNext={() => { createProject(); setStep('designer') }}
            onBack={() => setStep('new-project')}
          />
        )

      case 'load':
        return (
          <div className="ts-load">
            <div className="ts-load-header">
              <h2>Load Project</h2>
              <button className="ts-btn ts-btn-ghost" onClick={() => setStep('landing')}>
                <X size={14} /> Close
              </button>
            </div>
            <div className="ts-load-list">
              {projects.length === 0 ? (
                <div className="ts-empty">
                  <FolderOpen size={48} />
                  <p>No projects yet</p>
                  <button className="ts-btn ts-btn-primary" onClick={() => setStep('new-project')}>
                    <Plus size={14} /> Create One
                  </button>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="ts-load-item" onClick={() => loadProject(project)}>
                    <div className="ts-load-preview" style={{ background: project.colors?.['--bg-primary'] || '#0d1117' }}>
                      <div className="ts-load-dots">
                        <span style={{ background: '#ff5f57' }} />
                        <span style={{ background: '#febc2e' }} />
                        <span style={{ background: '#28c840' }} />
                      </div>
                      <div className="ts-load-lines">
                        <div style={{ background: project.colors?.['--accent'] + '40' || '#58a6ff40' }} />
                        <div style={{ background: (project.colors?.['--text-primary'] || '#ffffff') + '20' }} />
                      </div>
                    </div>
                    <div className="ts-load-info">
                      <span className="ts-load-name">{project.name}</span>
                      <span className="ts-load-template">{project.template || 'custom'}</span>
                      <span className="ts-load-date">{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <button className="ts-btn-icon ts-btn-danger" onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'designer':
        return (
          <UIDesigner
            project={activeProject}
            colors={customColors}
            setColors={setCustomColors}
            elements={uiElements}
            setElements={setUiElements}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            onSave={saveProject}
            onExport={exportProject}
            onApply={applyThemeToIDE}
            onBack={() => setStep('landing')}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="theme-studio">
      <div className="ts-header">
        <div className="ts-header-left">
          <Palette size={18} />
          <h2>Theme Studio</h2>
          {activeProject && (
            <span className="ts-project-badge">{activeProject.name}</span>
          )}
        </div>
        <div className="ts-header-right">
          {step === 'designer' && (
            <>
              <button className="ts-btn ts-btn-ghost" onClick={saveProject}>
                <Save size={14} /> Save
              </button>
              <button className="ts-btn ts-btn-ghost" onClick={exportProject}>
                <Download size={14} /> Export
              </button>
              <button className="ts-btn ts-btn-primary" onClick={applyThemeToIDE}>
                <Play size={14} /> Apply to IDE
              </button>
            </>
          )}
          {onClose && (
            <button className="ts-btn ts-btn-ghost" onClick={onClose}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="ts-body">
        {renderStep()}
      </div>
    </div>
  )
}

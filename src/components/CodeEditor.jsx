import React, { useState, useCallback, useEffect } from 'react'
import MonacoEditor from './MonacoEditor/MonacoEditor'
import {
  FileCode,
  Plus,
  X,
  Copy,
  Save,
  Download,
  ChevronDown
} from 'lucide-react'
import './CodeEditor.css'

const LANGUAGE_MAP = {
  js: 'javascript', jsx: 'javascriptreact', ts: 'typescript', tsx: 'typescriptreact',
  py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
  c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp', cs: 'csharp',
  php: 'php', html: 'html', htm: 'html', css: 'css', scss: 'scss',
  less: 'less', json: 'json', yaml: 'yaml', yml: 'yaml', xml: 'xml',
  md: 'markdown', sql: 'sql', sh: 'shell', bash: 'shell', ps1: 'powershell',
  dockerfile: 'dockerfile', toml: 'ini', ini: 'ini', r: 'r', lua: 'lua',
}

function detectLanguage(filePath) {
  if (!filePath) return 'javascript'
  const ext = filePath.split('.').pop()?.toLowerCase()
  return LANGUAGE_MAP[ext] || 'plaintext'
}

function CodeEditor({ onSelectionChange, fs }) {
  const [modifiedFiles, setModifiedFiles] = useState({})
  const [showLangMenu, setShowLangMenu] = useState(false)

  const openFiles = fs?.openFiles || []
  const activeFile = fs?.activeFile || null
  const fileContents = fs?.fileContents || {}

  const currentContent = activeFile ? (fileContents[activeFile] ?? '') : ''

  const handleCodeChange = useCallback((value) => {
    if (activeFile && fs) {
      fs.fileContents[activeFile] = value
      setModifiedFiles(prev => ({ ...prev, [activeFile]: true }))
    }
  }, [activeFile, fs])

  const handleSave = useCallback(async () => {
    if (activeFile && fs) {
      const content = fs.fileContents[activeFile]
      if (content !== undefined) {
        const ok = await fs.saveFile(activeFile, content)
        if (ok) setModifiedFiles(prev => { const n = { ...prev }; delete n[activeFile]; return n })
      }
    }
  }, [activeFile, fs])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  const handleEditorMount = useCallback((editor, monaco) => {
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getModel()?.getValueInRange(e.selection)
      if (selection && onSelectionChange) {
        onSelectionChange({
          text: selection,
          fileName: activeFile || 'untitled',
          language: detectLanguage(activeFile),
        })
      }
    })
  }, [activeFile, onSelectionChange])

  const handleTabClose = useCallback((e, filePath) => {
    e.stopPropagation()
    if (modifiedFiles[filePath]) {
      if (!confirm(`Unsaved changes in ${filePath.split('/').pop()}. Close anyway?`)) return
    }
    fs?.closeFile(filePath)
  }, [fs, modifiedFiles])

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(currentContent).catch(() => {})
  }, [currentContent])

  const handleDownload = useCallback(() => {
    const blob = new Blob([currentContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile?.split('/').pop() || 'file.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [currentContent, activeFile])

  const getFileName = (path) => path?.split('/').pop() || path
  const getFileLanguage = (path) => detectLanguage(path)

  if (!activeFile) {
    return (
      <div className="editor-container">
        <div className="editor-empty">
          <FileCode size={48} strokeWidth={1} />
          <p>No file open</p>
          <span>Select a file from the explorer to start editing</span>
        </div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-tabs">
          {openFiles.map((filePath) => (
            <div
              key={filePath}
              className={`editor-tab ${activeFile === filePath ? 'active' : ''}`}
              onClick={() => fs?.setActiveFile(filePath)}
            >
              <FileCode size={14} />
              <span>{getFileName(filePath)}{modifiedFiles[filePath] ? ' *' : ''}</span>
              <button className="tab-close" onClick={(e) => handleTabClose(e, filePath)}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="editor-actions">
          <span className="file-path-label">{activeFile}</span>
          <button className="action-btn" title="Save (Ctrl+S)" onClick={handleSave}>
            <Save size={16} />
          </button>
          <button className="action-btn" title="Copy" onClick={handleCopyCode}>
            <Copy size={16} />
          </button>
          <button className="action-btn" title="Download" onClick={handleDownload}>
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="editor-body">
        <MonacoEditor
          value={currentContent}
          onChange={handleCodeChange}
          language={getFileLanguage(activeFile)}
          fileName={getFileName(activeFile)}
          height="100%"
          onMount={handleEditorMount}
        />
      </div>
    </div>
  )
}

export default CodeEditor

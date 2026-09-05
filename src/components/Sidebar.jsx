import React, { useState, useCallback, useRef } from 'react'
import {
  FolderOpen,
  Folder,
  Search,
  GitBranch,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Blocks,
  Download,
  FileCode,
  RefreshCw,
  Trash2,
  Edit3,
  X,
} from 'lucide-react'
import { getFileIcon } from '../themes/fileIcons'
import { getModernIcon, getModernFolderIcon, getModernIconPath } from '../themes/modernIcons'
import { useSettings } from '../hooks/useSettings'
import './Sidebar.css'

function SetiIcon({ filename, isFolder, expanded }) {
  const { settings } = useSettings()
  const iconTheme = settings?.iconTheme || 'seti'

  if (iconTheme === 'none') return null

  if (isFolder) {
    if (iconTheme === 'modern') {
      const folderIcon = expanded ? 'folder-open' : 'folder'
      return <img src={getModernIconPath(folderIcon)} alt="folder" style={{ width: 14, height: 14, flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none' }} />
    }
    return expanded
      ? <FolderOpen size={14} style={{ color: '#dcb67a', flexShrink: 0 }} />
      : <Folder size={14} style={{ color: '#dcb67a', flexShrink: 0 }} />
  }

  if (iconTheme === 'modern') {
    const iconType = getModernIcon(filename)
    return <img src={getModernIconPath(iconType)} alt={iconType} style={{ width: 14, height: 14, flexShrink: 0, objectFit: 'contain' }} onError={(e) => { e.target.src = getModernIconPath('file') }} />
  }

  if (iconTheme === 'minimal') {
    const ext = filename.split('.').pop()?.toUpperCase() || 'TXT'
    return <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ext.slice(0, 2)}</span>
  }

  const iconType = getFileIcon(filename)
  if (!iconType) return <FileCode size={14} style={{ color: 'var(--k-text-dim, #888)', flexShrink: 0 }} />
  return <span className={`seti-icon ${iconType ? '' : 'seti-icon--default'}`} data-icon={iconType || 'default'} style={{ flexShrink: 0, fontSize: '14px', lineHeight: 1 }} />
}

function FileTreeItem({ item, depth = 0, onFileOpen, expandedPaths, toggleExpand, activeFile, onNewFile, onNewFolder, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(item.name)
  const isFolder = item.type === 'folder'
  const isExpanded = expandedPaths.has(item.path)
  const isActive = item.type === 'file' && activeFile === item.path

  const handleClick = () => {
    if (isFolder) {
      toggleExpand(item.path)
    } else {
      onFileOpen(item.path)
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setMenuOpen(true)
  }

  return (
    <>
      <div
        className={`tree-item ${isActive ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {isFolder ? (
          isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <SetiIcon filename={item.name} isFolder={false} />
        )}
        <span className="tree-name">{item.name}</span>
      </div>
      {menuOpen && (
        <div className="tree-context-menu" style={{ position: 'fixed', left: '100px', top: '100px', zIndex: 9999 }}>
          {isFolder && <>
            <button onClick={() => { onNewFile(item.path); setMenuOpen(false) }}>New File</button>
            <button onClick={() => { onNewFolder(item.path); setMenuOpen(false) }}>New Folder</button>
          </>}
          <button onClick={() => { setRenaming(true); setMenuOpen(false) }}>Rename</button>
          <button className="danger" onClick={() => { onDelete(item.path); setMenuOpen(false) }}>Delete</button>
          <button onClick={() => setMenuOpen(false)}>Cancel</button>
        </div>
      )}
      {isFolder && isExpanded && item.children && (
        <div className="tree-children">
          {item.children.map((child, index) => (
            <FileTreeItem
              key={child.path || index}
              item={child}
              depth={depth + 1}
              onFileOpen={onFileOpen}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
              activeFile={activeFile}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  )
}

function Sidebar({ activePanel, onPanelChange, fs, onFileOpen }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [expandedPaths, setExpandedPaths] = useState(() => {
    const s = new Set()
    fs.tree.forEach(item => { if (item.type === 'folder') s.add(item.path) })
    return s
  })

  const toggleExpand = useCallback((path) => {
    setExpandedPaths(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    if (!query) { setSearchResults([]); return }
    const results = await fs.searchFiles(query)
    setSearchResults(results)
  }, [fs])

  const handleNewFile = useCallback(async (dirPath) => {
    const name = prompt('File name:', 'new-file.js')
    if (name) {
      const filePath = dirPath ? `${dirPath}/${name}` : name
      await fs.createFile(filePath)
      setExpandedPaths(prev => new Set([...prev, dirPath]))
    }
  }, [fs])

  const handleNewFolder = useCallback(async (dirPath) => {
    const name = prompt('Folder name:', 'new-folder')
    if (name) {
      const folderPath = dirPath ? `${dirPath}/${name}` : name
      await fs.createFolder(folderPath)
      setExpandedPaths(prev => new Set([...prev, dirPath]))
    }
  }, [fs])

  const handleDelete = useCallback(async (filePath) => {
    if (confirm(`Delete ${filePath}?`)) {
      await fs.deleteFile(filePath)
    }
  }, [fs])

  const handleRefresh = useCallback(() => {
    fs.fetchTree()
    fs.fetchGitStatus()
  }, [fs])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">
          {activePanel === 'git' ? 'Source Control' : activePanel === 'extensions' ? 'Extensions' : 'Explorer'}
        </span>
        <div className="sidebar-actions">
          {activePanel === 'files' && (
            <>
              <button title="New File" onClick={() => handleNewFile('')}><Plus size={16} /></button>
              <button title="Refresh" onClick={handleRefresh}><RefreshCw size={14} /></button>
            </>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        {activePanel === 'files' && (
          <div className="sidebar-section">
            <div className="section-header" onClick={() => {
              const all = new Set(expandedPaths)
              fs.tree.forEach(item => { if (item.type === 'folder') all.add(item.path) })
              setExpandedPaths(all)
            }}>
              <span>Workspace</span>
              <ChevronDown size={14} />
            </div>
            <div className="file-tree">
              {fs.loading ? (
                <div className="tree-loading">Loading files...</div>
              ) : fs.error ? (
                <div className="tree-error">
                  <span>Server not connected</span>
                  <button onClick={() => { handleRefresh(); setTimeout(handleRefresh, 2000) }}>Retry</button>
                </div>
              ) : fs.tree.length === 0 ? (
                <div className="tree-empty">No files found</div>
              ) : (
                fs.tree.map((item, index) => (
                  <FileTreeItem
                    key={item.path || index}
                    item={item}
                    onFileOpen={onFileOpen}
                    expandedPaths={expandedPaths}
                    toggleExpand={toggleExpand}
                    activeFile={fs.activeFile}
                    onNewFile={handleNewFile}
                    onNewFolder={handleNewFolder}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activePanel === 'search' && (
          <div className="sidebar-section">
            <div className="sidebar-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && <button className="search-clear" onClick={() => handleSearch('')}><X size={12} /></button>}
            </div>
            <div className="search-results">
              {searchResults.map((item, i) => (
                <div key={i} className="search-result-item" onClick={() => onFileOpen(item.path)}>
                  <FileCode size={14} />
                  <span>{item.name}</span>
                  <span className="search-result-path">{item.path}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === 'git' && (
          <div className="sidebar-section">
            <div className="git-info">
              <div className="git-branch">
                <GitBranch size={14} />
                <span>{fs.gitStatus.branch || 'No git repo'}</span>
              </div>
              {fs.gitStatus.changes.length > 0 && (
                <div className="git-changes">
                  <div className="git-changes-header">
                    <span>Changes ({fs.gitStatus.changes.length})</span>
                  </div>
                  {fs.gitStatus.changes.map((change, i) => (
                    <div key={i} className="git-change-item" onClick={() => onFileOpen(change.path)}>
                      <span className={`git-status git-status-${change.status}`}>
                        {change.status === 'M' ? 'M' : change.status === 'A' ? 'A' : change.status === 'D' ? 'D' : change.status === '?' ? '?' : change.status}
                      </span>
                      <span className="git-change-path">{change.path}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activePanel === 'extensions' && (
          <div className="sidebar-section">
            <div className="section-header">
              <Blocks size={14} />
              <span>Extensions</span>
            </div>
            <div className="extensions-list">
              <div className="extension-item">
                <div className="ext-info">
                  <span className="ext-name">Prettier</span>
                  <span className="ext-desc">Code formatter</span>
                </div>
                <span className="ext-installed">Installed</span>
              </div>
              <div className="extension-item">
                <div className="ext-info">
                  <span className="ext-name">ESLint</span>
                  <span className="ext-desc">Linting utility</span>
                </div>
                <button className="ext-install"><Download size={12} /> Install</button>
              </div>
            </div>
          </div>
        )}

        {!['files', 'search', 'git', 'extensions'].includes(activePanel) && (
          <div className="sidebar-section">
            <div className="section-header">
              <span>Explorer</span>
            </div>
            <div className="file-tree">
              {fs.tree.map((item, index) => (
                <FileTreeItem
                  key={item.path || index}
                  item={item}
                  onFileOpen={onFileOpen}
                  expandedPaths={expandedPaths}
                  toggleExpand={toggleExpand}
                  activeFile={fs.activeFile}
                  onNewFile={handleNewFile}
                  onNewFolder={handleNewFolder}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

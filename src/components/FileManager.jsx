import React, { useState } from 'react'
import {
  FileCode,
  FileText,
  FileImage,
  FileJson,
  ChevronRight,
  ChevronDown,
  File,
  Search
} from 'lucide-react'
import './FileManager.css'

const fileTree = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'App.jsx', type: 'file', language: 'javascript' },
          { name: 'Header.jsx', type: 'file', language: 'javascript' },
          { name: 'Sidebar.jsx', type: 'file', language: 'javascript' },
          { name: 'Editor.jsx', type: 'file', language: 'javascript' },
        ]
      },
      {
        name: 'styles',
        type: 'folder',
        expanded: false,
        children: [
          { name: 'global.css', type: 'file', language: 'css' },
          { name: 'theme.css', type: 'file', language: 'css' },
        ]
      },
      { name: 'main.jsx', type: 'file', language: 'javascript' },
      { name: 'index.js', type: 'file', language: 'javascript' },
    ]
  },
  {
    name: 'public',
    type: 'folder',
    expanded: false,
    children: [
      { name: 'index.html', type: 'file', language: 'html' },
      { name: 'favicon.ico', type: 'file', language: 'image' },
    ]
  },
  { name: 'package.json', type: 'file', language: 'json' },
  { name: 'vite.config.js', type: 'file', language: 'javascript' },
  { name: 'README.md', type: 'file', language: 'text' },
]

function FileIcon({ item }) {
  if (item.type === 'folder') {
    return item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
  }
  
  const iconMap = {
    javascript: <FileCode size={14} className="file-icon js" />,
    css: <FileCode size={14} className="file-icon css" />,
    html: <FileCode size={14} className="file-icon html" />,
    json: <FileJson size={14} className="file-icon json" />,
    text: <FileText size={14} className="file-icon text" />,
    image: <FileImage size={14} className="file-icon image" />,
  }
  
  return iconMap[item.language] || <File size={14} className="file-icon" />
}

function FileTreeItem({ item, depth = 0 }) {
  const [expanded, setExpanded] = useState(item.expanded || false)
  const [selected, setSelected] = useState(false)

  const handleClick = () => {
    if (item.type === 'folder') {
      setExpanded(!expanded)
    }
    setSelected(true)
  }

  return (
    <>
      <div
        className={`file-tree-item ${selected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={handleClick}
      >
        <FileIcon item={{ ...item, expanded }} />
        <span className="file-name">{item.name}</span>
        {item.type === 'folder' && (
          <span className="file-count">{item.children?.length}</span>
        )}
      </div>
      {item.type === 'folder' && expanded && item.children && (
        <div className="file-tree-children">
          {item.children.map((child, index) => (
            <FileTreeItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  )
}

function FileManager() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="file-manager">
      <div className="file-search">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="file-tree">
        {fileTree.map((item, index) => (
          <FileTreeItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

export default FileManager

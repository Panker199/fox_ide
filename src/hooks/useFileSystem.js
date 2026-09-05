import { useState, useCallback, useEffect, useRef } from 'react'

const API = '/api'

export function useFileSystem() {
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gitStatus, setGitStatus] = useState({ branch: '', changes: [] })
  const [openFiles, setOpenFiles] = useState([])
  const [activeFile, setActiveFile] = useState(null)
  const [fileContents, setFileContents] = useState({})
  const fetchRef = useRef(null)

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/tree`)
      const data = await res.json()
      setTree(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFile = useCallback(async (filePath) => {
    if (fileContents[filePath] !== undefined) return fileContents[filePath]
    try {
      const res = await fetch(`${API}/file?path=${encodeURIComponent(filePath)}`)
      const data = await res.json()
      if (res.ok) {
        setFileContents(prev => ({ ...prev, [filePath]: data.content }))
        return data.content
      }
      return null
    } catch (e) {
      return null
    }
  }, [fileContents])

  const saveFile = useCallback(async (filePath, content) => {
    try {
      const res = await fetch(`${API}/file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content }),
      })
      if (res.ok) {
        setFileContents(prev => ({ ...prev, [filePath]: content }))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }, [])

  const openFile = useCallback(async (filePath) => {
    const content = await fetchFile(filePath)
    if (content === null) return false
    setOpenFiles(prev => {
      if (prev.includes(filePath)) return prev
      return [...prev, filePath]
    })
    setActiveFile(filePath)
    return true
  }, [fetchFile])

  const closeFile = useCallback((filePath) => {
    setOpenFiles(prev => {
      const next = prev.filter(f => f !== filePath)
      if (activeFile === filePath) {
        const idx = prev.indexOf(filePath)
        const newActive = next[Math.min(idx, next.length - 1)] || null
        setActiveFile(newActive)
      }
      return next
    })
  }, [activeFile])

  const createFile = useCallback(async (filePath) => {
    try {
      await fetch(`${API}/file/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      })
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree])

  const deleteFile = useCallback(async (filePath) => {
    try {
      await fetch(`${API}/file?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' })
      closeFile(filePath)
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree, closeFile])

  const createFolder = useCallback(async (folderPath) => {
    try {
      await fetch(`${API}/folder/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      })
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree])

  const renameFile = useCallback(async (oldPath, newPath) => {
    try {
      await fetch(`${API}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      })
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree])

  const fetchGitStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API}/git/status`)
      const data = await res.json()
      setGitStatus(data)
    } catch (e) {}
  }, [])

  const searchFiles = useCallback(async (query) => {
    if (!query) return []
    try {
      const res = await fetch(`${API}/tree`)
      const data = await res.json()
      const results = []
      const search = (items) => {
        for (const item of items) {
          if (item.name.toLowerCase().includes(query.toLowerCase())) {
            results.push(item)
          }
          if (item.children) search(item.children)
        }
      }
      search(data)
      return results
    } catch (e) {
      return []
    }
  }, [])

  useEffect(() => {
    fetchTree()
    fetchGitStatus()
    const interval = setInterval(fetchGitStatus, 30000)
    return () => clearInterval(interval)
  }, [fetchTree, fetchGitStatus])

  return {
    tree, loading, error,
    openFiles, activeFile, fileContents,
    openFile, closeFile, setActiveFile,
    fetchFile, saveFile, createFile, deleteFile, createFolder, renameFile,
    fetchTree, fetchGitStatus, gitStatus, searchFiles,
  }
}

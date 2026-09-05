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
  const fileContentsRef = useRef(fileContents)
  fileContentsRef.current = fileContents

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/tree`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setTree(data)
        setError(null)
      } else {
        throw new Error(data.error || 'Invalid response')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFile = useCallback(async (filePath) => {
    const cached = fileContentsRef.current[filePath]
    if (cached !== undefined) return cached
    try {
      const res = await fetch(`${API}/file?path=${encodeURIComponent(filePath)}`)
      if (!res.ok) throw new Error(`Failed to read file`)
      const data = await res.json()
      if (data.content !== undefined) {
        setFileContents(prev => ({ ...prev, [filePath]: data.content }))
        return data.content
      }
      return null
    } catch (e) {
      return null
    }
  }, [])

  const updateFileContent = useCallback((filePath, content) => {
    setFileContents(prev => ({ ...prev, [filePath]: content }))
  }, [])

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
      return next
    })
    setActiveFile(prev => {
      if (prev !== filePath) return prev
      setOpenFiles(currentOpen => {
        const idx = currentOpen.indexOf(filePath)
        const remaining = currentOpen.filter(f => f !== filePath)
        const newActive = remaining[Math.min(idx, remaining.length - 1)] || null
        setTimeout(() => setActiveFile(newActive), 0)
        return remaining
      })
      return prev
    })
  }, [])

  const createFile = useCallback(async (filePath) => {
    try {
      const res = await fetch(`${API}/file/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      })
      if (!res.ok) throw new Error('Failed to create file')
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree])

  const deleteFile = useCallback(async (filePath) => {
    try {
      const res = await fetch(`${API}/file?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      closeFile(filePath)
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree, closeFile])

  const createFolder = useCallback(async (folderPath) => {
    try {
      const res = await fetch(`${API}/folder/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      })
      if (!res.ok) throw new Error('Failed to create folder')
      await fetchTree()
      return true
    } catch (e) {
      return false
    }
  }, [fetchTree])

  const renameFile = useCallback(async (oldPath, newPath) => {
    try {
      const res = await fetch(`${API}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      })
      if (!res.ok) throw new Error('Failed to rename')
      setOpenFiles(prev => prev.map(f => f === oldPath ? newPath : f))
      setActiveFile(prev => prev === oldPath ? newPath : prev)
      setFileContents(prev => {
        const next = { ...prev }
        if (next[oldPath] !== undefined) {
          next[newPath] = next[oldPath]
          delete next[oldPath]
        }
        return next
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
      if (!res.ok) return []
      const data = await res.json()
      if (!Array.isArray(data)) return []
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
    openFile, closeFile, setActiveFile, updateFileContent,
    fetchFile, saveFile, createFile, deleteFile, createFolder, renameFile,
    fetchTree, fetchGitStatus, gitStatus, searchFiles,
  }
}

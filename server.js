const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const app = express()
const PORT = 3001
const ROOT = path.resolve(process.env.FOX_ROOT || __dirname)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const IGNORE = ['node_modules', '.git', 'dist', '.next', '.nuxt', '.cache', '.vite', 'out']

function buildTree(dirPath, depth = 0, maxDepth = 20) {
  if (depth > maxDepth) return []
  const entries = []
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    const dirs = items.filter(i => i.isDirectory() && !IGNORE.includes(i.name)).sort((a, b) => a.name.localeCompare(b.name))
    const files = items.filter(i => i.isFile()).sort((a, b) => a.name.localeCompare(b.name))

    for (const d of dirs) {
      const fullPath = path.join(dirPath, d.name)
      const children = buildTree(fullPath, depth + 1, maxDepth)
      entries.push({
        name: d.name,
        type: 'folder',
        path: path.relative(ROOT, fullPath).replace(/\\/g, '/'),
        children,
        expanded: depth < 1,
      })
    }
    for (const f of files) {
      entries.push({
        name: f.name,
        type: 'file',
        path: path.relative(ROOT, path.join(dirPath, f.name)).replace(/\\/g, '/'),
      })
    }
  } catch (e) {}
  return entries
}

app.get('/api/tree', (req, res) => {
  try {
    const tree = buildTree(ROOT)
    res.json(tree)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/file', (req, res) => {
  const filePath = req.query.path
  if (!filePath) return res.status(400).json({ error: 'No path' })
  const full = path.join(ROOT, filePath)
  try {
    const stat = fs.statSync(full)
    if (stat.size > 5 * 1024 * 1024) return res.status(413).json({ error: 'File too large' })
    const content = fs.readFileSync(full, 'utf-8')
    res.json({ content, path: filePath })
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

app.put('/api/file', (req, res) => {
  const { filePath, content } = req.body
  if (!filePath) return res.status(400).json({ error: 'No path' })
  const full = path.join(ROOT, filePath)
  try {
    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, content, 'utf-8')
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/file/new', (req, res) => {
  const { filePath } = req.body
  if (!filePath) return res.status(400).json({ error: 'No path' })
  const full = path.join(ROOT, filePath)
  try {
    fs.mkdirSync(path.dirname(full), { recursive: true })
    if (!fs.existsSync(full)) fs.writeFileSync(full, '', 'utf-8')
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/file', (req, res) => {
  const filePath = req.query.path
  if (!filePath) return res.status(400).json({ error: 'No path' })
  const full = path.join(ROOT, filePath)
  try {
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      fs.rmSync(full, { recursive: true })
    } else {
      fs.unlinkSync(full)
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/folder/new', (req, res) => {
  const { folderPath } = req.body
  if (!folderPath) return res.status(400).json({ error: 'No path' })
  const full = path.join(ROOT, folderPath)
  try {
    fs.mkdirSync(full, { recursive: true })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/git/status', (req, res) => {
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8', timeout: 5000 })
    const branch = execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf-8', timeout: 5000 }).trim()
    const changes = status.trim().split('\n').filter(Boolean).map(line => ({
      status: line.substring(0, 2).trim(),
      path: line.substring(3).trim(),
    }))
    res.json({ branch, changes })
  } catch (e) {
    res.json({ branch: 'unknown', changes: [] })
  }
})

app.listen(PORT, () => {
  console.log(`FOX server running on http://localhost:${PORT}`)
  console.log(`Serving: ${ROOT}`)
})

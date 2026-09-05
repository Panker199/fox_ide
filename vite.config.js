import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'

function autoStartServer() {
  let serverProcess = null
  return {
    name: 'auto-start-server',
    configureServer() {
      if (!serverProcess) {
        serverProcess = spawn('node', ['server.js'], {
          cwd: process.cwd(),
          stdio: 'ignore',
          detached: true,
        })
        serverProcess.unref()
        console.log('[vite] Backend server started on port 3001')
      }
    },
    closeBundle() {
      if (serverProcess) {
        serverProcess.kill()
        serverProcess = null
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), autoStartServer()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['monaco-editor'],
  },
})

import React, { useRef, useCallback, useEffect, useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { registerLanguageConfigs, registerSnippets } from './languages'
import './MonacoEditor.css'

loader.config({ monaco })

const LANGUAGE_MAP = {
  js: 'javascript',
  jsx: 'javascriptreact',
  ts: 'typescript',
  tsx: 'typescriptreact',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  cs: 'csharp',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  md: 'markdown',
  sql: 'sql',
  sh: 'shell',
  bash: 'shell',
  ps1: 'powershell',
  dockerfile: 'dockerfile',
  makefile: 'makefile',
  toml: 'ini',
  ini: 'ini',
  cfg: 'ini',
  txt: 'plaintext',
  r: 'r',
  lua: 'lua',
  pl: 'perl',
  dart: 'dart',
  ex: 'elixir',
  exs: 'elixir',
  hs: 'haskell',
  clj: 'clojure',
  vue: 'html',
  svelte: 'html',
  astro: 'html',
}

function useThemeType() {
  const [themeType, setThemeType] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'dark'
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') || 'dark'
          setThemeType(newTheme)
        }
      }
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  return themeType
}

function defineThemes(monaco) {
  monaco.editor.defineTheme('fox-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editor.lineHighlightBackground': '#161b2280',
      'editor.selectionBackground': '#264f7860',
      'editor.inactiveSelectionBackground': '#264f7830',
      'editorCursor.foreground': '#58a6ff',
      'editorWhitespace.foreground': '#30363d',
      'editorIndentGuide.background': '#21262d',
      'editorIndentGuide.activeBackground': '#30363d',
      'editorLineNumber.foreground': '#484f58',
      'editorLineNumber.activeForeground': '#e6edf3',
      'editorBracketMatch.background': '#1f6feb30',
      'editorBracketMatch.border': '#1f6feb60',
      'editor.selectionHighlightBackground': '#264f7830',
      'editorGutter.background': '#0d1117',
      'editorWidget.background': '#161b22',
      'editorWidget.border': '#30363d',
      'editorSuggestWidget.background': '#161b22',
      'editorSuggestWidget.border': '#30363d',
      'editorSuggestWidget.selectedBackground': '#264f7840',
      'editorHoverWidget.background': '#161b22',
      'editorHoverWidget.border': '#30363d',
      'input.background': '#0d1117',
      'input.border': '#30363d',
      'input.foreground': '#e6edf3',
      'focusBorder': '#58a6ff',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#30363d80',
      'scrollbarSlider.hoverBackground': '#484f5880',
      'scrollbarSlider.activeBackground': '#58a6ff40',
      'minimap.background': '#0d1117',
    },
  })

  monaco.editor.defineTheme('fox-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editor.selectionBackground': '#0366d625',
      'editor.inactiveSelectionBackground': '#0366d615',
      'editorCursor.foreground': '#0366d6',
      'editorWhitespace.foreground': '#d1d5da',
      'editorIndentGuide.background': '#e1e4e8',
      'editorIndentGuide.activeBackground': '#d1d5da',
      'editorLineNumber.foreground': '#babbbd',
      'editorLineNumber.activeForeground': '#24292e',
      'editorBracketMatch.background': '#0366d620',
      'editorBracketMatch.border': '#0366d640',
      'editor.selectionHighlightBackground': '#0366d615',
      'editorGutter.background': '#ffffff',
      'editorWidget.background': '#f6f8fa',
      'editorWidget.border': '#e1e4e8',
      'editorSuggestWidget.background': '#f6f8fa',
      'editorSuggestWidget.border': '#e1e4e8',
      'editorSuggestWidget.selectedBackground': '#0366d615',
      'editorHoverWidget.background': '#f6f8fa',
      'editorHoverWidget.border': '#e1e4e8',
      'input.background': '#ffffff',
      'input.border': '#e1e4e8',
      'input.foreground': '#24292e',
      'focusBorder': '#0366d6',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#d1d5da80',
      'scrollbarSlider.hoverBackground': '#babbbd80',
      'scrollbarSlider.activeBackground': '#0366d640',
      'minimap.background': '#ffffff',
    },
  })
}

function MonacoEditor({
  value = '',
  onChange,
  language = 'javascript',
  fileName = '',
  height = '100%',
  readOnly = false,
  minimap = true,
  fontSize = 14,
  fontFamily = "'Pyra', 'JetBrains Mono', 'Fira Code', monospace",
  tabSize = 2,
  wordWrap = 'off',
  lineNumbers = 'on',
  renderLineHighlight = 'all',
  bracketPairColorization = true,
  suggestOnTriggerCharacters = true,
  quickSuggestions = true,
  cursorBlinking = 'blink',
  cursorStyle = 'line',
  smoothScrolling = true,
  padding = { top: 8 },
  onMount,
  options = {},
}) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const themeType = useThemeType()

  const detectLanguage = useCallback((fname) => {
    if (!fname) return language
    const ext = fname.split('.').pop()?.toLowerCase()
    return LANGUAGE_MAP[ext] || language
  }, [language])

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const themeName = themeType === 'light' ? 'fox-light' : 'fox-dark'
      monacoRef.current.editor.setTheme(themeName)
    }
  }, [themeType])

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    defineThemes(monaco)

    const initialTheme = themeType === 'light' ? 'fox-light' : 'fox-dark'
    monaco.editor.setTheme(initialTheme)

    registerLanguageConfigs(monaco)
    registerSnippets(monaco)

    editor.updateOptions({
      minimap: { enabled: minimap },
      fontSize,
      fontFamily,
      tabSize,
      wordWrap,
      lineNumbers,
      renderLineHighlight,
      bracketPairColorization: { enabled: bracketPairColorization },
      suggestOnTriggerCharacters,
      quickSuggestions,
      cursorBlinking,
      cursorStyle,
      smoothScrolling,
      padding,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      folding: true,
      foldGutter: true,
      renderWhitespace: 'selection',
      bracketPairGuides: { enabled: true },
      stickyScroll: { enabled: true },
      inlineSuggest: { enabled: true },
      ...options,
    })

    if (onMount) onMount(editor, monaco)
  }, [minimap, fontSize, fontFamily, tabSize, wordWrap, lineNumbers, renderLineHighlight, bracketPairColorization, suggestOnTriggerCharacters, quickSuggestions, cursorBlinking, cursorStyle, smoothScrolling, padding, options, onMount, themeType])

  const handleChange = useCallback((value) => {
    if (onChange) onChange(value || '')
  }, [onChange])

  const themeName = themeType === 'light' ? 'fox-light' : 'fox-dark'

  return (
    <div className={`monaco-editor-wrapper theme-${themeType}`} style={{ height }}>
      <Editor
        language={detectLanguage(fileName)}
        value={value}
        theme={themeName}
        onChange={handleChange}
        onMount={handleMount}
        loading={
          <div className={`monaco-loading theme-${themeType}`}>
            <div className="monaco-loading-spinner" />
            <span>Loading editor...</span>
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: minimap },
          fontSize,
          fontFamily,
          tabSize,
          wordWrap,
          lineNumbers,
          renderLineHighlight,
          bracketPairColorization: { enabled: bracketPairColorization },
          suggestOnTriggerCharacters,
          quickSuggestions,
          cursorBlinking,
          cursorStyle,
          smoothScrolling,
          padding,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          folding: true,
          renderWhitespace: 'selection',
          ...options,
        }}
      />
    </div>
  )
}

export default MonacoEditor

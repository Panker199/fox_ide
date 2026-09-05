import { useState, useCallback, useRef } from 'react'

const WELCOME_MESSAGE = {
  id: 1,
  role: 'assistant',
  content: `Welcome to **FOX Deep AI**.

I behave like a Cursor-style pair programmer with Claude-level reasoning:
- **Plan** the right solution before editing
- **Read local code context** and infer intent
- **Refactor** for clarity, performance, and correctness
- **Fix** root causes with guarded patches
- **Generate** production-quality code from intent
- **Verify** logic with concise validation steps

Use the quick actions or ask me to audit, build, optimize, or ship a feature.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const CODE_SUGGESTIONS = {
  react: {
    explain: `This React component manages state using the useState hook and renders a dynamic UI based on that state. The component follows the single-responsibility principle and uses declarative rendering patterns.`,
    refactor: `// Refactored with custom hook and memoization
import { useState, useMemo, useCallback } from 'react'

function useComponentLogic(initialState) {
  const [state, setState] = useState(initialState)
  
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const derivedState = useMemo(() => ({
    ...state,
    isReady: Boolean(state.data && !state.loading)
  }), [state])

  return { state: derivedState, updateState }
}

export default function Component() {
  const { state, updateState } = useComponentLogic({ data: null, loading: false })
  
  return (
    <div className="component">
      {state.loading ? <Spinner /> : <Content data={state.data} />}
    </div>
  )
}`,
    fix: `// Common issues found and fixed:
// 1. Added null check for props
// 2. Added error boundary
// 3. Fixed memory leak in useEffect

function Component({ data }) {
  const [state, setState] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    try {
      if (!cancelled) setState(processData(data))
    } catch (err) {
      if (!cancelled) setError(err.message)
    }
    return () => { cancelled = true }
  }, [data])

  if (error) return <ErrorDisplay message={error} />
  return <div>{state?.render()}</div>
}`,
    generate: `// Generated React component with TypeScript
import React, { useState, useEffect } from 'react'

interface ComponentProps {
  title: string
  onDataFetch?: () => Promise<Data>
}

interface Data {
  id: string
  name: string
  value: number
}

export const GeneratedComponent: React.FC<ComponentProps> = ({ 
  title, 
  onDataFetch 
}) => {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (onDataFetch) {
        const result = await onDataFetch()
        setData(Array.isArray(result) ? result : [result])
      }
      setLoading(false)
    }
    fetchData()
  }, [onDataFetch])

  if (loading) return <div className="spinner" />

  return (
    <div className="component">
      <h2>{title}</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  )
}`
  },
  javascript: {
    explain: `This JavaScript code defines a function that processes data asynchronously. It uses modern ES6+ features like arrow functions, destructuring, and template literals. The function handles edge cases and returns a promise-based result.`,
    refactor: `// Refactored with modern JavaScript patterns
const processData = async (items) => {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      const validated = validateItem(item)
      return transform(validated)
    }))
  
  return results
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value)
}

const validateItem = (item) => {
  if (!item?.id) throw new Error('Missing item ID')
  return { ...item, validated: true }
}

const transform = (item) => ({
  ...item,
  name: item.name?.trim() || 'Untitled',
  timestamp: Date.now()
})`,
    fix: `// Fixed common issues:
// 1. Added proper error handling
// 2. Fixed undefined access
// 3. Added input validation

const processData = (data) => {
  if (!Array.isArray(data)) {
    throw new TypeError('Expected array input')
  }

  return data
    .filter(item => item && typeof item === 'object')
    .map(({ id, name, ...rest }) => ({
      id: id || crypto.randomUUID(),
      name: String(name || '').trim(),
      ...rest,
      processed: true
    }))
    .filter(item => item.name.length > 0)
}`,
    generate: `// Generated utility module
export class DataProcessor {
  #cache = new Map()
  #options

  constructor(options = {}) {
    this.#options = {
      maxRetries: 3,
      timeout: 5000,
      ...options
    }
  }

  async process(key, data) {
    if (this.#cache.has(key)) {
      return this.#cache.get(key)
    }

    const result = await this.#retry(() => this.#transform(data))
    this.#cache.set(key, result)
    return result
  }

  async #retry(fn, attempt = 0) {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= this.#options.maxRetries) throw error
      await this.#delay(Math.pow(2, attempt) * 100)
      return this.#retry(fn, attempt + 1)
    }
  }

  #transform(data) {
    return {
      ...data,
      processedAt: new Date().toISOString(),
      checksum: this.#hash(JSON.stringify(data))
    }
  }

  #hash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return hash.toString(36)
  }

  #delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  clearCache() {
    this.#cache.clear()
  }
}`
  },
  default: {
    explain: `This code implements a common programming pattern. It handles input validation, processes the data through a pipeline, and returns the transformed result. The code follows SOLID principles and is designed for maintainability.`,
    refactor: `// Refactored version with improved structure
const processData = (input) => {
  const pipeline = [
    validate,
    sanitize,
    transform,
    optimize
  ]

  return pipeline.reduce((data, step) => step(data), input)
}

const validate = (data) => {
  if (!data) throw new Error('Invalid input')
  return data
}

const sanitize = (data) => ({
  ...data,
  clean: true
})

const transform = (data) => ({
  ...data,
  transformed: true,
  timestamp: Date.now()
})

const optimize = (data) => ({
  ...data,
  optimized: true
})`,
    fix: `// Fixed common issues:
// 1. Added null/undefined checks
// 2. Improved error handling
// 3. Added type validation

const process = (data) => {
  if (data === null || data === undefined) {
    throw new TypeError('Data cannot be null or undefined')
  }

  try {
    return {
      ...data,
      processed: true,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Processing failed:', error)
    throw error
  }
}`,
    generate: `// Generated module with proper structure
export const createProcessor = (config = {}) => {
  const options = {
    validate: true,
    transform: true,
    ...config
  }

  return {
    process(data) {
      if (options.validate && !this.isValid(data)) {
        throw new Error('Invalid data')
      }

      let result = { ...data }

      if (options.transform) {
        result = this.transform(result)
      }

      return {
        success: true,
        data: result,
        processedAt: new Date().toISOString()
      }
    },

    isValid(data) {
      return data !== null && data !== undefined && typeof data === 'object'
    },

    transform(data) {
      return Object.entries(data).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: typeof value === 'string' ? value.trim() : value
      }), {})
    }
  }
}`
  }
}

const KEYWORD_RESPONSES = {
  react: `In React, components are the building blocks of your UI. Here are the key concepts:

**Hooks** - Functions that let you use state and lifecycle in functional components:
- \`useState\` - Manages local state
- \`useEffect\` - Handles side effects
- \`useCallback\` - Memoizes functions
- \`useMemo\` - Memoizes values

**Best Practices:**
1. Keep components small and focused
2. Lift state up when needed
3. Use custom hooks for reusable logic
4. Avoid unnecessary re-renders with React.memo`,

  javascript: `JavaScript is a versatile programming language. Key concepts:

**Modern Features:**
- Arrow functions: \`() => {} Template literals: \`\${var}\`
- Destructuring: \`const { a } = obj\`
- Spread operator: \`[...arr]\`, \`{...obj}\`
- Optional chaining: \`obj?.prop\`
- Nullish coalescing: \`val ?? default\`

**Async/Await:**
\`\`\`javascript
const fetchData = async () => {
  const response = await fetch(url)
  return response.json()
}
\`\`\`

**Error Handling:**
\`\`\`javascript
try {
  await riskyOperation()
} catch (error) {
  handleError(error)
}
\`\`\``,

  css: `CSS (Cascading Style Sheets) controls the visual presentation:

**Flexbox Layout:**
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
\`\`\`

**CSS Grid:**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

**Custom Properties (Variables):**
\`\`\`css
:root {
  --primary: #0066cc;
  --spacing: 16px;
}
\`\`\``,

  python: `Python is a high-level, interpreted language known for readability:

**Key Features:**
- Dynamic typing
- List comprehensions: \`[x for x in range(10)]\`
- Dictionary comprehensions: \`{k: v for k, v in items}\`
- Decorators for extending function behavior
- Context managers with \`with\` statement

**Example:**
\`\`\`python
def process_data(items):
    return [
        {"id": item["id"], "processed": True}
        for item in items
        if item.get("active")
    ]
\`\`\``,

  default: `Here are some general programming best practices:

**Code Quality:**
1. Write clean, readable code
2. Use meaningful variable names
3. Keep functions small and focused
4. Add comments for complex logic
5. Follow DRY (Don't Repeat Yourself) principle

**Performance:**
1. Cache expensive computations
2. Use appropriate data structures
3. Avoid unnecessary iterations
4. Lazy load when possible

**Testing:**
1. Write unit tests for critical paths
2. Test edge cases
3. Use mocking for external dependencies`
}

const buildDeepResponse = ({ text, context, mode = 'agent' }) => {
  const lower = (text || '').toLowerCase()
  const hasContext = Boolean(context?.text)
  const fileLabel = context?.fileName || 'current file'
  const language = context?.language || 'javascript'

  const contextIntro = hasContext
    ? `I’m working with the ${fileLabel} ${language} context you currently have selected.`
    : `I’m working from the project context and your current prompt.`

  if (lower.includes('fix') || lower.includes('bug') || lower.includes('error')) {
    return `**Root cause analysis**

${contextIntro}

The safest approach is to isolate the failure, verify the assumptions, and patch the smallest failure point first. I would:

1. Check whether the failure is caused by missing validation, incorrect assumptions, or state drift.
2. Add a guard for the failing path before changing behavior.
3. Keep the fix narrow and explicit so regressions stay easy to reason about.
4. Verify the result with the most relevant check or edge-case scenario.

\`\`\`javascript
function safeProcess(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input')
  }

  return {
    ...input,
    processed: true,
    timestamp: Date.now()
  }
}
\`\`\`

This pattern minimizes the blast radius while preserving expected behavior.`
  }

  if (lower.includes('refactor') || lower.includes('clean') || lower.includes('optimize')) {
    return `**Refactor plan**

${contextIntro}

I’d reduce duplication, separate responsibilities, and preserve behavior while making the code clearer.

\`\`\`javascript
const normalize = (value) => String(value ?? '').trim()

const buildPayload = (raw) => ({
  id: raw.id,
  name: normalize(raw.name),
  active: Boolean(raw.active)
})
\`\`\`

The refactor goals are:
- remove repeated logic
- make inputs explicit
- keep the function pure where possible
- improve readability before micro-optimizing`
  }

  if (lower.includes('generate') || lower.includes('build') || lower.includes('feature') || lower.includes('create')) {
    return `**Implementation plan**

${contextIntro}

I’d structure this as a small, testable feature build:

1. Define the interface and constraints.
2. Create the minimal data model and component boundaries.
3. Implement the happy path first.
4. Add edge-case handling and loading/error states.
5. Review the output against the original goal.

\`\`\`jsx
export function FeatureCard({ title, description }) {
  return (
    <section className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  )
}
\`\`\`

This is the cleanest path for a fast, reliable implementation.`
  }

  if (lower.includes('test') || lower.includes('verify') || lower.includes('check')) {
    return `**Verification approach**

${contextIntro}

I’d validate the change with the smallest meaningful proof:

- validate the critical input and output contract
- test the success path and one failure edge case
- confirm no regression in the surrounding logic

\`\`\`javascript
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}
\`\`\`

That gives confidence without overengineering the test setup.`
  }

  if (lower.includes('explain') || lower.includes('what does') || lower.includes('why')) {
    return `**Explanation**

${contextIntro}

This is best understood as a logic flow problem:

- determine the input contract
- transform or validate the data
- return consistent output
- handle edge cases without hiding errors

The main goal is to keep the code readable and predictable while ensuring every step has an explicit purpose.`
  }

  const modeLabel = mode === 'review' ? 'review' : mode === 'ask' ? 'answer' : 'agent'

  return `**Deep ${modeLabel} response**

${contextIntro}

I can approach this in a focused, production-ready way:

1. Clarify the intended outcome and success criteria.
2. Match the solution to the current architecture and code style.
3. Implement the leanest fix or feature that satisfies the goal.
4. Verify the behavior with the best available validation.

If you want, I can take the next step and turn this into a concrete patch or a full feature plan.`
}

function useCopilot() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)
  const messageIdRef = useRef(2)

  const addMessage = useCallback((role, content) => {
    const newMessage = {
      id: messageIdRef.current++,
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [])

  const simulateResponse = useCallback((content, delay = 700) => {
    setIsTyping(true)
    setTimeout(() => {
      addMessage('assistant', content)
      setIsTyping(false)
    }, delay)
  }, [addMessage])

  const sendMessage = useCallback((text, context = null, mode = 'agent') => {
    if (!text.trim()) return

    addMessage('user', text)
    setIsTyping(true)

    setTimeout(() => {
      const response = buildDeepResponse({ text, context, mode })
      addMessage('assistant', response)
      setIsTyping(false)
    }, 900)
  }, [addMessage])

  const explainCode = useCallback((code, context = null, mode = 'agent') => {
    if (!code) {
      simulateResponse('Please select some code in the editor first, then click **Explain**.')
      return
    }

    const lower = code.toLowerCase()
    let explanation = ''

    if (lower.includes('import') || lower.includes('export') || lower.includes('react') || lower.includes('component')) {
      explanation = CODE_SUGGESTIONS.react.explain
    } else if (lower.includes('function') || lower.includes('const') || lower.includes('async')) {
      explanation = CODE_SUGGESTIONS.javascript.explain
    } else {
      explanation = CODE_SUGGESTIONS.default.explain
    }

    addMessage('user', `\`\`\`\n${code.slice(0, 220)}${code.length > 220 ? '...' : ''}\n\`\`\`\n\nExplain this code:`)
    simulateResponse(`${buildDeepResponse({ text: 'explain this code', context, mode })}\n\n---\n\n${explanation}`)
  }, [addMessage, simulateResponse])

  const refactorCode = useCallback((code, context = null, mode = 'agent') => {
    if (!code) {
      simulateResponse('Please select some code in the editor first, then click **Refactor**.')
      return
    }

    const lower = code.toLowerCase()
    let refactored = ''

    if (lower.includes('import') || lower.includes('react') || lower.includes('component')) {
      refactored = CODE_SUGGESTIONS.react.refactor
    } else if (lower.includes('function') || lower.includes('const') || lower.includes('async')) {
      refactored = CODE_SUGGESTIONS.javascript.refactor
    } else {
      refactored = CODE_SUGGESTIONS.default.refactor
    }

    addMessage('user', `\`\`\`\n${code.slice(0, 220)}${code.length > 220 ? '...' : ''}\n\`\`\`\n\nRefactor this code:`)
    simulateResponse(`${buildDeepResponse({ text: 'refactor this code', context, mode })}\n\n---\n\n${refactored}`)
  }, [addMessage, simulateResponse])

  const fixCode = useCallback((code, context = null, mode = 'agent') => {
    if (!code) {
      simulateResponse('Please select some code in the editor first, then click **Fix**.')
      return
    }

    const lower = code.toLowerCase()
    let fixed = ''

    if (lower.includes('import') || lower.includes('react') || lower.includes('component')) {
      fixed = CODE_SUGGESTIONS.react.fix
    } else if (lower.includes('function') || lower.includes('const') || lower.includes('async')) {
      fixed = CODE_SUGGESTIONS.javascript.fix
    } else {
      fixed = CODE_SUGGESTIONS.default.fix
    }

    addMessage('user', `\`\`\`\n${code.slice(0, 220)}${code.length > 220 ? '...' : ''}\n\`\`\`\n\nFix this code:`)
    simulateResponse(`${buildDeepResponse({ text: 'fix this code', context, mode })}\n\n---\n\n${fixed}`)
  }, [addMessage, simulateResponse])

  const generateCode = useCallback((description, context = null, mode = 'agent') => {
    if (!description) {
      simulateResponse('Please describe what you want to generate, then click **Generate**.')
      return
    }

    const lower = description.toLowerCase()
    let generated = ''

    if (lower.includes('react') || lower.includes('component') || lower.includes('jsx')) {
      generated = CODE_SUGGESTIONS.react.generate
    } else if (lower.includes('javascript') || lower.includes('js') || lower.includes('node')) {
      generated = CODE_SUGGESTIONS.javascript.generate
    } else {
      generated = CODE_SUGGESTIONS.default.generate
    }

    addMessage('user', `Generate: ${description}`)
    simulateResponse(`${buildDeepResponse({ text: `generate ${description}`, context, mode })}\n\n---\n\n${generated}`)
  }, [addMessage, simulateResponse])

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    messageIdRef.current = 2
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    explainCode,
    refactorCode,
    fixCode,
    generateCode,
    clearMessages
  }
}

export default useCopilot

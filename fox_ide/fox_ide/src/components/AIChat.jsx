import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Mic,
  Paperclip,
  ChevronLeft
} from 'lucide-react'
import './AIChat.css'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. I can help you with code writing, debugging, explanations, and more. How can I assist you today?',
    timestamp: '2:30 PM'
  }
]

const suggestions = [
  'Explain async/await in JavaScript',
  'Help me debug this function',
  'Write a React component',
  'Optimize this code for performance'
]

function AIChat({ onBack }) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (query) => {
    const responses = [
      `Here's how you can approach "${query}":\n\n\`\`\`javascript\n// Example solution\nconst solution = () => {\n  // Your code here\n};\n\`\`\`\n\nLet me know if you need more details!`,
      `Great question! Let me help you with that.\n\nThe key concepts are:\n1. Understand the problem\n2. Break it down into smaller parts\n3. Implement step by step\n\nWould you like me to elaborate on any of these?`,
      `I can see what you're trying to do. Here's a clean approach:\n\n\`\`\`javascript\nfunction yourFunction() {\n  // Clean implementation\n  return result;\n}\n\`\`\`\n\nThis follows best practices and is easy to maintain.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="chat-back" onClick={() => onBack && onBack()}>
          <ChevronLeft size={20} />
        </button>
        <div className="chat-title">
          <Sparkles size={18} className="sparkle-icon" />
          <span>AI Assistant</span>
          <span className="status-dot"></span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">
                  {msg.role === 'assistant' ? 'FOX AI' : 'You'}
                </span>
                <span className="message-time">{msg.timestamp}</span>
              </div>
              <div className="message-text">
                <pre>{msg.content}</pre>
              </div>
              {msg.role === 'assistant' && (
                <div className="message-actions">
                  <button onClick={() => { navigator.clipboard.writeText(msg.content).catch(() => {}) }} title="Copy">
                    <Copy size={14} />
                  </button>
                  <button onClick={(e) => { e.currentTarget.classList.toggle('active') }} title="Helpful">
                    <ThumbsUp size={14} />
                  </button>
                  <button onClick={(e) => { e.currentTarget.classList.toggle('active') }} title="Not helpful">
                    <ThumbsDown size={14} />
                  </button>
                  <button onClick={() => {}} title="Regenerate">
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">
              <Bot size={18} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <button className="input-action">
            <Paperclip size={18} />
          </button>
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
          />
          <button className="input-action">
            <Mic size={18} />
          </button>
          <button
            className={`send-btn ${input.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIChat

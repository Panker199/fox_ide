import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#1e1e1e', color: '#f44747', fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', overflow: 'auto', height: '100vh' }}>
          <h2 style={{ color: '#f44747', marginBottom: 10 }}>Runtime Error</h2>
          <div>{this.state.error?.message}</div>
          <div style={{ marginTop: 10, color: '#888' }}>{this.state.error?.stack}</div>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ marginTop: 20, padding: '8px 16px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

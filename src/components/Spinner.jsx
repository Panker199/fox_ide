import React from 'react'
import './Spinner.css'

function Spinner({ size = 16, color = 'var(--accent)', show = false, className = '' }) {
  if (!show) return null

  return (
    <div className={`spinner-container ${className}`}>
      <svg
        className="spinner"
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
        <circle
          className="spinner-head"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          stroke={color}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function SaveIndicator({ saving, saved }) {
  return (
    <div className={`save-indicator ${saving ? 'saving' : saved ? 'saved' : ''}`}>
      {saving ? (
        <>
          <Spinner size={14} show={true} color="var(--accent)" />
          <span className="save-text">Saving...</span>
        </>
      ) : saved ? (
        <span className="save-text saved">Saved</span>
      ) : null}
    </div>
  )
}

export default Spinner

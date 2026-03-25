import React from 'react'

export function Spinner({ className = '' }) {
  return (
    <div
      className={`w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg p-6 max-w-md w-full mx-auto ${className}`}
    >
      {children}
    </div>
  )
}

import React from 'react'
import { Spinner } from './Spinner'

export function Button({
  children,
  loading = false,
  disabled,
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseStyles =
    'h-10 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
  }

  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner className="border-t-white border-white/30" />}
      {loading ? 'Loading...' : children}
    </button>
  )
}

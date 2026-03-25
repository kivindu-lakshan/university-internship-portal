import React, { useId } from 'react'

export function Input({ label, error, className = '', id, ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        className={`h-10 px-3 py-2 bg-white border rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

export function Select({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId()
  const selectId = id || generatedId

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={selectId}
        className={`h-10 px-3 py-2 bg-white border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 transition-colors ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

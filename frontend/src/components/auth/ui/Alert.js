import React from 'react'
import { CheckCircleIcon, XCircleIcon, InfoIcon } from 'lucide-react'

export function Alert({ variant, children, className = '' }) {
  const styles = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-blue-600',
  }

  const icons = {
    error: <XCircleIcon className="w-5 h-5 shrink-0" />,
    success: <CheckCircleIcon className="w-5 h-5 shrink-0" />,
    info: <InfoIcon className="w-5 h-5 shrink-0" />,
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-md text-white text-sm font-medium ${styles[variant]} ${className}`}
      role="alert"
    >
      {icons[variant]}
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

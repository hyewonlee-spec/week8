import React from 'react'

const variantClasses = {
  default: 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
  outline: 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100',
}

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
}

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center border text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant] ?? variantClasses.default,
        sizeClasses[size] ?? sizeClasses.default,
        className,
      ].join(' ')}
      {...props}
    />
  )
}

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Card ───────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl border border-gray-100',
        hover && 'hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer',
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-between mb-4', className)} {...props} />
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-semibold text-gray-900', className)} {...props} />
)
CardTitle.displayName = 'CardTitle'

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
)
CardBody.displayName = 'CardBody'

// ─── Badge ──────────────────────────────────────────────────
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-sky-50 text-sky-600',
  purple: 'bg-violet-50 text-violet-600',
}

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  purple: 'bg-violet-500',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
)
Badge.displayName = 'Badge'

// ─── Input ──────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-2.5 border rounded-xl text-sm transition-colors',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              rightIcon ? 'pr-10' : '',
              error
                ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
                : 'border-gray-200 bg-white',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Select ─────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-2.5 border rounded-xl text-sm bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            error ? 'border-red-300' : 'border-gray-200',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ─── Textarea ───────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charLimit?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, charLimit, id, value, onChange, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const currentLength = String(value || '').length
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {charLimit && (
              <span className={cn(
                'text-xs',
                currentLength > charLimit ? 'text-red-500' : 'text-gray-400'
              )}>
                {currentLength}/{charLimit}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-4 py-3 border rounded-xl text-sm transition-colors resize-none',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─── Divider ────────────────────────────────────────────────
export const Divider = ({ label, className }: { label?: string; className?: string }) => (
  <div className={cn('flex items-center gap-4', className)}>
    <div className="flex-1 h-px bg-gray-100" />
    {label && <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>}
    <div className="flex-1 h-px bg-gray-100" />
  </div>
)

// ─── Empty State ─────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-6">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
      {icon}
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 text-center max-w-sm mb-5">{description}</p>}
    {action}
  </div>
)

// ─── Skeleton ───────────────────────────────────────────────
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('bg-gray-100 animate-pulse rounded-lg', className)} />
)

// ─── Tooltip ────────────────────────────────────────────────
interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => (
  <div className="relative group inline-flex">
    {children}
    <div className={cn(
      'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap',
      'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
      'left-1/2 -translate-x-1/2',
      side === 'top' && 'bottom-full mb-2',
      side === 'bottom' && 'top-full mt-2',
    )}>
      {content}
      <div className={cn(
        'absolute left-1/2 -translate-x-1/2 w-0 h-0',
        side === 'top' && 'top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900',
        side === 'bottom' && 'bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900',
      )} />
    </div>
  </div>
)

// ─── Progress Bar ────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  color?: string
  showValue?: boolean
}

export const ProgressBar = ({ value, max = 100, label, color = '#6366f1', showValue = false }: ProgressBarProps) => {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showValue && <span className="text-xs text-gray-400">{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ─── Copy Button ────────────────────────────────────────────
export const CopyButton = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => {
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={cn(
        'p-1 rounded text-gray-400 hover:text-gray-600 transition-colors',
        copied && 'text-green-500',
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

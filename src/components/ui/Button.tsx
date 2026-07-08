import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-3 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

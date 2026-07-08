'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pills' | 'boxed'
  size?: 'sm' | 'md'
}

export function Tabs({ tabs, active, onChange, variant = 'underline', size = 'md' }: TabsProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'underline' && 'border-b border-gray-100 gap-0',
        variant === 'pills' && 'gap-1 p-1 bg-gray-100 rounded-xl',
        variant === 'boxed' && 'gap-1',
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            'flex items-center gap-1.5 font-medium transition-all duration-150 whitespace-nowrap disabled:opacity-40',
            size === 'sm' && 'text-xs py-1.5',
            size === 'md' && 'text-sm py-2.5',

            variant === 'underline' && [
              'px-4 border-b-2 -mb-px',
              active === tab.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ],

            variant === 'pills' && [
              'px-3 rounded-lg',
              active === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ],

            variant === 'boxed' && [
              'px-4 rounded-xl border',
              active === tab.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300',
            ],
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-xs font-bold',
              active === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-gray-200 text-gray-600'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

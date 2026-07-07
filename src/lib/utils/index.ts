import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger (used by shadcn-style components)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format INR
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Truncate text
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Parse domain from URL
export function parseDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// Check if valid URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

// Character count color
export function charCountColor(current: number, max: number): string {
  const ratio = current / max
  if (ratio > 1) return 'text-red-500'
  if (ratio > 0.9) return 'text-amber-500'
  return 'text-gray-400'
}

// Platform display config
export const PLATFORM_META: Record<string, {
  label: string
  color: string
  bg: string
  border: string
  icon: string
}> = {
  google: { label: 'Google Ads', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'G' },
  meta: { label: 'Meta Ads', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'M' },
  linkedin: { label: 'LinkedIn Ads', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', icon: 'L' },
  youtube: { label: 'YouTube Ads', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: 'Y' },
  shopping: { label: 'Google Shopping', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: 'S' },
  demand_gen: { label: 'Demand Gen', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', icon: 'D' },
  performance_max: { label: 'Performance Max', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'P' },
}

// Business goal display
export const GOAL_LABELS: Record<string, string> = {
  lead_generation: 'Lead Generation',
  ecommerce_sales: 'Ecommerce Sales',
  app_installs: 'App Installs',
  brand_awareness: 'Brand Awareness',
  website_traffic: 'Website Traffic',
}

// Confidence score label
export function confidenceLabel(score: number): string {
  if (score >= 80) return 'High Confidence'
  if (score >= 60) return 'Moderate Confidence'
  if (score >= 40) return 'Low Confidence'
  return 'Very Low Confidence'
}

// Score to color
export function scoreToColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

// Format large numbers
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

// Deep clone
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Check plan access
export function hasFeatureAccess(plan: string | null | undefined, feature: string): boolean {
  const FREE_FEATURES = ['basic_analysis', 'csv_export', 'google', 'meta']
  const PRO_FEATURES = [...FREE_FEATURES, 'competitor_analysis', 'creative_studio', 'landing_audit', 'forecasting', 'reports', 'linkedin', 'youtube', 'shopping', 'demand_gen', 'performance_max']
  const AGENCY_FEATURES = [...PRO_FEATURES, 'team_members', 'white_label', 'api_access']

  const p = plan || 'free'
  if (p === 'agency' || p === 'admin') return AGENCY_FEATURES.includes(feature)
  if (p === 'pro') return PRO_FEATURES.includes(feature)
  return FREE_FEATURES.includes(feature)
}

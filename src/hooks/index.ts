'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Subscription, Project, Campaign } from '@/types'

// ─── useUser ──────────────────────────────────────────────────────────────────
export function useUser() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      ])
      setProfile(p)
      setSubscription(s)
      setLoading(false)
    }
    load()
  }, [])

  const isPro = subscription?.plan === 'pro' || subscription?.plan === 'agency'
  const isAgency = subscription?.plan === 'agency'
  const isAdmin = profile?.role === 'admin'

  return { profile, subscription, loading, isPro, isAgency, isAdmin }
}

// ─── useProjects ─────────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setProjects(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return { projects, loading, error, refetch: load, deleteProject }
}

// ─── useProject ──────────────────────────────────────────────────────────────
export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!id) { setLoading(false); return }

    const load = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      setProject(data)
      setLoading(false)
    }
    load()

    // Real-time updates
    const channel = supabase
      .channel(`project-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${id}`,
      }, payload => {
        setProject(prev => prev ? { ...prev, ...payload.new } : null)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, supabase])

  return { project, loading, setProject }
}

// ─── useCampaigns ────────────────────────────────────────────────────────────
export function useCampaigns(projectId: string | null) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return }
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setCampaigns(data || [])
    setLoading(false)
  }, [projectId, supabase])

  useEffect(() => { load() }, [load])

  return { campaigns, loading, refetch: load }
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// ─── useCopyToClipboard ───────────────────────────────────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Copy failed')
    }
  }, [])

  return { copy, copied }
}

// ─── useInterval ─────────────────────────────────────────────────────────────
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)
  useEffect(() => { savedCallback.current = callback }, [callback])
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

// ─── useAnalysisPolling ───────────────────────────────────────────────────────
export function useAnalysisPolling(projectId: string, enabled: boolean) {
  const [status, setStatus] = useState<string>('analyzing')
  const supabase = createClient()

  useInterval(async () => {
    if (!enabled) return
    const { data } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single()
    if (data?.status) setStatus(data.status)
  }, enabled && status === 'analyzing' ? 3000 : null)

  return status
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Subscription, Project } from '@/types'

// ============================================================
// APP STORE (persisted)
// ============================================================
interface AppState {
  profile: Profile | null
  subscription: Subscription | null
  currentProject: Project | null
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'

  setProfile: (profile: Profile | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setCurrentProject: (project: Project | null) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      subscription: null,
      currentProject: null,
      sidebarCollapsed: false,
      theme: 'light',

      setProfile: (profile) => set({ profile }),
      setSubscription: (subscription) => set({ subscription }),
      setCurrentProject: (project) => set({ currentProject: project }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'adpilot-app-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)

// ============================================================
// CAMPAIGN GENERATION STORE (session only)
// ============================================================
interface GenerationState {
  activeGenerations: Record<string, {
    projectId: string
    platform: string
    status: 'pending' | 'generating' | 'complete' | 'error'
    progress: number
  }>
  startGeneration: (key: string, projectId: string, platform: string) => void
  updateProgress: (key: string, progress: number) => void
  completeGeneration: (key: string) => void
  failGeneration: (key: string) => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  activeGenerations: {},

  startGeneration: (key, projectId, platform) =>
    set(state => ({
      activeGenerations: {
        ...state.activeGenerations,
        [key]: { projectId, platform, status: 'generating', progress: 0 },
      },
    })),

  updateProgress: (key, progress) =>
    set(state => ({
      activeGenerations: {
        ...state.activeGenerations,
        [key]: { ...state.activeGenerations[key], progress },
      },
    })),

  completeGeneration: (key) =>
    set(state => ({
      activeGenerations: {
        ...state.activeGenerations,
        [key]: { ...state.activeGenerations[key], status: 'complete', progress: 100 },
      },
    })),

  failGeneration: (key) =>
    set(state => ({
      activeGenerations: {
        ...state.activeGenerations,
        [key]: { ...state.activeGenerations[key], status: 'error' },
      },
    })),
}))

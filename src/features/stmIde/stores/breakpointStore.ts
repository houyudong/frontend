/**
 * 断点存储 - 基于 DAP 标准的断点状态管理
 */

import { create } from 'zustand'

export interface Breakpoint {
  id: string
  file: string
  line: number
  verified: boolean  // DAP 标准：true=实心，false=空心
  enabled: boolean
  condition?: string
  hitCount?: number
  message?: string
}

interface BreakpointState {
  breakpoints: Breakpoint[]
  setBreakpoints: (breakpoints: Breakpoint[]) => void
  addBreakpoint: (breakpoint: Breakpoint) => void
  removeBreakpoint: (id: string) => void
  updateBreakpoint: (id: string, updates: Partial<Breakpoint>) => void
  toggleBreakpoint: (id: string) => void
  clearBreakpoints: () => void
  
  // DAP 标准状态更新
  setAllVerified: (verified: boolean) => void
}

export const useBreakpointStore = create<BreakpointState>((set, get) => ({
  breakpoints: [],

  setBreakpoints: (breakpoints) => set({ breakpoints }),

  addBreakpoint: (breakpoint) => set((state) => ({
    breakpoints: [...state.breakpoints, breakpoint]
  })),

  removeBreakpoint: (id) => set((state) => ({
    breakpoints: state.breakpoints.filter(bp => bp.id !== id)
  })),

  updateBreakpoint: (id, updates) => set((state) => ({
    breakpoints: state.breakpoints.map(bp => 
      bp.id === id ? { ...bp, ...updates } : bp
    )
  })),

  toggleBreakpoint: (id) => set((state) => ({
    breakpoints: state.breakpoints.map(bp => 
      bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
    )
  })),

  clearBreakpoints: () => set({ breakpoints: [] }),

  // 基于 DAP 标准：批量更新验证状态
  setAllVerified: (verified) => set((state) => ({
    breakpoints: state.breakpoints.map(bp => ({ ...bp, verified }))
  }))
}))

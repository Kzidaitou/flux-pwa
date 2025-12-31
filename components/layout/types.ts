import React from 'react'

export type ViewState = 'LOGIN' | 'HOME' | 'CHARGING' | 'PROFILE'

export interface LayoutProps {
  children: React.ReactNode
  currentView: ViewState
  isCharging?: boolean
}

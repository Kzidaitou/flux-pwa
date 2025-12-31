import React from 'react'

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

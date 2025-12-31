
// Add React import to fix UMD global reference errors
import React from 'react'
import { HomeRoute } from './modules/home.route'
import { ChargingRoute } from './modules/charging.route'
import { ProfileRoute } from './modules/profile.route'
import LoginRoute from './modules/login.route'

export interface ModuleRoute {
  path: string
  element: React.ReactNode
  protected?: boolean
}

/**
 * 静态路由表
 * 显式导出所有业务模块路由，确保在鸿蒙、App、Web 端具有 100% 的一致性
 */
export const getAppRoutes = (): ModuleRoute[] => {
  return [
    LoginRoute,
    {
      path: '/home',
      // Fix: Use React.createElement with imported React
      element: React.createElement(HomeRoute),
      protected: true
    },
    {
      path: '/charging',
      // Fix: Use React.createElement with imported React
      element: React.createElement(ChargingRoute),
      protected: true
    },
    {
      path: '/profile',
      // Fix: Use React.createElement with imported React
      element: React.createElement(ProfileRoute),
      protected: true
    }
  ]
}

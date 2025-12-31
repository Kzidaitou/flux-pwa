
import React, { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { getAppRoutes } from './registry'

/**
 * 协同友好型顶级路由器
 * 职责：动态聚合所有业务模块路由
 */
export const AppRouter: React.FC = () => {
  const allRoutes = useMemo(() => getAppRoutes(), [])

  // 区分受保护路由和公开路由
  const publicRoutes = allRoutes.filter(r => !r.protected)
  const protectedRoutes = allRoutes.filter(r => r.protected !== false) // 默认保护

  return (
    <Routes>
      {/* 1. 渲染公开路由 (如 Login) */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* 2. 渲染受保护路由 (如 Home, Charging, Profile) */}
      <Route element={<ProtectedRoute />}>
        {protectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* 3. 兜底重定向 */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { getStorage } from '../../platform'

export const ProtectedRoute: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  const needsAuth = process.env.APP_NEED_AUTH !== 'false'

  useEffect(() => {
    const checkAuth = async () => {
      // 优先从跨端适配的存储中获取 Token，确保鸿蒙、App、Web 一致性
      const token = await getStorage().getItem('access_token') || localStorage.getItem('access_token')
      setHasToken(!!token)
      setIsVerifying(false)
    }
    checkAuth()
  }, [])

  if (!needsAuth) return <Outlet />
  
  if (isVerifying) {
    return (
      <div className="h-full w-full bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!hasToken) {
    console.warn('[Guard] Unauthorized access, redirecting...')
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
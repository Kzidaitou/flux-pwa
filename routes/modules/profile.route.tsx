import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import Layout from '../../components/layout'
import Profile from '../../pages/Profile'
import { useUser } from '../../context/UserContext'
import { useUI } from '../../context/UIContext'
import { useCharging } from '../../context/ChargingContext'
import { useStations } from '../../context/StationContext'

export const ProfileRoute: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    user, history, logout, refreshUser, refreshHistory, 
    updateUser, updateHistory,
    isLoadingProfile, isLoadingHistory 
  } = useUser()
  const { showToast, showAlert, setActiveModal } = useUI()
  const { setChargingSession, isCharging, resetCharging } = useCharging()
  const { resetStations } = useStations()
  
  const [jumpToSessionId, setJumpToSessionId] = useState<string | null>(null)

  useEffect(() => {
    const state = location.state as { sessionId?: string } | null
    if (state?.sessionId) {
      setJumpToSessionId(state.sessionId)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const activeUnpaidSession = history.find((h) => h.status === 'unpaid')

  const handleLogout = async () => {
    // 1. 清理业务模块状态
    resetStations()
    resetCharging()
    
    // 2. 清理用户核心状态（包含 Token 清除）
    await logout()
    
    // 3. 导航至登录页
    navigate('/login', { replace: true })
    showToast('Logged out successfully', 'info')
  }

  const handleBannerClick = () => {
    if (isCharging) {
      navigate('/charging')
    } else if (activeUnpaidSession) {
      setJumpToSessionId(activeUnpaidSession.id)
    }
  }

  return (
    <Layout currentView="PROFILE" isCharging={isCharging}>
      <Profile
        user={user!}
        onLogout={handleLogout}
        onUpdateUser={updateUser}
        history={history}
        onRefresh={async () => {
          await Promise.all([refreshUser(true), refreshHistory(true)])
        }}
        onUpdateHistory={updateHistory}
        initialSessionId={jumpToSessionId}
        onClearInitialSessionId={() => setJumpToSessionId(null)}
        onPayPastSession={(s) => {
          setChargingSession(s as any)
          setActiveModal('PAYMENT_SESSION')
        }}
        isCharging={isCharging}
        activeUnpaidSession={activeUnpaidSession}
        onBannerClick={handleBannerClick}
        onShowAlert={showAlert}
        onShowToast={showToast}
        isLoadingProfile={isLoadingProfile}
        isLoadingHistory={isLoadingHistory}
      />
    </Layout>
  )
}
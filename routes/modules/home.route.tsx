import React from 'react'
import { useNavigate } from 'react-router'
import Layout from '../../components/layout'
import Home from '../../pages/Home'
import { useUser } from '../../context/UserContext'
import { useStations } from '../../context/StationContext'
import { useUI } from '../../context/UIContext'
import { useCharging } from '../../context/ChargingContext'

export const HomeRoute: React.FC = () => {
  const navigate = useNavigate()
  const { user, history } = useUser()
  const { stations, refreshStations, isLoading } = useStations()
  const { showToast } = useUI()
  const { startCharging, isCharging } = useCharging()
  
  const activeUnpaidSession = history.find((h) => h.status === 'unpaid')

  // 优化点击逻辑：支持携带状态跳转
  const handleBannerClick = () => {
    if (isCharging) {
      navigate('/charging')
    } else if (activeUnpaidSession) {
      // 优化：不仅跳转，还告诉 Profile 页面要打开哪个订单
      navigate('/profile', { state: { sessionId: activeUnpaidSession.id } })
    }
  }

  return (
    <Layout currentView="HOME" isCharging={isCharging}>
      <Home
        stations={stations}
        isLoading={isLoading}
        onRefresh={() => refreshStations(true)}
        onStartCharging={startCharging}
        onNavigateToProfile={() => navigate('/profile')} 
        user={user}
        isCharging={isCharging}
        activeUnpaidSession={activeUnpaidSession}
        onBannerClick={handleBannerClick}
        onClearInitialCode={() => {}}
        onShowToast={showToast}
      />
    </Layout>
  )
}
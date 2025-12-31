import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router'
import { UIProvider, useUI } from './context/UIContext'
import { UserProvider, useUser } from './context/UserContext'
import { StationProvider, useStations } from './context/StationContext'
import { ChargingProvider, useCharging } from './context/ChargingContext'
import { AppRouter } from './routes/AppRouter'
import { ProviderComposer } from './components/context-composer'
import PaymentModal from './components/payment/PaymentModal'
import ForgotPasswordModal from './components/auth/ForgotPasswordModal'
import BiometricLockScreen from './components/auth/BiometricLockScreen'
import { setupInterceptors } from './core/request'
import { getStorage, getPlatformClass } from './platform'
import { RefreshCw } from 'lucide-react'

export const FluxApp: React.FC = () => {
  const { user, logout, refreshUser, refreshHistory } = useUser()
  const { refreshStations, resetStations } = useStations()
  const { showToast, activeModal, setActiveModal, isAppLocked, setAppLocked } = useUI()
  const { chargingSession, setChargingSession, resetCharging } = useCharging()
  const [showUpdateBar, setShowUpdateBar] = useState(false)
  const initRef = useRef(false)

  const handleFullLogout = async () => {
    resetStations()
    resetCharging()
    await logout()
  }

  const handlePaymentSuccess = async () => {
    await Promise.all([refreshUser(true), refreshHistory(true)])
    setChargingSession(null)
    setActiveModal('NONE')
    showToast('Payment successful', 'success')
  }

  useEffect(() => {
    setupInterceptors((m, t) => showToast(m, t), handleFullLogout)
    
    // 监听 PWA 更新事件
    const onUpdate = () => setShowUpdateBar(true);
    window.addEventListener('pwa-update-available', onUpdate);

    if (initRef.current) return
    initRef.current = true

    const bootstrap = async () => {
      const token = (await getStorage().getItem('access_token')) || localStorage.getItem('access_token')
      if (!token && process.env.APP_NEED_AUTH !== 'false') return;
      
      try {
        await Promise.allSettled([refreshUser(true), refreshHistory(true), refreshStations(true)])
      } catch (e) {}
    }
    
    bootstrap()
    document.body.classList.add(getPlatformClass())
    return () => window.removeEventListener('pwa-update-available', onUpdate);
  }, [refreshUser, refreshHistory, refreshStations, logout, showToast])

  useEffect(() => {
    if (!user?.preferences.faceId) return
    setAppLocked(true)
  }, [user?.preferences.faceId, setAppLocked])

  return (
    <div className="h-full w-full bg-light dark:bg-dark text-gray-900 dark:text-white relative">
      <AppRouter />
      
      {/* PWA 更新提示栏 */}
      {showUpdateBar && (
        <div className="fixed bottom-24 left-4 right-4 z-[999] animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-primary text-dark p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <RefreshCw size={20} className="animate-spin-slow" />
              <div>
                <p className="font-black text-xs uppercase tracking-tighter">New Version Ready</p>
                <p className="text-[10px] font-bold opacity-80">Update to access latest features</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Update Now
            </button>
          </div>
        </div>
      )}

      {activeModal === 'PAYMENT_SESSION' && chargingSession && user && (
        <PaymentModal session={chargingSession} user={user} onPay={handlePaymentSuccess} onClose={() => setActiveModal('NONE')} />
      )}
      {activeModal === 'FORGOT_PASSWORD' && (
        <ForgotPasswordModal onClose={() => setActiveModal('NONE')} onShowToast={(m, t) => showToast(m, t as any)} />
      )}
      {isAppLocked && user?.preferences.faceId && (
        <BiometricLockScreen onUnlock={() => setAppLocked(false)} />
      )}
    </div>
  )
}

const App: React.FC = () => (
  <BrowserRouter>
    <ProviderComposer providers={[
      <UIProvider children={null} />,
      <UserProvider children={null} />,
      <StationProvider children={null} />,
      <ChargingProvider children={null} />
    ]}>
      <FluxApp />
    </ProviderComposer>
  </BrowserRouter>
)

export default App;

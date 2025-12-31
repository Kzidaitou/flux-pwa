
import React, { useState, useEffect } from 'react'
import { Edit2, LogOut } from 'lucide-react'
import { ProfileProps } from '../types/modules/user'
import { PastSession } from '../services/user/types'
import StatusBanner from '../components/status-banner'
import UserProfileCard from '../components/profile/main/UserProfileCard'
import WalletCard from '../components/profile/main/WalletCard'
import MenuButtons from '../components/profile/main/MenuButtons'
import TopUpModal from '../components/profile/wallet/TopUpModal'
import VehicleModal from '../components/profile/vehicle/VehicleModal'
import HistoryModal from '../components/profile/history/HistoryModal'
import PaymentMethodsModal from '../components/profile/wallet/PaymentMethodsModal'
import EditProfileModal from '../components/profile/account/EditProfileModal'
import SettingsModal from '../components/profile/settings/SettingsModal'
import AccountBindingModal from '../components/profile/account/AccountBindingModal'
import SetPasswordModal from '../components/profile/account/SetPasswordModal'
import PrivacyModal from '../components/legal/PrivacyModal'
import PullToRefresh from '../components/pull-to-refresh'
import { useUI } from '../context/UIContext'
import { userApi } from '../services/user'

const APP_VERSION = process.env.APP_PUBLIC_VERSION || '1.0.0'

interface ExtendedProfileProps extends ProfileProps {
  onRefresh: () => Promise<void>
}

const Profile: React.FC<ExtendedProfileProps> = ({
  user,
  onLogout,
  onUpdateUser,
  history,
  onRefresh,
  onUpdateHistory,
  initialSessionId,
  onClearInitialSessionId,
  onPayPastSession,
  isCharging,
  activeUnpaidSession,
  onBannerClick,
  onShowAlert,
  onShowToast,
  isLoadingProfile,
  isLoadingHistory
}) => {
  const { activeModal, setActiveModal } = useUI()
  const [selectedSession, setSelectedSession] = useState<PastSession | null>(null)

  useEffect(() => {
    if (initialSessionId && history.length > 0) {
      const session = history.find((h) => h.id === initialSessionId)
      if (session) {
        setSelectedSession(session)
        setActiveModal('HISTORY')
      }
      onClearInitialSessionId()
    }
  }, [initialSessionId, history, onClearInitialSessionId, setActiveModal])

  const handleConfirmTopUp = async (amount: number, method: string) => {
    try {
      const res = await userApi.topUp(amount, method)
      if (res.success) {
        onUpdateUser({ balance: res.newBalance })
        onShowToast(`Successfully added ${amount} to wallet`, 'success')
      }
    } catch (err: any) {
      onShowAlert('Top Up Failed', err.message || 'Unable to process payment at this time.', 'error')
      throw err 
    }
  }

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="pt-6 px-4 pb-40 relative bg-light dark:bg-dark min-h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Profile</h2>
          <button
            type="button"
            disabled={!user}
            onClick={() => setActiveModal('EDIT_PROFILE')}
            className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:text-white transition-all active:scale-90 disabled:opacity-50"
            title="Edit"
          >
            <Edit2 size={20} />
          </button>
        </div>

        <UserProfileCard user={user} isLoading={isLoadingProfile} />

        <StatusBanner
          isCharging={isCharging}
          activeUnpaidSession={activeUnpaidSession}
          onClick={onBannerClick}
          className="mb-6"
        />

        <WalletCard balance={user?.balance || 0} onTopUp={() => setActiveModal('TOPUP')} isLoading={isLoadingProfile || !user} />

        <MenuButtons
          user={user}
          history={history}
          onOpenVehicle={() => setActiveModal('VEHICLE')}
          onOpenHistory={() => { setActiveModal('HISTORY'); }}
          onOpenPayment={() => setActiveModal('PAYMENT_METHODS')}
          onOpenSettings={() => setActiveModal('SETTINGS')}
          isLoading={isLoadingProfile}
        />

        <button
          onClick={onLogout}
          className="w-full mt-10 p-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-red-500 font-black bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          <LogOut size={18} />
          Sign Out Account
        </button>

        <p className="text-center text-gray-400 dark:text-gray-600 text-[10px] font-black mt-12 pb-4 uppercase tracking-[0.3em]">
          Flux Network © 2025 • v{APP_VERSION}
        </p>

        {activeModal === 'TOPUP' && user && (
          <TopUpModal 
            balance={user.balance} 
            onConfirmTopUp={handleConfirmTopUp} 
            onClose={() => setActiveModal('NONE')} 
          />
        )}
        {activeModal === 'VEHICLE' && user && (
          <VehicleModal user={user} onUpdateUser={onUpdateUser} onClose={() => setActiveModal('NONE')} />
        )}
        {activeModal === 'HISTORY' && (
          <HistoryModal 
            history={history} 
            selectedSession={selectedSession} 
            onSelectSession={setSelectedSession} 
            onPayPastSession={onPayPastSession} 
            onUpdateHistory={onUpdateHistory} 
            onClose={() => { setActiveModal('NONE'); setSelectedSession(null); }} 
            onShowAlert={onShowAlert} 
            onShowToast={onShowToast}
            isLoading={isLoadingHistory}
          />
        )}
        {activeModal === 'PAYMENT_METHODS' && user && (
          <PaymentMethodsModal balance={user.balance} onClose={() => setActiveModal('NONE')} />
        )}
        {activeModal === 'EDIT_PROFILE' && user && (
          <EditProfileModal user={user} onUpdateUser={onUpdateUser} onClose={() => setActiveModal('NONE')} />
        )}
        {activeModal === 'SETTINGS' && user && (
          <SettingsModal user={user} onUpdateUser={onUpdateUser} onClose={() => setActiveModal('NONE')} onOpenAccountBinding={() => setActiveModal('ACCOUNT_BINDING')} onOpenSetPassword={() => setActiveModal('SET_PASSWORD')} onOpenPrivacy={() => setActiveModal('PRIVACY')} appVersion={APP_VERSION} />
        )}
        {activeModal === 'ACCOUNT_BINDING' && user && (
          <AccountBindingModal user={user} onUpdateUser={onUpdateUser} onBack={() => setActiveModal('SETTINGS')} onOpenSetPassword={() => setActiveModal('SET_PASSWORD')} onClose={() => setActiveModal('NONE')} />
        )}
        {activeModal === 'SET_PASSWORD' && user && (
          <SetPasswordModal user={user} onUpdateUser={onUpdateUser} onBack={() => setActiveModal('SETTINGS')} onClose={() => setActiveModal('NONE')} onShowAlert={onShowAlert} />
        )}
        {activeModal === 'PRIVACY' && <PrivacyModal onClose={() => setActiveModal('SETTINGS')} />}
      </div>
    </PullToRefresh>
  )
}

export default Profile

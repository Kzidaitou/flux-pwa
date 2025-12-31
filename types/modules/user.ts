
import { User, PastSession } from '../../services/user/types'
import { AlertType } from '../common/primitives'

export * from '../../services/user/types'

/**
 * 个人中心视图属性 (Profile View Props)
 */
export interface ProfileProps {
  user: User
  onLogout: () => void
  onUpdateUser: (updates: Partial<User>) => void
  history: PastSession[]
  onUpdateHistory: (items: PastSession[]) => void
  initialSessionId: string | null
  onClearInitialSessionId: () => void
  onPayPastSession: (session: PastSession) => void
  isCharging: boolean
  activeUnpaidSession?: PastSession
  onBannerClick: () => void
  onShowAlert: (title: string, message: string, type: AlertType) => void
  onShowToast: (message: string, type: AlertType, duration?: number) => void
  isLoadingProfile?: boolean
  isLoadingHistory?: boolean
}

export interface UserProfileCardProps {
  user: User
  isLoading?: boolean
}

export interface WalletCardProps {
  balance: number
  onTopUp: () => void
  isLoading?: boolean
}

/**
 * Added TopUpModalProps to fix missing export error in TopUpModal.tsx
 */
export interface TopUpModalProps {
  balance: number
  onTopUp?: (amount: number) => void
  onClose: () => void
}

export interface VehicleModalProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onClose: () => void
}

export interface HistoryModalProps {
  history: PastSession[]
  selectedSession: PastSession | null
  onSelectSession: (session: PastSession | null) => void
  onPayPastSession: (session: PastSession) => void
  onUpdateHistory: (items: PastSession[]) => void
  onClose: () => void
  onShowAlert: (title: string, message: string, type: AlertType) => void
  onShowToast: (message: string, type: AlertType, duration?: number) => void
  isLoading?: boolean
}

export interface PaymentMethodsModalProps {
  balance: number
  onClose: () => void
}

export interface EditProfileModalProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onClose: () => void
}

export interface SettingsModalProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onClose: () => void
  onOpenAccountBinding: () => void
  onOpenSetPassword: () => void
  onOpenPrivacy: () => void
  appVersion: string
}

export interface AccountBindingModalProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onBack: () => void
  onOpenSetPassword: () => void
  onClose: () => void
}

export interface SetPasswordModalProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onBack: () => void
  onClose: () => void
  onShowAlert: (title: string, message: string, type: AlertType) => void
}

export interface PrivacyModalProps {
  onClose: () => void
}

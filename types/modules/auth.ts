
import { AuthData } from '../../services/auth/types'
import { AlertType } from '../common/primitives'

export * from '../../services/auth/types'

/**
 * 登录页面视图属性 (Login View Props)
 */
export interface LoginProps {
  onLogin: (data: AuthData) => Promise<void> | void
  onShowAlert: (title: string, message: string, type: AlertType) => void
  onShowToast: (message: string, type: AlertType, duration?: number) => void
  onForgotPassword?: () => void
  onOpenPrivacy?: () => void
  onOpenAgreement?: () => void
  platform?: string
}

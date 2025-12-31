
import { AlertType } from '../../types/common/primitives'

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: AlertType
  allowBackdropDismiss?: boolean
}

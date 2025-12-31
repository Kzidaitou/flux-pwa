import { ChargingSession } from '../../services/charging/types'
import { User } from '../../services/user/types'

export interface PaymentProps {
  session: ChargingSession
  user: User
  onPay: (topUpAmount?: number) => void
}

export interface BillReceiptProps {
  session: ChargingSession
}

export interface PaymentModalProps {
  session: ChargingSession
  user: User
  onPay: (topUpAmount?: number) => void
  onClose: () => void
}

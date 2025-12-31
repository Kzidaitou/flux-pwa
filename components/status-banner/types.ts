import { PastSession } from '../../services/user/types'

export interface StatusBannerProps {
  isCharging: boolean
  activeUnpaidSession?: PastSession
  onClick: () => void
  className?: string
}


import { ChargingSession } from '../../services/charging/types'
import { PastSession } from '../../services/user/types'
import { AlertType } from '../common/primitives'

export * from '../../services/charging/types'

/**
 * 实时充电页面视图属性 (Charging View Props)
 */
export interface ChargingProps {
  session: ChargingSession | null
  onStopSession: () => void
  onStartByCode: (code: string) => Promise<boolean>
  isCharging: boolean
  activeUnpaidSession?: PastSession
  prefilledCode?: string | null
  onShowToast: (message: string, type: AlertType) => void
}

export interface ChargingChartProps {
  data: { time: number; power: number }[]
}

export interface ChargingStatsProps {
  session: ChargingSession
  onStopSession: () => void
}

/**
 * Added BillReceiptProps to fix missing export error in BillReceipt.tsx
 */
export interface BillReceiptProps {
  session: ChargingSession
}

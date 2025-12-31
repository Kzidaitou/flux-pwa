/**
 * 实时充电会话模型
 */
export interface ChargingSession {
  id: string
  stationId: string
  connectorId: string
  startTime: number
  status: 'charging' | 'completed'
  kwhDelivered: number
  currentPower: number
  batteryLevel: number
  cost: number
}
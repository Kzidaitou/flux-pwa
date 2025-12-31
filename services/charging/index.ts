
import { api } from '../../core/request'
import { ChargingSession } from './types'
import { MockChargingSocket } from '../../core/websocket'

export const chargingApi = {
  startSession: async (stationId: string, connectorId: string): Promise<ChargingSession> => {
    return api.post<ChargingSession>('/charging/start', { stationId, connectorId })
  },

  getSessionSocket: (sessionId: string): MockChargingSocket => {
    return new MockChargingSocket(sessionId)
  },

  stopSession: async (sessionId: string): Promise<boolean> => {
    return api.post<boolean>('/charging/stop', { sessionId })
  }
}

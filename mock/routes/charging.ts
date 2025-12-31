
import { ChargingSession } from '../../services/charging/types'

export const MOCK_CHARGING_START = (stationId: string, connectorId: string): ChargingSession => ({
  id: 'sess_' + Math.random().toString(36).substr(2, 9),
  stationId,
  connectorId,
  status: 'charging',
  batteryLevel: 24,
  kwhDelivered: 0,
  currentPower: 0,
  cost: 0,
  startTime: Date.now()
});

export const routes = {
  '/charging/start': (body: any) => MOCK_CHARGING_START(body?.stationId || '1', body?.connectorId || 't-1'),
  '/charging/stop': { success: true },
};

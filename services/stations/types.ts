/**
 * 充电站领域模型
 */
export interface Connector {
  id: string
  label: string
  code: string
  type: string
  power: number
  status: 'available' | 'busy' | 'offline' | 'faulted'
}

export interface PriceSlot {
  start: string
  end: string
  price: number
  label: 'Off-Peak' | 'Standard' | 'Peak'
}

export interface Station {
  id: string
  name: string
  address: string
  distance: string
  pricePerKwh: number
  priceSchedule?: PriceSlot[]
  available: number
  total: number
  type: 'AC' | 'DC'
  power: number
  status: 'online' | 'busy' | 'offline' | 'maintenance' | 'closed'
  openingHours?: string
  coordinates: { lat: number; lng: number }
  mapPos?: { top: string; left: string }
  connectors: Connector[]
}
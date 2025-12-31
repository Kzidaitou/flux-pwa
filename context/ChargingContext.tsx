import React, { createContext, useContext, useState, useCallback } from 'react'
import { ChargingSession } from '../types/modules/charging'
import { Station } from '../types/modules/station'
import { chargingApi } from '../services'
import { useUI } from './UIContext'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router'

interface ChargingContextType {
  chargingSession: ChargingSession | null
  setChargingSession: (s: ChargingSession | null) => void
  startCharging: (station: Station, connectorId: string) => Promise<boolean>
  resetCharging: () => void // 新增：重置方法
  isStarting: boolean
  isCharging: boolean
}

const ChargingContext = createContext<ChargingContextType | undefined>(undefined)

export const ChargingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chargingSession, setChargingSession] = useState<ChargingSession | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const { showAlert } = useUI()
  const { history } = useUser()
  const navigate = useNavigate()

  const isCharging = !!chargingSession && chargingSession.status === 'charging'

  const startCharging = useCallback(async (station: Station, connectorId: string) => {
    const hasUnpaid = history.some(h => h.status === 'unpaid')
    
    if (hasUnpaid) {
      showAlert('Payment Required', 'Please settle your unpaid invoice in your profile before starting a new session.', 'warning')
      return false
    }

    if (isCharging) {
      showAlert('Notice', 'A charging session is already in progress. Please complete it first.', 'info')
      return false
    }

    setIsStarting(true)
    try {
      const session = await chargingApi.startSession(station.id, connectorId)
      setChargingSession(session)
      navigate('/charging')
      return true
    } catch (e) {
      showAlert('Start Failed', 'Could not connect to the charger. Please check the connector and try again.', 'error')
      return false
    } finally {
      setIsStarting(false)
    }
  }, [navigate, showAlert, history, isCharging])

  const resetCharging = useCallback(() => {
    setChargingSession(null)
    setIsStarting(false)
  }, [])

  return (
    <ChargingContext.Provider value={{ 
      chargingSession, 
      setChargingSession, 
      startCharging, 
      resetCharging,
      isStarting,
      isCharging 
    }}>
      {children}
    </ChargingContext.Provider>
  )
}

export const useCharging = () => {
  const context = useContext(ChargingContext)
  if (!context) throw new Error('useCharging must be used within ChargingProvider')
  return context
}
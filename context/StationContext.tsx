import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Station } from '../types/modules/station'
import { stationsApi } from '../services'
import { getCurrentLocation } from '../platform'

interface StationContextType {
  stations: Station[]
  isLoading: boolean
  isLoaded: boolean
  locationStatus: 'granted' | 'denied' | 'prompt'
  refreshStations: (force?: boolean) => Promise<void>
  resetStations: () => void // 新增：重置方法
}

const StationContext = createContext<StationContextType | undefined>(undefined)

export const StationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const loadingRef = useRef(false)

  const refreshStations = useCallback(async (force = false) => {
    if (loadingRef.current || (isLoaded && stations.length > 0 && !force)) return
    
    loadingRef.current = true
    setIsLoading(true)
    
    try {
      let coordsParam: { lat?: number; lng?: number } = {}
      try {
        const location = await getCurrentLocation()
        coordsParam = { lat: location.latitude, lng: location.longitude }
        setLocationStatus('granted')
      } catch (e: any) {
        setLocationStatus('denied')
      }

      const data = await stationsApi.getStations(coordsParam)
      setStations(data)
      setIsLoaded(true)
    } catch (e) {
      console.error('Failed to fetch stations', e)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [isLoaded, stations.length])

  const resetStations = useCallback(() => {
    setStations([])
    setIsLoaded(false)
    setIsLoading(false)
    loadingRef.current = false
    setLocationStatus('prompt')
  }, [])

  return (
    <StationContext.Provider value={{ 
      stations, isLoading, isLoaded, locationStatus, refreshStations, resetStations 
    }}>
      {children}
    </StationContext.Provider>
  )
}

export const useStations = () => {
  const context = useContext(StationContext)
  if (!context) throw new Error('useStations must be used within StationProvider')
  return context
}
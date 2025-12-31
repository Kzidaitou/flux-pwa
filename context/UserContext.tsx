
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { User, PastSession } from '../types/modules/user'
import { userApi } from '../services'
import { getStorage } from '../platform'

interface UserContextType {
  user: User | null
  history: PastSession[]
  isLoaded: boolean
  isLoadingProfile: boolean
  isLoadingHistory: boolean
  refreshUser: (force?: boolean) => Promise<void>
  refreshHistory: (force?: boolean) => Promise<void>
  login: (authData: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  updateHistory: (history: PastSession[]) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<PastSession[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  const profileLoadingRef = useRef(false)
  const historyLoadingRef = useRef(false)

  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [user?.preferences.darkMode])

  const refreshUser = useCallback(async (force = false) => {
    if ((isLoaded && user && !force) || profileLoadingRef.current) return
    
    profileLoadingRef.current = true
    setIsLoadingProfile(true)
    try {
      const profile = await userApi.getProfile()
      setUser(profile)
      setIsLoaded(true)
    } catch (e) {
      console.error('Failed to fetch profile', e)
    } finally {
      setIsLoadingProfile(false)
      profileLoadingRef.current = false
    }
  }, [isLoaded, user])

  const refreshHistory = useCallback(async (force = false) => {
    if ((history.length > 0 && !force) || historyLoadingRef.current) return
    
    historyLoadingRef.current = true
    setIsLoadingHistory(true)
    try {
      const data = await userApi.getHistory()
      setHistory(data)
    } catch (e) {
      console.error('Failed to fetch history', e)
    } finally {
      setIsLoadingHistory(false)
      historyLoadingRef.current = false
    }
  }, [history])

  const login = async (_authData: any) => {
    await Promise.all([refreshUser(true), refreshHistory(true)])
  }

  const logout = async () => {
    await getStorage().removeItem('access_token')
    setUser(null)
    setHistory([])
    setIsLoaded(false)
  }

  const updateUserState = (updates: Partial<User>) => {
     setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  return (
    <UserContext.Provider value={{ 
      user, history, isLoaded, 
      isLoadingProfile, isLoadingHistory,
      refreshUser, refreshHistory, login, logout,
      updateUser: updateUserState,
      updateHistory: setHistory
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

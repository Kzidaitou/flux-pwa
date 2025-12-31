
import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertType } from '../types/common/primitives'
import { ModalType } from '../types/common/navigation'
import { ToastState, ToastAction } from '../components/toast/types'
import AlertModal from '../components/alert-modal'
import Toast from '../components/toast'

interface UIContextType {
  showAlert: (title: string, message: string, type?: AlertType) => void
  showToast: (message: React.ReactNode, type?: AlertType, duration?: number, action?: ToastAction) => void
  hideAlert: () => void
  hideToast: () => void
  activeModal: ModalType
  setActiveModal: (modal: ModalType) => void
  isAppLocked: boolean
  setAppLocked: (locked: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: AlertType }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  })

  const [toast, setToast] = useState<ToastState>({
    id: 0,
    isOpen: false,
    message: '',
    type: 'info',
  })

  const [activeModal, setActiveModal] = useState<ModalType>('NONE')
  const [isAppLocked, setIsAppLocked] = useState(false)

  const showAlert = useCallback((title: string, message: string, type: AlertType = 'info') => {
    setAlert({ isOpen: true, title, message, type })
  }, [])

  const showToast = useCallback((message: React.ReactNode, type: AlertType = 'info', duration = 3000, action?: ToastAction) => {
    setToast({ id: Date.now(), isOpen: true, message, type, duration, action })
  }, [])

  const hideAlert = useCallback(() => setAlert(prev => ({ ...prev, isOpen: false })), [])
  const hideToast = useCallback(() => setToast(prev => ({ ...prev, isOpen: false })), [])

  return (
    <UIContext.Provider value={{ 
      showAlert, showToast, hideAlert, hideToast, 
      activeModal, setActiveModal,
      isAppLocked, setAppLocked: setIsAppLocked
    }}>
      {children}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        action={toast.action}
        onClose={hideToast}
      />
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within UIProvider')
  return context
}

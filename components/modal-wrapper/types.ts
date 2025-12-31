import React from 'react'

export interface ModalWrapperProps {
  onClose: () => void
  children: React.ReactNode
  title?: string
  allowBackdropDismiss?: boolean
}

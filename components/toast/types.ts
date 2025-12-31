
import React from 'react'
import { AlertType } from '../../types/common/primitives'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastState {
  id: number
  isOpen: boolean
  message: React.ReactNode
  type: AlertType
  duration?: number
  action?: ToastAction
}

export interface ToastProps extends Omit<ToastState, 'id'> {
  onClose: () => void
}

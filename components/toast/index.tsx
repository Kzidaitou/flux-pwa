import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { ToastProps } from './types'

const Toast: React.FC<ToastProps> = ({
  isOpen,
  message,
  type = 'info',
  duration = 3000,
  action,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white dark:bg-surface border-l-4 border-green-500',
          icon: <CheckCircle2 size={20} className="text-green-500" />,
          text: 'text-gray-800 dark:text-white',
        }
      case 'error':
        return {
          bg: 'bg-white dark:bg-surface border-l-4 border-red-500',
          icon: <AlertCircle size={20} className="text-red-500" />,
          text: 'text-gray-800 dark:text-white',
        }
      case 'warning':
        return {
          bg: 'bg-white dark:bg-surface border-l-4 border-yellow-500',
          icon: <AlertTriangle size={20} className="text-yellow-500" />,
          text: 'text-gray-800 dark:text-white',
        }
      default:
        return {
          bg: 'bg-white dark:bg-surface border-l-4 border-blue-500',
          icon: <Info size={20} className="text-blue-500" />,
          text: 'text-gray-800 dark:text-white',
        }
    }
  }

  const styles = getStyles()

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[110] w-full max-w-sm px-4 pointer-events-none">
      <div
        className={`pointer-events-auto shadow-2xl rounded-lg p-4 flex items-start gap-3 border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-5 fade-in duration-300 ${styles.bg}`}
      >
        <div className="shrink-0 mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${styles.text} break-words`}>{message}</div>
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
                onClose()
              }}
              className="mt-2 text-xs font-bold text-primary hover:underline focus:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          title="Close"
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast

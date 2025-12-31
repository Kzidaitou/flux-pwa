import React from 'react'
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { AlertModalProps } from './types'

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  allowBackdropDismiss = false,
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={48} className="text-green-500" />
      case 'error':
        return <AlertCircle size={48} className="text-red-500" />
      case 'warning':
        return <AlertTriangle size={48} className="text-yellow-500" />
      default:
        // Fixed: Replaced incorrect character with standard Info icon
        return <Info size={48} className="text-blue-500" />
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={allowBackdropDismiss ? onClose : undefined}
      />
      <div className="relative bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl p-6 shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700 pointer-events-auto z-10">
        <button
          type="button"
          title="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 z-20"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-full">{getIcon()}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed px-2">{message}</p>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${getButtonColor()}`}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertModal
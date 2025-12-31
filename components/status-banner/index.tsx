import React from 'react'
import { Zap, ChevronRight, AlertCircle } from 'lucide-react'
import { StatusBannerProps } from './types'

const StatusBanner: React.FC<StatusBannerProps> = ({
  isCharging,
  activeUnpaidSession,
  onClick,
  className = '',
}) => {
  if (isCharging) {
    return (
      <div className={`w-full ${className} animate-in fade-in slide-in-from-top-2 duration-300`}>
        <button
          className="w-full bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md border border-green-500/30 rounded-2xl p-3 flex items-center justify-between shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center relative">
              <Zap size={16} className="text-green-500 animate-pulse" fill="currentColor" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm leading-none">Charging in progress</p>
              <p className="text-green-400 text-[10px] mt-0.5">Tap to monitor session</p>
            </div>
          </div>
          <div className="bg-green-500/20 text-green-500 p-1.5 rounded-full">
            <ChevronRight size={14} />
          </div>
        </button>
      </div>
    )
  }

  if (activeUnpaidSession) {
    return (
      <div className={`w-full ${className} animate-in fade-in slide-in-from-top-2 duration-300`}>
        <button
          className="w-full bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-3 flex items-center justify-between shadow-lg hover:bg-red-900 transition-colors"
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center relative">
              <AlertCircle size={18} className="text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm leading-none">Unpaid Order Pending</p>
              <p className="text-red-300 text-[10px] mt-0.5">Services suspended until paid</p>
            </div>
          </div>
          <div className="bg-white/10 text-white p-1.5 rounded-full">
            <ChevronRight size={14} />
          </div>
        </button>
      </div>
    )
  }

  return null
}

export default StatusBanner

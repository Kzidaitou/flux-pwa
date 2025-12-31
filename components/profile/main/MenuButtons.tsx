
import React from 'react'
import { Clock, CreditCard, Settings, ChevronRight } from 'lucide-react'
import { getVehicleBrandIcon } from '../../../constant/vehicle'
import Icon from '../../ui/Icon'

const MenuButtons: React.FC<{ user: any; history: any[]; onOpenVehicle: any; onOpenHistory: any; onOpenPayment: any; onOpenSettings: any; isLoading?: boolean }> = ({
  user, history = [], onOpenVehicle, onOpenHistory, onOpenPayment, onOpenSettings, isLoading
}) => {
  if (isLoading || !user) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-full bg-white dark:bg-surface rounded-xl p-5 border border-gray-200 dark:border-gray-800 flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" /></div><div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" /></div>
        ))}
      </div>
    )
  }

  const vehicleIcon = getVehicleBrandIcon(user.vehicleBrand || '')

  return (
    <div className="space-y-3">
      <button title="View and manage my vehicle" onClick={onOpenVehicle} className="w-full bg-white dark:bg-surface rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="w-5 h-5 text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <Icon name={vehicleIcon} size={18} strokeWidth={2.5} className="text-gray-500 dark:text-gray-400" />
          </div>
          <span className="font-medium">My Vehicle ({user.vehicleModel === 'Add Vehicle' ? 'None' : `${user.vehicleBrand || ''} ${user.vehicleModel}`})</span>
        </div>
        <ChevronRight size={18} className="text-gray-600" />
      </button>
      <button title="View charging session history" onClick={onOpenHistory} className="w-full bg-white dark:bg-surface rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <Clock size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Charging History</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{history.length} orders</span>
          {history.some((h) => h.status === 'unpaid') && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          <ChevronRight size={18} className="text-gray-600" />
        </div>
      </button>
      <button title="Manage payment methods and cards" onClick={onOpenPayment} className="w-full bg-white dark:bg-surface rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <CreditCard size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Payment Methods</span>
        </div>
        <ChevronRight size={18} className="text-gray-600" />
      </button>
      <button title="Open application settings" onClick={onOpenSettings} className="w-full bg-white dark:bg-surface rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <Settings size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Settings</span>
        </div>
        <ChevronRight size={18} className="text-gray-600" />
      </button>
    </div>
  )
}

export default MenuButtons

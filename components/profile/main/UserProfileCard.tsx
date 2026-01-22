import React from 'react'
import { UserProfileCardProps } from '../../../types/modules/user'
import { getVehicleBrandIcon } from '../../../constant/vehicle'
import Icon from '../../ui/Icon'

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isLoading }) => {
  if (isLoading || !user) {
    return (
      <div className="bg-white dark:bg-surface border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const vehicleIcon = getVehicleBrandIcon(user.vehicleBrand || '')

  return (
    <div className="bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mb-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 shadow-lg relative overflow-hidden">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary overflow-hidden shrink-0 relative">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          user.name?.charAt(0) || 'U'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{user.email}</p>
          {user.vehicleBrand && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"></div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                <Icon name={vehicleIcon} size={10} className="text-primary" />
                <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
                  {user.vehicleBrand}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Decorative large brand logo in background */}
      {user.vehicleBrand && (
        <div className="absolute -right-4 -bottom-4 opacity-[0.07] rotate-12 pointer-events-none text-gray-900 dark:text-white">
          <Icon name={vehicleIcon} size={120} />
        </div>
      )}
    </div>
  )
}

export default UserProfileCard

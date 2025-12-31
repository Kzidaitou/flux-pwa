import React from 'react'
import { StationCardProps } from '../../types/modules/station'
import { MapPin, Clock, Zap, Navigation } from 'lucide-react'
import { formatCurrency } from '../../utils'
import { STATION_STATUS_MAP } from '../../constant/station'
import Icon from '../ui/Icon'

const StationCard: React.FC<StationCardProps> = ({ station, onSelect, minimal }) => {
  const statusConfig = STATION_STATUS_MAP[station.status] || STATION_STATUS_MAP.offline
  const isActionable = station.status === 'online' || station.status === 'busy'

  return (
    <div className={`${minimal ? 'bg-transparent' : 'bg-white dark:bg-surface border border-gray-100 dark:border-gray-800'} rounded-3xl p-5 transition-all group shadow-sm dark:shadow-none hover:border-primary/30 active:scale-[0.98]`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-black text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate tracking-tight">{station.name}</h3>
          <div className="flex flex-col gap-1.5 mt-2 text-gray-500 dark:text-gray-400 text-[11px] font-medium uppercase tracking-wide">
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-secondary" /> {station.address}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> {station.openingHours}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border flex items-center gap-1.5 uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            <Icon name={statusConfig.icon} size={10} strokeWidth={3} /> {statusConfig.label}
          </span>
          <span className="text-gray-900 dark:text-white font-mono font-black mt-2 text-xs tracking-tighter">{station.distance}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50 dark:border-gray-700/50">
        <div className="flex gap-6">
          <div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Power</p>
            <p className="font-black text-gray-900 dark:text-white flex items-center gap-1 text-sm tracking-tight">
              <Zap size={12} className="text-primary" fill="currentColor" /> {station.power} kW
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Rate</p>
            <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight">
              {formatCurrency(station.pricePerKwh)}/kWh
            </p>
          </div>
        </div>
        <button title={`View details for ${station.name}`} onClick={onSelect} className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${isActionable ? 'bg-primary text-dark shadow-lg shadow-green-500/10 active:scale-95' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}>
          <Navigation size={14} fill="currentColor" /> {isActionable ? 'Access' : 'Service'}
        </button>
      </div>
    </div>
  )
}

export default StationCard

import React from 'react'
import { StationListProps } from '../../types/modules/station'
import StationCard from './StationCard'
import { useStations } from '../../context/StationContext'
import { StationCardSkeleton, StationEmptyState } from '../empty-states'
import { Loader2 } from 'lucide-react'

const StationList: React.FC<StationListProps> = ({ stations, onSelectStation }) => {
  const { isLoading, isLoaded } = useStations()

  if (!isLoaded || (isLoading && stations.length === 0)) {
    return (
      <div className="flex-1 px-4 space-y-4 pb-20 overflow-hidden">
        <StationCardSkeleton />
        <StationCardSkeleton />
        <StationCardSkeleton />
      </div>
    )
  }

  if (stations.length === 0) {
    return <StationEmptyState />
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {isLoading && stations.length > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-primary text-dark text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-primary/20 backdrop-blur-md">
            <Loader2 size={10} className="animate-spin" /> Updating Stations
          </div>
        </div>
      )}

      <div className={`overflow-y-auto px-4 pb-20 space-y-4 transition-all duration-500 ${isLoading ? 'opacity-50 scale-[0.99] grayscale-[0.2]' : 'opacity-100 scale-100'}`}>
        {stations.map((station) => (
          <StationCard key={station.id} station={station} onSelect={() => onSelectStation(station)} />
        ))}
      </div>
    </div>
  )
}

export default StationList

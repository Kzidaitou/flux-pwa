import React, { useEffect, useState, useMemo } from 'react'
import { StationMapProps } from '../../types/modules/station'
import { Station } from '../../services/stations/types'
import { MapMarker, MapController } from '../maps/types'
import { X, Target } from 'lucide-react'
import StationCard from './StationCard'
import Map from '../maps'
import { getCurrentLocation, Coords } from '../../platform'
import { STATION_STATUS_MAP } from '../../constant/station'

const getStatusHexColor = (status: string) => {
  switch (status) {
    case 'online':
      return '#00e676'
    case 'busy':
      return '#ffb300'
    case 'maintenance':
      return '#ff9100'
    case 'closed':
      return '#ff5252'
    default:
      return '#9e9e9e'
  }
}

const StationMap: React.FC<StationMapProps> = ({
  stations,
  selectedMapStation,
  onMapStationClick,
  onCloseMapStation,
  onSelectStation,
}) => {
  const [mapController, setMapController] = useState<MapController | null>(null)
  const [userCoords, setUserCoords] = useState<Coords | null>(null)

  useEffect(() => {
    getCurrentLocation()
      .then(setUserCoords)
      .catch(() => {})
  }, [])

  const markers = useMemo<MapMarker[]>(() => {
    return stations.map((s) => {
      const statusConfig = STATION_STATUS_MAP[s.status] || STATION_STATUS_MAP.offline
      return {
        id: s.id,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
        title: s.name,
        color: getStatusHexColor(s.status),
        icon: statusConfig.icon,
        data: s,
      }
    })
  }, [stations])

  const centerOnUser = () => {
    if (userCoords && mapController) {
      mapController.panTo(userCoords.latitude, userCoords.longitude, 15)
    }
  }

  return (
    <div className="flex-1 relative bg-dark overflow-hidden select-none">
      <Map
        markers={markers}
        userLocation={userCoords ? { lat: userCoords.latitude, lng: userCoords.longitude } : null}
        selectedMarkerId={selectedMapStation?.id}
        onMarkerClick={(m) => onMapStationClick(m.data as Station)}
        onMapReady={setMapController}
      />

      <div className="absolute top-24 right-4 z-[450] flex flex-col gap-3">
        <button
          title="Locate Me"
          onClick={centerOnUser}
          className={`p-3.5 bg-dark/95 backdrop-blur-xl border border-gray-700 rounded-full shadow-2xl active:scale-90 transition-all ring-1 ring-white/10 ${
            userCoords ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <Target size={22} />
        </button>
      </div>

      {selectedMapStation && (
        <div className="absolute bottom-24 left-4 right-4 animate-in slide-in-from-bottom-12 fade-in duration-500 z-[500]">
          <div className="bg-dark/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col ring-1 ring-white/5">
            <div className="h-10 w-full flex items-center justify-center relative shrink-0">
              <div className="w-12 h-1.5 bg-gray-600/40 rounded-full mt-2"></div>
              <button
                title="Close"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseMapStation()
                }}
                className="absolute right-4 top-2 p-2 text-gray-500 hover:text-white bg-white/5 rounded-full z-10 transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-2 pb-6">
              <StationCard
                station={selectedMapStation}
                onSelect={() => onSelectStation(selectedMapStation)}
                minimal
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StationMap

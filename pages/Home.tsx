
import React, { useState, useEffect } from 'react'
import { HomeProps } from '../types/modules/station'
import { Station } from '../services/stations/types'
import { AlertType } from '../types/common/primitives'
import HomeHeader from '../components/home/HomeHeader'
import StationList from '../components/home/StationList'
import StationMap from '../components/home/StationMap'
import StationDetailModal from '../components/home/StationDetailModal'
import BusinessInterceptModal from '../components/business/BusinessInterceptModal'
import PullToRefresh from '../components/pull-to-refresh'
import { useStations } from '../context/StationContext'

const Home: React.FC<HomeProps & { onRefresh: () => Promise<void>; onShowToast: (m: string, t: AlertType) => void }> = ({
  stations,
  isLoading,
  onRefresh,
  onStartCharging,
  initialConnectorCode,
  onClearInitialCode,
  onNavigateToProfile,
  user,
  isCharging,
  activeUnpaidSession,
  onBannerClick,
  onShowToast,
}) => {
  const { locationStatus } = useStations()
  const [filter, setFilter] = useState<'ALL' | 'AC' | 'DC'>('ALL')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST')
  const [selectedMapStation, setSelectedMapStation] = useState<Station | null>(null)
  const [activeStation, setActiveStation] = useState<Station | null>(null)
  const [interceptType, setInterceptType] = useState<'UNPAID' | 'CHARGING' | null>(null)

  useEffect(() => {
    if (initialConnectorCode && stations.length > 0) {
      const found = stations.find(s => s.connectors.some(c => c.code === initialConnectorCode))
      if (found) setActiveStation(found)
      onClearInitialCode()
    }
  }, [initialConnectorCode, stations, onClearInitialCode])

  const filteredStations = stations.filter((s) => {
    const matchesFilter = filter === 'ALL' || s.type === filter
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={`h-full flex flex-col ${viewMode === 'MAP' ? 'bg-gray-900' : ''} relative`}>
      <HomeHeader
        search={search} onSearchChange={setSearch}
        filter={filter} onFilterChange={setFilter}
        viewMode={viewMode} onViewModeChange={setViewMode}
        user={user} onNavigateToProfile={onNavigateToProfile}
        filteredCount={filteredStations.length}
        isCharging={isCharging} activeUnpaidSession={activeUnpaidSession}
        onBannerClick={onBannerClick}
        onShowToast={onShowToast}
        onShowIntercept={setInterceptType}
        isLoading={isLoading}
        locationStatus={locationStatus}
      />
      {viewMode === 'LIST' ? (
        <PullToRefresh onRefresh={onRefresh}>
          <StationList stations={filteredStations} onSelectStation={setActiveStation} />
        </PullToRefresh>
      ) : (
        <StationMap
          stations={filteredStations}
          selectedMapStation={selectedMapStation}
          onMapStationClick={setSelectedMapStation}
          onCloseMapStation={() => setSelectedMapStation(null)}
          onSelectStation={setActiveStation}
        />
      )}
      {activeStation && (
        <StationDetailModal
          station={activeStation}
          onClose={() => setActiveStation(null)}
          onStartCharging={onStartCharging}
          isCharging={isCharging}
          activeUnpaidSession={activeUnpaidSession}
        />
      )}
      <BusinessInterceptModal 
        isOpen={!!interceptType}
        type={interceptType}
        sessionId={activeUnpaidSession?.id}
        onClose={() => setInterceptType(null)}
      />
    </div>
  )
}

export default Home

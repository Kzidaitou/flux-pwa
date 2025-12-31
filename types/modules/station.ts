
import { Station } from '../../services/stations/types'
import { User, PastSession } from '../../services/user/types'
import { AlertType } from '../common/primitives'

// Add missing export of station types to fix import errors in other modules
export * from '../../services/stations/types'

/**
 * 首页视图属性 (Home View Props)
 */
export interface HomeProps {
  stations: Station[]
  isLoading?: boolean
  onStartCharging: (station: Station, connectorId: string) => void
  initialConnectorCode?: string | null
  onClearInitialCode: () => void
  onNavigateToProfile: () => void
  user: User | null
  isCharging: boolean
  activeUnpaidSession?: PastSession
  onBannerClick: () => void
  onShowToast: (message: string, type: AlertType, duration?: number) => void
}

export interface HomeHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  filter: 'ALL' | 'AC' | 'DC'
  onFilterChange: (value: 'ALL' | 'AC' | 'DC') => void
  viewMode: 'LIST' | 'MAP'
  onViewModeChange: (value: 'LIST' | 'MAP') => void
  user: User | null
  onNavigateToProfile: () => void
  filteredCount: number
  isCharging: boolean
  activeUnpaidSession?: PastSession
  onBannerClick: () => void
  onShowToast: (message: string, type: AlertType, duration?: number) => void
  onShowIntercept: (type: 'UNPAID' | 'CHARGING') => void
  isLoading?: boolean
  locationStatus?: string
}

export interface StationListProps {
  stations: Station[]
  onSelectStation: (station: Station) => void
}

export interface StationMapProps {
  stations: Station[]
  selectedMapStation: Station | null
  onMapStationClick: (station: Station) => void
  onCloseMapStation: () => void
  onSelectStation: (station: Station) => void
}

export interface StationDetailModalProps {
  station: Station
  onClose: () => void
  onStartCharging: (station: Station, connectorId: string) => Promise<boolean> | void
  isCharging: boolean
  activeUnpaidSession?: PastSession
}

export interface StationCardProps {
  station: Station
  onSelect: () => void
  minimal?: boolean
}

export interface ConnectorIconProps {
  type: string
  isDC?: boolean
  className?: string
}
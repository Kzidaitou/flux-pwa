export type MapProvider = 'leaflet' | 'google' | 'tencent' | 'baidu'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  title?: string
  icon?: string
  color?: string
  status?: string
  zIndex?: number
  data?: any
}

/**
 * 统一地图控制器
 */
export interface MapController {
  panTo: (lat: number, lng: number, zoom?: number) => void
}

export interface MapViewProps {
  markers: MapMarker[]
  userLocation?: { lat: number; lng: number } | null
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  onMapReady?: (controller: MapController) => void
  onBoundsChange?: (bounds: any) => void
  className?: string
  selectedMarkerId?: string | null
  provider?: MapProvider
  libraries?: string[]
}

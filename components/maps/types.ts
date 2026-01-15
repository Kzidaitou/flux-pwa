export type MapProvider = 'leaflet' | 'google' | 'tencent' | 'baidu'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  name?: string
  color?: string // 标记主色
  icon?: string // 图标名称或 URL（目前 TaroMap 用不到，可留给 H5 引擎）
  data?: any
}

export interface LatLng {
  lat: number
  lng: number
}

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

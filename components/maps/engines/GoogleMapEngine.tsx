import React, { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import ReactDOMServer from 'react-dom/server'
import { MapViewProps } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'

let isGoogleMapsOptionsSet = false

const GoogleMapEngine: React.FC<MapViewProps> = ({
  markers,
  userLocation,
  center,
  zoom = 13,
  onMarkerClick,
  onMapReady,
  className = '',
  selectedMarkerId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const markerInstances = useRef<Map<string, google.maps.AdvancedMarkerElement>>(new Map())
  const userMarkerRef = useRef<google.maps.AdvancedMarkerElement | null>(null)
  const isFirstFitRef = useRef(true)

  // 1. 初始化地图
  useEffect(() => {
    const key = process.env.APP_MAP_GOOGLE_KEY
    const mapId = process.env.APP_MAP_GOOGLE_MAP_ID
    
    if (!containerRef.current || !key || !mapId) return

    if (!isGoogleMapsOptionsSet) {
      setOptions({ apiKey: key, version: 'weekly' } as any)
      isGoogleMapsOptionsSet = true
    }

    const initMap = async () => {
      try {
        const { Map } = await importLibrary('maps')
        const instance = new Map(containerRef.current!, {
          center: center || { lat: 37.7749, lng: -122.4194 },
          zoom,
          mapId: mapId, // 这里可以扩展为根据 document.documentElement.classList.contains('dark') 切换不同的 mapId
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
        })
        setMap(instance)
        if (onMapReady) onMapReady({ panTo: (lat, lng, z) => { instance.panTo({ lat, lng }); if (z) instance.setZoom(z); } })
      } catch (err) { console.error('[GoogleMap] Error:', err) }
    }
    initMap()
  }, [])

  // 2. 处理用户位置
  useEffect(() => {
    if (!map || !userLocation) return
    const update = async () => {
      const { AdvancedMarkerElement } = await importLibrary('marker')
      const content = document.createElement('div')
      content.innerHTML = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
      if (userMarkerRef.current) userMarkerRef.current.position = userLocation
      else userMarkerRef.current = new AdvancedMarkerElement({ map, position: userLocation, content, zIndex: 2000 })
    }
    update()
  }, [map, userLocation])

  // 3. 同步标记
  useEffect(() => {
    if (!map) return
    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await importLibrary('marker')
      const isDark = document.documentElement.classList.contains('dark')
      const innerCircleColor = isDark ? '#111827' : '#ffffff'

      markerInstances.current.forEach(m => m.setMap(null))
      markerInstances.current.clear()

      const bounds = new google.maps.LatLngBounds()
      if (userLocation) bounds.extend(userLocation)

      markers.forEach((m) => {
        const isSelected = m.id === selectedMarkerId
        const container = document.createElement('div')
        container.innerHTML = ReactDOMServer.renderToStaticMarkup(<MarkerMarkup color={m.color || '#9e9e9e'} icon={m.icon} isSelected={isSelected} innerCircleColor={innerCircleColor} />)
        const marker = new AdvancedMarkerElement({ map, position: { lat: m.lat, lng: m.lng }, title: m.title, content: container, zIndex: isSelected ? 1000 : 1 })
        marker.addListener('click', () => onMarkerClick?.(m))
        markerInstances.current.set(m.id, marker)
        bounds.extend({ lat: m.lat, lng: m.lng })
      })

      if (isFirstFitRef.current && (markers.length > 0 || userLocation)) {
        map.fitBounds(bounds)
        const listener = map.addListener('idle', () => { if (map.getZoom()! > 15) map.setZoom(15); google.maps.event.removeListener(listener); })
        isFirstFitRef.current = false
      }
    }
    updateMarkers()
  }, [map, markers, selectedMarkerId, userLocation])

  return <div ref={containerRef} className={`w-full h-full bg-light dark:bg-dark transition-all duration-700 ${map ? 'opacity-100' : 'opacity-0'} ${className}`} />
}

export default GoogleMapEngine
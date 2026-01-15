// GoogleMapEngine.tsx
import React, { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import ReactDOMServer from 'react-dom/server'
import { createRoot, Root } from 'react-dom/client'
import { MapViewProps } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'

let isGoogleMapsOptionsSet = false
type MarkerRootMap = Map<string, { marker: google.maps.AdvancedMarkerElement; root: Root }>

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

  // 保存 { id -> marker 实例 + React root }，方便更新/销毁
  const markerRootsRef = useRef<MarkerRootMap>(new Map())
  const userMarkerRef = useRef<google.maps.AdvancedMarkerElement | null>(null)
  const isFirstFitRef = useRef(true)

  // 1. 初始化地图
  useEffect(() => {
    const key = process.env.TARO_APP_MAP_GOOGLE_KEY
    const mapId = process.env.TARO_APP_MAP_GOOGLE_MAP_ID

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
          mapId,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
        })
        setMap(instance)
        if (onMapReady) {
          onMapReady({
            panTo: (lat, lng, z) => {
              instance.panTo({ lat, lng })
              if (z) instance.setZoom(z)
            },
          })
        }
      } catch (err) {
        console.error('[GoogleMap] Error:', err)
      }
    }
    initMap()
  }, [center, zoom, onMapReady])

  // 2. 处理用户位置（仍然用静态 HTML 即可）
  useEffect(() => {
    if (!map || !userLocation) return
    const update = async () => {
      const { AdvancedMarkerElement } = await importLibrary('marker')
      const content = document.createElement('div')
      content.innerHTML = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
      if (userMarkerRef.current) {
        userMarkerRef.current.position = userLocation
      } else {
        userMarkerRef.current = new AdvancedMarkerElement({
          map,
          position: userLocation,
          content,
          zIndex: 2000,
        })
      }
    }
    update()
  }, [map, userLocation])

  // 3. 同步标记：改为“先创建 marker + 空容器，再用 React root 挂载 MarkerMarkupForMap”
  useEffect(() => {
    if (!map) return

    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await importLibrary('marker')
      const isDark = document.documentElement.classList.contains('dark')
      const innerCircleColor = isDark ? '#111827' : '#ffffff'

      // 先清理旧的 marker + React root
      markerRootsRef.current.forEach(({ marker, root }) => {
        marker.map = null
        root.unmount()
      })
      markerRootsRef.current.clear()

      const bounds = new google.maps.LatLngBounds()
      if (userLocation) bounds.extend(userLocation)

      markers.forEach((m) => {
        const isSelected = m.id === selectedMarkerId

        // 1) 为当前 marker 创建一个容器
        const container = document.createElement('div')

        // 2) 创建 AdvancedMarkerElement，content 指向这个容器
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: m.lat, lng: m.lng },
          title: m.name || '',
          content: container,
          zIndex: isSelected ? 1000 : 1,
        })

        marker.addListener('click', () => onMarkerClick?.(m))
        bounds.extend({ lat: m.lat, lng: m.lng })

        // 3) 在容器上挂一个 React root，渲染带 Icon 的 MarkerMarkupForMap
        const root = createRoot(container)
        root.render(
          <MarkerMarkup
            color={m.color || '#9e9e9e'}
            icon={m.icon}
            isSelected={isSelected}
            innerCircleColor={innerCircleColor}
          />,
        )

        markerRootsRef.current.set(m.id, { marker, root })
      })

      if (isFirstFitRef.current && (markers.length > 0 || userLocation)) {
        map.fitBounds(bounds)
        const listener = map.addListener('idle', () => {
          if (map.getZoom()! > 15) map.setZoom(15)
          google.maps.event.removeListener(listener)
        })
        isFirstFitRef.current = false
      }
    }

    updateMarkers()
  }, [map, markers, selectedMarkerId, userLocation, onMarkerClick])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      markerRootsRef.current.forEach(({ marker, root }) => {
        marker.map = null
        root.unmount()
      })
      markerRootsRef.current.clear()
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null
        userMarkerRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-light dark:bg-dark transition-all duration-700 ${
        map ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  )
}

export default GoogleMapEngine

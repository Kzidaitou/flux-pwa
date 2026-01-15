// LeafletEngine.tsx - 优化版（参考 GoogleMapEngine 的 React root 方案）
import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createRoot, Root } from 'react-dom/client'
import { MapViewProps } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'
import ReactDOMServer from 'react-dom/server'

// 保存 { id -> marker 实例 + React root } 的 Map
type MarkerRootMap = Map<string, { marker: L.Marker; root: Root }>

export const LeafletEngine: React.FC<MapViewProps> = ({
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
  const [map, setMap] = useState<L.Map | null>(null)
  const markerRootsRef = useRef<MarkerRootMap>(new Map()) // 新增：保存 marker + React root
  const userMarkerRef = useRef<L.Marker | null>(null)
  const isFirstFitRef = useRef(true)

  // 1. 初始化地图（不变）
  useEffect(() => {
    if (!containerRef.current || map) return
    const initialCenter: L.LatLngExpression = center
      ? [center.lat, center.lng]
      : [37.7749, -122.4194]
    const instance = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 3,
      maxZoom: 18,
    }).setView(initialCenter, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(instance)
    setMap(instance)
    if (onMapReady)
      onMapReady({
        panTo: (lat, lng, z) => instance.flyTo([lat, lng], z || instance.getZoom()),
      })
    return () => {
      instance.remove()
    }
  }, [])

  // 2. 用户位置标记（保持静态 HTML，性能敏感）
  useEffect(() => {
    if (!map || !userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      return
    }

    const userHtml = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
    const userIcon = L.divIcon({
      className: '',
      html: userHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 2000,
      }).addTo(map)
    }
  }, [map, userLocation])

  // 3. 核心优化：同步标记，使用 React root 动态渲染 MarkerMarkup
  useEffect(() => {
    if (!map) return

    const updateMarkers = () => {
      const isDark = document.documentElement.classList.contains('dark')
      const innerCircleColor = isDark ? '#111827' : '#ffffff'

      // 先清理旧的 marker + React root（与 GoogleMapEngine 一致）
      markerRootsRef.current.forEach(({ marker, root }) => {
        map.removeLayer(marker)
        root.unmount()
      })
      markerRootsRef.current.clear()

      const bounds = L.latLngBounds([])

      markers.forEach((m) => {
        const isSelected = m.id === selectedMarkerId

        // 1) 创建容器 div
        const container = document.createElement('div')

        // 2) 创建 Leaflet marker，icon 使用临时占位（稍后 React root 会覆盖）
        const marker = L.marker([m.lat, m.lng], {
          icon: L.divIcon({
            className: 'marker-container',
            html: container, // 关键：直接使用 React 容器
            iconSize: [40, 50],
            iconAnchor: [20, 50],
          }),
        }).on('click', () => onMarkerClick?.(m))

        marker.addTo(map)
        bounds.extend([m.lat, m.lng])

        // 3) 在容器上挂 React root，渲染 MarkerMarkup（与 GoogleMapEngine 完全一致）
        const root = createRoot(container)
        root.render(
          <MarkerMarkup
            color={m.color || '#9e9e9e'}
            icon={m.icon}
            isSelected={isSelected}
            innerCircleColor={innerCircleColor}
          />,
        )

        // 4) zIndex 处理（模拟 GoogleMap 的选中优先级）
        marker.setZIndexOffset(isSelected ? 1000 : 1)

        markerRootsRef.current.set(m.id, { marker, root })
      })

      // 自适应边界（与原版一致）
      if (userLocation) bounds.extend([userLocation.lat, userLocation.lng])
      if (isFirstFitRef.current && markers.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        isFirstFitRef.current = false
      }
    }

    updateMarkers()
  }, [map, markers, selectedMarkerId, onMarkerClick, userLocation])

  // 4. 组件卸载清理（完善版）
  useEffect(() => {
    return () => {
      markerRootsRef.current.forEach(({ marker, root }) => {
        if (map) map.removeLayer(marker)
        root.unmount()
      })
      markerRootsRef.current.clear()
      if (userMarkerRef.current && map) {
        map.removeLayer(userMarkerRef.current)
      }
    }
  }, [])

  return <div ref={containerRef} className={`w-full h-full ${className}`} />
}

export default LeafletEngine

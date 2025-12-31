import React, { useEffect, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapViewProps } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'

const LeafletEngine: React.FC<MapViewProps> = ({
  markers,
  userLocation,
  center,
  zoom = 13,
  onMarkerClick,
  onMapReady,
  className = '',
  selectedMarkerId
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markersGroupRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const isFirstFitRef = useRef(true)

  useEffect(() => {
    if (!containerRef.current || map) return
    const initialCenter: L.LatLngExpression = center ? [center.lat, center.lng] : [37.7749, -122.4194]
    const instance = L.map(containerRef.current, { zoomControl: false, attributionControl: false, minZoom: 3, maxZoom: 18 }).setView(initialCenter, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(instance)
    markersGroupRef.current = L.layerGroup().addTo(instance)
    setMap(instance)
    if (onMapReady) onMapReady({ panTo: (lat, lng, z) => instance.flyTo([lat, lng], z || instance.getZoom()) })
    return () => { instance.remove() }
  }, [])

  // 处理用户位置标记
  useEffect(() => {
    if (!map || !userLocation) {
      if (userMarkerRef.current) userMarkerRef.current.remove()
      return
    }

    const userHtml = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
    const userIcon = L.divIcon({ className: '', html: userHtml, iconSize: [40, 40], iconAnchor: [20, 20] })

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 2000 }).addTo(map)
    }
  }, [map, userLocation])

  useEffect(() => {
    const markersGroup = markersGroupRef.current
    if (!map || !markersGroup) return
    markersGroup.clearLayers()
    const bounds = L.latLngBounds([])

    const isDark = document.documentElement.classList.contains('dark')
    const innerCircleColor = isDark ? '#111827' : '#ffffff'

    markers.forEach((m) => {
      const isSelected = m.id === selectedMarkerId
      const iconHtml = ReactDOMServer.renderToStaticMarkup(<MarkerMarkup color={m.color || '#9e9e9e'} icon={m.icon} isSelected={isSelected} innerCircleColor={innerCircleColor} />)
      const marker = L.marker([m.lat, m.lng], {
        icon: L.divIcon({ className: '', html: iconHtml, iconSize: [40, 50], iconAnchor: [20, 50] })
      }).on('click', () => onMarkerClick?.(m))
      marker.addTo(markersGroup)
      bounds.extend([m.lat, m.lng])
    })

    if (userLocation) bounds.extend([userLocation.lat, userLocation.lng])

    if (isFirstFitRef.current && markers.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      isFirstFitRef.current = false
    }
  }, [map, markers, selectedMarkerId, onMarkerClick, userLocation])

  return <div ref={containerRef} className={`w-full h-full ${className}`} />
}

export default LeafletEngine
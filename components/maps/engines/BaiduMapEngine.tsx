import React, { useEffect, useState, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { useUser } from '@/context/UserContext'
import { MapViewProps, MapMarker } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'

/**
 * 结构化存储覆盖物及其 React 根节点
 */
type OverlayRecord = {
  overlay: any
  root: Root
}

/**
 * 百度地图脚本异步加载器
 */
const loadBMapScript = (ak: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).BMap) return resolve()
    if ((window as any)._flux_bmap_loading) {
      const checkLoaded = setInterval(() => {
        if ((window as any).BMap) {
          clearInterval(checkLoaded)
          resolve()
        }
      }, 100)
      return
    }
    ;(window as any)._flux_bmap_loading = true
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onBMapReady`
    ;(window as any).onBMapReady = () => {
      delete (window as any)._flux_bmap_loading
      resolve()
    }
    script.onerror = () => {
      delete (window as any)._flux_bmap_loading
      reject(new Error('Baidu Map script failed to load'))
    }
    document.head.appendChild(script)
  })
}

const BaiduMapEngine: React.FC<MapViewProps> = ({
  markers,
  userLocation,
  center,
  zoom = 13,
  onMarkerClick,
  onMapReady,
  className = '',
  selectedMarkerId,
}) => {
  const { user } = useUser()
  const isDarkMode = user?.preferences.darkMode ?? true

  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  // 使用 Map 管理记录，便于精确卸载
  const markerRecordsRef = useRef<Map<string, OverlayRecord>>(new Map())
  const userRecordRef = useRef<OverlayRecord | null>(null)

  const [scriptLoaded, setScriptLoaded] = useState(false)
  const isFirstFitRef = useRef(true)

  // 1. 加载脚本
  useEffect(() => {
    const ak = process.env.TARO_APP_MAP_BAIDU_KEY
    if (!ak) return
    loadBMapScript(ak).then(() => setScriptLoaded(true))
  }, [])

  // 2. 初始化地图
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || mapInstance.current) return
    const BMap = (window as any).BMap
    const map = new BMap.Map(containerRef.current)
    const point = center ? new BMap.Point(center.lng, center.lat) : new BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, zoom)
    map.enableScrollWheelZoom(true)
    mapInstance.current = map

    if (onMapReady) {
      onMapReady({
        panTo: (lat, lng, z) => {
          const p = new BMap.Point(lng, lat)
          map.panTo(p)
          if (z) map.setZoom(z)
        },
      })
    }
  }, [scriptLoaded, center, zoom, onMapReady])

  // 3. 主题样式同步
  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current
    const styleId = process.env.TARO_APP_MAP_BAIDU_STYLE_ID?.trim()
    if (isDarkMode && styleId) {
      map.setMapStyleV2({ styleId })
    } else {
      map.setMapStyleV2({ styleJson: [] })
    }
  }, [isDarkMode, scriptLoaded])

  // 4. 自定义响应式 Overlay 类
  useEffect(() => {
    if (!scriptLoaded || !mapInstance.current) return
    const BMap = (window as any).BMap
    if ((window as any).FluxOverlay) return

    function FluxOverlay(
      this: any,
      point: any,
      container: HTMLElement,
      offset: { x: number; y: number },
      zIndex: number,
      onClick?: () => void,
    ) {
      this._point = point
      this._container = container
      this._offset = offset
      this._zIndex = zIndex
      this._onClick = onClick
    }
    FluxOverlay.prototype = new BMap.Overlay()
    FluxOverlay.prototype.initialize = function (map: any) {
      this._map = map
      const div = (this._div = document.createElement('div'))
      div.style.position = 'absolute'
      div.style.zIndex = this._zIndex
      div.style.cursor = 'pointer'
      // 关键：直接挂载容器节点
      div.appendChild(this._container)
      if (this._onClick) {
        div.onclick = (e: any) => {
          e.stopPropagation()
          this._onClick()
        }
      }
      map.getPanes().labelPane.appendChild(div)
      return div
    }
    FluxOverlay.prototype.draw = function () {
      const pixel = this._map.pointToOverlayPixel(this._point)
      this._div.style.left = pixel.x + this._offset.x + 'px'
      this._div.style.top = pixel.y + this._offset.y + 'px'
    }
    FluxOverlay.prototype.setPoint = function (newPoint: any) {
      this._point = newPoint
      this.draw()
    }
    ;(window as any).FluxOverlay = FluxOverlay
  }, [scriptLoaded])

  // 5. 同步 Markers 与用户位置
  useEffect(() => {
    const map = mapInstance.current
    const BMap = (window as any).BMap
    const FluxOverlay = (window as any).FluxOverlay
    if (!map || !BMap || !FluxOverlay) return

    const viewportPoints: any[] = []
    const innerCircleColor = isDarkMode ? '#111827' : '#ffffff'

    // A. 同步用户位置
    if (userLocation) {
      const point = new BMap.Point(userLocation.lng, userLocation.lat)
      viewportPoints.push(point)

      if (!userRecordRef.current) {
        const container = document.createElement('div')
        const root = createRoot(container)
        root.render(<UserLocationMarkup />)
        const overlay = new FluxOverlay(point, container, { x: -20, y: -20 }, 2000)
        map.addOverlay(overlay)
        userRecordRef.current = { overlay, root }
      } else {
        userRecordRef.current.overlay.setPoint(point)
      }
    }

    // B. 同步电站 Markers
    // 先清理旧根节点
    markerRecordsRef.current.forEach(({ overlay, root }) => {
      map.removeOverlay(overlay)
      root.unmount()
    })
    markerRecordsRef.current.clear()

    markers.forEach((m: MapMarker) => {
      const isSelected = m.id === selectedMarkerId
      const point = new BMap.Point(m.lng, m.lat)
      viewportPoints.push(point)

      const container = document.createElement('div')
      const root = createRoot(container)
      root.render(
        <MarkerMarkup
          color={m.color || '#9e9e9e'}
          icon={m.icon}
          isSelected={isSelected}
          innerCircleColor={innerCircleColor}
        />,
      )

      const overlay = new FluxOverlay(
        point,
        container,
        isSelected ? { x: -25, y: -62 } : { x: -20, y: -50 },
        isSelected ? 1000 : 10,
        () => onMarkerClick?.(m),
      )
      map.addOverlay(overlay)
      markerRecordsRef.current.set(m.id, { overlay, root })
    })

    // C. 视野自适应
    if (isFirstFitRef.current && viewportPoints.length > 0) {
      const view = map.getViewport(viewportPoints)
      if (view.zoom > 15) view.zoom = 15
      map.centerAndZoom(view.center, view.zoom)
      isFirstFitRef.current = false
    }
  }, [markers, userLocation, selectedMarkerId, scriptLoaded, isDarkMode, onMarkerClick])

  // 6. 卸载清理
  useEffect(() => {
    return () => {
      const map = mapInstance.current
      if (!map) return
      markerRecordsRef.current.forEach(({ overlay, root }) => {
        map.removeOverlay(overlay)
        root.unmount()
      })
      if (userRecordRef.current) {
        map.removeOverlay(userRecordRef.current.overlay)
        userRecordRef.current.root.unmount()
      }
    }
  }, [])

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className} bg-light dark:bg-dark transition-colors duration-500`}
    >
      <div ref={containerRef} className="w-full h-full" />
      {!scriptLoaded && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex items-center justify-center z-10 transition-colors duration-500">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default React.memo(BaiduMapEngine)

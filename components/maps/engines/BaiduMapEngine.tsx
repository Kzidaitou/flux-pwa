import React, { useEffect, useState, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import { MapViewProps, MapMarker } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'
import { useUser } from '../../../context/UserContext'

/**
 * 百度地图脚本异步加载器 (普通版 v3.0)
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
  const markerOverlays = useRef<any[]>([])
  const userOverlayInstance = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  
  // 核心：聚焦逻辑标识，确保仅在初次进入时自动缩放视野
  const isFirstFitRef = useRef(true)

  // 1. 加载脚本
  useEffect(() => {
    const ak = process.env.APP_MAP_BAIDU_KEY
    if (!ak) return
    loadBMapScript(ak).then(() => setScriptLoaded(true))
  }, [])

  // 2. 初始化地图
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || mapInstance.current) return

    const BMap = (window as any).BMap
    const map = new BMap.Map(containerRef.current)
    const point = center 
      ? new BMap.Point(center.lng, center.lat) 
      : new BMap.Point(116.404, 39.915)
    
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
  }, [scriptLoaded])

  // 3. 动态样式切换逻辑：根据 dark 模式和环境变量 ID 判断
  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current
    const styleId = process.env.APP_MAP_BAIDU_STYLE_ID?.trim()

    if (isDarkMode && styleId) {
      // 仅在 dark 模式且有有效 styleId 时设置自定义样式
      map.setMapStyleV2({ styleId })
    } else {
      // 否则切换回百度地图默认样式 (Light)
      map.setMapStyleV2({ styleJson: [] })
    }
  }, [isDarkMode, scriptLoaded])

  // 4. 通用 Overlay 类定义
  useEffect(() => {
    if (!scriptLoaded || !mapInstance.current) return
    const BMap = (window as any).BMap

    function FluxOverlay(this: any, point: any, html: string, offset: { x: number, y: number }, zIndex: number, onClick?: () => void) {
      this._point = point; this._html = html; this._offset = offset; this._zIndex = zIndex; this._onClick = onClick;
    }
    FluxOverlay.prototype = new BMap.Overlay()
    FluxOverlay.prototype.initialize = function(map: any) {
      this._map = map
      const div = this._div = document.createElement("div")
      div.style.position = "absolute"; div.style.zIndex = this._zIndex; div.style.cursor = "pointer"
      div.innerHTML = this._html
      if (this._onClick) div.onclick = (e: any) => { e.stopPropagation(); this._onClick(); }
      map.getPanes().labelPane.appendChild(div)
      return div
    }
    FluxOverlay.prototype.draw = function() {
      const pixel = this._map.pointToOverlayPixel(this._point)
      this._div.style.left = (pixel.x + this._offset.x) + "px"
      this._div.style.top = (pixel.y + this._offset.y) + "px"
    }
    FluxOverlay.prototype.setPoint = function(newPoint: any) { this._point = newPoint; this.draw(); }

    ;(window as any).FluxOverlay = FluxOverlay
  }, [scriptLoaded])

  // 5. 同步覆盖物
  useEffect(() => {
    const map = mapInstance.current
    const BMap = (window as any).BMap
    const FluxOverlay = (window as any).FluxOverlay
    if (!map || !BMap || !FluxOverlay) return

    const viewportPoints: any[] = []

    // A. 处理用户位置
    if (userLocation) {
      const point = new BMap.Point(userLocation.lng, userLocation.lat)
      viewportPoints.push(point)
      if (!userOverlayInstance.current) {
        const html = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
        const overlay = new FluxOverlay(point, html, { x: -20, y: -20 }, 2000)
        map.addOverlay(overlay)
        userOverlayInstance.current = overlay
      } else {
        userOverlayInstance.current.setPoint(point)
      }
    }

    // B. 处理电站标记 (感知 isDarkMode 以更新内部圆环颜色)
    markerOverlays.current.forEach(o => map.removeOverlay(o))
    markerOverlays.current = []

    const innerCircleColor = isDarkMode ? '#111827' : '#ffffff'

    markers.forEach((m: MapMarker) => {
      const isSelected = m.id === selectedMarkerId
      const html = ReactDOMServer.renderToStaticMarkup(
        <MarkerMarkup color={m.color || '#9e9e9e'} icon={m.icon} isSelected={isSelected} innerCircleColor={innerCircleColor} />
      )
      const point = new BMap.Point(m.lng, m.lat)
      viewportPoints.push(point)

      const overlay = new FluxOverlay(
        point, 
        html, 
        isSelected ? { x: -25, y: -62 } : { x: -20, y: -50 }, 
        isSelected ? 1000 : 10, 
        () => onMarkerClick?.(m)
      )
      map.addOverlay(overlay)
      markerOverlays.current.push(overlay)
    })

    // C. 初次加载聚焦视野
    if (isFirstFitRef.current && viewportPoints.length > 0) {
      const view = map.getViewport(viewportPoints)
      if (view.zoom > 15) view.zoom = 15
      map.centerAndZoom(view.center, view.zoom)
      isFirstFitRef.current = false
    }
  }, [markers, userLocation, selectedMarkerId, scriptLoaded, isDarkMode])

  return (
    <div className={`w-full h-full relative overflow-hidden ${className} bg-light dark:bg-dark transition-colors duration-500`}>
      <div ref={containerRef} className="w-full h-full" />
      {!scriptLoaded && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex items-center justify-center z-10 transition-colors duration-500">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default BaiduMapEngine
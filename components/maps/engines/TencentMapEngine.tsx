import React, { useEffect, useRef, useState } from 'react'
import { createRoot, Root } from 'react-dom/client'
import Icon from '@/components/ui/Icon'
import { useUser } from '@/context/UserContext'
import { MapViewProps, MapMarker } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'

/**
 * 结构化存储记录
 */
type OverlayRecord = {
  overlay: any
  root: Root
}

/**
 * 动态加载腾讯地图 SDK
 */
const loadTMapGL = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).qq && (window as any).qq.maps && (window as any).qq.maps.Map) {
      return resolve((window as any).qq.maps)
    }
    if ((window as any)._flux_tmap_loading) {
      const check = setInterval(() => {
        if ((window as any).qq && (window as any).qq.maps && (window as any).qq.maps.Map) {
          clearInterval(check)
          resolve((window as any).qq.maps)
        }
      }, 100)
      return
    }
    ;(window as any)._flux_tmap_loading = true
    const callbackName = `onTMapReady_${Math.random().toString(36).substring(2, 7)}`
    const cleanup = () => {
      delete (window as any)._flux_tmap_loading
      delete (window as any)[callbackName]
    }
    ;(window as any)[callbackName] = () => {
      const verifyTimer = setInterval(() => {
        if ((window as any).qq && (window as any).qq.maps && (window as any).qq.maps.Map) {
          clearInterval(verifyTimer)
          cleanup()
          resolve((window as any).qq.maps)
        }
      }, 50)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://map.qq.com/api/js?v=2.exp&key=${key}&callback=${callbackName}`
    script.onerror = () => {
      cleanup()
      reject(new Error('FAILED'))
    }
    document.head.appendChild(script)
  })
}

const TencentMapEngine: React.FC<MapViewProps> = ({
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

  // 精确追踪每一个 Overlay 和 React Root
  const markerRecordsRef = useRef<Map<string, OverlayRecord>>(new Map())
  const userRecordRef = useRef<OverlayRecord | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<boolean>(false)
  const hasFocusedRef = useRef(false)

  // 1. 初始化
  useEffect(() => {
    const key = process.env.TARO_APP_MAP_TENCENT_KEY
    if (!containerRef.current || !key) {
      setError(true)
      return
    }
    let mounted = true
    loadTMapGL(key)
      .then((qqMaps) => {
        if (!mounted || !containerRef.current) return
        try {
          const instance = new qqMaps.Map(containerRef.current, {
            center: new qqMaps.LatLng(center?.lat || 39.98412, center?.lng || 116.307484),
            zoom,
            mapStyleId: isDarkMode ? qqMaps.MapStyleId.DARK : qqMaps.MapStyleId.LIGHT,
            mapTypeId: qqMaps.MapTypeId.ROADMAP,
            zoomControl: false,
            panControl: false,
            mapTypeControl: false,
          })
          mapInstance.current = instance
          if (onMapReady) {
            onMapReady({
              panTo: (lat, lng, z) => {
                const target = new (window as any).qq.maps.LatLng(lat, lng)
                instance.panTo(target)
                if (z) instance.setZoom(z)
              },
            })
          }
          setIsReady(true)
        } catch (err) {
          setError(true)
        }
      })
      .catch(() => setError(true))
    return () => {
      mounted = false
    }
  }, [])

  // 2. 响应式底图主题
  useEffect(() => {
    if (mapInstance.current && isReady) {
      const map = mapInstance.current
      if (typeof map.setMapStyleId === 'function') {
        map.setMapStyleId(isDarkMode ? 'style2' : 'style1')
      }
    }
  }, [isDarkMode, isReady])

  // 3. 自定义 Overlay 定义
  useEffect(() => {
    if (!isReady) return
    const qq = (window as any).qq
    if ((window as any).FluxTencentOverlay) return

    function FluxTencentOverlay(
      this: any,
      latlng: any,
      container: HTMLElement,
      offset: { x: number; y: number },
      onClick?: () => void,
    ) {
      this.latlng = latlng
      this.container = container
      this.offset = offset
      this.onClick = onClick
    }
    FluxTencentOverlay.prototype = new qq.maps.Overlay()
    FluxTencentOverlay.prototype.construct = function () {
      const div = (this.dom = document.createElement('div'))
      div.style.position = 'absolute'
      div.style.cursor = 'pointer'
      div.style.zIndex = '100'
      // 核心：直接 append 外部容器
      div.appendChild(this.container)
      if (this.onClick) {
        div.onclick = (e: any) => {
          e.stopPropagation()
          this.onClick()
        }
      }
      this.getPanes().overlayMouseTarget.appendChild(div)
    }
    FluxTencentOverlay.prototype.draw = function () {
      const projection = this.getProjection()
      if (!projection) return
      const pixel = projection.fromLatLngToDivPixel(this.latlng)
      this.dom.style.left = pixel.getX() + this.offset.x + 'px'
      this.dom.style.top = pixel.getY() + this.offset.y + 'px'
    }
    FluxTencentOverlay.prototype.destroy = function () {
      if (this.dom?.parentNode) this.dom.parentNode.removeChild(this.dom)
    }
    FluxTencentOverlay.prototype.setLatLng = function (latlng: any) {
      this.latlng = latlng
      this.draw()
    }
    ;(window as any).FluxTencentOverlay = FluxTencentOverlay
  }, [isReady])

  // 4. 同步覆盖物记录
  useEffect(() => {
    const map = mapInstance.current
    const FluxOverlay = (window as any).FluxTencentOverlay
    const qq = (window as any).qq
    if (!isReady || !map || !FluxOverlay) return

    const activeBounds = new qq.maps.LatLngBounds()
    const innerCircleColor = isDarkMode ? '#111827' : '#ffffff'

    // A. 处理用户位置
    if (userLocation) {
      const pos = new qq.maps.LatLng(userLocation.lat, userLocation.lng)
      activeBounds.extend(pos)
      if (!userRecordRef.current) {
        const container = document.createElement('div')
        const root = createRoot(container)
        root.render(<UserLocationMarkup />)
        const overlay = new FluxOverlay(pos, container, { x: -20, y: -20 })
        overlay.setMap(map)
        userRecordRef.current = { overlay, root }
      } else {
        userRecordRef.current.overlay.setLatLng(pos)
      }
    }

    // B. 同步电站标记 (createRoot 模式)
    markerRecordsRef.current.forEach(({ overlay, root }) => {
      overlay.setMap(null)
      root.unmount()
    })
    markerRecordsRef.current.clear()

    markers.forEach((m: MapMarker) => {
      const isSelected = m.id === selectedMarkerId
      const pos = new qq.maps.LatLng(m.lat, m.lng)
      activeBounds.extend(pos)

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

      const offset = isSelected ? { x: -25, y: -62 } : { x: -20, y: -50 }
      const overlay = new FluxOverlay(pos, container, offset, () => onMarkerClick?.(m))
      overlay.setMap(map)
      markerRecordsRef.current.set(m.id, { overlay, root })
    })

    // C. 视野聚焦
    if (markers.length > 0 && !hasFocusedRef.current) {
      const applyFit = () => {
        if (!mapInstance.current || hasFocusedRef.current) return
        try {
          mapInstance.current.fitBounds(activeBounds)
          hasFocusedRef.current = true
        } catch (e) {}
      }
      setTimeout(applyFit, 300)
    }
  }, [isReady, markers, selectedMarkerId, userLocation, onMarkerClick, isDarkMode])

  // 5. 清理
  useEffect(() => {
    return () => {
      markerRecordsRef.current.forEach(({ overlay, root }) => {
        overlay.setMap(null)
        root.unmount()
      })
      if (userRecordRef.current) {
        userRecordRef.current.overlay.setMap(null)
        userRecordRef.current.root.unmount()
      }
    }
  }, [])

  return (
    <div
      className={`w-full h-full relative ${className} bg-light dark:bg-dark transition-colors duration-500`}
    >
      <div ref={containerRef} className="w-full h-full" />
      {error && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex flex-col items-center justify-center p-12 text-center z-30">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
            <Icon name="MapPinOff" size={32} />
          </div>
          <span className="text-gray-900 dark:text-gray-200 text-sm font-black uppercase tracking-widest mb-2">
            Service Unavailable
          </span>
        </div>
      )}
      {!isReady && !error && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default React.memo(TencentMapEngine)

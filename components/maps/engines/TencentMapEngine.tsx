import React, { useEffect, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { MapViewProps, MapMarker } from '../types'
import { MarkerMarkup } from '../components/MarkerMarkup'
import { UserLocationMarkup } from '../components/UserLocationMarkup'
import { MapPinOff } from 'lucide-react'
import { useUser } from '../../../context/UserContext'

/**
 * 动态加载腾讯地图 SDK (GL 版本支持更好的样式定制)
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
    // 使用 GL 版本以获得更好的深色模式样式支持
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
  const overlaysRef = useRef<any[]>([])
  const userOverlayRef = useRef<any>(null)

  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<boolean>(false)

  const hasFocusedRef = useRef(false)
  const isTransitioningRef = useRef(false)

  // 1. 初始化地图实例
  useEffect(() => {
    const key = process.env.APP_MAP_TENCENT_KEY
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
                if (!mapInstance.current) return
                const target = new (window as any).qq.maps.LatLng(lat, lng)
                mapInstance.current.panTo(target)
                if (z) mapInstance.current.setZoom(z)
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
  }, [onMapReady])

  // 2. 响应式切换深色/浅色模式底图样式
  useEffect(() => {
    if (mapInstance.current && isReady) {
      const map = mapInstance.current
      // 腾讯地图 API 支持动态设置样式 ID
      // style1: 经典, style2: 实验室样式/夜间, 也可使用在腾讯地图控制台配置的自定义样式 ID
      if (typeof map.setMapStyleId === 'function') {
        map.setMapStyleId(isDarkMode ? 'style2' : 'style1')
      }
    }
  }, [isDarkMode, isReady])

  // 3. 自定义 Overlay 定义 (单例化)
  useEffect(() => {
    if (!isReady) return
    const qq = (window as any).qq
    if ((window as any).FluxTencentOverlay) return
    function FluxTencentOverlay(
      this: any,
      latlng: any,
      html: string,
      offset: { x: number; y: number },
      onClick?: () => void,
    ) {
      this.latlng = latlng
      this.html = html
      this.offset = offset
      this.onClick = onClick
    }
    FluxTencentOverlay.prototype = new qq.maps.Overlay()
    FluxTencentOverlay.prototype.construct = function () {
      const div = (this.dom = document.createElement('div'))
      div.style.position = 'absolute'
      div.style.cursor = 'pointer'
      div.style.zIndex = '100'
      div.innerHTML = this.html
      div.className = 'tmap-custom-overlay'
      if (this.onClick)
        div.onclick = (e: any) => {
          e.stopPropagation()
          this.onClick()
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

  // 4. 渲染标记与视野自适应逻辑
  useEffect(() => {
    const map = mapInstance.current
    const FluxOverlay = (window as any).FluxTencentOverlay
    const qq = (window as any).qq
    if (!isReady || !map || !FluxOverlay) return

    const activeBounds = new qq.maps.LatLngBounds()

    // 更新用户位置
    if (userLocation) {
      const pos = new qq.maps.LatLng(userLocation.lat, userLocation.lng)
      activeBounds.extend(pos)
      const userHtml = ReactDOMServer.renderToStaticMarkup(<UserLocationMarkup />)
      if (!userOverlayRef.current) {
        userOverlayRef.current = new FluxOverlay(pos, userHtml, { x: -20, y: -20 })
        userOverlayRef.current.setMap(map)
      } else {
        userOverlayRef.current.dom.innerHTML = userHtml
        userOverlayRef.current.setLatLng(pos)
      }
    }

    // 更新电站标记 (重绘以适应 innerCircleColor)
    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []
    const innerCircleColor = isDarkMode ? '#111827' : '#ffffff'

    markers.forEach((m: MapMarker) => {
      const isSelected = m.id === selectedMarkerId
      const pos = new qq.maps.LatLng(m.lat, m.lng)
      activeBounds.extend(pos)
      const html = ReactDOMServer.renderToStaticMarkup(
        <MarkerMarkup
          color={m.color || '#9e9e9e'}
          icon={m.icon}
          isSelected={isSelected}
          innerCircleColor={innerCircleColor}
        />,
      )
      const offset = isSelected ? { x: -25, y: -62 } : { x: -20, y: -50 }
      const overlay = new FluxOverlay(pos, html, offset, () => onMarkerClick?.(m))
      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })

    if (markers.length > 0 && !hasFocusedRef.current && !isTransitioningRef.current) {
      isTransitioningRef.current = true
      const applyFit = () => {
        if (!mapInstance.current || hasFocusedRef.current) {
          isTransitioningRef.current = false
          return
        }
        try {
          const currentMap = mapInstance.current
          if (!currentMap.getBounds() || currentMap.getBounds().isEmpty()) {
            setTimeout(applyFit, 200)
            return
          }
          currentMap.fitBounds(activeBounds)
          hasFocusedRef.current = true
          qq.maps.event.addListenerOnce(currentMap, 'idle', () => {
            if (mapInstance.current && mapInstance.current.getZoom() > 15) {
              mapInstance.current.setZoom(15)
            }
            isTransitioningRef.current = false
          })
        } catch (e) {
          isTransitioningRef.current = false
        }
      }
      setTimeout(applyFit, 250)
    }
  }, [isReady, markers, selectedMarkerId, userLocation, onMarkerClick, isDarkMode])

  return (
    <div
      className={`w-full h-full relative ${className} bg-light dark:bg-dark transition-colors duration-500`}
    >
      <div ref={containerRef} className="w-full h-full" />

      {error && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex flex-col items-center justify-center p-12 text-center z-30">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
            <MapPinOff size={32} />
          </div>
          <h4 className="text-gray-900 dark:text-gray-200 text-sm font-black uppercase tracking-widest mb-2">
            Service Unavailable
          </h4>
          <p className="text-gray-500 text-[10px] leading-relaxed max-w-[200px]">
            Map engine failed to initialize. Check your API key.
          </p>
        </div>
      )}
      {!isReady && !error && (
        <div className="absolute inset-0 bg-light dark:bg-dark flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-6 opacity-40">
            Syncing Environment
          </p>
        </div>
      )}
    </div>
  )
}

export default TencentMapEngine

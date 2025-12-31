import React, { useMemo } from 'react'
import { MapViewProps, MapProvider } from './types'

// 各引擎渲染组件
import LeafletEngine from './engines/LeafletEngine'
import GoogleMapEngine from './engines/GoogleMapEngine'
import TencentMapEngine from './engines/TencentMapEngine'
import BaiduMapEngine from './engines/BaiduMapEngine'

const Map: React.FC<MapViewProps> = (props) => {
  const activeProvider = useMemo<MapProvider>(() => {
    if (props.provider) return props.provider

    const strategy = (process.env.APP_MAP_STRATEGY || '').toLowerCase().trim()

    if (['google', 'tencent', 'baidu', 'leaflet'].includes(strategy)) {
      const hasConfig =
        (strategy === 'google' && !!process.env.APP_MAP_GOOGLE_KEY  && !!process.env.APP_MAP_GOOGLE_MAP_ID)||
        (strategy === 'tencent' && !!process.env.APP_MAP_TENCENT_KEY) ||
        (strategy === 'baidu' && !!process.env.APP_MAP_BAIDU_KEY) ||
        strategy === 'leaflet'

      if (hasConfig){
         return strategy as MapProvider
      } else {
        return 'leaflet'
      }
    } else {
      if (process.env.APP_MAP_GOOGLE_KEY && process.env.APP_MAP_GOOGLE_MAP_ID) return 'google'
      if (process.env.APP_MAP_BAIDU_KEY) return 'baidu'
      if (process.env.APP_MAP_TENCENT_KEY) return 'tencent'
      return 'leaflet'
    }
  }, [props.provider])

  switch (activeProvider) {
    case 'google':
      return <GoogleMapEngine {...props} />
    case 'tencent':
      return <TencentMapEngine {...props} />
    case 'baidu':
      return <BaiduMapEngine {...props} />
    case 'leaflet':
    default:
      return <LeafletEngine {...props} />
  }
}

export default Map
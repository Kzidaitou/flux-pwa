/**
 * Environment Variables & Global Declarations
 */

interface ImportMetaEnv {
  // 基础 App 信息
  readonly APP_NAME: string
  readonly APP_PUBLIC_VERSION: string
  readonly APP_DISPLAY_VERSION: string

  // 网络与网关配置
  readonly APP_BASE_API: string
  readonly APP_BASE_WS: string
  readonly APP_USE_MOCK: string
  readonly APP_NEED_AUTH: string
  readonly APP_MOCK_EXCLUSIONS?: string
  readonly VITE_PROXY_TARGET?: string

  // 平台与构建标识
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly BUILD_PLATFORM:
    | 'web'
  readonly BUILD_TIME: string

  // 地图引擎配置
  readonly APP_MAP_STRATEGY?: 'google' | 'tencent' | 'baidu' | 'leaflet' | 'auto'

  readonly APP_MAP_GOOGLE_KEY?: string
  readonly APP_MAP_GOOGLE_MAP_ID?: string
  readonly APP_MAP_BAIDU_KEY?: string
  readonly APP_MAP_BAIDU_STYLE_ID?: string
  readonly APP_MAP_TENCENT_KEY?: string

  // 允许索引访问
  readonly [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv {}
}

/**
 * WebAuthn / Biometrics support
 */
interface Window {
  PublicKeyCredential?: any
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>
    openSelectKey: () => Promise<void>
  }
  // 使用 BMap 而非 BMapGL
  BMap?: any
}

/**
 * 谷歌地图全局命名空间
 */
declare namespace google {
  namespace maps {
    function importLibrary(libraryName: 'maps'): Promise<MapsLibrary>;
    function importLibrary(libraryName: 'marker'): Promise<MarkerLibrary>;
    function importLibrary(libraryName: string): Promise<any>;

    interface MapsLibrary {
      Map: typeof Map;
      // Added LatLngBounds to MapsLibrary interface
      LatLngBounds: typeof LatLngBounds;
      [key: string]: any;
    }

    interface MarkerLibrary {
      AdvancedMarkerElement: typeof AdvancedMarkerElement;
      PinElement: any;
      [key: string]: any;
    }

    class Map {
      constructor(el: HTMLElement, opts: any)
      setCenter(latlng: any): void
      setZoom(zoom: number): void
      panTo(latLng: any): void
      // Fix: Added missing fitBounds method
      fitBounds(bounds: any, padding?: number | object): void
      // Fix: Added missing addListener method
      addListener(eventName: string, handler: Function): any
      // Fix: Added missing getZoom method
      getZoom(): number | undefined
    }
    class LatLng {
      constructor(lat: number, lng: number)
    }
    // Fix: Added LatLngBounds class to namespace maps
    class LatLngBounds {
      constructor()
      extend(point: any): LatLngBounds
    }
    // Fix: Added event namespace for static event methods
    namespace event {
      function removeListener(handle: any): void
    }
    class Marker {
      constructor(opts: any)
      setMap(map: Map | null): void
      addListener(event: string, handler: Function): void
    }
    class AdvancedMarkerElement {
      constructor(opts: any)
      setMap(map: Map | null): void
      addListener(event: string, handler: Function): void
      position: any;
      content: HTMLElement;
      zIndex: number;
      title: string;
    }
    enum SymbolPath {
      CIRCLE = 0,
    }
  }
}
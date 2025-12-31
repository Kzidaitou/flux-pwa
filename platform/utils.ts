
import { Platform, Coords } from './types'


/**
 * 核心平台检测逻辑
 */
export function detectPlatform(): Platform {

  if (typeof window === 'undefined') return 'web'
  const ua = navigator.userAgent.toLowerCase()

  return /mobile|android|iphone|ipad|ipod|harmony|openharmony/i.test(ua) ? 'h5' : 'web'
}


/**
 * 获取用户真实经纬度
 */
export async function getCurrentLocation(): Promise<Coords> {

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })
}

export function getPlatformConfig() {
  return {
    apiBaseUrl: process.env.APP_BASE_API || '',
    wsBaseUrl: process.env.APP_BASE_WS || '',
  }
}

export async function isLowEndDevice(): Promise<boolean> {
  if (typeof navigator !== 'undefined') {
    const concurrency = navigator.hardwareConcurrency || 4
    // @ts-ignore
    const ram = navigator.deviceMemory || 4
    if (concurrency <= 4 || ram <= 3) return true
  }
  return false
}

export function getPlatformClass(): string {
  return `platform-${detectPlatform()}`
}

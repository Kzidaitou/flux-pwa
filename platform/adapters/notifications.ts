
import { NotificationAdapter } from '../types'
import { detectPlatform } from '../utils'

class NotificationAdapterImpl implements NotificationAdapter {
  isSupported(): boolean {
    const platform = detectPlatform()
    if (platform === 'web' || platform === 'h5') return 'Notification' in window
    return true // App 和 小程序默认认为支持，需通过 request 确认
  }

  async requestPermission(): Promise<'granted' | 'denied' | 'default'> {
    const platform = detectPlatform()

    // 1. 浏览器环境
    if (platform === 'web' || platform === 'h5') {
      if (!('Notification' in window)) return 'denied'
      const permission = await Notification.requestPermission()
      return permission
    }

    return 'default'
  }
}

export const getNotification = (): NotificationAdapter => new NotificationAdapterImpl()

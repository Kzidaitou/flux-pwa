
/**
 * Unified Platform Types
 */

export type Platform = 'web' | 'h5'

export interface Coords {
  latitude: number
  longitude: number
}

export interface StorageAdapter {
  setItem(key: string, value: string): void | Promise<void>
  getItem(key: string): string | null | Promise<string | null>
  removeItem(key: string): void | Promise<void>
  clear(): void | Promise<void>
}

export interface CameraAdapter {
  scanQRCode(): Promise<string>
}

export interface NavigationAdapter {
  navigate(path: string): void
  goBack(): void
  replace(path: string): void
  getCurrentPath(): string
  setNavigate?(navigate: (path: string) => void): void
}

export interface PaymentAdapter {
  requestPayment(params: {
    amount: number
    orderId: string
    description: string
  }): Promise<{ success: boolean; transactionId?: string }>
}

export interface SocialAuthResponse {
  provider: 'google' | 'apple'
  token: string
  email?: string
  name?: string
}

export interface SocialAuthAdapter {
  login(provider: 'google' | 'apple'): Promise<SocialAuthResponse>
}

// --- 新增：硬件与系统适配接口 ---

export interface NotificationAdapter {
  requestPermission(): Promise<'granted' | 'denied' | 'default'>
  isSupported(): boolean
}

export interface BiometricAdapter {
  isAvailable(): Promise<boolean>
  authenticate(reason: string): Promise<boolean>
}


import { User, PastSession, VehicleBrand } from './types'
import { api } from '../../core/request'

/**
 * 用户资料与数据服务
 */
export const userApi = {
  getProfile: async (): Promise<User> => {
    return api.get<User>('/user/profile')
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return api.put<User>('/user/profile', updates)
  },

  getHistory: async (): Promise<PastSession[]> => {
    return api.get<PastSession[]>('/user/history')
  },

  getVehicleBrands: async (): Promise<VehicleBrand[]> => {
    return api.get<VehicleBrand[]>('/user/vehicle-brands')
  },

  /**
   * 检测应用版本
   */
  checkVersion: async (): Promise<{ latestVersion: string; downloadUrl: string; changelog: string }> => {
    return api.get('/app/check-version', { requireAuth: false })
  },

  /**
   * 绑定三方账号
   */
  linkSocial: async (params: { provider: string; socialToken: string }): Promise<{ success: boolean; user: User }> => {
    return api.post('/user/social/link', params)
  },

  /**
   * 解绑三方账号
   */
  unlinkSocial: async (provider: string): Promise<{ success: boolean; user: User }> => {
    return api.post('/user/social/unlink', { provider })
  },

  /**
   * 支付卡片管理
   */
  addPaymentMethod: async (data: { type: string; last4: string; expiry: string; name: string }): Promise<{ success: boolean; user: User }> => {
    return api.post('/user/payment-methods/add', data)
  },

  deletePaymentMethod: async (id: string): Promise<{ success: boolean; user: User }> => {
    return api.post('/user/payment-methods/delete', { id })
  },

  setDefaultPaymentMethod: async (id: string): Promise<{ success: boolean; user: User }> => {
    return api.post('/user/payment-methods/set-default', { id })
  },

  /**
   * 钱包充值接口
   */
  topUp: async (amount: number, method: string): Promise<{ success: boolean; newBalance: number }> => {
    return api.post('/payment/topup', { amount, method })
  },

  /**
   * 撤出售后申请
   */
  cancelSupport: async (sessionId: string): Promise<boolean> => {
    return api.post<boolean>('/user/support/cancel', { sessionId })
  }
}

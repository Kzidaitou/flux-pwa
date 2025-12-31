import { api } from '../../core/request'
import { 
  LoginCredentials, 
  RegisterParams, 
  SocialAuthParams, 
  LoginResponse 
} from './types'

/**
 * 认证服务模块
 */
export const authApi = {
  /**
   * 邮箱密码登录
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials, {
      requireAuth: false,
      skipGlobalError: true 
    })
  },

  /**
   * 账号注册
   */
  register: async (data: RegisterParams): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/register', data, {
      requireAuth: false
    })
  },

  /**
   * 社交账号快捷登录/注册
   */
  socialAuth: async (params: SocialAuthParams): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/social', params, {
      requireAuth: false
    })
  },

  /**
   * 发送验证码 (新)
   */
  sendOtp: async (email: string): Promise<{ success: boolean }> => {
    return api.post('/auth/send-otp', { email }, { requireAuth: false })
  },

  /**
   * 绑定社交账号邮箱（补全并完成注册）
   * 增加了 code 参数进行安全校验
   */
  bindSocialEmail: async (params: SocialAuthParams & { email: string; code: string }): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/social/bind', params, {
      requireAuth: false
    })
  },

  /**
   * 退出登录
   */
  logout: async (): Promise<void> => {
    return api.post('/auth/logout', {})
  }
}
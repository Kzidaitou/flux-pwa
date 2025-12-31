import { User } from '../user/types'

/**
 * 认证服务专用领域模型
 */
export interface AuthData {
  provider: 'email' | 'google' | 'apple'
  email: string
  name?: string
}

/**
 * 登录请求参数 (DTO)
 */
export interface LoginCredentials {
  email: string
  password?: string
}

/**
 * 注册请求参数 (DTO)
 */
export interface RegisterParams extends LoginCredentials {
  name?: string
  // Added verification code property to allow submitting OTP during registration
  code: string
}

/**
 * 社交登录请求参数 (DTO)
 */
export interface SocialAuthParams {
  provider: 'google' | 'apple'
  socialToken: string
  email?: string
  name?: string
}

/**
 * 登录成功响应
 */
export interface LoginResponse {
  user: User
  token: string
  needsEmail?: boolean
}

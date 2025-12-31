
import { User } from '../../services/user/types'
import { MockDB, createUserObject } from './user'

// 验证码 Store (仅内存，模拟短信/邮件失效性)
const MOCK_OTP_STORE: Record<string, { code: string; expires: number; lastSent: number }> = {}

/**
 * 辅助：构造登录成功后的统一 DTO
 */
const buildAuthSuccess = (user: User) => {
  MockDB.setActiveUser(user)
  MockDB.saveUser(user) // 确保进入持久化库
  return {
    user,
    token: `jwt_${Math.random().toString(36).substring(7)}`
  }
}

export const MOCK_LOGIN_RESPONSE = (user?: User) => {
  const _user = user || MockDB.getActiveUser()
  if (_user) {
    return buildAuthSuccess(_user)
  } else {
    return { success: false, message: 'No active user.' }
  }
}

export const routes = {
  '/auth/login': (body: any) => {
    const { email, password, code } = body
    const users = MockDB.getUsers()

    if (code) {
      if (MOCK_OTP_STORE[email]?.code === code) {
        delete MOCK_OTP_STORE[email]
        return buildAuthSuccess(users[email] || createUserObject({ email }))
      }
      return { success: false, message: 'Invalid code.' }
    }

    if (users[email] && password === 'password') {
      return buildAuthSuccess(users[email])
    }
    return { success: false, message: 'Invalid email or password' }
  },

  '/auth/send-otp': (body: any) => {
    const { email } = body
    const now = Date.now()
    
    if (MOCK_OTP_STORE[email] && (now - MOCK_OTP_STORE[email].lastSent < 60000)) {
      return { success: false, message: 'Please wait.' }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    MOCK_OTP_STORE[email] = { code, expires: now + 600000, lastSent: now }
    
    console.log(`%c 📧 FLUX OTP for ${email}: %c ${code} `, "background: #333; color: #00e676", "background: #00e676; color: #000; font-weight: bold")
    return { success: true, _mockCode: code }
  },

  '/auth/register': (body: any) => {
    const { email, code, password, name } = body
    if (!code || MOCK_OTP_STORE[email]?.code !== code) return { success: false, message: 'Invalid code.' }
    if (MockDB.getUsers()[email]) return { success: false, message: 'Email already exists.' }

    delete MOCK_OTP_STORE[email]
    return buildAuthSuccess(createUserObject({ email, name, hasPassword: !!password }))
  },

  '/auth/social': (body: any) => {
    const { provider, socialToken, email: providedEmail } = body
    const uid = `social_uid_${provider}_${socialToken.split('_').pop()}`
    const socialMap = MockDB.getSocialMap()
    const users = MockDB.getUsers()

    // 1. 已关联账号
    if (socialMap[uid]) return buildAuthSuccess(users[socialMap[uid]])

    // 2. 具备邮箱 (Google 式静默注册/绑定)
    if (providedEmail) {
      const user = users[providedEmail] || createUserObject({ email: providedEmail, linkedAccounts: [provider], hasPassword: false })
      if (!user.linkedAccounts.includes(provider)) user.linkedAccounts.push(provider)
      MockDB.linkSocial(uid, providedEmail)
      return buildAuthSuccess(user)
    }

    // 3. 缺失邮箱 (Apple 式引导绑定)
    return { needsEmail: true, user: { linkedAccounts: [provider] }, token: 'temp_token' }
  },

  '/auth/social/bind': (body: any) => {
    const { email, code, provider, socialToken } = body
    if (!code || MOCK_OTP_STORE[email]?.code !== code) return { success: false, message: 'OTP failed.' }
    
    const uid = `social_uid_${provider}_${socialToken.split('_').pop()}`
    const users = MockDB.getUsers()
    const user = users[email] || createUserObject({ email, linkedAccounts: ['email', provider], hasPassword: false })
    
    if (!user.linkedAccounts.includes(provider)) user.linkedAccounts.push(provider)
    MockDB.linkSocial(uid, email)
    return buildAuthSuccess(user)
  },

  '/auth/logout': () => { MockDB.setActiveUser(null); return { success: true } },
  '/auth/forgot-password': { success: true }
}

import { SocialAuthAdapter, SocialAuthResponse } from '../types'

/**
 * 辅助函数：生成随机 Google 邮箱
 */
const generateRandomGmail = () => {
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `user_${randomStr}@gmail.com`
}

class WebSocialAuthAdapter implements SocialAuthAdapter {
  async login(provider: string): Promise<SocialAuthResponse> {
    await new Promise((r) => setTimeout(r, 800))
    if (provider === 'google') {
      const email = generateRandomGmail()
      return {
        provider: 'google',
        token: 'mock_web_token_' + Date.now(),
        email: email,
        name: 'Web User (' + email.split('@')[0] + ')'
      }
    } else {
      return {
        provider: 'apple' as any,
        token: 'mock_web_token_' + Date.now()
      }
    }
  }
}

export function getSocialAuthAdapter(): SocialAuthAdapter {
  return new WebSocialAuthAdapter()
}

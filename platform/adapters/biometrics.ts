
import { BiometricAdapter } from '../types'
import { detectPlatform } from '../utils'

/**
 * 辅助函数：将字符串转换为 ArrayBuffer (WebAuthn 挑战值需要)
 */
function bufferFrom(str: string): Uint8Array {
  const buffer = new TextEncoder().encode(str)
  // Cast to ensure ArrayBuffer type (not SharedArrayBuffer)
  if (buffer.buffer instanceof SharedArrayBuffer) {
    return new Uint8Array(buffer)
  }
  return buffer
}

/**
 * 生物识别跨端实现
 * 支持：Web (WebAuthn)
 */
class BiometricAdapterImpl implements BiometricAdapter {
  /**
   * 检查硬件是否支持生物识别
   */
  async isAvailable(): Promise<boolean> {
    const platform = detectPlatform()

    // Web/H5 环境：检查浏览器 WebAuthn API 真实可用性
    if (['web', 'h5'].includes(platform)) {
      if (!window.PublicKeyCredential) return false
      // 检查当前设备是否有“用户验证平台认证器”（如 FaceID/TouchID）
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    }
    
    return false
  }

  /**
   * 触发生物识别验证
   */
  async authenticate(reason: string): Promise<boolean> {
    const platform = detectPlatform()
    console.log(`[Biometrics] Triggering auth for: ${reason}`)

    //  Web/H5 环境：通过 WebAuthn 唤起真实的系统验证
    if (['web', 'h5'].includes(platform)) {
      try {
        // 在 Web 上，唤起生物识别通常需要创建一个验证请求
        // 注意：WebAuthn 验证通常需要后端配合，此处通过一个通用的“获取凭证”流程来触发系统弹窗
        const challenge = bufferFrom(`flux_challenge_${Date.now()}`)
        
        // 构造 WebAuthn 验证参数
        const options: CredentialRequestOptions = {
          publicKey: {
            challenge: challenge.buffer as ArrayBuffer,
            timeout: 60000,
            userVerification: "required", // 强制要求生物识别（而非仅点击确认）
            // 注意：在没有预注册凭证 ID 的情况下，尝试获取所有可用平台凭证
            // 如果是 PWA 或已注册 Passkey 的场景，这里会非常流畅
          }
        }

        const credential = await navigator.credentials.get(options)
        return !!credential
      } catch (e: any) {
        // 如果用户点击取消、超时或未注册生物识别，会抛出异常
        console.error('[Web Biometrics] Verification failed or cancelled:', e.name, e.message)
        return false
      }
    }

    return false
  }
}

let instance: BiometricAdapter | null = null

export const getBiometric = (): BiometricAdapter => {
  if (!instance) instance = new BiometricAdapterImpl()
  return instance
}

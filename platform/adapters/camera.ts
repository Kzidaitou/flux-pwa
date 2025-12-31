import { CameraAdapter } from '../types'

/**
 * 扫码逻辑跨端实现
 */
class CameraAdapterImpl implements CameraAdapter {
  async scanQRCode(): Promise<string> {
    // Web/H5 环境：手动提示或使用 Canvas (由专门的 QRCodeScannerView 组件处理)
    throw new Error('CAMERA_UNAVAILABLE')
  }
}

let instance: CameraAdapter | null = null

export function getCamera(): CameraAdapter {
  if (!instance) instance = new CameraAdapterImpl()
  return instance
}

export default getCamera

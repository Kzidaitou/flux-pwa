
declare module 'jsqr' {
  export interface QRCodeLocation {
    topLeftCorner: { x: number; y: number }
    topRightCorner: { x: number; y: number }
    bottomLeftCorner: { x: number; y: number }
    bottomRightCorner: { x: number; y: number }
  }

  export interface QRCode {
    data: string
    binaryData: Uint8ClampedArray
    chunks?: Array<{ type: string; data: Uint8ClampedArray }>
    location?: QRCodeLocation
  }

  export interface QRCodeOptions {
    inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst'
  }

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: QRCodeOptions
  ): QRCode | null
}

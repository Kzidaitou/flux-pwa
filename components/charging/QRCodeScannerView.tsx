
import { useCallback, useEffect, useRef, useState } from 'react'
import { QrCode, Loader2, AlertCircle } from 'lucide-react'

type ScannerStatus = 'idle' | 'starting' | 'running' | 'error'

export interface QRCodeScannerViewProps {
  enabled: boolean
  onResult: (text: string) => void
  onError?: (error: Error) => void
  className?: string
  scanInterval?: number
}

export default function QRCodeScannerView({
  enabled,
  onResult,
  onError,
  className = '',
  scanInterval = 200,
}: QRCodeScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastScanTime = useRef<number>(0)
  const isComponentMounted = useRef(true)

  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [errorText, setErrorText] = useState<string>('')
  

  const stopWebScanner = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }, [])

  const initiateScanner = useCallback(async () => {
    if (!enabled) return

    if (streamRef.current) return
    setStatus('starting')
    
    try {
      const [{ default: jsQR }] = await Promise.all([import('jsqr')])
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      })
      
      if (!isComponentMounted.current) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }

      streamRef.current = stream
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await video.play()
        setStatus('running')

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
        if (!ctx || !canvas) return

        const scanFrame = (timestamp: number) => {
          if (!streamRef.current || !isComponentMounted.current) return
          
          const currentVideo = videoRef.current
          if (!currentVideo) return

          // 修复：显式检查 readyState 以确保视频数据可用
          if (timestamp - lastScanTime.current >= scanInterval && currentVideo.readyState === currentVideo.HAVE_ENOUGH_DATA) {
            lastScanTime.current = timestamp
            
            const w = currentVideo.videoWidth
            const h = currentVideo.videoHeight
            const dw = Math.min(w, 640)
            const dh = (h / w) * dw
            
            canvas.width = dw
            canvas.height = dh
            ctx.drawImage(currentVideo, 0, 0, dw, dh)
            
            const imageData = ctx.getImageData(0, 0, dw, dh)
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
            
            if (code?.data) {
              onResult(code.data)
              stopWebScanner()
              return
            }
          }
          rafRef.current = requestAnimationFrame(scanFrame)
        }
        rafRef.current = requestAnimationFrame(scanFrame)
      }
    } catch (e: any) {
      setStatus('error')
      setErrorText(e.name === 'NotAllowedError' ? 'Grant camera access to scan' : 'Unable to access camera')
      onError?.(e)
    }
  }, [enabled, onResult, onError, scanInterval, stopWebScanner])

  useEffect(() => {
    isComponentMounted.current = true
    if (enabled) {
      const timer = setTimeout(initiateScanner, 300)
      return () => {
        clearTimeout(timer)
        isComponentMounted.current = false
        stopWebScanner()
      }
    }
    return () => { isComponentMounted.current = false }
  }, [enabled, initiateScanner, stopWebScanner])

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden group ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline autoPlay
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {status === 'idle' && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <QrCode className="text-white/40" size={32} />
            </div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Ready to scan</p>
          </div>
        )}

        {status === 'starting' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary animate-spin" size={32} />
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Accessing Lens</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 px-10 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
              <AlertCircle size={24} />
            </div>
            <p className="text-red-500 text-xs font-bold">{errorText}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); initiateScanner(); }} 
              className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full text-[10px] font-black pointer-events-auto active:scale-95"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}
      </div>

      {status === 'running' && (
        <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none">
          <div className="w-full h-full border-2 border-primary/30 rounded-3xl relative overflow-hidden">
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#00e676] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}
    </div>
  )
}

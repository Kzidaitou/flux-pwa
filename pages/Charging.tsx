
import React, { useState, useEffect } from 'react'
import { ChargingProps } from '../types/modules/charging'
import ChargingChart from '../components/charging/ChargingChart'
import ChargingStats from '../components/charging/ChargingStats'
import QRCodeScannerView from '../components/charging/QRCodeScannerView'
import ManualCodeEntryView from '../components/charging/ManualCodeEntryView'
import { QrCode, Keyboard, ArrowLeft, Loader2 } from 'lucide-react'
import { chargingApi } from '../services/charging'

const Charging: React.FC<ChargingProps> = ({
  session,
  onStopSession,
  onStartByCode,
  isCharging,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'SCAN' | 'MANUAL' | 'MONITOR'>(isCharging ? 'MONITOR' : 'SCAN')
  const [code, setCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [chartData, setChartData] = useState<{ time: number; power: number }[]>([])

  useEffect(() => {
    if (isCharging) setMode('MONITOR')
    else if (mode === 'MONITOR') setMode('SCAN')
  }, [isCharging])

  useEffect(() => {
    if (!session || !isCharging) {
      setChartData([])
      return
    }
    const socket = chargingApi.getSessionSocket(session.id)
    socket.connect({
      onMessage: (msg) => {
        if (msg.type === 'STATUS_UPDATE') {
          setChartData((prev) => [...prev, { time: msg.data.timestamp, power: msg.data.currentPower }].slice(-30))
        }
      },
    })
    return () => socket.disconnect()
  }, [session, isCharging])

  const handleScanResult = async (rawResult: string) => {
    if (isProcessing) return
    
    let extractedCode = rawResult.trim()
    if (extractedCode.includes('/c/')) {
      extractedCode = extractedCode.split('/c/').pop() || ''
    } else if (extractedCode.includes('connector=')) {
      const url = new URL(rawResult)
      extractedCode = url.searchParams.get('connector') || ''
    }

    if (!extractedCode) {
      onShowToast('Invalid QR code format', 'error')
      return
    }

    setIsProcessing(true)
    onShowToast(`Terminal identified: #${extractedCode}`, 'success')
    
    const success = await onStartByCode(extractedCode)
    if (!success) {
      onShowToast('Hardware connection failed', 'error')
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = async () => {
    setIsProcessing(true)
    const success = await onStartByCode(code)
    if (!success) {
      onShowToast('Invalid terminal code', 'error')
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-dark text-white overflow-hidden relative">
      <div className="pt-8 px-6 pb-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          {/* 仅在 MANUAL 模式下显示返回按钮，点击返回 SCAN */}
          {mode === 'MANUAL' && (
            <button 
              title="Back to scanner" 
              onClick={() => setMode('SCAN')} 
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90 border border-white/5"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
              {mode === 'MONITOR' ? 'Live Session' : mode === 'MANUAL' ? 'Input Code' : 'Hardware Access'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60">
              {isProcessing ? 'Handshake in progress' : mode === 'MONITOR' ? 'Data Stream Active' : 'Scan terminal to begin'}
            </p>
          </div>
        </div>
        
        {/* 仅在非充电状态且未处理中时显示模式切换按钮 */}
        {!isCharging && !isProcessing && (
          <button 
            title={mode === 'SCAN' ? 'Enter code' : 'Scan QR'} 
            onClick={() => setMode(mode === 'SCAN' ? 'MANUAL' : 'SCAN')} 
            className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 transition-all active:scale-90"
          >
            {mode === 'SCAN' ? <Keyboard size={24} /> : <QrCode size={24} />}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {isProcessing && !isCharging && (
          <div className="absolute inset-0 z-50 bg-dark/80 backdrop-blur-md flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
             <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-6">
                <Loader2 className="text-primary animate-spin" size={40} />
             </div>
             <h3 className="text-xl font-black">Authorizing...</h3>
             <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">Establishing Secure Link</p>
          </div>
        )}

        {mode === 'SCAN' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-full aspect-square max-w-sm rounded-[3.5rem] overflow-hidden border-2 border-primary/20 relative shadow-2xl shadow-primary/5">
              <QRCodeScannerView enabled={!isProcessing} onResult={handleScanResult} />
            </div>
            <div className="mt-12 text-center max-w-xs">
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Automatic Identification</p>
              <p className="text-gray-600 text-[10px] mt-2 font-medium">The system will automatically redirect once the terminal QR code is successfully authorized.</p>
            </div>
          </div>
        )}

        {mode === 'MANUAL' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <ManualCodeEntryView value={code} onChange={setCode} onSubmit={handleManualSubmit} isProcessing={isProcessing} />
          </div>
        )}

        {mode === 'MONITOR' && session && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-700">
            <ChargingChart data={chartData} />
            <ChargingStats session={session} onStopSession={onStopSession} />
          </div>
        )}
      </div>

      <div className="pb-10 px-8 text-center shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
          <div className={`w-1.5 h-1.5 rounded-full ${isCharging ? 'bg-primary animate-pulse' : 'bg-gray-600'}`}></div>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Verified Secure Session</p>
        </div>
      </div>
    </div>
  )
}

export default Charging

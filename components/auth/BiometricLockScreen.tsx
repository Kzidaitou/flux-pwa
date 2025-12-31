
import React, { useState, useEffect } from 'react'
import { Zap, Smartphone, Loader2, Lock } from 'lucide-react'
import { getBiometric } from '../../platform'

interface BiometricLockScreenProps {
  onUnlock: () => void
}

const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({ onUnlock }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState(false)

  const handleUnlock = async () => {
    setIsAuthenticating(true)
    setError(false)
    try {
      const success = await getBiometric().authenticate('Unlock Flux Application')
      if (success) {
        onUnlock()
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    } finally {
      setIsAuthenticating(false)
    }
  }

  // 初始自动触发一次验证
  useEffect(() => {
    const timer = setTimeout(handleUnlock, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-20">
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20 shadow-2xl shadow-green-500/10 animate-bounce-slow">
          <Zap size={40} className="text-primary" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">FLUX<span className="text-primary">.</span></h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60">Security Shield Active</p>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center">
        <button 
          title="Authenticate to unlock"
          disabled={isAuthenticating}
          onClick={handleUnlock}
          className={`w-full py-5 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all active:scale-95 ${
            error ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            error ? 'bg-red-500/20 text-red-500 animate-shake' : 'bg-primary/20 text-primary'
          }`}>
            {isAuthenticating ? <Loader2 size={28} className="animate-spin" /> : <Smartphone size={28} />}
          </div>
          <span className={`text-xs font-black uppercase tracking-widest ${error ? 'text-red-500' : 'text-white'}`}>
            {isAuthenticating ? 'Scanning...' : error ? 'Try Again' : 'Tap to Unlock'}
          </span>
        </button>

        {error && (
          <p className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-tighter flex items-center gap-1.5">
            <Lock size={12} /> Authentication Failed
          </p>
        )}
      </div>

      <p className="absolute bottom-12 text-gray-600 text-[10px] font-bold uppercase tracking-widest opacity-40">
        Your biometrics stay on your device
      </p>
    </div>
  )
}

export default BiometricLockScreen

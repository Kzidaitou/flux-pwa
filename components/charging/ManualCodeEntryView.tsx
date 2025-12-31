import React, { useState } from 'react'
import { Hash, ArrowRight, Loader2, Info, Zap } from 'lucide-react'

interface ManualCodeEntryViewProps {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  isProcessing: boolean
  errorMsg?: string
}

const ManualCodeEntryView: React.FC<ManualCodeEntryViewProps> = ({
  value,
  onChange,
  onSubmit,
  isProcessing,
  errorMsg,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    onChange(val)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length === 6 && !isProcessing) {
      onSubmit()
    }
  }

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center space-y-4 mb-2">
          {/* 复合图标区域 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse"></div>

            <div className="relative w-20 h-20 bg-gray-900 border-2 border-primary/30 rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,#00e676_25%,#00e676_50%,transparent_50%,transparent_75%,#00e676_75%)] bg-[length:4px_4px]"></div>
              <Zap size={32} className="text-primary animate-pulse" fill="currentColor" />
              <div className="absolute inset-0 border border-white/5 rounded-[2rem]"></div>
            </div>

            <div className="absolute -right-2 -bottom-2 w-9 h-9 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-dark ring-1 ring-secondary/20 rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <Hash size={16} strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
              Terminal Access
            </h3>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.35em] opacity-70">
              Verified Hardware Handshake
            </p>
          </div>
        </div>

        <div className="relative group pt-4">
          <label htmlFor="connector-input" className="sr-only">
            Enter 6-digit connector code
          </label>
          <input
            id="connector-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
            autoFocus
          />

          <div
            className={`flex justify-between gap-2 px-2 transition-all duration-300 ${
              errorMsg ? 'animate-shake' : ''
            }`}
          >
            {[...Array(6)].map((_, i) => {
              const char = value[i] || ''
              const isCurrent = i === value.length && isFocused
              return (
                <div
                  key={i}
                  className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-mono font-black transition-all duration-300 shadow-inner
                    ${
                      char
                        ? 'border-primary bg-primary/5 text-primary scale-105'
                        : isCurrent
                        ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10'
                        : 'border-gray-800 bg-black/20 text-gray-600'
                    }
                  `}
                >
                  {char}
                  {isCurrent && (
                    <div className="w-0.5 h-8 bg-secondary animate-pulse rounded-full"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {errorMsg && (
            <div className="flex items-center justify-center gap-2 py-2 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in zoom-in-95">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5">
                <Info size={12} /> {errorMsg}
              </p>
            </div>
          )}

          <button
            title="Confirm code and start"
            type="submit"
            disabled={isProcessing || value.length < 6}
            className={`w-full py-5 rounded-[1.5rem] font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl
              ${
                value.length === 6
                  ? 'bg-primary text-dark shadow-green-500/30'
                  : 'bg-gray-800 text-gray-500 border border-white/5 opacity-50 cursor-not-allowed'
              }
            `}
          >
            {isProcessing ? (
              <>
                AUTHENTICATING... <Loader2 className="animate-spin" size={20} />
              </>
            ) : (
              <>
                CONFIRM & CONNECT <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-12 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
        Verified Endpoint Protection
      </p>
    </div>
  )
}

export default ManualCodeEntryView

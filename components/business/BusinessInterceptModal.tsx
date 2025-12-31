import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import { FileText, Zap, ArrowRight, X } from 'lucide-react'

interface BusinessInterceptModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'UNPAID' | 'CHARGING' | null
  sessionId?: string
}

const BusinessInterceptModal: React.FC<BusinessInterceptModalProps> = ({
  isOpen,
  onClose,
  type,
  sessionId,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  if (!isOpen || !type) return null

  const isUnpaid = type === 'UNPAID'

  const handleAction = () => {
    onClose()
    if (isUnpaid) {
      navigate('/profile', { state: { sessionId } })
    } else {
      if (location.pathname !== '/charging') {
        navigate('/charging')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-surface border border-gray-700 w-full max-w-sm rounded-[2.5rem] p-8 relative z-[1010] animate-in zoom-in-95 duration-300 shadow-2xl shadow-black/50">
        <button title="Colse" onClick={onClose} className="absolute right-6 top-6 p-2 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transform -rotate-6 border ${
            isUnpaid ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-primary/10 border-primary/20 text-primary'
          }`}>
            {isUnpaid ? <FileText size={40} /> : <Zap size={40} fill="currentColor" />}
          </div>
          <h3 className="text-2xl font-black text-white mb-3">{isUnpaid ? 'Unpaid Invoice' : 'Session Active'}</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {isUnpaid 
              ? 'You have an outstanding bill that needs your attention. Please settle it to continue.' 
              : 'A charging session is already in progress on your account.'}
          </p>
          <div className="w-full space-y-3">
            <button onClick={handleAction} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
              isUnpaid ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-dark shadow-green-500/20'
            }`}>
              {isUnpaid ? 'View and Pay Now' : 'Go to Monitor'}
              <ArrowRight size={18} />
            </button>
            <button onClick={onClose} className="w-full py-3 text-gray-500 font-bold text-sm hover:text-gray-300 transition-colors">Maybe Later</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessInterceptModal

import React from 'react'
import { ArrowLeft, Loader2, ChevronRight, AlertTriangle, Battery, CreditCard, ShieldAlert } from 'lucide-react'
import { PastSession } from '../../../services/user/types'
import { OrderSummaryHeader } from './OrderSummaryHeader'

interface AfterSalesReasonPickerProps {
  session: PastSession
  type: 'SUPPORT' | 'REFUND'
  onBack: () => void
  onSelectReason: (reason: string) => void
  isActionLoading: boolean
}

const SUPPORT_PRESETS = [
  { id: 'S1', label: 'Hardware Failure', desc: 'Broken cable, plug, or screen issues.', icon: AlertTriangle },
  { id: 'S2', label: 'APP Connectivity', desc: 'Could not stop or start via app.', icon: ShieldAlert },
  { id: 'S3', label: 'Inaccurate Status', desc: 'App showed available but site was blocked.', icon: Battery },
  { id: 'S4', label: 'Other Issues', desc: 'General feedback or specific requests.', icon: ChevronRight }
]

const REFUND_PRESETS = [
  { id: 'R1', label: 'Incorrect Deduction', desc: 'Charged more than estimated.', icon: CreditCard },
  { id: 'R2', label: 'Zero Energy Transfer', desc: 'No energy received by car.', icon: Battery },
  { id: 'R3', label: 'Duplicate Transaction', desc: 'Billed twice for one session.', icon: CreditCard },
  { id: 'R4', label: 'Other Financial', desc: 'Other refund related issues.', icon: ChevronRight }
]

export const AfterSalesReasonPicker: React.FC<AfterSalesReasonPickerProps> = ({ session, type, onBack, onSelectReason, isActionLoading }) => {
  const presets = type === 'SUPPORT' ? SUPPORT_PRESETS : REFUND_PRESETS
  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-300">
      <button title="Go back to details" onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest active:-translate-x-1 transition-transform"><ArrowLeft size={16} /> Back</button>
      <OrderSummaryHeader session={session} />
      <h4 className="text-xl font-black mb-4 px-1 tracking-tight">Select {type === 'REFUND' ? 'Refund' : 'Support'} Reason</h4>
      <div className="space-y-3 pb-10 overflow-y-auto custom-scrollbar flex-1 pr-0.5">
        {presets.map((p) => (
          <button title={`Reason: ${p.label}`} key={p.id} disabled={isActionLoading} onClick={() => onSelectReason(p.label)} className="w-full p-5 bg-white dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-3xl flex items-center gap-4 group active:scale-[0.98] transition-all hover:border-primary shadow-sm text-left">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors"><p.icon size={20} /></div>
            <div className="flex-1">
              <span className="text-sm font-black text-gray-900 dark:text-white block">{p.label}</span>
              <span className="text-[10px] text-gray-500 font-medium">{p.desc}</span>
            </div>
            {isActionLoading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />}
          </button>
        ))}
      </div>
    </div>
  )
}

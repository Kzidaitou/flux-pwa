
import React, { useState } from 'react'
import { ArrowLeft, Loader2, Send} from 'lucide-react'
import { PastSession } from '../../../services/user/types'
import { OrderSummaryHeader } from './OrderSummaryHeader'
import { formatCurrency } from '../../../utils'

interface AfterSalesCustomFormProps {
  session: PastSession
  type: 'SUPPORT' | 'REFUND'
  reason: string
  onBack: () => void
  onSubmit: (description: string, amount?: number) => void
  isActionLoading: boolean
}

export const AfterSalesCustomForm: React.FC<AfterSalesCustomFormProps> = ({ session, type, reason, onBack, onSubmit, isActionLoading }) => {
  const [text, setText] = useState('')
  const [amount, setAmount] = useState<string>(session.cost.toString())
  const isRefund = type === 'REFUND'
  const numericAmount = parseFloat(amount)
  const isAmountValid = !isRefund || (!isNaN(numericAmount) && numericAmount > 0 && numericAmount <= session.cost)

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-300">
      <button title="Back to reason list" onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest active:-translate-x-1 transition-transform"><ArrowLeft size={16} /> Back</button>
      <OrderSummaryHeader session={session} />
      <div className="mb-6 px-1">
        <h4 className="text-xl font-black tracking-tight">{isRefund ? 'Refund Details' : 'Issue Description'}</h4>
        <p className="text-[10px] font-black text-primary uppercase mt-1">Reason: {reason || 'General'}</p>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 space-y-8 pb-10">
        {isRefund && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-400">
            <div className="flex justify-between items-end mb-3 ml-2 pr-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Expected Refund Amount</label>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Max {formatCurrency(session.cost)}</span>
            </div>
            <div className="relative mb-4">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-xl leading-none">$</div>
              <input title="Refund amount input" type="text" inputMode="decimal" value={amount} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val)) setAmount(val); }} className={`w-full bg-gray-50 dark:bg-dark border-2 rounded-[1.5rem] pl-10 pr-6 py-5 text-2xl font-mono font-black focus:outline-none transition-all ${!isAmountValid ? 'border-red-500/50 bg-red-500/5' : 'border-gray-100 dark:border-gray-800 focus:border-primary shadow-inner'}`} placeholder="0.00" />
            </div>
          </div>
        )}
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3 block">Additional Context</label>
          <textarea title="Enter detailed description" value={text} onChange={(e) => setText(e.target.value.slice(0, 500))} className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] p-5 text-sm min-h-[140px] focus:border-primary focus:outline-none transition-all resize-none shadow-inner" placeholder={isRefund ? "Why do you need a refund?" : "What went wrong?"} />
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 pb-8 shrink-0">
        <button title="Submit after-sales ticket" disabled={isActionLoading || text.length < 10 || !isAmountValid} onClick={() => onSubmit(text, isRefund ? numericAmount : undefined)} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40">
          {isActionLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />} SUBMIT APPLICATION
        </button>
      </div>
    </div>
  )
}

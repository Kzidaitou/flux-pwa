
import React from 'react'
import { ArrowLeft, Copy, ShieldCheck, XCircle, Zap, CreditCard, MessageSquare, RotateCcw, Loader2, Info, Phone, Camera, ChevronRight } from 'lucide-react'
import { PastSession, ServiceTicket, TicketEvent } from '../../../services/user/types'
import { PAYMENT_STATUS_MAP, SUPPORT_STATUS_MAP, REFUND_STATUS_MAP } from '../../../constant/order'
import { formatCurrency } from '../../../utils'
import Icon from '../../ui/Icon'

interface HistoryDetailViewProps {
  session: PastSession
  onBack: () => void
  onWithdraw: () => void
  onShowReasonPicker: (type: 'SUPPORT' | 'REFUND') => void
  onPayNow: (session: PastSession) => void
  onCopy: (text: string, label: string) => void
  isPreparingPayment: boolean
  isActionLoading: boolean
}

const TicketTimeline: React.FC<{ timeline: TicketEvent[] }> = ({ timeline }) => (
  <div className="mt-6 space-y-6">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Case Timeline</p>
    <div className="relative pl-6 border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-2 py-1">
      {timeline.map((evt, idx) => (
        <div key={idx} className="relative mb-6 last:mb-0">
          <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-4 border-white dark:border-surface ${idx === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
          <div className="flex justify-between items-start">
             <h5 className={`text-xs font-black ${idx === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{evt.title}</h5>
             <span className="text-[10px] font-bold text-gray-400 tabular-nums">{evt.time}</span>
          </div>
          {evt.description && <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{evt.description}</p>}
        </div>
      ))}
    </div>
  </div>
)

const TicketCard: React.FC<{ ticket: ServiceTicket; onWithdraw: () => void; onCopy: any; loading: boolean }> = ({ ticket, onWithdraw, onCopy, loading }) => {
  const isRefund = ticket.type === 'REFUND'
  const isWithdrawn = ticket.status === 'withdrawn'
  
  const statusMap = isRefund ? REFUND_STATUS_MAP : SUPPORT_STATUS_MAP
  const statusCfg = statusMap[ticket.status] || statusMap.pending
  
  const accentColor = isWithdrawn ? 'gray' : (isRefund ? 'blue' : 'indigo')

  return (
    <div className={`mb-4 bg-gradient-to-br from-${accentColor}-500/10 to-${accentColor}-500/5 border border-${accentColor}-500/20 rounded-[2.5rem] p-6 shadow-sm ${isWithdrawn ? 'opacity-70 grayscale-[0.5]' : ''}`}>
       <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${accentColor}-500/20 rounded-2xl flex items-center justify-center text-${accentColor}-500 shadow-inner`}>
              {isRefund ? <RotateCcw size={24} /> : <MessageSquare size={24} />}
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] font-black text-${accentColor}-500 uppercase tracking-widest leading-none mb-1.5`}>{isRefund ? 'Refund Case' : 'Support Case'}</p>
              <button title="Copy Ticket ID" onClick={() => onCopy(ticket.id, 'Ticket ID')} className="flex items-center gap-1.5 group">
                <p className="text-xs font-mono font-bold text-gray-700 dark:text-gray-200 truncate">#{ticket.id}</p>
                <Copy size={10} className="text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0" />
              </button>
            </div>
          </div>
          {(['pending', 'processing', 'waiting_user', 'approved'].includes(ticket.status)) && !isWithdrawn && (
            <button title="Withdraw request" onClick={onWithdraw} disabled={loading} className="p-3 bg-white dark:bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-all active:scale-90 border border-gray-100 dark:border-white/5 shadow-sm">
              <XCircle size={20} />
            </button>
          )}
       </div>

       <div className="space-y-4">
         <div className="flex justify-between items-center">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-2 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} border`}>
               <Icon name={statusCfg.icon} size={10} strokeWidth={4} /> {statusCfg.label}
            </div>
            {isRefund && ticket.refundAmount && (
              <p className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 shadow-sm">
                Expected: {formatCurrency(ticket.refundAmount)}
              </p>
            )}
         </div>

         <div className="p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 mb-2"><Info size={12} /> Issue Details</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-bold leading-relaxed italic">"{ticket.reason}"</p>
         </div>

         {ticket.adminResponse && !isWithdrawn && (
           <div className={`p-5 rounded-2xl border-2 animate-in fade-in slide-in-from-top-2 duration-300 ${ticket.status === 'waiting_user' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-primary/5 border-primary/10'}`}>
             <div className="flex justify-between items-start mb-2">
               <p className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${ticket.status === 'waiting_user' ? 'text-amber-500' : 'text-primary'}`}>
                 <ShieldCheck size={12} /> Agent Feedback
               </p>
               {ticket.status === 'waiting_user' && (
                 <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-500 text-white rounded uppercase animate-pulse">Action Required</span>
               )}
             </div>
             <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{ticket.adminResponse}</p>
             
             {ticket.status === 'waiting_user' && (
                <button title="Click to upload documentation" className="w-full mt-4 py-3 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-amber-500/20">
                  <Camera size={14} /> Upload Evidence
                </button>
             )}
           </div>
         )}

         {ticket.hotline && !isWithdrawn && (
            <a href={`tel:${ticket.hotline}`} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center"><Phone size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter leading-none mb-1">Site Manager Hotline</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{ticket.hotline}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </a>
         )}

         {ticket.timeline && <TicketTimeline timeline={ticket.timeline} />}
       </div>
    </div>
  )
}

export const HistoryDetailView: React.FC<HistoryDetailViewProps> = ({ 
  session, 
  onBack, 
  onWithdraw, 
  onShowReasonPicker, 
  onPayNow, 
  onCopy, 
  isPreparingPayment, 
  isActionLoading 
}) => {
  const isPayable = session.status === 'unpaid';
  const payCfg = PAYMENT_STATUS_MAP[session.status] || PAYMENT_STATUS_MAP.unpaid;
  
  const activeSupport = session.supportTicket && ['pending', 'processing', 'waiting_user'].includes(session.supportTicket.status) 
    ? session.supportTicket 
    : null;
    
  const activeRefund = session.refundTicket && ['pending', 'processing', 'approved'].includes(session.refundTicket.status) 
    ? session.refundTicket 
    : null;

  const getSupportLabel = () => {
    if (!activeSupport) return 'SUPPORT';
    return SUPPORT_STATUS_MAP[activeSupport.status]?.label.toUpperCase() || 'PROCESSING';
  };

  const getRefundLabel = () => {
    if (isPayable) return 'UNPAID';
    if (!activeRefund) return 'REFUND';
    return REFUND_STATUS_MAP[activeRefund.status]?.label.toUpperCase() || 'AUDITING';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 pb-6">
        <button title="Back to order list" onClick={onBack} className="mb-5 text-[10px] font-black text-secondary flex items-center gap-1.5 uppercase tracking-widest active:translate-x-[-4px] transition-transform">
          <ArrowLeft size={14} strokeWidth={3} /> Back to history
        </button>

        <div className="space-y-3">
          {session.supportTicket && (
            <TicketCard ticket={session.supportTicket} onWithdraw={onWithdraw} onCopy={onCopy} loading={isActionLoading} />
          )}
          {session.refundTicket && (
            <TicketCard ticket={session.refundTicket} onWithdraw={onWithdraw} onCopy={onCopy} loading={isActionLoading} />
          )}
        </div>

        <div className="mt-4 bg-gray-50 dark:bg-surface border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 mb-6 text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block tracking-widest">Total Transaction</span>
          <h2 className="text-5xl font-black tracking-tighter">{formatCurrency(session.cost)}</h2>
          <div className={`mt-5 inline-flex items-center gap-2 px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${payCfg.bg} ${payCfg.text} ${payCfg.border}`}>
            <Icon name={payCfg.icon} size={12} strokeWidth={3} />
            {payCfg.label}
          </div>
        </div>

        <div className="bg-white dark:bg-dark p-6 rounded-[2rem] space-y-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest ml-1">Order Identifier</span>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
              <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300 truncate pr-4">{session.id}</span>
              <button title="Copy Order ID to clipboard" onClick={() => onCopy(session.id, 'Order ID')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                <Copy size={14} className="text-primary" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-800 pt-5">
            <div className="space-y-1">
              <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest block">Station</span>
              <p className="text-xs font-black leading-tight text-gray-900 dark:text-white line-clamp-2">{session.stationName}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest block">Connector</span>
              <div className="flex items-center justify-end gap-1.5 text-gray-900 dark:text-white font-black">
                <Zap size={10} className="text-primary" fill="currentColor" /> 
                #{session.connectorCode || '101'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-gray-50 dark:border-gray-800 pt-5">
            <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest">Energy Delivered</span>
            <span className="text-gray-900 dark:text-white font-black text-base">{session.kwh} <span className="text-[10px] text-gray-500 uppercase">kWh</span></span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-gray-50 dark:border-gray-800 pt-5">
            <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest">Session Duration</span>
            <span className="text-gray-900 dark:text-white font-black">{session.durationMins} <span className="text-[10px] text-gray-500 uppercase">Mins</span></span>
          </div>

          {session.paymentMethod && (
            <div className="flex justify-between items-center text-sm border-t border-gray-50 dark:border-gray-800 pt-5">
              <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest">Payment Method</span>
              <span className="text-gray-900 dark:text-white font-black flex items-center gap-1.5">
                <CreditCard size={14} className="text-secondary" /> {session.paymentMethod}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 shrink-0 pb-6">
        {isPayable && (
          <button title="Pay current outstanding balance" onClick={() => onPayNow(session)} disabled={isPreparingPayment} className="w-full bg-primary text-dark font-black py-4 rounded-[1.5rem] shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            {isPreparingPayment ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={20} />} 
            {isPreparingPayment ? 'LOADING CHECKOUT...' : 'PAY NOW'}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            title="Initiate support inquiry" 
            onClick={() => !activeSupport && onShowReasonPicker('SUPPORT')} 
            className={`font-black py-4 rounded-[1.5rem] text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${
              activeSupport 
                ? 'bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-60' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white active:scale-95 hover:border-gray-300'
            }`}
          >
            <MessageSquare size={16} className={activeSupport ? 'text-gray-400' : 'text-secondary'} />
            {getSupportLabel()}
          </button>
          
          <button 
            title="Initiate refund request" 
            onClick={() => !isPayable && !activeRefund && onShowReasonPicker('REFUND')} 
            className={`font-black py-4 rounded-[1.5rem] text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${
              (activeRefund || isPayable)
                ? 'bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-60' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white active:scale-95 hover:border-red-500/30'
            }`}
          >
            <RotateCcw size={16} className={(activeRefund || isPayable) ? 'text-gray-400' : 'text-red-500'} />
            {getRefundLabel()}
          </button>
        </div>
      </div>
    </div>
  )
}

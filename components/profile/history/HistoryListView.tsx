
import React from 'react'
import { PastSession } from '../../../services/user/types'
import { PAYMENT_STATUS_MAP, SUPPORT_STATUS_MAP, REFUND_STATUS_MAP } from '../../../constant/order'
import { formatCurrency } from '../../../utils'
import { HistoryItemSkeleton, HistoryEmptyState } from '../../empty-states'
import Icon from '../../ui/Icon'

interface HistoryListViewProps {
  history: PastSession[]
  isLoaded: boolean
  isLoading: boolean
  onSelectSession: (session: PastSession) => void
}

export const HistoryListView: React.FC<HistoryListViewProps> = ({ history, isLoaded, isLoading, onSelectSession }) => {
  if (!isLoaded || (isLoading && history.length === 0)) return <div className="space-y-3"><HistoryItemSkeleton /><HistoryItemSkeleton /></div>
  if (history.length === 0) return <HistoryEmptyState />
  
  return (
    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-0.5 pb-10">
      {history.map((item) => {
        const tags: { key: string; label: string; icon: string; style: any }[] = [];
        const payCfg = PAYMENT_STATUS_MAP[item.status] || PAYMENT_STATUS_MAP.unpaid;
        tags.push({ key: `pay-${item.id}`, label: payCfg.label, icon: payCfg.icon, style: payCfg });
        if (item.supportTicket && item.supportTicket.status !== 'withdrawn') {
          const cfg = SUPPORT_STATUS_MAP[item.supportTicket.status] || SUPPORT_STATUS_MAP.pending;
          tags.push({ key: `sup-${item.id}`, label: `Support: ${cfg.label}`, icon: cfg.icon, style: cfg });
        }
        if (item.refundTicket && item.refundTicket.status !== 'withdrawn') {
          const cfg = REFUND_STATUS_MAP[item.refundTicket.status] || REFUND_STATUS_MAP.pending;
          tags.push({ key: `ref-${item.id}`, label: `Refund: ${cfg.label}`, icon: cfg.icon, style: cfg });
        }

        return (
          <button title={`View order details for ${item.stationName}`} key={item.id} onClick={() => onSelectSession(item)} className="w-full bg-white dark:bg-surface border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between text-left shadow-sm active:scale-[0.98] transition-all group">
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="font-black text-sm truncate group-hover:text-primary transition-colors">{item.stationName}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">{item.date}</p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="font-black text-base tracking-tighter">{formatCurrency(item.cost)}</p>
              <div className="flex flex-wrap justify-end gap-1 mt-1.5">
                {tags.map(tag => (
                  <span key={tag.key} className={`text-[7px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 uppercase tracking-tighter shrink-0 ${tag.style.bg} ${tag.style.text} ${tag.style.border}`}>
                    <Icon name={tag.icon} size={7} strokeWidth={3} /> {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

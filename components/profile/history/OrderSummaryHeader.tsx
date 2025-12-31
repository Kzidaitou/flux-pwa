
import React from 'react'
import { PastSession } from '../../../services/user/types'
import { formatCurrency } from '../../../utils'

interface OrderSummaryHeaderProps {
  session: PastSession
}

export const OrderSummaryHeader: React.FC<OrderSummaryHeaderProps> = ({ session }) => (
  <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-gray-200 dark:border-white/5 flex justify-between items-center shrink-0">
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Referencing Order</p>
      <h5 className="text-sm font-black truncate">{session.stationName}</h5>
      <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">ID: {session.id}</p>
    </div>
    <div className="text-right shrink-0 ml-4">
      <p className="text-lg font-black text-primary">{formatCurrency(session.cost)}</p>
      <p className="text-[9px] font-bold text-gray-400 uppercase">{session.date}</p>
    </div>
  </div>
)

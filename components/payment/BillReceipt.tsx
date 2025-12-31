
import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { BillReceiptProps } from '../../types/modules/charging'
import { formatCurrency, formatKwh, formatDurationMins } from '../../utils'

const BillReceipt: React.FC<BillReceiptProps> = ({ session }) => {
  return (
    <div className="bg-white dark:bg-surface rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6 relative overflow-hidden shadow-lg dark:shadow-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">
            Total Due
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(session.cost)}
          </h1>
        </div>
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
          <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800/50 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Energy Delivered</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatKwh(session.kwhDelivered)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Duration</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatDurationMins(session.startTime)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Station ID</span>
          <span className="text-gray-900 dark:text-white font-medium">#{session.stationId}</span>
        </div>
      </div>
    </div>
  )
}

export default BillReceipt

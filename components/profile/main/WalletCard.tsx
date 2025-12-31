
import React from 'react'
import { Plus } from 'lucide-react'
import { WalletCardProps } from '../../../types/modules/user'
import { formatCurrency } from '../../../utils'

const WalletCard: React.FC<WalletCardProps> = ({ balance, onTopUp, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-surface rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Current Balance</span>
        <button title="Top up" onClick={onTopUp} className="text-green-600 dark:text-primary text-sm font-bold flex items-center gap-1">
          <Plus size={14} /> Top Up
        </button>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(balance).replace('$', '')}</span>
        <span className="text-gray-500 font-medium text-xs">USD</span>
      </div>
    </div>
  )
}

export default WalletCard

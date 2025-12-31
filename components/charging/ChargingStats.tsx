
import React from 'react'
import { Zap, Battery, Clock } from 'lucide-react'
import { ChargingStatsProps } from '../../types/modules/charging'
import { formatDurationMins, formatKwh } from '../../utils'

const ChargingStats: React.FC<ChargingStatsProps> = ({ session, onStopSession }) => {
  return (
    <div className="bg-surface rounded-t-3xl p-6 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-800">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-dark p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Zap size={18} />
            <span className="text-xs font-medium uppercase">Speed</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {session.currentPower.toFixed(1)}{' '}
            <span className="text-sm text-gray-500 font-normal">kW</span>
          </p>
        </div>
        <div className="bg-dark p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Battery size={18} />
            <span className="text-xs font-medium uppercase">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatKwh(session.kwhDelivered)}
          </p>
        </div>
        <div className="bg-dark p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Clock size={18} />
            <span className="text-xs font-medium uppercase">Elapsed</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatDurationMins(session.startTime)}
          </p>
        </div>
        <div className="bg-dark p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <span className="text-lg leading-none font-bold">$</span>
            <span className="text-xs font-medium uppercase">Cost</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">{session.cost.toFixed(2)}</p>
        </div>
      </div>

      <button
        title="Stop current charging session"
        onClick={onStopSession}
        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
        </div>
        Stop Charging
      </button>
    </div>
  )
}

export default ChargingStats


import React from 'react'
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { Info } from 'lucide-react'
import { ChargingChartProps } from '../../types/modules/charging'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 border border-gray-600 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[100px]">
        <p className="text-gray-400 mb-1 font-mono border-b border-gray-700 pb-1">
          {new Date(label).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <p className="text-white font-bold text-sm">
            {Number(payload[0].value).toFixed(2)}{' '}
            <span className="text-xs font-normal text-gray-400">kW</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

const ChargingChart: React.FC<ChargingChartProps> = ({ data }) => {
  return (
    <div className="flex-1 relative flex flex-col items-center justify-center py-6">
      {/* Label for the chart */}
      <div className="z-10 mb-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <span className="text-xs text-gray-300 font-medium flex items-center gap-2">
          <Info size={12} className="text-primary" /> Real-time Power Curve
        </span>
      </div>

      {/* Animated Rings - kept in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-primary/20 rounded-full animate-ping opacity-20"></div>
        <div className="w-48 h-48 border border-primary/40 rounded-full absolute"></div>
      </div>

      {/* Chart */}
      <div className="w-full h-48 px-0 z-10 opacity-90">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e676" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#ffffff30', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Area
              type="monotone"
              dataKey="power"
              stroke="#00e676"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPower)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChargingChart

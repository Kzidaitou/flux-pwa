
import React, { useState } from 'react'
import { StationDetailModalProps } from '../../types/modules/station'
import { MapPin, Navigation, Zap, Check, DollarSign, ListFilter, ArrowRight, ShieldCheck, ZapOff, Loader2 } from 'lucide-react'
import ConnectorIcon from './ConnectorIcon'
import { STATION_STATUS_MAP } from '../../constant/station'
import Icon from '../ui/Icon'
import BusinessInterceptModal from '../business/BusinessInterceptModal'
import ModalWrapper from '../modal-wrapper'
import { formatCurrency } from '../../utils'

const StationDetailModal: React.FC<StationDetailModalProps> = ({ station, onClose, onStartCharging, isCharging, activeUnpaidSession }) => {
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null)
  const [interceptType, setInterceptType] = useState<'UNPAID' | 'CHARGING' | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const stationStatus = STATION_STATUS_MAP[station.status] || STATION_STATUS_MAP.offline
  const isInterceptNeeded = isCharging || !!activeUnpaidSession

  const handleStartAction = async () => {
    if (isInterceptNeeded) {
      if (activeUnpaidSession) setInterceptType('UNPAID')
      else if (isCharging) setInterceptType('CHARGING')
      return
    }
    if (selectedConnectorId) {
      setIsStarting(true)
      try { await onStartCharging(station, selectedConnectorId) } catch (e) { setIsStarting(false) }
    }
  }

  const handleNavigation = () => { window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.coordinates.lat},${station.coordinates.lng}`, '_blank'); }

  return (
    <ModalWrapper onClose={onClose} title={station.name}>
      <div className="flex flex-col text-gray-900 dark:text-white pb-6">
        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
            <div className="flex gap-3 min-w-0 items-center">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0"><MapPin size={18} /></div>
              <div className="min-w-0">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-sm font-bold truncate leading-snug">{station.address}</p>
              </div>
            </div>
            <button title="Start navigation to station" onClick={handleNavigation} className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full text-[10px] font-black shadow-lg shadow-blue-500/20 active:scale-95 shrink-0 transition-all"><Navigation size={12} fill="currentColor" /> GO</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black border flex items-center gap-1.5 uppercase tracking-wider ${stationStatus.bg} ${stationStatus.text} ${stationStatus.border}`}><Icon name={stationStatus.icon} size={10} strokeWidth={3} /> {stationStatus.label}</span>
            <span className="px-3 py-1.5 rounded-xl text-[9px] font-black border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck size={10} /> {station.power} kW</span>
          </div>
        </div>
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3 ml-1"><DollarSign size={14} className="text-primary" /><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Policy</h4></div>
          <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-primary/5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-xs font-black text-gray-500 uppercase">Standard Rate</span>
              <div className="text-right"><span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(station.pricePerKwh)}</span><span className="text-[9px] font-black text-gray-400"> / kWh</span></div>
            </div>
          </div>
        </section>
        <section className="mb-2">
           <div className="flex items-center justify-between mb-4 ml-1"><div className="flex items-center gap-2"><ListFilter size={14} className="text-primary" /><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connectors</h4></div><span className="text-[9px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg uppercase border border-primary/20">{station.available} Ready</span></div>
            <div className="grid grid-cols-1 gap-2.5">
              {station.connectors.map((conn) => {
                const isBusy = conn.status !== 'available'
                const isSelected = selectedConnectorId === conn.id
                return (
                  <button title={`Select connector ${conn.code}`} key={conn.id} disabled={isBusy || isStarting} onClick={() => setSelectedConnectorId(conn.id)} className={`group w-full p-4 rounded-[1.5rem] border-2 flex items-center justify-between transition-all duration-300 active:scale-[0.98] ${isSelected ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : !isBusy ? 'bg-white dark:bg-surface border-gray-100 dark:border-gray-800 hover:border-gray-300' : 'bg-gray-50 dark:bg-gray-900 border-transparent opacity-40 grayscale cursor-not-allowed'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-primary text-dark scale-105 shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}><ConnectorIcon type={conn.type} className="w-6 h-6" /></div>
                      <div className="text-left min-w-0"><div className="flex items-center gap-2 mb-0.5"><span className="font-black text-base tracking-tighter">#{conn.code}</span><span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase">{conn.type}</span></div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{conn.power} kW Fast Charge</p></div>
                    </div>
                    {!isBusy ? <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-primary border-primary text-dark shadow-sm' : 'border-gray-200 dark:border-gray-800'}`}>{isSelected && <Check size={14} strokeWidth={4} />}</div> : <ZapOff size={14} className="text-gray-500 mr-1" />}
                  </button>
                )
              })}
            </div>
        </section>
        <div className="mt-8">
          <button title="Confirm and start charging session" onClick={handleStartAction} disabled={!selectedConnectorId || isStarting} className={`w-full font-black py-4 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 text-base tracking-tight ${isInterceptNeeded && selectedConnectorId ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gradient-to-r from-primary to-green-400 text-dark shadow-green-500/30'}`}>
            {isStarting ? <>CONNECTING... <Loader2 size={18} className="animate-spin" /></> : isInterceptNeeded && selectedConnectorId ? <>RESOLVE STATUS <ArrowRight size={18} strokeWidth={3} /></> : <>START CHARGING <Zap size={18} fill="currentColor" /></>}
          </button>
          <p className="text-center text-gray-400 text-[9px] font-bold mt-4 uppercase tracking-[0.2em] opacity-50">Secure session authentication</p>
        </div>
        <BusinessInterceptModal isOpen={!!interceptType} type={interceptType} sessionId={activeUnpaidSession?.id} onClose={() => setInterceptType(null)} />
      </div>
    </ModalWrapper>
  )
}

export default StationDetailModal

import React from 'react'
import { Search, Map as MapIcon, List, Zap, BatteryCharging, QrCode, Loader2, MapPinOff, XCircle } from 'lucide-react'
import { HomeHeaderProps } from '../../types/modules/station'
import StatusBanner from '../status-banner'
import { getCamera } from '../../platform'
import { useNavigate } from 'react-router'

const HomeHeader: React.FC<HomeHeaderProps & { isLoading?: boolean, locationStatus?: string }> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  user,
  onNavigateToProfile,
  filteredCount,
  isCharging,
  activeUnpaidSession,
  onBannerClick,
  onShowToast,
  onShowIntercept,
  isLoading,
  locationStatus
}) => {
  const navigate = useNavigate()

  const handleScan = async () => {
    if (activeUnpaidSession) { onShowIntercept('UNPAID'); return; }
    if (isCharging) { onShowIntercept('CHARGING'); return; }
    try {
      const code = await getCamera().scanQRCode()
      if (code) navigate(`/charging?code=${code}`)
    } catch (e: any) {
      if (e.message === 'CAMERA_UNAVAILABLE') {
        onShowToast('Camera unavailable, manual input enabled.', 'warning')
        navigate('/charging?mode=manual')
      }
    }
  }

  return (
    <div className="pt-6 px-4 pb-2 bg-light dark:bg-dark transition-colors duration-500 z-20 shadow-sm dark:shadow-none">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Nearby</h2>
          <div className="flex items-center gap-2 h-5">
            {isLoading ? (
              <p className="text-primary text-[10px] font-black uppercase animate-pulse tracking-widest">Searching...</p>
            ) : locationStatus === 'denied' ? (
              <p className="text-amber-600 dark:text-amber-500 text-[9px] font-black flex items-center gap-1 uppercase tracking-widest">
                <MapPinOff size={10} /> Location Disabled
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                {filteredCount} stations found
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2.5">
          <button onClick={handleScan} className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-dark hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20" title="Scan QR Code to charge">
            <QrCode size={20} strokeWidth={2.5} />
          </button>
          <button title={viewMode === 'LIST' ? "Switch to map view" : "Switch to list view"} onClick={() => onViewModeChange(viewMode === 'LIST' ? 'MAP' : 'LIST')} className="w-11 h-11 rounded-2xl bg-white dark:bg-surface border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-primary transition-all active:scale-90 shadow-sm dark:shadow-none">
            {viewMode === 'LIST' ? <MapIcon size={20} /> : <List size={20} />}
          </button>
          <button title="Open my profile" onClick={onNavigateToProfile} className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 overflow-hidden hover:ring-2 hover:ring-primary transition-all flex items-center justify-center shadow-sm dark:shadow-none">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-gray-600 dark:text-white font-black text-sm">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>}
          </button>
        </div>
      </header>

      <div className="relative mb-5 z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          title="Search charging stations" 
          type="text" 
          placeholder="Search location or ID..." 
          value={search} 
          onChange={(e) => onSearchChange(e.target.value)} 
          className="w-full bg-white dark:bg-surface border border-gray-200 dark:border-gray-800 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all shadow-inner dark:shadow-none placeholder:text-gray-400" 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {search && (
            <button title="Clear search" onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 active:scale-90 transition-all">
              <XCircle size={18} />
            </button>
          )}
          {isLoading && <Loader2 size={18} className="animate-spin text-primary" />}
        </div>
      </div>

      <div className="flex gap-3 mb-2 overflow-x-auto no-scrollbar pb-2 z-10 relative">
        <button title="Show all stations" onClick={() => onFilterChange('ALL')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === 'ALL' ? 'bg-primary border-primary text-dark shadow-lg shadow-green-500/10' : 'bg-white dark:bg-surface text-gray-500 border-gray-200 dark:border-gray-800 shadow-sm'}`}>All</button>
        <button title="Show fast DC stations" onClick={() => onFilterChange('DC')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 transition-all border ${filter === 'DC' ? 'bg-secondary border-secondary text-white shadow-lg shadow-blue-500/10' : 'bg-white dark:bg-surface text-gray-500 border-gray-200 dark:border-gray-800 shadow-sm'}`}><Zap size={12} fill="currentColor" /> Fast (DC)</button>
        <button title="Show standard AC stations" onClick={() => onFilterChange('AC')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 transition-all border ${filter === 'AC' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/10' : 'bg-white dark:bg-surface text-gray-500 border-gray-200 dark:border-gray-800 shadow-sm'}`}><BatteryCharging size={12} /> Slow (AC)</button>
      </div>

      <StatusBanner isCharging={isCharging} activeUnpaidSession={activeUnpaidSession} onClick={onBannerClick} className="mb-2" />
    </div>
  )
}

export default HomeHeader
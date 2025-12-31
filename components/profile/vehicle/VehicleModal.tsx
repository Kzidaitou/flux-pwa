
import React, { useState, useEffect } from 'react'
import { Edit2, Check, Loader2 } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { VehicleModalProps } from '../../../types/modules/user'
import { VehicleBrand } from '../../../services/user/types'
import { VehicleEmptyState } from '../../empty-states'
import { userApi } from '../../../services/user'
import { getVehicleBrandIcon } from '../../../constant/vehicle'
import Icon from '../../ui/Icon'

const VehicleModal: React.FC<VehicleModalProps> = ({ user, onUpdateUser, onClose }) => {
  const hasVehicle = user.vehicleModel && user.vehicleModel !== 'Add Vehicle'
  const [isEditing, setIsEditing] = useState(!hasVehicle)
  
  // Form State
  const [brand, setBrand] = useState(user.vehicleBrand || '')
  const [model, setModel] = useState(hasVehicle ? user.vehicleModel || '' : '')
  const [plate, setPlate] = useState(user.licensePlate || '')
  const [isSaving, setIsSaving] = useState(false)

  // API State
  const [availableBrands, setAvailableBrands] = useState<VehicleBrand[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)

  useEffect(() => {
    if (isEditing && availableBrands.length === 0) {
      fetchBrands()
    }
  }, [isEditing])

  const fetchBrands = async () => {
    setIsLoadingBrands(true)
    try {
      const data = await userApi.getVehicleBrands()
      setAvailableBrands(data)
      if (!brand && data.length > 0) {
        setBrand(data[0].name)
      }
    } catch (e) {
      console.error('Failed to load brands', e)
    } finally {
      setIsLoadingBrands(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!model.trim()) return
    
    setIsSaving(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600))
    
    onUpdateUser({ 
      vehicleBrand: brand,
      vehicleModel: model.trim(),
      licensePlate: plate.toUpperCase()
    })
    
    setIsSaving(false)
    setIsEditing(false)
  }

  // Get active vehicle icon
  const activeBrandIcon = getVehicleBrandIcon(user.vehicleBrand || '')

  return (
    <ModalWrapper onClose={onClose} title="My Vehicle">
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-6">
        {!isEditing ? (
          <div className="animate-in fade-in duration-500">
            {hasVehicle ? (
              <>
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  {/* Brand Specific Icon in background */}
                  <div className="absolute -top-4 -right-4 p-8 opacity-10 group-hover:opacity-20 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                    <Icon name={activeBrandIcon} size={160} strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                         <Icon name={activeBrandIcon} size={12} strokeWidth={3} />
                       </div>
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block opacity-80">{user.vehicleBrand}</span>
                    </div>
                    <h4 className="text-4xl font-black mb-6 tracking-tighter text-white">{user.vehicleModel}</h4>
                    <div className="inline-flex flex-col gap-1">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Registration Plate</p>
                      <div className="bg-yellow-400 text-black rounded-2xl px-6 py-3 font-mono font-black text-2xl shadow-lg border-2 border-yellow-300/50">
                        {user.licensePlate || 'NO PLATE'}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="w-full mt-10 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                >
                  <Edit2 size={16} /> Edit Vehicle Details
                </button>
              </>
            ) : <VehicleEmptyState onAdd={() => setIsEditing(true)} />}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             {/* Brand Selector - Height Limited & Scrollable */}
             <div className="flex flex-col">
               <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4 ml-2 block">Select Brand</label>
               
               <div className="bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                 <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-4">
                   {isLoadingBrands ? (
                     <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="text-primary animate-spin mb-3" size={28} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Fleet Data...</span>
                     </div>
                   ) : (
                     <div className="grid grid-cols-3 gap-3">
                       {availableBrands.map((b) => {
                         const brandIcon = getVehicleBrandIcon(b.name)
                         return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setBrand(b.name)}
                            className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden active:scale-95 ${
                              brand === b.name 
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' 
                                : 'border-transparent bg-white dark:bg-surface hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${brand === b.name ? 'text-primary' : 'text-gray-400'}`}>
                              <Icon name={brandIcon} size={24} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter truncate w-full text-center ${brand === b.name ? 'text-primary' : 'text-gray-500'}`}>{b.name}</span>
                            {brand === b.name && (
                              <div className="absolute top-1.5 right-1.5">
                                <div className="bg-primary text-dark rounded-full p-0.5 shadow-sm"><Check size={8} strokeWidth={5} /></div>
                              </div>
                            )}
                          </button>
                         )
                       })}
                     </div>
                   )}
                 </div>
               </div>
             </div>

             {/* Inputs */}
             <div className="space-y-5">
               <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2 block">Model Name</label>
                 <input 
                   type="text" 
                   value={model} 
                   onChange={(e) => setModel(e.target.value)} 
                   placeholder="e.g. Model 3, ET5, Han EV" 
                   className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold outline-none focus:border-primary transition-all shadow-inner" 
                   required 
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2 block">License Plate</label>
                 <input 
                   type="text" 
                   value={plate} 
                   onChange={(e) => setPlate(e.target.value.toUpperCase())} 
                   placeholder="CA • 8X2942" 
                   className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold outline-none font-mono focus:border-primary transition-all shadow-inner" 
                 />
               </div>
             </div>

             <div className="pt-4 flex gap-3">
               <button 
                 type="button" 
                 onClick={() => hasVehicle ? setIsEditing(false) : onClose()} 
                 className="flex-1 py-5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black rounded-[1.5rem] text-sm uppercase tracking-widest"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={isSaving || !model.trim() || isLoadingBrands} 
                 className="flex-[2] bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-2xl shadow-green-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-40"
               >
                 {isSaving ? 'UPDATING...' : 'SAVE VEHICLE'}
               </button>
             </div>
          </form>
        )}
      </div>
    </ModalWrapper>
  )
}

export default VehicleModal

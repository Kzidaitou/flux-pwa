
import React, { useState, useEffect } from 'react'
import { Link, Key, Bell, Moon, Sun, Shield, Info, ChevronRight, Smartphone, Loader2, Download } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { SettingsModalProps } from '../../../types/modules/user'
import { getNotification, getBiometric } from '../../../platform'
import { useUI } from '../../../context/UIContext'
import { userApi } from '../../../services/user'

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, 
  onUpdateUser, 
  onClose, 
  onOpenAccountBinding, 
  onOpenSetPassword, 
  onOpenPrivacy,
  appVersion 
}) => {
  const { showToast, showAlert } = useUI()
  const [isPending, setIsPending] = useState<string | null>(null)
  const [latestInfo, setLatestInfo] = useState<{ latestVersion: string; downloadUrl: string; changelog: string } | null>(null)
  const [isCheckingVersion, setIsCheckingVersion] = useState(false)

  // 模拟版本检测
  useEffect(() => {
    const fetchVersion = async () => {
      setIsCheckingVersion(true)
      try {
        const info = await userApi.checkVersion()
        setLatestInfo(info)
      } catch (e) {
        console.error('Version check failed')
      } finally {
        setIsCheckingVersion(false)
      }
    }
    fetchVersion()
  }, [])

  const isLatest = !latestInfo || appVersion === latestInfo.latestVersion

  const handleUpdate = () => {
    if (latestInfo) {
      showAlert(
        `Update v${latestInfo.latestVersion}`, 
        latestInfo.changelog, 
        'info'
      )
      // 实际场景：window.open(latestInfo.downloadUrl) 或触发原生下载插件
    }
  }

  const toggleDarkMode = () => {
    const newValue = !user.preferences.darkMode
    onUpdateUser({ preferences: { ...user.preferences, darkMode: newValue } })
    showToast(`Theme switched to ${newValue ? 'Dark' : 'Light'}`, 'success')
  }

  const toggleNotifications = async () => {
    if (!user.preferences.notifications) {
      setIsPending('NOTIFS')
      const status = await getNotification().requestPermission()
      setIsPending(null)
      if (status === 'granted') {
        onUpdateUser({ preferences: { ...user.preferences, notifications: true } })
        showToast('Notifications enabled', 'success')
      } else {
        showToast('Permission denied by system', 'error')
      }
    } else {
      onUpdateUser({ preferences: { ...user.preferences, notifications: false } })
      showToast('Notifications disabled', 'info')
    }
  }

  const toggleFaceId = async () => {
    if (!user.preferences.faceId) {
      setIsPending('BIO')
      const available = await getBiometric().isAvailable()
      if (!available) {
        setIsPending(null)
        showToast('Hardware not supported', 'warning')
        return
      }
      
      const success = await getBiometric().authenticate('Enable Biometric Unlock for Flux')
      setIsPending(null)
      if (success) {
        onUpdateUser({ preferences: { ...user.preferences, faceId: true } })
        showToast('Biometrics active', 'success')
      }
    } else {
      onUpdateUser({ preferences: { ...user.preferences, faceId: false } })
      showToast('Biometrics disabled', 'info')
    }
  }

  return (
    <ModalWrapper onClose={onClose} title="Settings">
      <div className="flex flex-col h-full text-gray-900 dark:text-white overflow-y-auto custom-scrollbar pb-10">
        
        {/* Account Section */}
        <section className="mb-8">
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3 ml-2">Authentication</h4>
          <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm">
            <button title="Open linked accounts management" onClick={onOpenAccountBinding} className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Link size={18} /></div>
                <span className="font-bold text-sm">Linked Accounts</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <button title="Open password settings" onClick={onOpenSetPassword} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Key size={18} /></div>
                <span className="font-bold text-sm">{user.hasPassword ? 'Change Password' : 'Set Password'}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="mb-8">
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3 ml-2">Personalization</h4>
          <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  {user.preferences.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <span className="font-bold text-sm">Dark Interface</span>
              </div>
              <button title="Toggle dark mode theme" onClick={toggleDarkMode} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${user.preferences.darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${user.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
            
            <div className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${user.preferences.notifications ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                   {isPending === 'NOTIFS' ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} />}
                </div>
                <span className="font-bold text-sm">Push Notifications</span>
              </div>
              <button disabled={isPending === 'NOTIFS'} title="Toggle push notifications" onClick={toggleNotifications} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${user.preferences.notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} ${isPending === 'NOTIFS' ? 'opacity-50' : ''}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="w-full flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${user.preferences.faceId ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                   {isPending === 'BIO' ? <Loader2 size={18} className="animate-spin" /> : <Smartphone size={18} />}
                </div>
                <span className="font-bold text-sm">Biometric Unlock</span>
              </div>
              <button disabled={isPending === 'BIO'} title="Toggle biometric FaceID/TouchID unlock" onClick={toggleFaceId} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${user.preferences.faceId ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} ${isPending === 'BIO' ? 'opacity-50' : ''}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${user.preferences.faceId ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Legal & About Section */}
        <section>
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3 ml-2">Information</h4>
          <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm">
            <button title="Read privacy policy" onClick={onOpenPrivacy} className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500"><Shield size={18} /></div>
                <span className="font-bold text-sm">Privacy Center</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <div className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 relative">
                   <Info size={18} />
                   {!isLatest && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 border-2 border-white dark:border-surface rounded-full"></span>}
                </div>
                <div>
                   <p className="font-bold text-sm">Flux Application</p>
                   <p className="text-[10px] text-gray-400 font-medium">Build v{appVersion}</p>
                </div>
              </div>
              {isCheckingVersion ? (
                 <Loader2 size={14} className="animate-spin text-gray-400 mr-2" />
              ) : isLatest ? (
                 <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded uppercase">Latest</span>
              ) : (
                 <button onClick={handleUpdate} className="text-[10px] font-black text-white px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded-lg uppercase shadow-lg shadow-orange-500/20 flex items-center gap-1.5 active:scale-95 transition-all">
                    <Download size={12} strokeWidth={3} /> Update v{latestInfo?.latestVersion}
                 </button>
              )}
            </div>
          </div>
        </section>
        
        <p className="text-center text-gray-400 dark:text-gray-600 text-[10px] font-bold mt-12 uppercase tracking-widest opacity-50">Designed in San Francisco</p>
      </div>
    </ModalWrapper>
  )
}

export default SettingsModal

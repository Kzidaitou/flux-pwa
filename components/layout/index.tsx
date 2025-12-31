import React from 'react'
import { useNavigate } from 'react-router'
import { MapPin, Zap, User as UserIcon } from 'lucide-react'
import { LayoutProps } from './types'

const Layout: React.FC<LayoutProps> = ({ children, currentView, isCharging }) => {
  const navigate = useNavigate()

  if (currentView === 'LOGIN') {
    return <div className="h-full w-full overflow-hidden relative">{children}</div>
  }

  const tabs = [
    { id: 'HOME', label: 'Station', icon: MapPin, path: '/home' },
    { id: 'CHARGING', label: 'Charge', icon: Zap, path: '/charging' },
    { id: 'PROFILE', label: 'Profile', icon: UserIcon, path: '/profile' },
  ]

  return (
    <div className="h-full w-full flex flex-col bg-light dark:bg-dark transition-colors duration-500 overflow-hidden relative">
      <main className="flex-1 overflow-hidden relative">{children}</main>

      <nav className="h-20 bg-white/90 dark:bg-surface/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-6 pb-safe shrink-0 z-50 transition-all">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentView === tab.id

          return (
            <button
              key={tab.id}
              title={`Navigate to ${tab.label}`}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-110' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                <Icon size={22} fill={isActive ? 'currentColor' : 'none'} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              {tab.id === 'CHARGING' && isCharging && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#00e676]"></span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Layout
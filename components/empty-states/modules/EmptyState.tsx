import React from 'react'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-10 text-center animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
    {/* 背景装饰光晕 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    
    <div className="relative z-10">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/40 rounded-3xl flex items-center justify-center mb-8 border border-gray-200 dark:border-gray-700/50 text-gray-300 dark:text-gray-600 transform -rotate-3 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[260px] mx-auto font-medium">
        {description}
      </p>
      {action && <div className="mt-8 w-full animate-in slide-in-from-bottom-2 duration-500 delay-200">{action}</div>}
    </div>
  </div>
)
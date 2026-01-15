import React from 'react'
import { X } from 'lucide-react'
import { ModalWrapperProps } from './types'

const ModalWrapper: React.FC<ModalWrapperProps & { title?: string }> = ({
  onClose,
  children,
  title,
  allowBackdropDismiss = false,
}) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* 遮罩层 - 深度毛玻璃效果 */}
      <div
        className="absolute inset-0 bg-black/80 dark:bg-black/95 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
        onClick={() => {
          if (allowBackdropDismiss) onClose()
        }}
      ></div>

      {/* 弹窗主体 - 极简大圆角与高级阴影 */}
      <div className="bg-white dark:bg-[#1c1c1e] border-t border-x border-gray-100 dark:border-white/5 w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3rem] relative z-[210] animate-in slide-in-from-bottom-32 fade-in duration-500 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col pointer-events-auto overflow-hidden ring-1 ring-white/5">
        {/* 指示条 - 移动端手势暗示 */}
        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full opacity-60"></div>
        </div>

        {/* 固定页眉 - 增加底部阴影区分 */}
        <div className="flex items-center justify-between px-8 pt-3 pb-4 shrink-0 relative z-10 bg-white dark:bg-[#1c1c1e]">
          <div className="flex-1 min-w-0 pr-6">
            {title && (
              <h3 className="text-2xl font-black text-gray-900 dark:text-white truncate uppercase tracking-tighter leading-tight">
                {title}
              </h3>
            )}
          </div>

          <button
            type="button"
            title="Close"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white bg-gray-100 dark:bg-white/5 rounded-full transition-all active:scale-90 shrink-0 border border-gray-100 dark:border-white/5"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* 统一滚动区域 - 关键修复：min-h-0 允许 flex 容器收缩并滚动 */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-8 pb-10 relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalWrapper

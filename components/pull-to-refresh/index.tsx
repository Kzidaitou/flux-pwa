import React, { useState, useRef } from 'react'
import { Loader2, ArrowDown } from 'lucide-react'
import { PullToRefreshProps } from './types'

const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  onRefresh, 
  children, 
  disabled = false,
  className = ""
}) => {
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const THRESHOLD = 80
  const MAX_PULL = 120

  const handleMove = (client_y: number) => {
    const diff = client_y - startY
    if (diff > 0) {
      const dampedDiff = Math.min(diff * 0.5, MAX_PULL)
      setCurrentY(dampedDiff)
    }
  }

  const handleEnd = async () => {
    if (currentY >= THRESHOLD) {
      setIsRefreshing(true)
      setCurrentY(THRESHOLD)

      try {
        await onRefresh()
      } finally {
        setTimeout(() => {
          setIsRefreshing(false)
          setCurrentY(0)
        }, 500)
      }
    } else {
      setCurrentY(0)
    }
    setStartY(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    if (containerRef.current && containerRef.current.scrollTop <= 5) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY === 0) return
    handleMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (disabled || isRefreshing || startY === 0) return
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isRefreshing) return
    if (containerRef.current && containerRef.current.scrollTop <= 5) {
      setStartY(e.clientY)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || isRefreshing || startY === 0) return
    if (currentY > 0) {
        e.preventDefault() 
    }
    handleMove(e.clientY)
  }

  const handleMouseUp = () => {
    if (disabled || isRefreshing || startY === 0) return
    handleEnd()
  }

  const handleMouseLeave = () => {
    if (startY !== 0) {
      setCurrentY(0)
      setStartY(0)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: startY > 0 ? 'grabbing' : 'auto',
        WebkitOverflowScrolling: 'touch' 
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-[60]"
        style={{
          height: `${THRESHOLD}px`,
          transform: `translateY(${currentY - THRESHOLD}px)`,
          opacity: currentY > 0 ? 1 : 0,
          transition: isRefreshing ? 'transform 0.2s' : 'none',
        }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-white/90 dark:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800">
          {isRefreshing ? (
            <>
              <Loader2 size={16} className="animate-spin text-primary" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <ArrowDown
                size={16}
                className={`text-primary transition-transform duration-200 ${
                  currentY >= THRESHOLD ? 'rotate-180' : ''
                }`}
              />
              <span>{currentY >= THRESHOLD ? 'Release to update' : 'Pull down'}</span>
            </>
          )}
        </div>
      </div>

      <div
        className="flex-1 transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `translateY(${currentY}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh

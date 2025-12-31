import React from 'react'

/**
 * 带有呼吸动画的用户位置标记
 */
export const UserLocationMarkup: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      {/* 脉冲扩散层 */}
      <div className="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-40"></div>
      
      {/* 光晕层 */}
      <div className="absolute w-6 h-6 bg-blue-500/20 rounded-full"></div>
      
      {/* 中心实心圆点 */}
      <div className="relative w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
    </div>
  )
}

export default UserLocationMarkup
import React from 'react'
import Icon from '../../ui/Icon'

interface MarkerMarkupProps {
  color: string
  icon?: string
  isSelected?: boolean
  innerCircleColor: string
}

/**
 * 跨引擎通用的 Marker 视觉定义
 */
export const MarkerMarkup: React.FC<MarkerMarkupProps> = ({ 
  color, 
  icon, 
  isSelected, 
  innerCircleColor 
}) => {
  const scale = isSelected ? 1.25 : 1
  const shadow = isSelected 
    ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' 
    : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'

  return (
    <div style={{ 
      transform: `scale(${scale})`, 
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}>
      <svg 
        width="40" 
        height="50" 
        viewBox="-2 -2 28 34" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ filter: shadow, overflow: 'visible' }}
      >
        <path 
          d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 18 12 18s12-9.5 12-18c0-6.63-5.37-12-12-12z" 
          fill={color} 
          stroke="white" 
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="9" fill={innerCircleColor} />
        {icon && (
          <g transform="translate(5, 5)">
             <foreignObject width="14" height="14">
               <div style={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                 <Icon name={icon} size={14} strokeWidth={3} />
               </div>
             </foreignObject>
          </g>
        )}
      </svg>
    </div>
  )
}

export default MarkerMarkup
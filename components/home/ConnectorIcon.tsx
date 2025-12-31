
import React from 'react'
import { Plug } from 'lucide-react'
import { ConnectorIconProps } from '../../types/modules/station'

const ConnectorIcon: React.FC<ConnectorIconProps> = ({ type, isDC, className }) => {
  const t = type.toLowerCase().replace(/\s/g, '').replace('-', '')
  const props = {
    className,
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
  }

  switch (t) {
    case 'ccs2':
      return (
        <svg {...props}>
          <path d="M7 6a5 5 0 0 1 10 0c0 2.5-1.5 4-3 5h-4c-1.5-1-3-2.5-3-5Z" />
          <circle cx="12" cy="5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="9" cy="9" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9" r="0.8" fill="currentColor" stroke="none" />
          <path d="M8 12h8v5a4 4 0 0 1-8 0v-5Z" />
          <circle cx="10" cy="15" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="14" cy="15" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'ccs1':
      return (
        <svg {...props}>
          <circle cx="12" cy="7" r="4.5" />
          <circle cx="12" cy="4.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="11" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="13" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
          <path d="M8 12.5h8v4.5a4 4 0 0 1-8 0v-4.5Z" />
          <circle cx="10" cy="15.5" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="14" cy="15.5" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'type2':
      return (
        <svg {...props}>
          <path d="M6 10a6 6 0 0 1 12 0c0 3-2 5-4 6h-4c-2-1-4-3-4-6Z" />
          <path d="M7 7h10" />
          <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none" />
          <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
          <circle cx="11" cy="15" r="1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="15" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'type1':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="15" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="13.5" cy="15" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'chademo':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="9" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="15" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="2.2" fill="currentColor" stroke="none" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeWidth="1.5" />
        </svg>
      )
    case 'gbt':
      if (isDC) {
        return (
          <svg {...props}>
            <circle cx="12" cy="12" r="9.5" />
            <circle cx="8.5" cy="8.5" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="8.5" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
            <circle cx="10" cy="5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="14" cy="5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="5" cy="12" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        )
      } else {
        return (
          <svg {...props}>
            <path d="M6 10a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7Z" />
            <path d="M7 6h10" />
            <circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="8" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="10.5" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="13.5" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        )
      }
    case 'nacs': 
    case 'tesla':
      return (
        <svg {...props}>
          <path d="M6 6 Q12 0 18 6 L17 18 Q12 21 7 18 Z" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="9" cy="8" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="8" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return <Plug {...props} />
  }
}

export default ConnectorIcon

/**
 * Station & Connector Status Configuration
 * Single source of truth for visual representation
 */

export interface StatusStyle {
  label: string
  text: string
  bg: string
  border: string
  dot: string
  icon: string
}

export const STATION_STATUS_MAP: Record<string, StatusStyle> = {
  online: {
    label: 'Online',
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    icon: 'MapPin'
  },
  busy: {
    label: 'Busy',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: 'Zap'
  },
  offline: {
    label: 'Offline',
    text: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
    icon: 'WifiOff'
  },
  maintenance: {
    label: 'Maintenance',
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
    icon: 'Hammer'
  },
  closed: {
    label: 'Closed',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    icon: 'Ban'
  }
}

export const CONNECTOR_STATUS_MAP: Record<string, StatusStyle> = {
  available: {
    label: 'Available',
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    icon: 'CheckCircle2'
  },
  busy: {
    label: 'In Use',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: 'Zap'
  },
  offline: {
    label: 'Offline',
    text: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
    icon: 'WifiOff'
  },
  faulted: {
    label: 'Faulted',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    icon: 'AlertCircle'
  }
}

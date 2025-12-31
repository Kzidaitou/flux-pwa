
/**
 * Order & Session Status Configuration
 */

export interface StatusStyle {
  label: string
  text: string
  bg: string
  border: string
  icon: string
}

/**
 * 1. 基础支付状态 (交易维度)
 */
export const PAYMENT_STATUS_MAP: Record<string, StatusStyle> = {
  paid: {
    label: 'Paid',
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
    icon: 'CheckCircle2'
  },
  unpaid: {
    label: 'Unpaid',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    icon: 'AlertCircle'
  }
}

/**
 * 2. 技术申诉工单状态 (服务维度)
 */
export const SUPPORT_STATUS_MAP: Record<string, StatusStyle> = {
  pending: {
    label: 'Submitted',
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'MessageSquare'
  },
  processing: {
    label: 'Investigating',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'RefreshCw'
  },
  waiting_user: {
    label: 'Action Required',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'Camera'
  },
  resolved: {
    label: 'Issue Fixed',
    text: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    border: 'border-teal-200 dark:border-teal-800',
    icon: 'ShieldCheck'
  },
  withdrawn: {
    label: 'Withdrawn',
    text: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'XCircle'
  },
  rejected: {
    label: 'Closed',
    text: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'Ban'
  }
}

/**
 * 3. 退款工单状态 (财务维度)
 */
export const REFUND_STATUS_MAP: Record<string, StatusStyle> = {
  pending: {
    label: 'Applied',
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'Clock'
  },
  processing: {
    label: 'Auditing',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'RefreshCw'
  },
  approved: {
    label: 'Approved',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    icon: 'Loader2'
  },
  resolved: {
    label: 'Refunded',
    text: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    border: 'border-teal-200 dark:border-teal-800',
    icon: 'RotateCcw'
  },
  withdrawn: {
    label: 'Withdrawn',
    text: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'XCircle'
  },
  rejected: {
    label: 'Rejected',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    icon: 'XCircle'
  },
  failed: {
    label: 'Bank Failed',
    text: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-100 dark:border-red-900/30',
    icon: 'AlertTriangle'
  }
}


/**
 * 用户领域模型与接口类型
 */
export interface SavedCard {
  id: string
  type: 'Visa' | 'MasterCard' | 'Amex' | 'Discovery'
  last4: string
  expiry: string
  cardholderName: string
  isDefault: boolean
}

export interface VehicleBrand {
  id: string
  name: string
  icon: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  balance: number

  vehicleBrand?: string
  vehicleModel?: string
  vehicleYear?: string
  vehicleColor?: string
  preferredConnector?: string
  licensePlate?: string

  linkedAccounts: ('google' | 'apple' | 'email')[]
  paymentMethods?: SavedCard[] // 新增：保存的支付卡片
  hasPassword?: boolean

  preferences: {
    darkMode: boolean
    notifications: boolean
    faceId: boolean
  }
}

/**
 * 售后工单时间轴节点
 */
export interface TicketEvent {
  title: string
  time: string
  description?: string
  isUserAction?: boolean
}

/**
 * 售后工单/退款申请 详细模型
 */
export interface ServiceTicket {
  id: string
  type: 'SUPPORT' | 'REFUND'
  status: 
    | 'pending'       // 待受理 / 申请中
    | 'processing'    // 处理中
    | 'approved'      // 已批准（待打款）
    | 'resolved'      // 已完成（钱已到账/问题解决）
    | 'rejected'      // 已拒绝
    | 'withdrawn'     // 用户撤回
    | 'waiting_user'  // 等待用户反馈 / 需上传凭证
    | 'failed'        // 处理失败
  reason: string
  createdAt: string
  updatedAt?: string
  adminResponse?: string
  refundAmount?: number
  timeline?: TicketEvent[] // 状态时间轴
  hotline?: string // 站点现场电话
  attachments?: string[] // 附件图片URL
}

/**
 * 历史账单与售后模型
 */
export interface PastSession {
  id: string
  date: string
  stationName: string
  connectorCode?: string
  kwh: number
  cost: number
  durationMins: number
  status:
    | 'paid'
    | 'unpaid'
    | 'refunding'
    | 'refunded'
    | 'rejected'
    | 'complaint_submitted'
    | 'complaint_in_progress'
    | 'complaint_resolved'
    | 'complaint_rejected'
    | 'complaint_withdrawn'
  paymentMethod?: string

  supportTicket?: ServiceTicket
  refundTicket?: ServiceTicket

  // 兼容旧字段
  refundReason?: string
  complaintReason?: string
  adminResponse?: string
  refundAmount?: number
  supportTicketId?: string 
}

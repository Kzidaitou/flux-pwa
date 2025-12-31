
import { User, PastSession, SavedCard, VehicleBrand } from '../../services/user/types'

/**
 * Internal Mock Database for persistence simulation
 */
const STORAGE_KEYS = {
  ACTIVE_USER: '__MOCK_ACTIVE_USER__',
  USERS_LIST: '__MOCK_DB_USERS__',
  SOCIAL_MAP: '__MOCK_DB_SOCIAL_MAP__',
  HISTORY: '__MOCK_HISTORY_DB__'
}

const MOCK_BRANDS: VehicleBrand[] = [
  { id: 'b1', name: 'Tesla', icon: 'local:tesla' },
  { id: 'b2', name: 'BYD', icon: 'local:byd' },
  { id: 'b3', name: 'NIO', icon: 'local:nio' },
  { id: 'b4', name: 'XPeng', icon: 'local:xpeng' },
  { id: 'b5', name: 'Li Auto', icon: 'local:li-auto' },
  { id: 'b6', name: 'BMW', icon: 'local:bmw' },
  { id: 'b7', name: 'Zeekr', icon: 'local:zeekr' },
  { id: 'b8', name: 'Audi', icon: 'local:audi' },
  { id: 'b9', name: 'Xiaomi', icon: 'local:xiaomi' },
  { id: 'b10', name: 'Mercedes-Benz', icon: 'local:mercedes-benz' },
  { id: 'b11', name: 'Volkswagen', icon: 'local:volkswagen' },
  { id: 'b12', name: 'Rivian', icon: 'local:rivian' },
  { id: 'b13', name: 'Ford', icon: 'local:ford' },
  { id: 'b14', name: 'Hyundai', icon: 'local:hyundai' },
]

export const MockDB = {
  getUsers: (): Record<string, User> => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST)
    return data ? JSON.parse(data) : { 'kzidaitou@flux.app': MOCK_USER }
  },
  
  saveUser: (user: User) => {
    const users = MockDB.getUsers()
    users[user.email] = user
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users))
    // 同步更新活跃用户
    const active = MockDB.getActiveUser()
    if (active && active.email === user.email) MockDB.setActiveUser(user)
  },

  getSocialMap: (): Record<string, string> => {
    const data = localStorage.getItem(STORAGE_KEYS.SOCIAL_MAP)
    return data ? JSON.parse(data) : { 'social_uid_google_123': 'kzidaitou@flux.app' }
  },

  linkSocial: (uid: string, email: string) => {
    const map = MockDB.getSocialMap()
    map[uid] = email
    localStorage.setItem(STORAGE_KEYS.SOCIAL_MAP, JSON.stringify(map))
  },

  getActiveUser: (): User | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)
    return saved ? JSON.parse(saved) : null
  },

  setActiveUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER)
  },

  getHistory: (userId: string): PastSession[] => {
    const dbStr = localStorage.getItem(STORAGE_KEYS.HISTORY)
    let db: Record<string, PastSession[]> = {}
    try {
      db = JSON.parse(dbStr || '{}')
    } catch (e) {
      db = {}
    }

    if (db[userId] === undefined) {
      if (userId === 'u1') {
        db[userId] = [...MOCK_HISTORY]
      } else {
        db[userId] = []
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(db))
    }
    
    return db[userId]
  },

  saveHistory: (userId: string, history: PastSession[]) => {
    const dbStr = localStorage.getItem(STORAGE_KEYS.HISTORY)
    let db: Record<string, PastSession[]> = {}
    try {
      db = JSON.parse(dbStr || '{}')
    } catch (e) {}
    db[userId] = history
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(db))
  }
}

export const createUserObject = (overrides: Partial<User>): User => ({
  ...MOCK_USER,
  id: overrides.id || `u_${Date.now()}`,
  name: overrides.name || overrides.email?.split('@')[0] || 'User',
  email: overrides.email || '',
  balance: overrides.balance ?? 0,
  linkedAccounts: overrides.linkedAccounts || ['email'],
  paymentMethods: overrides.paymentMethods || [{ id: 'c1', type: 'Visa', last4: '4242', expiry: '12/25', cardholderName: 'KZID AITOU', isDefault: true }],
  hasPassword: overrides.hasPassword ?? true,
  ...overrides
})

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Kzidaitou',
  email: 'kzidaitou@flux.app',
  balance: 145.5,
  vehicleBrand: 'Tesla',
  vehicleModel: 'Model 3',
  vehicleYear: '2023',
  vehicleColor: 'Red',
  preferredConnector: 'NACS',
  licensePlate: 'CA • 8X2942',
  linkedAccounts: ['google', 'email'],
  paymentMethods: [
    { id: 'c1', type: 'Visa', last4: '4242', expiry: '12/25', cardholderName: 'KZID AITOU', isDefault: true }
  ],
  hasPassword: true,
  preferences: {
    darkMode: true,
    notifications: true,
    faceId: false,
  },
}

export const routes = {
  '/user/profile': (body: any, path: string, method: string) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false, message: 'Unauthorized' }
    return user
  },

  '/user/history': () => {
    const user = MockDB.getActiveUser()
    if (!user) return []
    return MockDB.getHistory(user.id)
  },

  '/user/vehicle-brands': () => MOCK_BRANDS,

  '/app/check-version': {
    latestVersion: '1.1.0',
    downloadUrl: 'https://flux.app/download',
    changelog: '• Optimized map rendering performance\n• Added support for new fast-chargers\n• Fixed minor UI glitches in history'
  },

  '/user/social/link': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false }
    if (!user.linkedAccounts.includes(body.provider)) {
      user.linkedAccounts.push(body.provider)
      MockDB.saveUser(user)
    }
    return { success: true, user }
  },

  '/user/social/unlink': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false }
    user.linkedAccounts = user.linkedAccounts.filter(p => p !== body.provider)
    MockDB.saveUser(user)
    return { success: true, user }
  },

  '/user/payment-methods/add': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false }
    const newCard: SavedCard = {
      id: `c_${Date.now()}`,
      type: body.type as any,
      last4: body.last4,
      expiry: body.expiry,
      cardholderName: body.name,
      isDefault: (user.paymentMethods?.length || 0) === 0
    }
    user.paymentMethods = [...(user.paymentMethods || []), newCard]
    MockDB.saveUser(user)
    return { success: true, user }
  },

  '/user/payment-methods/delete': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false }
    user.paymentMethods = user.paymentMethods?.filter(c => c.id !== body.id)
    MockDB.saveUser(user)
    return { success: true, user }
  },

  '/user/payment-methods/set-default': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return { success: false }
    user.paymentMethods = user.paymentMethods?.map(c => ({
      ...c,
      isDefault: c.id === body.id
    }))
    MockDB.saveUser(user)
    return { success: true, user }
  },

  '/user/support/cancel': (body: any) => {
    const user = MockDB.getActiveUser()
    if (!user) return false
    const history = MockDB.getHistory(user.id).map(h => {
      if (h.id === body.sessionId) {
        return { ...h, supportTicket: undefined }
      }
      return h
    })
    MockDB.saveHistory(user.id, history)
    return true
  }
}

export const dynamicRoutes = [
  {
    pattern: /^\/user\/profile$/,
    handler: (path: string, body: any) => {
      const user = MockDB.getActiveUser()
      if (!user) return { success: false }
      // 如果是 PUT 请求（通常 body 不为空）
      if (body) {
        const updated = { ...user, ...body }
        MockDB.saveUser(updated)
        return updated
      }
      return user
    }
  }
]

export const MOCK_HISTORY: PastSession[] = [
  {
    id: 'FLX-ORD-112',
    date: '2024-04-15 14:20',
    stationName: 'Tesla Supercharger - Downtown',
    connectorCode: '100001',
    kwh: 55.4,
    cost: 25.12,
    durationMins: 40,
    status: 'unpaid',
    paymentMethod: 'Pending',
  },
  {
    id: 'FLX-ORD-111',
    date: '2024-04-14 09:10',
    stationName: 'Highway Express DC',
    connectorCode: '500002',
    kwh: 42.1,
    cost: 32.50,
    durationMins: 35,
    status: 'paid',
    paymentMethod: 'Visa •••• 4242',
    refundTicket: {
      id: 'REF-77291',
      type: 'REFUND',
      status: 'resolved',
      reason: 'Billed twice due to app glitch.',
      createdAt: '2024-04-14 10:00',
      refundAmount: 32.50,
      adminResponse: 'We have processed the duplicate transaction refund. The credits have been returned to your Flux Wallet.',
      timeline: [
        { title: 'Refund Completed', time: '2024-04-14 11:30', description: 'Credits issued to wallet.' },
        { title: 'Approved', time: '2024-04-14 10:45' },
        { title: 'Applied', time: '2024-04-14 10:00' }
      ]
    }
  },
  {
    id: 'FLX-ORD-110',
    date: '2024-04-12 18:30',
    stationName: 'GreenMotion AC Hub',
    connectorCode: '200001',
    kwh: 12.5,
    cost: 4.38,
    durationMins: 120,
    status: 'paid',
    paymentMethod: 'Flux Wallet',
    supportTicket: {
      id: 'SUP-88291',
      type: 'SUPPORT',
      status: 'resolved',
      reason: 'Connector was difficult to unplug after session finished.',
      createdAt: '2024-04-12 21:00',
      adminResponse: 'We have dispatched a technician to check the locking mechanism of connector #200001. Thank you for your feedback.',
      timeline: [
        { title: 'Case Resolved', time: '2024-04-13 10:00', description: 'Technician confirmed fix.' },
        { title: 'Under Investigation', time: '2024-04-12 22:30' },
        { title: 'Request Submitted', time: '2024-04-12 21:00' }
      ]
    }
  },
  {
    id: 'FLX-ORD-109',
    date: '2024-04-10 12:45',
    stationName: 'City FastCharge Station',
    connectorCode: '300002',
    kwh: 44.2,
    cost: 23.00,
    durationMins: 35,
    status: 'paid',
    paymentMethod: 'Apple Pay',
    refundTicket: {
      id: 'REF-11029',
      type: 'REFUND',
      status: 'processing',
      reason: 'Charging speed was significantly lower than advertised (max 30kW vs 150kW).',
      createdAt: '2024-04-10 13:20',
      refundAmount: 11.50,
      timeline: [
        { title: 'Auditing', time: '2024-04-11 09:00', description: 'Finance team is reviewing the power logs.' },
        { title: 'Application Received', time: '2024-04-10 13:20' }
      ]
    }
  },
  {
    id: 'FLX-ORD-108',
    date: '2024-04-08 11:20',
    stationName: 'VoltPark - Maintenance',
    connectorCode: '400001',
    kwh: 18.2,
    cost: 5.10,
    durationMins: 50,
    status: 'paid',
    paymentMethod: 'Flux Wallet',
    supportTicket: {
      id: 'SUP-77012',
      type: 'SUPPORT',
      status: 'waiting_user',
      reason: 'The screen on the charger was blank, could only start via APP.',
      createdAt: '2024-04-08 12:00',
      adminResponse: 'We are sorry for the inconvenience. Could you please upload a photo of the charger screen so we can identify the hardware version?',
      timeline: [
        { title: 'Information Requested', time: '2024-04-09 10:00', description: 'Waiting for user to upload photo.' },
        { title: 'Under Review', time: '2024-04-08 14:00' }
      ]
    }
  },
  {
    id: 'FLX-ORD-107',
    date: '2024-04-05 19:10',
    stationName: 'Highway Express DC',
    connectorCode: '500001',
    kwh: 75.0,
    cost: 48.75,
    durationMins: 55,
    status: 'paid',
    paymentMethod: 'MasterCard •••• 8812',
    refundTicket: {
      id: 'REF-22091',
      type: 'REFUND',
      status: 'approved',
      reason: 'Overcharged due to system latency.',
      createdAt: '2024-04-05 20:00',
      refundAmount: 5.00,
      timeline: [
        { title: 'Refund Approved', time: '2024-04-06 15:00', description: 'Funds will be returned to your original payment method within 3-5 business days.' }
      ]
    }
  },
  {
    id: 'FLX-ORD-106',
    date: '2024-04-03 08:45',
    stationName: 'Downtown Power Hub',
    connectorCode: '100003',
    kwh: 33.5,
    cost: 15.08,
    durationMins: 30,
    status: 'paid',
    paymentMethod: 'Google Pay',
  },
  {
    id: 'FLX-ORD-105',
    date: '2024-03-30 14:00',
    stationName: 'GreenMotion AC Hub',
    connectorCode: '200005',
    kwh: 8.4,
    cost: 2.94,
    durationMins: 90,
    status: 'paid',
    paymentMethod: 'Flux Wallet',
    refundTicket: {
      id: 'REF-99102',
      type: 'REFUND',
      status: 'rejected',
      reason: 'Requested refund for perceived slow charging on AC hub.',
      createdAt: '2024-03-30 16:00',
      adminResponse: 'After reviewing the logs, the charging speed was consistent with the 11kW Type 2 standard for your vehicle. No technical fault was found.',
      timeline: [
        { title: 'Request Rejected', time: '2024-03-31 09:00' }
      ]
    }
  },
  {
    id: 'FLX-ORD-104',
    date: '2024-03-25 17:30',
    stationName: 'City FastCharge Station',
    connectorCode: '300001',
    kwh: 45.0,
    cost: 23.40,
    durationMins: 40,
    status: 'unpaid',
    paymentMethod: 'Failed',
  },
  {
    id: 'FLX-ORD-103',
    date: '2024-03-20 12:15',
    stationName: 'Community AC Pillar',
    connectorCode: '600001',
    kwh: 22.1,
    cost: 4.86,
    durationMins: 180,
    status: 'paid',
    paymentMethod: 'Flux Wallet',
    supportTicket: {
      id: 'SUP-11002',
      type: 'SUPPORT',
      status: 'withdrawn',
      reason: 'Wrong connector selected in app.',
      createdAt: '2024-03-20 13:00',
      timeline: [
        { title: 'User Withdrawn', time: '2024-03-20 13:15' }
      ]
    }
  },
  {
    id: 'FLX-ORD-102',
    date: '2024-03-15 10:00',
    stationName: 'Tesla Supercharger - Downtown',
    connectorCode: '100005',
    kwh: 68.2,
    cost: 30.69,
    durationMins: 45,
    status: 'paid',
    paymentMethod: 'Visa •••• 4242',
    refundTicket: {
      id: 'REF-55021',
      type: 'REFUND',
      status: 'failed',
      reason: 'Technical error during original checkout.',
      createdAt: '2024-03-15 11:00',
      adminResponse: 'Automatic refund attempt failed. Please contact your bank or update your card details.',
      timeline: [
        { title: 'Bank Failed', time: '2024-03-16 09:00', description: 'Transaction declined by issuer.' }
      ]
    }
  },
  {
    id: 'FLX-ORD-101',
    date: '2024-03-10 15:30',
    stationName: 'Highway Express DC',
    connectorCode: '500004',
    kwh: 30.0,
    cost: 19.50,
    durationMins: 20,
    status: 'paid',
    paymentMethod: 'Flux Wallet',
    supportTicket: {
      id: 'SUP-99082',
      type: 'SUPPORT',
      status: 'processing',
      reason: 'Parking space was blocked by non-EV vehicle.',
      createdAt: '2024-03-10 16:00',
      timeline: [
        { title: 'Investigating', time: '2024-03-10 17:00', description: 'Contacting site management to check CCTV.' }
      ]
    }
  }
]

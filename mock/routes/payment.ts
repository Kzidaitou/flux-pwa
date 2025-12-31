
import { MockDB } from './user'
import { PastSession } from '../../services/user/types'

export const routes = {
  '/payment/confirm': (body: any) => {
    const user = MockDB.getActiveUser()
    const { sessionId, amount, method, topUpAmount } = body
    
    if(user){
      // 1. 获取当前用户历史记录并寻找匹配订单
      let history = MockDB.getHistory(user.id)
      let sessionFound = false

      history = history.map(item => {
        // 关键修复：匹配 sessionId 并更新状态
        if (item.id === sessionId) {
          sessionFound = true
          return {
            ...item,
            status: 'paid' as const,
            paymentMethod: method === 'WALLET' ? 'Flux Wallet' : 'Credit Card'
          }
        }
        return item
      })

      // 2. 如果是实时会话（即不在历史库中），则创建一条新的已支付记录
      if (!sessionFound) {
        const newSession: PastSession = {
          id: sessionId || `h_${Date.now()}`,
          date: new Date().toLocaleString('en-GB', { hour12: false }).replace(',', ''),
          stationName: (body as any).stationName || 'Flux Power Hub',
          connectorCode: (body as any).connectorCode || '101',
          kwh: (amount || 0) * 2.2,
          cost: amount || 0,
          durationMins: 30,
          status: 'paid',
          paymentMethod: method === 'WALLET' ? 'Flux Wallet' : 'Credit Card',
        }
        history = [newSession, ...history]
      }

      // 3. 处理余额扣除/充值
      if (topUpAmount && topUpAmount > 0) {
        user.balance += topUpAmount
      }
      
      if (method === 'WALLET') {
        user.balance -= (amount || 0)
      }

      // 4. 保存到 MockDB
      MockDB.saveHistory(user.id, history)
      MockDB.saveUser(user)
      MockDB.setActiveUser(user)

      return { 
        success: true, 
        transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
        newBalance: user.balance
      }
    } else{
      return { success: false, code: 'USER_NOT_FOUND', message: 'User not found.' }
    }
  },

  '/payment/topup': (body: any) => {
    const user = MockDB.getActiveUser()
    if(user){
      const newBalance = user.balance + (body?.amount || 0)
      user.balance = newBalance
      
      MockDB.setActiveUser(user)
      MockDB.saveUser(user)
      return { success: true, newBalance }
    }  else{
      return { success: false, code: 'USER_NOT_FOUND', message: 'User not found.' }
    }
    
  },
}

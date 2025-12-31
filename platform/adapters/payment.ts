import { PaymentAdapter } from '../types'

// Web Payment Adapter (using Web Payment API or mock)
class WebPaymentAdapter implements PaymentAdapter {
  async requestPayment(params: {
    amount: number
    orderId: string
    description: string
  }): Promise<{ success: boolean; transactionId?: string }> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(
        `Payment Request:\n${params.description}\nAmount: $${params.amount.toFixed(2)}\n\nConfirm payment?`
      )
      if (confirmed) {
        resolve({
          success: true,
          transactionId: `web_${Date.now()}`,
        })
      } else {
        resolve({ success: false })
      }
    })
  }
}

// Factory function to get the appropriate payment adapter
export function getPaymentAdapter(): PaymentAdapter {
  return new WebPaymentAdapter()
}

// Singleton instance
let paymentInstance: PaymentAdapter | null = null

export function getPayment(): PaymentAdapter {
  if (!paymentInstance) {
    paymentInstance = getPaymentAdapter()
  }
  return paymentInstance
}
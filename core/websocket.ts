/**
 * Core WebSocket Service
 * 模拟标准的 WebSocket 行为
 */
export type SocketCallback = (data: any) => void

export class MockChargingSocket {
  private sessionId: string
  private onOpen?: SocketCallback
  private onMessage?: SocketCallback
  private onClose?: SocketCallback
  private intervalId?: any
  private isConnected: boolean = false

  private batteryLevel: number = 24
  private kwhDelivered: number = 0
  private cost: number = 0

  constructor(sessionId: string) {
    this.sessionId = sessionId
  }

  connect(callbacks: { onOpen?: SocketCallback; onMessage?: SocketCallback; onClose?: SocketCallback }) {
    this.onOpen = callbacks.onOpen
    this.onMessage = callbacks.onMessage
    this.onClose = callbacks.onClose

    setTimeout(() => {
      this.isConnected = true
      this.onOpen?.({ status: 'connected', sessionId: this.sessionId })
      this.startDataPush()
    }, 800)
  }

  private startDataPush() {
    this.intervalId = setInterval(() => {
      if (!this.isConnected) return

      const currentPower = this.batteryLevel > 80 
        ? 25 + Math.random() * 2 
        : 120 + Math.random() * 5

      const kwhAdded = currentPower / 3600
      this.kwhDelivered += kwhAdded
      this.batteryLevel += (kwhAdded / 75) * 100
      this.cost += kwhAdded * 0.45

      if (this.batteryLevel >= 100) {
        this.batteryLevel = 100
        this.pushMessage('completed')
        this.disconnect()
      } else {
        this.pushMessage('charging', currentPower)
      }
    }, 1000)
  }

  private pushMessage(status: 'charging' | 'completed', power: number = 0) {
    this.onMessage?.({
      type: 'STATUS_UPDATE',
      data: {
        sessionId: this.sessionId,
        status,
        batteryLevel: Number(this.batteryLevel.toFixed(1)),
        kwhDelivered: Number(this.kwhDelivered.toFixed(3)),
        currentPower: Number(power.toFixed(1)),
        cost: Number(this.cost.toFixed(2)),
        timestamp: Date.now()
      }
    })
  }

  disconnect() {
    this.isConnected = false
    if (this.intervalId) clearInterval(this.intervalId)
    this.onClose?.({ code: 1000, reason: 'Normal Closure' })
  }

  send(message: any) {
    console.log(`[WS Send] Session ${this.sessionId}:`, message)
  }
}

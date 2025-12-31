
import React, { useState, useEffect } from 'react'
import { ChargingSession } from '../../types/modules/charging'
import { User } from '../../types/modules/user'
import { Wallet, CreditCard, Apple, Loader2, Zap } from 'lucide-react'
import ModalWrapper from '../modal-wrapper'
import { api } from '../../core/request'
import { formatCurrency } from '../../utils'
import Icon from '../ui/Icon'

interface PaymentModalProps {
  session: ChargingSession
  user: User
  onPay: (topUpAmount?: number) => void
  onClose: () => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ session, user, onPay, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [selectedMethod, setSelectedMethod] = useState<string>('WALLET')

  useEffect(() => {
    const defaultCard = user.paymentMethods?.find(c => c.isDefault) || user.paymentMethods?.[0]
    if (user.balance < session.cost && defaultCard) {
      setSelectedMethod(defaultCard.id)
    }
  }, [user.paymentMethods, user.balance, session.cost])

  const energyDisplay = session.kwhDelivered !== undefined ? session.kwhDelivered.toFixed(1) : (session as any).kwh || '0.0'
  const insufficientFunds = user.balance < session.cost
  const neededAmount = session.cost - user.balance
  const recommendedTopUp = Math.ceil(neededAmount / 5) * 5

  const getCheckoutMethods = () => {
    const methods: any[] = [
      { 
        id: 'WALLET', 
        label: 'Flux Wallet', 
        icon: <Wallet size={20} />, 
        sub: `Available: ${formatCurrency(user.balance)}`,
        warning: insufficientFunds
      }
    ]

    if (user.paymentMethods) {
      user.paymentMethods.forEach(card => {
        methods.push({
          id: card.id,
          label: `${card.type} Account`,
          icon: <CreditCard size={20} />,
          sub: `•••• ${card.last4}`
        })
      })
    }

    const nativeMethods = [
      { id: 'APPLE', label: 'Apple Pay', icon: <Apple size={20} />, sub: 'Quick Checkout', hidden: true },
      { id: 'WECHAT', label: 'WeChat Pay', icon: <Icon name="message-circle" size={20} />, sub: 'Secure Payment', hidden: true },
      { id: 'ALIPAY', label: 'Alipay', icon: <Icon name="shield" size={20} />, sub: 'Instant Transfer', hidden:true },
    ].filter(m => !m.hidden)

    return [...methods, ...nativeMethods]
  }

  const checkoutMethods = getCheckoutMethods()

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const isWallet = selectedMethod === 'WALLET'
      await api.post('/payment/confirm', {
        sessionId: session.id,
        amount: session.cost,
        method: isWallet ? 'WALLET' : 'CARD',
        cardId: !isWallet ? selectedMethod : undefined,
        topUpAmount: isWallet && insufficientFunds ? recommendedTopUp : 0,
      })
      if (isWallet && insufficientFunds) onPay(recommendedTopUp)
      else onPay()
      onClose()
    } catch (error) {
      setIsProcessing(false)
    }
  }

  return (
    <ModalWrapper onClose={onClose} title="Checkout">
      <div className="flex flex-col space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-inner">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
               <Zap size={20} fill="currentColor" />
             </div>
             <div className="min-w-0">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Service Point</p>
               <p className="text-sm font-black truncate">{(session as any).stationName || 'Flux Power Hub'}</p>
             </div>
           </div>
           <div className="flex justify-between items-end">
             <div className="space-y-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Efficiency Metrics</p>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{energyDisplay} kWh</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{formatCurrency(session.cost)}</p>
             </div>
           </div>
        </div>

        <div className="space-y-2.5">
          {checkoutMethods.map((m) => (
            <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={`w-full p-4 rounded-[1.5rem] border-2 flex items-center justify-between transition-all ${selectedMethod === m.id ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : 'bg-white dark:bg-surface border-gray-100 dark:border-gray-800'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${selectedMethod === m.id ? 'bg-primary border-primary text-dark shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-transparent opacity-60'}`}>{m.icon}</div>
                <div className="text-left min-w-0">
                  <p className="font-black text-sm tracking-tight leading-none mb-1.5">{m.label}</p>
                  <p className={`text-[10px] font-bold uppercase truncate ${m.warning && selectedMethod === 'WALLET' ? 'text-red-500' : 'text-gray-400'}`}>{m.sub}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === m.id ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}>{selectedMethod === m.id && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-in zoom-in"></div>}</div>
            </button>
          ))}
        </div>

        <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg">
          {isProcessing ? <Loader2 className="animate-spin" size={24} /> : (selectedMethod === 'WALLET' && insufficientFunds ? `RELOAD & PAY` : `AUTHORIZE PAYMENT`)}
        </button>
      </div>
    </ModalWrapper>
  )
}

export default PaymentModal

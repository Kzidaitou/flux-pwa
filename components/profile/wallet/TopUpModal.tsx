
import React, { useState, useEffect } from 'react'
import { CreditCard, Apple, Check, ChevronLeft } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { TopUpModalProps } from '../../../types/modules/user'
import { formatCurrency } from '../../../utils'
import Icon from '../../ui/Icon'
import { useUser } from '../../../context/UserContext'

const TopUpModal: React.FC<TopUpModalProps & { onConfirmTopUp: (amount: number, method: string) => Promise<void> }> = ({ 
  balance, 
  onConfirmTopUp, 
  onClose 
}) => {
  const { user } = useUser()
  
  const [step, setStep] = useState<'AMOUNT' | 'METHOD' | 'SUCCESS'>('AMOUNT')
  const [amount, setAmount] = useState<number | ''>(20)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<string>('CARD')
  const [isProcessing, setIsProcessing] = useState(false)

  const PRESETS = [10, 20, 50, 100]
  const finalAmount = amount === '' ? parseFloat(customAmount) : amount

  const getAvailableMethods = () => {
    const baseMethods = [
      { id: 'APPLE', label: 'Apple Pay', icon: <Apple size={20} />, sub: 'Quick Checkout', hidden: true },
      { id: 'WECHAT', label: 'WeChat Pay', icon: <Icon name="message-circle" size={20} />, sub: 'Secure Payment', hidden:true },
      { id: 'ALIPAY', label: 'Alipay', icon: <Icon name="shield" size={20} />, sub: 'Instant Transfer', hidden: true },
    ].filter(m => !m.hidden)

    const savedCards = (user?.paymentMethods || []).map(card => ({
      id: card.id,
      label: `${card.type} Account`,
      icon: <CreditCard size={20} />,
      sub: `•••• ${card.last4}`,
      isDefault: card.isDefault
    }))

    const fallback = savedCards.length === 0 ? [{ id: 'CARD', label: 'Card', icon: <CreditCard size={20} />, sub: 'One-time payment' }] : []
    return [...baseMethods, ...savedCards, ...fallback]
  }

  const paymentMethods = getAvailableMethods()

  useEffect(() => {
    const defaultMethod = paymentMethods.find(m => (m as any).isDefault) || paymentMethods[0]
    if (defaultMethod) setSelectedMethod(defaultMethod.id)
  }, [user?.paymentMethods])

  const handlePay = async () => {
    setIsProcessing(true)
    try {
      await onConfirmTopUp(Number(finalAmount), selectedMethod)
      setStep('SUCCESS')
      setTimeout(() => onClose(), 2000)
    } catch (e) {
      setIsProcessing(false)
    }
  }

  if (step === 'SUCCESS') {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-dark mb-8">
             <Check size={48} strokeWidth={4} />
          </div>
          <h3 className="text-3xl font-black mb-2">Reload Complete</h3>
          <p className="text-4xl font-black text-primary">{formatCurrency(balance + Number(finalAmount))}</p>
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose} title={step === 'AMOUNT' ? 'Add Funds' : 'Confirm'}>
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-6">
        {step === 'AMOUNT' ? (
          <div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 mb-8 text-center border">
              <h2 className="text-5xl font-black tracking-tighter text-primary">{formatCurrency(balance)}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PRESETS.map(amt => (
                <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(''); }} className={`py-5 rounded-2xl border-2 font-black text-xl ${amount === amt ? 'border-primary bg-primary/10' : 'border-gray-100'}`}>${amt}</button>
              ))}
            </div>
            <button disabled={!finalAmount || Number(finalAmount) <= 0} onClick={() => setStep('METHOD')} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem]">PROCEED</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setStep('AMOUNT')} className="flex items-center gap-1.5 text-gray-500 font-black text-[10px] uppercase mb-6"><ChevronLeft size={14} /> Back</button>
            <div className="space-y-3">
              {paymentMethods.map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between ${selectedMethod === m.id ? 'border-secondary bg-secondary/5' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">{m.icon}</div>
                    <div><p className="font-black text-sm">{m.label}</p></div>
                  </div>
                </button>
              ))}
            </div>
            <button disabled={isProcessing} onClick={handlePay} className="w-full mt-10 bg-gray-900 dark:bg-white text-white dark:text-dark font-black py-5 rounded-[1.5rem]">
              {isProcessing ? 'AUTHORIZING...' : 'CONFIRM & PAY'}
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}

export default TopUpModal

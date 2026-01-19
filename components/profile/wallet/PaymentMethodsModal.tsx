import React, { useState } from 'react'
import {
  Trash2,
  CreditCard as CardIcon,
  Plus,
  ArrowLeft,
  Check,
  Loader2,
  CreditCard,
} from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { PaymentMethodsModalProps } from '../../../types/modules/user'
import { formatCurrency } from '../../../utils'
import { userApi } from '../../../services/user'
import { useUser } from '../../../context/UserContext'
import { useUI } from '../../../context/UIContext'

const CARD_TYPES = [
  { id: 'Visa', color: 'bg-blue-600' },
  { id: 'MasterCard', color: 'bg-orange-500' },
  { id: 'Amex', color: 'bg-cyan-600' },
  { id: 'Discovery', color: 'bg-orange-400' },
]

const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({ balance, onClose }) => {
  const { user, updateUser } = useUser()
  const { showToast } = useUI()
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [cardType, setCardType] = useState('Visa')
  const [last4, setLast4] = useState('')
  const [expiry, setExpiry] = useState('')
  const [name, setName] = useState(user?.name || '')

  const cards = user?.paymentMethods || []

  const handleRemoveCard = async (id: string) => {
    try {
      const res = await userApi.deletePaymentMethod(id)
      if (res.success) {
        updateUser(res.user)
        showToast('Card removed successfully', 'info')
      }
    } catch (e) {
      showToast('Failed to remove card', 'error')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await userApi.setDefaultPaymentMethod(id)
      if (res.success) {
        updateUser(res.user)
        showToast('Default payment updated', 'success')
      }
    } catch (e) {}
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (last4.length !== 4) {
      showToast('Please enter the last 4 digits', 'warning')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await userApi.addPaymentMethod({
        type: cardType,
        last4,
        expiry,
        name,
      })
      if (res.success) {
        updateUser(res.user)
        showToast('New card linked successfully', 'success')
        setIsAdding(false)
        // Reset form
        setLast4('')
        setExpiry('')
      }
    } catch (e) {
      showToast('System busy, try again later', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper onClose={onClose} title={isAdding ? 'Link New Card' : 'Payment Methods'}>
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-6">
        {isAdding ? (
          /* ADD CARD FORM VIEW */
          <form
            onSubmit={handleAddCard}
            className="space-y-8 animate-in slide-in-from-right-4 duration-300"
          >
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest mb-2"
            >
              <ArrowLeft size={14} /> Back to list
            </button>

            <div className="space-y-6">
              {/* Card Type Selector */}
              <div>
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-2 mb-3 block">
                  Card Issuer
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CARD_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCardType(type.id)}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        cardType === type.id
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-dark hover:border-gray-200'
                      }`}
                    >
                      <span
                        className={`text-xs font-black ${
                          cardType === type.id ? 'text-primary' : 'text-gray-500'
                        }`}
                      >
                        {type.id}
                      </span>
                      {cardType === type.id && (
                        <Check size={14} className="text-primary" strokeWidth={4} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 mb-1 block">
                    Full Name on Card
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 font-bold focus:border-primary outline-none transition-all"
                    placeholder="e.g. JOHN DOE"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 mb-1 block">
                      Last 4 Digits
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={last4}
                      onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 font-mono font-bold focus:border-primary outline-none transition-all"
                      placeholder="0000"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2 mb-1 block">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      maxLength={5}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4)
                        setExpiry(val)
                      }}
                      className="w-full bg-gray-50 dark:bg-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 font-mono font-bold focus:border-primary outline-none transition-all"
                      placeholder="12/25"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || last4.length < 4 || expiry.length < 5}
                className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-2xl shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check size={20} strokeWidth={3} />
                )}
                {isSubmitting ? 'SECURELY LINKING...' : 'CONFIRM & LINK CARD'}
              </button>
              <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4 opacity-50">
                PCI-DSS Compliant Handshake
              </p>
            </div>
          </form>
        ) : (
          /* LIST VIEW */
          <div className="space-y-8 animate-in fade-in duration-500">
            <section>
              <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4 ml-2">
                Flux Credits
              </h4>
              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 rounded-[2.5rem] flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                    Available Funds
                  </p>
                  <p className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {formatCurrency(balance)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4 ml-2">
                <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  Stored Cards
                </h4>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} strokeWidth={3} /> Add New
                </button>
              </div>

              {cards.length === 0 ? (
                <div className="bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[2rem] p-10 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <CreditCard size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No cards linked yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-5 rounded-[2rem] border-2 transition-all group ${
                        card.isDefault
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                              card.isDefault
                                ? 'bg-primary text-dark border-primary'
                                : 'bg-gray-50 dark:bg-dark text-gray-400 border-gray-100 dark:border-gray-800'
                            }`}
                          >
                            <CardIcon size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-black text-sm uppercase tracking-tight">
                                {card.type} Account
                              </p>
                              {card.isDefault && (
                                <span className="text-[7px] font-black bg-primary text-dark px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-xs text-gray-400 mt-0.5">
                              •••• •••• •••• {card.last4}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!card.isDefault && (
                            <button
                              onClick={() => handleSetDefault(card.id)}
                              className="text-[9px] font-black text-secondary uppercase tracking-widest px-3 py-1 hover:bg-secondary/10 rounded-lg transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            title="Remove Card"
                            onClick={() => handleRemoveCard(card.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <p className="text-center text-[9px] text-gray-400 font-bold mt-4 uppercase tracking-[0.3em] opacity-40">
              Encrypted via Flux Security Bridge
            </p>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}

export default PaymentMethodsModal

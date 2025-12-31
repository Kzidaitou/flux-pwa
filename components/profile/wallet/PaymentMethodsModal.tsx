
import React from 'react'
import { Trash2, CreditCard as CardIcon} from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { PaymentMethodsModalProps } from '../../../types/modules/user'
import { formatCurrency } from '../../../utils'
import { userApi } from '../../../services/user'
import { useUser } from '../../../context/UserContext'

const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({ balance, onClose }) => {
  const { user, updateUser } = useUser()
  const cards = user?.paymentMethods || []

  const removeCard = async (id: string) => {
    try {
      const res = await userApi.deletePaymentMethod(id)
      if (res.success) updateUser(res.user)
    } finally {
    }
  }

  const setDefault = async (id: string) => {
    const res = await userApi.setDefaultPaymentMethod(id)
    if (res.success) updateUser(res.user)
  }

  return (
    <ModalWrapper onClose={onClose} title="Payments">
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-6">
        <div className="space-y-8">
            <section>
              <h4 className="text-[10px] text-gray-400 font-black uppercase mb-4 ml-2">Flux Wallet</h4>
              <div className="bg-primary/5 border border-primary/10 p-5 rounded-[2rem] flex justify-between items-center">
                 <p className="font-black">Stored Credits</p>
                 <p className="font-mono">{formatCurrency(balance)}</p>
              </div>
            </section>
            <section>
              <h4 className="text-[10px] text-gray-400 font-black uppercase mb-4 ml-2">Linked Cards</h4>
              <div className="space-y-3">
                {cards.map(card => (
                  <div key={card.id} className={`p-5 rounded-[2rem] border-2 ${card.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardIcon size={24} className="text-gray-400" />
                        <div><p className="font-black text-sm uppercase">{card.type} •••• {card.last4}</p></div>
                      </div>
                      <div className="flex gap-2">
                        {!card.isDefault && <button onClick={() => setDefault(card.id)} className="text-[9px] font-black text-secondary">Set Default</button>}
                        <button title='Remove Card' onClick={() => removeCard(card.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default PaymentMethodsModal

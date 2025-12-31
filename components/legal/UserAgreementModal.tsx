
import React from 'react'
import { Zap, CreditCard, ShieldAlert, Scale } from 'lucide-react'
import ModalWrapper from '../modal-wrapper'

interface UserAgreementModalProps {
  onClose: () => void
}

const UserAgreementModal: React.FC<UserAgreementModalProps> = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose} title="User Agreement">
      <div className="flex flex-col gap-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
        
        <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10">
          <p className="font-bold text-primary leading-relaxed">
            Welcome to Flux. By accessing our charging network, you enter into a binding agreement to follow our safety and billing protocols.
          </p>
        </div>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-4 text-base uppercase tracking-tight">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Zap size={18} /></div>
            1. Charging Services
          </h4>
          <p className="pl-1">Users are responsible for ensuring their vehicle is compatible with the selected connector. Flux is not liable for damages caused by faulty vehicle inlets or unauthorized adapters.</p>
        </section>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-4 text-base uppercase tracking-tight">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><CreditCard size={18} /></div>
            2. Billing & Idle Fees
          </h4>
          <p className="pl-1">Fees are calculated based on energy delivered (kWh) and time occupied. Idle fees apply 10 minutes after charging completes to ensure network availability for all users.</p>
        </section>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-4 text-base uppercase tracking-tight">
            <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><ShieldAlert size={18} /></div>
            3. Safety Protocols
          </h4>
          <p className="pl-1">Smoking, open flames, or tampering with equipment at Flux stations is strictly prohibited. Violations will result in immediate account termination and potential legal action.</p>
        </section>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-4 text-base uppercase tracking-tight">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Scale size={18} /></div>
            4. Service Availability
          </h4>
          <p className="pl-1">Flux provides the network "as-is". While we strive for 99.9% uptime, we do not guarantee immediate availability of any specific charging point at all times.</p>
        </section>
      </div>
    </ModalWrapper>
  )
}

export default UserAgreementModal


import React from 'react'
import { Lock, Database } from 'lucide-react'
import ModalWrapper from '../modal-wrapper'
import { PrivacyModalProps } from '../../types/modules/user'

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose} title="Privacy Policy">
      <div className="flex flex-col gap-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-7 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-inner">
          <p className="font-black text-gray-900 dark:text-white mb-3 uppercase text-[10px] tracking-[0.3em] opacity-50">
            Last Updated: Oct 2024
          </p>
          <p className="font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
            Flux ("we", "our", or "us") respects your digital footprint. This policy outlines how we treat your personal data with extreme care.
          </p>
        </div>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-5 text-base uppercase tracking-tight">
            <div className="p-2.5 bg-blue-500/10 rounded-2xl text-blue-500"><Database size={20} /></div>
            Core Data Collection
          </h4>
          <div className="space-y-4 pl-1">
            <div className="flex gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2.5 group-hover:scale-150 transition-transform"></div>
              <p><strong className="text-gray-900 dark:text-white font-black">Identity:</strong> Essential information like your registered email and vehicle identifier.</p>
            </div>
            <div className="flex gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2.5 group-hover:scale-150 transition-transform"></div>
              <p><strong className="text-gray-900 dark:text-white font-black">Location:</strong> GPS coordinates to calculate distances and find nearby charging points.</p>
            </div>
          </div>
        </section>

        <section>
          <h4 className="flex items-center gap-3 font-black text-gray-900 dark:text-white mb-5 text-base uppercase tracking-tight">
            <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-500"><Lock size={20} /></div>
            Security Infrastructure
          </h4>
          <p className="font-medium text-gray-500 dark:text-gray-400 pl-1">
            Industry-standard encryption is applied to all sensitive data. Flux undergoes regular security audits to protect against unauthorized access.
          </p>
        </section>

        <div className="bg-gray-100 dark:bg-gray-800/40 p-8 rounded-[2.5rem] text-center border border-gray-200 dark:border-gray-700/50">
          <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Legal Inquiries</p>
          <p className="font-black text-primary text-lg">privacy@flux.app</p>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default PrivacyModal

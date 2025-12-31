
import React, { useState } from 'react'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { SetPasswordModalProps } from '../../../types/modules/user'

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ user, onUpdateUser, onBack, onClose, onShowAlert }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const isLengthValid = newPassword.length >= 6
  const isMatch = newPassword === confirmPassword && confirmPassword !== ''

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLengthValid) { onShowAlert('Weak Password', 'Minimum 6 characters required.', 'warning'); return; }
    if (!isMatch) { onShowAlert('Error', 'Passwords do not match.', 'error'); return; }
    onUpdateUser({ hasPassword: true })
    onShowAlert('Success', 'Security password updated.', 'success')
    onBack()
  }

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSetPassword} className="flex flex-col h-full text-gray-900 dark:text-white pb-8">
        <button type="button" onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
        <h3 className="text-2xl font-black mb-8">{user.hasPassword ? 'Change Password' : 'Set Password'}</h3>
        <div className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 py-4 focus:border-primary outline-none" placeholder="New Password" required />
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full bg-gray-50 dark:bg-dark border rounded-2xl pl-12 py-4 focus:border-primary outline-none ${confirmPassword && !isMatch ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`} placeholder="Confirm Password" required />
          </div>
        </div>
        <div className="mt-auto pt-10">
          <button type="submit" disabled={!isMatch || !isLengthValid} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] disabled:opacity-40">UPDATE PASSWORD</button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default SetPasswordModal

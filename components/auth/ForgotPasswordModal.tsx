
import React, { useState } from 'react'
import { Mail, ArrowRight, Loader2, KeyRound, Lock, ShieldCheck, Check, AlertCircle, Eye, EyeOff, XCircle } from 'lucide-react'
import ModalWrapper from '../modal-wrapper'
import { api } from '../../core/request'

interface ForgotPasswordModalProps {
  onClose: () => void
  onShowToast: (message: string, type: 'success' | 'error' | 'warning') => void
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onShowToast }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'EMAIL' | 'CODE' | 'RESET'>('EMAIL')
  
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPassValid = newPassword.length >= 6
  const isMatch = newPassword === confirmPassword && confirmPassword !== ''
  const canReset = isPassValid && isMatch && code.length === 6

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !validateEmail(email)) {
      onShowToast('Please enter a valid email address', 'error');
      return;
    }
    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', { email }, { requireAuth: false })
      setStep('CODE')
      onShowToast('Verification code sent to your email', 'success')
    } catch (error) {
      console.error('Failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) setStep('RESET')
    else onShowToast('Please enter a 6-digit code', 'warning')
  }

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canReset) return
    setIsLoading(true)
    try {
      await api.post('/auth/reset-password', { email, code, newPassword }, { requireAuth: false })
      onShowToast('Password reset successful!', 'success')
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-8">
        <div className="flex items-center gap-4 mb-10 mt-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <KeyRound size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight uppercase">Account Recovery</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Step {step === 'EMAIL' ? '1' : step === 'CODE' ? '2' : '3'} of 3</p>
          </div>
        </div>

        {step === 'EMAIL' && (
          <form onSubmit={handleSendLink} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-1">
              Enter your registered email address to receive a verification code.
            </p>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-12 py-5 font-bold focus:border-primary outline-none transition-all shadow-inner" required />
              {email && (
                <button type="button" title="Clear email" onClick={() => setEmail('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <XCircle size={18} />
                </button>
              )}
            </div>
            <button title="Request reset code" type="submit" disabled={isLoading || !validateEmail(email)} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-xl shadow-green-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" /> : <>SEND CODE <ArrowRight size={18} strokeWidth={3} /></>}
            </button>
          </form>
        )}

        {step === 'CODE' && (
          <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-1">
              Enter the 6-digit code sent to <span className="text-gray-900 dark:text-white font-black">{email}</span>.
            </p>
            <div className="relative">
              <input type="text" value={code} maxLength={6} inputMode="numeric" onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-800 rounded-2xl py-6 text-center text-4xl font-mono font-black tracking-[0.5em] focus:border-primary outline-none shadow-inner" required />
              {code && (
                <button type="button" title="Clear code" onClick={() => setCode('')} className="absolute right-4 bottom-2 text-gray-400 hover:text-gray-600">
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button title="Verify code and continue" type="submit" disabled={code.length < 6} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-xl shadow-green-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-40">
              NEXT STEP <ArrowRight size={18} strokeWidth={3} />
            </button>
            <button title="Change email address" type="button" onClick={() => setStep('EMAIL')} className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Change Email</button>
          </form>
        )}

        {step === 'RESET' && (
          <form onSubmit={handleFinalReset} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-1">Create a secure new password.</p>
            <div className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className={`w-full bg-gray-50 dark:bg-dark border rounded-2xl pl-12 pr-20 py-5 font-bold focus:border-primary outline-none transition-all ${newPassword && !isPassValid ? 'border-red-500/50' : 'border-gray-100 dark:border-gray-800'}`} required />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {newPassword && (
                    <button type="button" title="Clear password" onClick={() => setNewPassword('')} className="text-gray-400 hover:text-gray-600">
                      <XCircle size={18} />
                    </button>
                  )}
                  <button title={showNew ? "Hide password" : "Show password"} type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400 hover:text-white">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className={`w-full bg-gray-50 dark:bg-dark border rounded-2xl pl-12 pr-24 py-5 font-bold focus:border-primary outline-none transition-all ${confirmPassword && !isMatch ? 'border-red-500/50' : isMatch ? 'border-primary/50' : 'border-gray-100 dark:border-gray-800'}`} required />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {confirmPassword && !isMatch && (
                    <button type="button" title="Clear confirmation" onClick={() => setConfirmPassword('')} className="text-gray-400 hover:text-gray-600">
                      <XCircle size={18} />
                    </button>
                  )}
                  {isMatch && <Check size={20} className="text-primary animate-in zoom-in" />}
                  <button title={showConfirm ? "Hide password" : "Show password"} type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-white">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            {confirmPassword && !isMatch && <p className="text-[10px] text-red-500 font-black uppercase mt-2 tracking-tighter ml-2 flex items-center gap-1"><AlertCircle size={10} /> Passwords do not match</p>}
            <button title="Complete password reset" type="submit" disabled={isLoading || !canReset} className="w-full bg-primary text-dark font-black py-5 rounded-[1.5rem] shadow-xl shadow-green-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-40">
              {isLoading ? <Loader2 className="animate-spin" /> : <>RESET PASSWORD <Check size={18} strokeWidth={3} /></>}
            </button>
          </form>
        )}
      </div>
    </ModalWrapper>
  )
}

export default ForgotPasswordModal

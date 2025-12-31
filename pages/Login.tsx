
import React, { useState, useEffect, useRef } from 'react'
import { Zap, Loader2, Mail, Lock, User as UserIcon, ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2, Circle, ArrowLeft, Link as LinkIcon, AlertCircle, XCircle } from 'lucide-react'
import { LoginProps } from '../types/modules/auth'
import { authApi } from '../services'
import { getSocialAuthAdapter } from '../platform'
import Icon from '../components/ui/Icon'

const Login: React.FC<LoginProps> = ({ onLogin, onShowAlert, onShowToast, onForgotPassword, onOpenPrivacy, onOpenAgreement }) => {
  // ... 逻辑保持不变
  const [isSignUp, setIsSignUp] = useState(false)
  const [isBinding, setIsBinding] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const [socialContext, setSocialContext] = useState<{provider: any, socialToken: string} | null>(null)
  const [isOtpLoading, setIsOtpLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSwitchMode = (targetSignUp: boolean) => {
    if (targetSignUp === isSignUp) return
    setIsSignUp(targetSignUp)
    setPassword('')
    setConfirmPassword('')
    setName('')
    setCode('')
    setAgreed(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Include a number', met: /\d/.test(password) },
    { label: 'Special character (@$!%*?)', met: /[@$!%*?&#]/.test(password) }
  ]
  const isPasswordValid = passwordRequirements.every(r => r.met)
  const isMatch = password === confirmPassword && confirmPassword !== ''
  const hasInputConfirm = confirmPassword.length > 0
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      onShowToast('Please enter a valid email', 'warning')
      return
    }
    setIsOtpLoading(true)
    try {
      await authApi.sendOtp(email)
      onShowToast('Verification code sent!', 'success')
      startCountdown()
    } catch (err: any) {} finally {
      setIsOtpLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    try {
      let response;
      if (isBinding && socialContext) {
        response = await authApi.bindSocialEmail({ ...socialContext, email, code, name: email.split('@')[0] })
      } else if (isSignUp) {
        response = await authApi.register({ email, code, password, name })
      } else {
        response = await authApi.login({ email, password })
      }
      localStorage.setItem('access_token', response.token)
      onLogin({ provider: 'email', email: response.user.email, name: response.user.name })
    } catch (err: any) {
      onShowAlert('Error', err.message || 'Authentication failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    try {
      const adapter = getSocialAuthAdapter()
      const socialRes = await adapter.login(provider)
      const res = await authApi.socialAuth({ provider: socialRes.provider, socialToken: socialRes.token, email: socialRes.email, name: socialRes.name })
      if (res.needsEmail) {
        setSocialContext({ provider: socialRes.provider, socialToken: socialRes.token })
        setEmail(socialRes.email || '')
        setIsBinding(true)
      } else {
        localStorage.setItem('access_token', res.token)
        onLogin({ provider: res.user.linkedAccounts[0] as any, email: res.user.email, name: res.user.name })
      }
    } catch (err: any) {
      if (err.message !== 'USER_CANCELLED') onShowToast(err.message || 'Social auth failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isBinding) {
    return (
      <div className="flex flex-col h-full bg-dark px-8 pt-safe pb-10">
        <button title="Cancel account binding" onClick={() => setIsBinding(false)} className="mt-8 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={16} /> Cancel Binding
        </button>
        <div className="mt-12 mb-10 text-center">
          <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary mb-4 border border-primary/20"><LinkIcon size={32} /></div>
          <h2 className="text-2xl font-black text-white tracking-tight">Link Your Email</h2>
          <p className="text-gray-500 text-xs mt-2 font-bold px-8">Complete security setup for {socialContext?.provider}</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input title="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-12 py-4 text-white font-bold outline-none" placeholder="Enter your email" required />
            {email && (
              <button type="button" title="Clear email" onClick={() => setEmail('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                <XCircle size={18} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input title="Verification Code" type="text" value={code} maxLength={6} inputMode="numeric" onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-10 py-4 text-white font-mono font-bold outline-none" placeholder="6-digit code" required />
              {code && (
                <button type="button" title="Clear code" onClick={() => setCode('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button title="Send verification code" type="button" disabled={countdown > 0 || isOtpLoading || !validateEmail(email)} onClick={handleSendOtp} className="px-5 rounded-2xl bg-gray-800 text-white font-black text-[10px] border border-gray-700 active:scale-95 disabled:opacity-30 transition-all">
              {isOtpLoading ? <Loader2 size={16} className="animate-spin" /> : countdown > 0 ? `${countdown}S` : 'SEND'}
            </button>
          </div>
          <button title="Confirm and link account" type="submit" disabled={isLoading || code.length < 6 || !email} className="w-full bg-primary text-dark font-black py-5 rounded-2xl shadow-xl shadow-green-500/10 active:scale-95 transition-all flex items-center justify-center gap-3 text-base mt-8 group disabled:opacity-40">
            {isLoading ? <Loader2 className="animate-spin" /> : <>COMPLETE SETUP <ArrowRight size={18} strokeWidth={3} /></>}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-dark px-8 pt-safe pb-10 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center mt-12 mb-10">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 border border-primary/20 shadow-xl shadow-green-500/5 rotate-3">
          <Zap size={32} className="text-primary -rotate-3" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter">FLUX<span className="text-primary">.</span></h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-1.5 opacity-60">Energy Network</p>
      </div>

      <div className="w-full max-w-sm mx-auto mb-8 bg-surface/50 p-1 rounded-2xl border border-gray-800 flex relative">
        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-xl transition-all duration-500 ease-out ${isSignUp ? 'left-[calc(50%+2px)]' : 'left-1'}`}></div>
        <button title="Switch to login mode" onClick={() => handleSwitchMode(false)} className={`flex-1 py-3 text-xs font-black z-10 transition-colors duration-300 ${!isSignUp ? 'text-white' : 'text-gray-500'}`}>LOGIN</button>
        <button title="Switch to sign up mode" onClick={() => handleSwitchMode(true)} className={`flex-1 py-3 text-xs font-black z-10 transition-colors duration-300 ${isSignUp ? 'text-white' : 'text-gray-500'}`}>JOIN NOW</button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
        {isSignUp && (
          <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input title="Display Name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-12 py-4 text-white font-bold outline-none" placeholder="Display Name" required />
            {name && (
              <button type="button" title="Clear name" onClick={() => setName('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                <XCircle size={18} />
              </button>
            )}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input title="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-12 py-4 text-white font-bold outline-none" placeholder="Email Address" required />
          {email && (
            <button type="button" title="Clear email" onClick={() => setEmail('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <XCircle size={18} />
            </button>
          )}
        </div>

        {isSignUp && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-400">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input title="Verification Code" type="text" value={code} maxLength={6} inputMode="numeric" onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-10 py-4 text-white font-mono font-bold outline-none" placeholder="6-digit code" required />
              {code && (
                <button type="button" title="Clear code" onClick={() => setCode('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button title="Send OTP" type="button" disabled={countdown > 0 || isOtpLoading || !validateEmail(email)} onClick={handleSendOtp} className="px-5 rounded-2xl bg-gray-800 text-white font-black text-[10px] border border-gray-700 active:scale-95 disabled:opacity-30 transition-all">
              {isOtpLoading ? <Loader2 size={16} className="animate-spin" /> : countdown > 0 ? `${countdown}S` : 'SEND'}
            </button>
          </div>
        )}

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input title="Account Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface border border-gray-800 focus:border-primary rounded-2xl pl-12 pr-20 py-4 text-white font-bold outline-none" placeholder="Password" required />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {password && (
              <button type="button" title="Clear password" onClick={() => setPassword('')} className="text-gray-500 hover:text-gray-300 transition-colors">
                <XCircle size={18} />
              </button>
            )}
            <button title={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input title="Confirm Password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full bg-surface border rounded-2xl pl-12 pr-20 py-4 text-white font-bold transition-all outline-none ${hasInputConfirm && !isMatch ? 'border-red-500/50' : isMatch ? 'border-primary/50' : 'border-gray-800 focus:border-primary'}`} placeholder="Confirm Password" required />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {confirmPassword && !isMatch && (
                  <button type="button" title="Clear confirmation" onClick={() => setConfirmPassword('')} className="text-gray-500 hover:text-gray-300 transition-colors">
                    <XCircle size={18} />
                  </button>
                )}
                {isMatch && <CheckCircle2 className="text-primary animate-in zoom-in" size={18} />}
                <button title={showConfirmPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 hover:text-white">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {hasInputConfirm && !isMatch && <p className="text-[10px] text-red-500 font-black uppercase mt-1 tracking-tighter ml-2 flex items-center gap-1"><AlertCircle size={10} /> Passwords do not match</p>}
            <div className="p-4 bg-white/5 rounded-2xl border border-gray-800 space-y-2">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Security Standards</p>
               {passwordRequirements.map((req, i) => (
                 <div key={i} className="flex items-center gap-2 text-[11px] font-bold">
                   {req.met ? <CheckCircle2 size={12} className="text-primary" /> : <Circle size={12} className="text-gray-700" />}
                   <span className={req.met ? 'text-gray-300' : 'text-gray-600'}>{req.label}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {!isSignUp ? (
          <div className="flex justify-end">
            <button title="Reset your password" type="button" onClick={onForgotPassword} className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-widest">Forgot Password?</button>
          </div>
        ) : (
          <div className="flex items-start gap-3 py-2 group">
            <button title="Agree to terms" type="button" onClick={() => setAgreed(!agreed)} className={`w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center transition-all shrink-0 ${agreed ? 'bg-primary border-primary' : 'border-gray-800 group-hover:border-gray-600'}`}>
              {agreed && <CheckCircle2 size={14} className="text-dark" strokeWidth={3} />}
            </button>
            <span className="text-[11px] font-bold text-gray-500 leading-snug">
              I agree to <button title="View user agreement" type="button" onClick={onOpenAgreement} className="text-gray-400 underline underline-offset-4 mx-1 hover:text-primary">User Agreement</button> and <button title="View privacy policy" type="button" onClick={onOpenPrivacy} className="text-gray-400 underline underline-offset-4 ml-1 hover:text-primary">Privacy Policy</button>
            </span>
          </div>
        )}

        <button title={isSignUp ? "Create account" : "Secure sign in"} type="submit" disabled={isLoading || (isSignUp && (!isMatch || !isPasswordValid || !agreed || code.length < 6))} className="w-full bg-primary text-dark font-black py-5 rounded-2xl shadow-xl shadow-green-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base mt-6 group disabled:opacity-40 disabled:grayscale">
          {isLoading ? <Loader2 className="animate-spin" /> : <>{isSignUp ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'} <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>

        {!isSignUp && (
          <>
            <div className="relative py-8 flex items-center justify-center">
              <div className="absolute w-full h-px bg-gray-800/50"></div>
              <span className="relative bg-dark px-6 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Fast Connection</span>
            </div>
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <button title="Sign in with Google" type="button" onClick={() => handleSocialAuth('google')} disabled={isLoading} className="bg-surface border border-gray-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-gray-800 active:scale-95 transition-all shadow-sm">
                <Icon name="google" size={18} />
                <span className="text-xs font-black">Google</span>
              </button>
              <button title="Sign in with Apple" type="button" onClick={() => handleSocialAuth('apple')} disabled={isLoading} className="bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-gray-100 active:scale-95 transition-all shadow-sm">
                <Icon name="apple" size={18} />
                <span className="text-xs font-black">Apple ID</span>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default Login

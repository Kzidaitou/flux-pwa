import React, { useState } from 'react'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { AccountBindingModalProps } from '../../../types/modules/user'
import Icon from '../../ui/Icon'
import { getSocialAuthAdapter } from '../../../platform'
import { userApi } from '../../../services/user'

const AccountBindingModal: React.FC<AccountBindingModalProps> = ({
  user,
  onUpdateUser,
  onBack,
  onClose,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleLink = async (provider: string) => {
    setLoadingProvider(provider)
    try {
      const adapter = getSocialAuthAdapter()
      const socialRes = await adapter.login(provider as any)
      const res = await userApi.linkSocial({
        provider: socialRes.provider,
        socialToken: socialRes.token,
      })
      if (res.success) onUpdateUser(res.user)
    } catch (e: any) {
      console.error('Linking failed', e)
    } finally {
      setLoadingProvider(null)
    }
  }

  const handleUnlink = async (provider: string) => {
    setLoadingProvider(provider)
    try {
      const res = await userApi.unlinkSocial(provider)
      if (res.success) onUpdateUser(res.user)
    } finally {
      setLoadingProvider(null)
    }
  }

  const providers = [
    { id: 'google', label: 'Google Account', icon: 'local:google' },
    { id: 'apple', label: 'Apple ID', icon: 'local:apple' },
  ]

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col h-full text-gray-900 dark:text-white pb-10">
        <button
          title="Back"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="mb-10 px-1">
          <h3 className="text-3xl font-black tracking-tight">Login Methods</h3>
        </div>
        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 ml-1">
              Identity Anchor
            </h4>
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-dark flex items-center justify-center border border-gray-100 dark:border-gray-800 text-primary">
                  <Mail size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {providers.map((p) => {
              const isLinked = user.linkedAccounts?.includes(p.id as any)
              const isLoading = loadingProvider === p.id
              return (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-surface border rounded-[2rem] p-5 ${
                    isLinked ? 'border-primary/20' : 'border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isLinked ? 'bg-primary/5' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon name={p.icon} size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{p.label}</p>
                      </div>
                    </div>
                    <button
                      disabled={isLoading}
                      onClick={() => (isLinked ? handleUnlink(p.id) : handleLink(p.id))}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        isLinked ? 'bg-red-500/10 text-red-500' : 'bg-primary text-dark'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isLinked ? (
                        'Unlink'
                      ) : (
                        'Link'
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default AccountBindingModal

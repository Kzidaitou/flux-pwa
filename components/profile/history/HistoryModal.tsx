
import React, { useState } from 'react'
import ModalWrapper from '../../modal-wrapper'
import { HistoryModalProps } from '../../../types/modules/user'
import { PastSession } from '../../../services/user/types'
import { useUser } from '../../../context/UserContext'
import { api } from '../../../core/request'
import { userApi } from '../../../services/user'
import { AlertCircle, Loader2} from 'lucide-react'

import { HistoryListView } from './HistoryListView'
import { HistoryDetailView } from './HistoryDetailView'
import { AfterSalesReasonPicker } from './AfterSalesReasonPicker'
import { AfterSalesCustomForm } from './AfterSalesCustomForm'

const CustomConfirmModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading: boolean
}> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={isLoading ? undefined : onClose}></div>
      <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 relative z-[310] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20"><AlertCircle size={32} /></div>
          <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{title}</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed font-medium">{message}</p>
          <div className="w-full space-y-3">
            <button title="Confirm and withdraw" disabled={isLoading} onClick={onConfirm} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black active:scale-95 transition-all flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'YES, WITHDRAW'}
            </button>
            <button title="Cancel and stay" disabled={isLoading} onClick={onClose} className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 dark:hover:text-gray-200 transition-colors">No, keep it</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const HistoryModal: React.FC<HistoryModalProps & { isLoading?: boolean }> = ({ history = [], selectedSession, onSelectSession, onPayPastSession, onClose, onShowToast, isLoading }) => {
  const { isLoaded, refreshHistory } = useUser() 
  const [isPreparingPayment, setIsPreparingPayment] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [viewState, setViewState] = useState<'LIST' | 'DETAIL' | 'REASONS' | 'CUSTOM_FORM'>('LIST')
  const [activeAfterSalesType, setActiveAfterSalesType] = useState<'SUPPORT' | 'REFUND' | null>(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [isConfirmWithdrawOpen, setIsConfirmWithdrawOpen] = useState(false)

  React.useEffect(() => {
    if (selectedSession) setViewState('DETAIL')
    else setViewState('LIST')
  }, [selectedSession])

  const currentSession = selectedSession ? history.find(h => h.id === selectedSession.id) || selectedSession : null

  const handleBack = () => {
    if (viewState === 'CUSTOM_FORM') setViewState('REASONS')
    else if (viewState === 'REASONS') setViewState('DETAIL')
    else if (viewState === 'DETAIL') onSelectSession(null)
  }

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    onShowToast(`${label} copied to clipboard`, 'success')
  }

  const handlePayNow = async (session: PastSession) => {
    setIsPreparingPayment(true)
    await new Promise(r => setTimeout(r, 400))
    onPayPastSession(session)
    setIsPreparingPayment(false)
  }

  const submitAfterSales = async (data: { reason?: string, amount?: number, description?: string }) => {
    if (!currentSession || !activeAfterSalesType) return
    setIsActionLoading(true)
    try {
      const finalDescription = data.description || 'No additional details'
      if (activeAfterSalesType === 'SUPPORT') {
        const finalReason = `${selectedReason}: ${finalDescription}`
        const res: any = await api.post('/user/support', { sessionId: currentSession.id, reason: finalReason })
        onShowToast(`Support ticket ${res.ticketId} created.`, 'success')
      } else {
        const finalReason = `${selectedReason}: ${finalDescription}`
        await api.post('/user/refund', { sessionId: currentSession.id, reason: finalReason, amount: data.amount })
        onShowToast('Refund request submitted.', 'success')
      }
      await refreshHistory(true)
      setViewState('DETAIL'); setActiveAfterSalesType(null); setSelectedReason('')
    } catch (e) {
      console.error('Action failed', e)
    } finally { setIsActionLoading(false) }
  }

  const performWithdraw = async () => {
    if (!currentSession) return
    setIsActionLoading(true)
    try {
      await userApi.cancelSupport(currentSession.id)
      onShowToast('Request withdrawn successfully.', 'success')
      await refreshHistory(true)
      setIsConfirmWithdrawOpen(false)
    } catch (e) { console.error('Withdrawal failed', e) } finally { setIsActionLoading(false) }
  }

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason)
    setViewState('CUSTOM_FORM')
  }

  return (
    <>
      <ModalWrapper onClose={onClose} title={currentSession ? 'Order Details' : 'Charging History'}>
        <div className="flex-1 flex flex-col min-h-0 text-gray-900 dark:text-white">
          {viewState === 'LIST' && <HistoryListView history={history} isLoaded={isLoaded} isLoading={!!isLoading} onSelectSession={onSelectSession} />}
          {(viewState === 'DETAIL' && currentSession) && <HistoryDetailView session={currentSession} onBack={handleBack} onWithdraw={() => setIsConfirmWithdrawOpen(true)} onShowReasonPicker={(type) => { setActiveAfterSalesType(type); setViewState('REASONS'); }} onPayNow={handlePayNow} onCopy={copyToClipboard} isPreparingPayment={isPreparingPayment} isActionLoading={isActionLoading} />}
          {(viewState === 'REASONS' && currentSession && activeAfterSalesType) && <AfterSalesReasonPicker session={currentSession} type={activeAfterSalesType} onBack={handleBack} onSelectReason={handleSelectReason} isActionLoading={isActionLoading} />}
          {(viewState === 'CUSTOM_FORM' && currentSession && activeAfterSalesType) && (
            <AfterSalesCustomForm session={currentSession} type={activeAfterSalesType} reason={selectedReason} onBack={handleBack} onSubmit={(description, amount) => submitAfterSales({ description, amount })} isActionLoading={isActionLoading} />
          )}
        </div>
      </ModalWrapper>
      <CustomConfirmModal isOpen={isConfirmWithdrawOpen} onClose={() => setIsConfirmWithdrawOpen(false)} onConfirm={performWithdraw} title="Confirm Withdrawal" message="Are you sure you want to cancel this request? This action cannot be undone." isLoading={isActionLoading} />
    </>
  )
}

export default HistoryModal

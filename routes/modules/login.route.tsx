
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Layout from '../../components/layout'
import Login from '../../pages/Login'
import { useUser } from '../../context/UserContext'
import { useStations } from '../../context/StationContext'
import { useUI } from '../../context/UIContext'
import PrivacyModal from '../../components/legal/PrivacyModal'
import UserAgreementModal from '../../components/legal/UserAgreementModal'
import { ModuleRoute } from '../registry'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, user } = useUser()
  const { refreshStations } = useStations()
  const { showToast, showAlert, activeModal, setActiveModal } = useUI()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && user) navigate('/home', { replace: true })
  }, [user, navigate])

  const handleLoginSuccess = async (data: any) => {
    await login(data)
    refreshStations(true).catch(() => {})
    showToast(`Welcome back!`, 'success')
    navigate('/home', { replace: true })
  }

  return (
    <Layout currentView="LOGIN">
      <Login
        onLogin={handleLoginSuccess}
        onShowAlert={showAlert}
        onShowToast={showToast}
        onForgotPassword={() => setActiveModal('FORGOT_PASSWORD')}
        onOpenPrivacy={() => setActiveModal('PRIVACY')}
        onOpenAgreement={() => setActiveModal('USER_AGREEMENT')}
      />
      {activeModal === 'PRIVACY' && <PrivacyModal onClose={() => setActiveModal('NONE')} />}
      {activeModal === 'USER_AGREEMENT' && <UserAgreementModal onClose={() => setActiveModal('NONE')} />}
    </Layout>
  )
}

// 导出为 ModuleRoute 格式
const route: ModuleRoute = {
  path: '/login',
  element: <LoginPage />,
  protected: false
}

export default route

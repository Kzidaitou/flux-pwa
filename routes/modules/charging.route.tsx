import React from 'react'
import Layout from '../../components/layout'
import Charging from '../../pages/Charging'
import { useUser } from '../../context/UserContext'
import { useUI } from '../../context/UIContext'
import { useCharging } from '../../context/ChargingContext'
import { useStations } from '../../context/StationContext'

export const ChargingRoute: React.FC = () => {
  const { history } = useUser()
  const { stations } = useStations()
  const { showToast, setActiveModal } = useUI()
  const { chargingSession, isCharging, startCharging } = useCharging()

  const activeUnpaidSession = history.find((h) => h.status === 'unpaid')

  // 实现真实的启动逻辑：根据输入的 Code 查找对应的电站和枪口
  const handleStartByCode = async (code: string) => {
    const station = stations.find((s) => s.connectors.some((c) => c.code === code))
    if (!station) return false

    const connector = station.connectors.find((c) => c.code === code)
    if (!connector) return false

    return await startCharging(station, connector.id)
  }

  return (
    <Layout currentView="CHARGING" isCharging={isCharging}>
      <Charging
        session={chargingSession}
        onStopSession={() => setActiveModal('PAYMENT_SESSION')}
        onStartByCode={handleStartByCode}
        isCharging={isCharging}
        activeUnpaidSession={activeUnpaidSession}
        onShowToast={showToast}
      />
    </Layout>
  )
}

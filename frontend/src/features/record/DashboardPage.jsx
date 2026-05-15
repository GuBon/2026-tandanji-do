import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import useAuthStore from '../../store/useAuthStore.js'
import { useDashboard } from './useDashboard.js'
import BmrCard from './dashboard/BmrCard.jsx'
import PeriodToggle from './dashboard/PeriodToggle.jsx'
import { calcBMR } from './dashboard/bmr.js'
import { BLUE, GREEN } from './dashboard/dashboardConstants.js'
import {
  LineChart,
  NetCalorieBarChart,
  TodayRingChart,
  WeightLineChart,
} from './dashboard/DashboardCharts.jsx'

export default function DashboardPage() {
  const [period, setPeriod] = useState(7)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const allDays = useMemo(() => {
    if (!user?.createdAt) return 30
    const diff = Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 86400000) + 1
    return Math.max(diff, 1)
  }, [user?.createdAt])

  const days = period === 'all' ? allDays : period
  const { data, today, weightLogs, loading } = useDashboard(days)
  const bmr = calcBMR(user?.gender, user?.weight, user?.height, user?.age)

  return (
    <PageLayout
      customHeader={
        <Header
          title="대시보드"
          left={
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="뒤로"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                strokeWidth="2.5" strokeLinecap="round" stroke="#2b3437">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          }
        />
      }
    >
      <div className="flex flex-col gap-5 px-5 py-5 pb-28">
        <BmrCard
          bmr={bmr}
          gender={user?.gender}
          weight={user?.weight}
          height={user?.height}
          age={user?.age}
          onEditProfile={() => navigate('/profile/body', { state: { from: '/record/dashboard' } })}
        />

        <TodayRingChart intake={today.intake} burned={today.burned} bmr={bmr} />
        <PeriodToggle period={period} onChange={setPeriod} />

        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-outline-variant">
            불러오는 중...
          </div>
        ) : (
          <>
            <NetCalorieBarChart data={data} bmr={bmr} />
            <LineChart data={data} valueKey="intake" color={BLUE} title="섭취 칼로리 추이" />
            <LineChart data={data} valueKey="burned" color={GREEN} title="운동 소비 칼로리 추이" />
            <WeightLineChart data={weightLogs} />
          </>
        )}
      </div>
    </PageLayout>
  )
}

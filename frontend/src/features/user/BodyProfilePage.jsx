import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import useAuthStore from '../../store/useAuthStore.js'
import { updateMe } from '../../api/userApi.js'

const HEIGHT_RANGE = { min: 80, max: 250 }
const WEIGHT_RANGE = { min: 20, max: 300 }

function normalizeNumber(value) {
  if (value === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  return Math.round(parsed)
}

function NumberField({ id, label, unit, value, min, max, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-xs font-bold text-outline mb-2">{label}</span>
      <div className="flex items-center bg-white border border-outline-variant/30 rounded-xl px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-16 bg-transparent text-3xl font-bold font-headline text-on-surface outline-none"
        />
        <span className="text-sm font-bold text-outline-variant uppercase">{unit}</span>
      </div>
    </label>
  )
}

export default function BodyProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const requiredByProfile = user && (user.height == null || user.weight == null)
  const required = Boolean(location.state?.required || requiredByProfile)
  const from = location.state?.from && location.state.from !== '/profile/body'
    ? location.state.from
    : '/record'

  const [height, setHeight] = useState(user?.height?.toString() ?? '')
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const title = required ? '신체 정보 입력' : '신체 정보 수정'
  const canSubmit = useMemo(() => height.trim() !== '' && weight.trim() !== '', [height, weight])

  if (!user) return <Navigate to="/map" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextHeight = normalizeNumber(height)
    const nextWeight = normalizeNumber(weight)

    if (
      nextHeight == null ||
      nextHeight < HEIGHT_RANGE.min ||
      nextHeight > HEIGHT_RANGE.max
    ) {
      setError(`키는 ${HEIGHT_RANGE.min}~${HEIGHT_RANGE.max}cm 사이로 입력해주세요.`)
      return
    }

    if (
      nextWeight == null ||
      nextWeight < WEIGHT_RANGE.min ||
      nextWeight > WEIGHT_RANGE.max
    ) {
      setError(`몸무게는 ${WEIGHT_RANGE.min}~${WEIGHT_RANGE.max}kg 사이로 입력해주세요.`)
      return
    }

    setSaving(true)
    setError('')

    try {
      const profile = await updateMe({ height: nextHeight, weight: nextWeight })
      updateUser(profile)
      navigate(required ? '/map' : from, { replace: true })
    } catch (err) {
      setError(err?.message ?? '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout
      customHeader={
        <Header
          title={title}
          left={
            required ? undefined : (
              <button
                type="button"
                onClick={() => navigate(from, { replace: true })}
                className="w-10 h-10 flex items-center justify-center text-2xl text-on-surface"
                aria-label="이전으로"
              >
                ‹
              </button>
            )
          }
          right={<span className="w-10" />}
        />
      }
      className="bg-surface"
    >
      <form onSubmit={handleSubmit} className="px-5 py-8 pb-28">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-headline text-on-surface mb-2">
            {required ? '처음 한 번만 입력해주세요' : '현재 몸 상태에 맞게 바꿔주세요'}
          </h1>
          <p className="text-sm leading-6 text-on-surface-variant">
            식단과 운동 기록에서 더 정확한 칼로리 계산에 사용돼요.
          </p>
        </div>

        <div className="space-y-5">
          <NumberField
            id="height"
            label="키"
            unit="cm"
            value={height}
            min={HEIGHT_RANGE.min}
            max={HEIGHT_RANGE.max}
            onChange={setHeight}
          />
          <NumberField
            id="weight"
            label="몸무게"
            unit="kg"
            value={weight}
            min={WEIGHT_RANGE.min}
            max={WEIGHT_RANGE.max}
            onChange={setWeight}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-error bg-red-50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="gradient"
          disabled={!canSubmit || saving}
          className="w-full h-14 mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : required ? '입력 완료' : '수정 완료'}
        </Button>
      </form>
    </PageLayout>
  )
}

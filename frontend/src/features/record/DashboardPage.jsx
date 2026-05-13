import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import useAuthStore from '../../store/useAuthStore.js'
import { useDashboard } from './useDashboard.js'

// ── 해리스-베네딕트 기초대사량 (개정판) ───────────────────────────────────────
// 남성: (88.4 + 13.4 × 체중) + (4.8 × 키) - (5.68 × 나이)
// 여성: (447.6 + 9.25 × 체중) + (3.1 × 키) - (4.33 × 나이)
// 순 칼로리 = 섭취 칼로리 - (기초대사량 + 활동 소비 칼로리)

const BLUE   = '#49AFE6'
const GREEN  = '#1b6d24'
const ORANGE = '#f97316'
const PURPLE = '#8b5cf6'

function calcBMR(gender, weight, height, age) {
  if (!weight || !height || !age) return null
  if (gender === 'M') return Math.round(88.4 + 13.4 * weight + 4.8 * height - 5.68 * age)
  if (gender === 'F') return Math.round(447.6 + 9.25 * weight + 3.1 * height - 4.33 * age)
  return null
}

// ── BMR 정보 모달 ─────────────────────────────────────────────────────────────

function BmrInfoModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-modal"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl px-6 pt-6 pb-10 z-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold font-headline text-on-surface">기초대사량이란?</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant text-xl"
          >
            ×
          </button>
        </div>

        {/* 정의 */}
        <div className="bg-surface-container rounded-2xl p-4 mb-4">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            <span className="font-bold text-on-surface">기초대사량(BMR, Basal Metabolic Rate)</span><br />
            아무것도 하지 않고 완전히 안정된 상태에서 생명 유지에 필요한 최소한의 에너지양이에요.<br />
            호흡, 심장박동, 체온 유지 등 기본 신체 기능에 소비되며, 하루 총 소비 칼로리의
            약 60~70%를 차지해요.
          </p>
        </div>

        {/* 공식 */}
        <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-3">해리스-베네딕트 공식 (개정판)</h3>
        <div className="space-y-3 mb-5">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-[#49AFE6] mb-2">남성</p>
            <p className="text-xs font-mono text-on-surface leading-relaxed">
              (88.4 + 13.4 × 체중kg)<br />
              + (4.8 × 키cm)<br />
              − (5.68 × 나이)
            </p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-pink-500 mb-2">여성</p>
            <p className="text-xs font-mono text-on-surface leading-relaxed">
              (447.6 + 9.25 × 체중kg)<br />
              + (3.1 × 키cm)<br />
              − (4.33 × 나이)
            </p>
          </div>
        </div>

        {/* 순 칼로리 설명 */}
        <div className="border-t border-outline-variant/10 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-2">순 칼로리 계산</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface">순 칼로리 = 섭취 − (기초대사량 + 활동 소비)</span><br />
            적자(−)이면 체중 감소 방향, 과잉(+)이면 체중 증가 방향이에요.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Chart 1: 기초대사량 카드 ─────────────────────────────────────────────────

function BmrCard({ bmr, gender, weight, height, age, onEditProfile }) {
  const [infoOpen, setInfoOpen] = useState(false)

  if (bmr == null) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">기초대사량 (BMR)</h3>
          <button
            onClick={() => setInfoOpen(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors"
            style={{ borderColor: BLUE, color: BLUE }}
            aria-label="기초대사량 정보"
          >
            i
          </button>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          기초대사량 계산을 위해 성별·나이·키·체중 정보가 필요해요.
        </p>
        <button
          onClick={onEditProfile}
          className="text-xs font-bold px-4 py-2 rounded-full text-white"
          style={{ background: BLUE }}
        >
          신체 정보 입력하기
        </button>
        {infoOpen && <BmrInfoModal onClose={() => setInfoOpen(false)} />}
      </div>
    )
  }

  const genderLabel = gender === 'M' ? '남성' : '여성'
  const formula = gender === 'M'
    ? `(88.4 + 13.4×${weight}) + (4.8×${height}) − (5.68×${age})`
    : `(447.6 + 9.25×${weight}) + (3.1×${height}) − (4.33×${age})`

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">기초대사량 (BMR)</h3>
          <button
            onClick={() => setInfoOpen(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors"
            style={{ borderColor: BLUE, color: BLUE }}
            aria-label="기초대사량 정보"
          >
            i
          </button>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-bold font-headline" style={{ color: BLUE }}>
            {bmr.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-outline-variant mb-1">kcal / 일</span>
        </div>

        {/* <div className="flex items-center gap-4 text-[10px] text-outline-variant">
          <span className="flex items-center gap-1">
            <span className="font-bold text-on-surface-variant">성별</span> {genderLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-on-surface-variant">나이</span> {age}세
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-on-surface-variant">키</span> {height}cm
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-on-surface-variant">체중</span> {weight}kg
          </span>
        </div> */}
      </div>

      {infoOpen && <BmrInfoModal onClose={() => setInfoOpen(false)} />}
    </>
  )
}

// ── Chart 2: 오늘 순 칼로리 링 차트 ─────────────────────────────────────────

function TodayRingChart({ intake, burned, bmr }) {
  const totalBurn = (bmr ?? 0) + burned
  const net = intake - totalBurn
  const isDeficit = net <= 0
  const goal = bmr ?? 2000

  const R = 48
  const C = 2 * Math.PI * R
  const intakePct  = Math.min(intake / (goal * 1.5), 1)
  const burnedPct  = Math.min(burned / (goal * 1.5), 1)
  const bmrPct     = Math.min((bmr ?? 0) / (goal * 1.5), 1)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline mb-4">오늘 순 칼로리</h3>
      <div className="flex items-center gap-5">
        {/* Ring */}
        <div className="relative shrink-0" style={{ width: 112, height: 112 }}>
          <svg viewBox="0 0 112 112" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="56" cy="56" r={R} fill="none" stroke="#f3f4f6" strokeWidth="11" />
            {/* 기초대사량 호 (회색 녹색) */}
            <circle cx="56" cy="56" r={R} fill="none"
              stroke={GREEN} strokeWidth="11" strokeOpacity="0.3"
              strokeDasharray={`${bmrPct * C} ${C}`} strokeLinecap="round"
            />
            {/* 활동 소비 호 (진한 녹색) */}
            <circle cx="56" cy="56" r={R} fill="none"
              stroke={GREEN} strokeWidth="11" strokeOpacity="0.75"
              strokeDasharray={`${burnedPct * C} ${C}`} strokeLinecap="round"
            />
            {/* 섭취 호 (파랑) */}
            <circle cx="56" cy="56" r={R} fill="none"
              stroke={BLUE} strokeWidth="11"
              strokeDasharray={`${intakePct * C} ${C}`} strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[13px] font-bold font-headline leading-tight"
              style={{ color: isDeficit ? BLUE : ORANGE }}>
              {net > 0 ? '+' : ''}{net.toLocaleString()}
            </span>
            <span className="text-[8px] text-outline-variant mt-0.5">kcal</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: BLUE }} />
            <div>
              <p className="text-[10px] font-bold text-outline-variant leading-none mb-0.5">섭취</p>
              <p className="text-sm font-bold font-headline text-on-surface">
                {intake.toLocaleString()} <span className="text-[10px] font-normal text-outline-variant">kcal</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GREEN, opacity: 0.75 }} />
            <div>
              <p className="text-[10px] font-bold text-outline-variant leading-none mb-0.5">활동 소비</p>
              <p className="text-sm font-bold font-headline text-on-surface">
                {burned.toLocaleString()} <span className="text-[10px] font-normal text-outline-variant">kcal</span>
              </p>
            </div>
          </div>
          {bmr != null && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GREEN, opacity: 0.3 }} />
              <div>
                <p className="text-[10px] font-bold text-outline-variant leading-none mb-0.5">기초대사량</p>
                <p className="text-sm font-bold font-headline text-on-surface">
                  {bmr.toLocaleString()} <span className="text-[10px] font-normal text-outline-variant">kcal</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
        <span className="text-[10px] font-bold text-outline-variant">
          총 소비 {totalBurn.toLocaleString()} kcal {bmr != null ? '(기초+활동)' : '(활동만)'}
        </span>
        <span className="text-xs font-bold" style={{ color: isDeficit ? BLUE : ORANGE }}>
          {isDeficit ? '적자 ' : '과잉 '}{Math.abs(net).toLocaleString()} kcal
        </span>
      </div>
    </div>
  )
}

// ── Chart 3: 순 칼로리 막대 그래프 ──────────────────────────────────────────

function NetCalorieBarChart({ data, bmr }) {
  if (!data.length) return null

  const VW = 320, VH = 170
  const pad = { top: 18, right: 8, bottom: 28, left: 46 }
  const cW = VW - pad.left - pad.right
  const cH = VH - pad.top - pad.bottom

  // 기초대사량 포함한 순 칼로리 = 섭취 - (bmr + 활동소비)
  const nets = data.map((d) => d.intake - ((bmr ?? 0) + d.burned))
  const maxAbs = Math.max(...nets.map(Math.abs), 200)
  const rounded = Math.ceil(maxAbs / 100) * 100

  const zeroY = pad.top + cH / 2
  const scaleY = (v) => zeroY - (v / rounded) * (cH / 2)
  const barW = Math.max((cW / data.length) * 0.65, 3)
  const centerX = (i) => pad.left + (i + 0.5) * (cW / data.length)
  const showLabel = (i) =>
    data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0
  const fmtV = (v) => {
    const abs = Math.abs(v)
    const str = abs >= 1000 ? `${(abs / 1000).toFixed(1)}k` : String(abs)
    return v > 0 ? `+${str}` : v < 0 ? `-${str}` : '0'
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
      <div className="flex items-center mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">순 칼로리 추이</h3>
        <div className="flex items-center gap-3 ml-auto text-[9px] font-bold text-outline-variant">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: ORANGE }} />과잉
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: BLUE }} />적자
          </span>
        </div>
      </div>
      {bmr != null && (
        <p className="text-[10px] text-outline-variant mb-2">기초대사량({bmr.toLocaleString()} kcal) 포함</p>
      )}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: VH }}>
        {[-rounded, -Math.round(rounded / 2), 0, Math.round(rounded / 2), rounded].map((v) => (
          <g key={v}>
            <line x1={pad.left} y1={scaleY(v)} x2={pad.left + cW} y2={scaleY(v)}
              stroke={v === 0 ? '#d1d5db' : '#f3f4f6'}
              strokeWidth={v === 0 ? 1 : 0.6} />
            <text x={pad.left - 4} y={scaleY(v) + 3.5} textAnchor="end" fontSize="8" fill="#9ca3af">
              {fmtV(v)}
            </text>
          </g>
        ))}
        {nets.map((net, i) => {
          const bX = centerX(i) - barW / 2
          const bH = Math.max(Math.abs(scaleY(net) - zeroY), 1)
          const bY = net >= 0 ? scaleY(net) : zeroY
          return (
            <rect key={i} x={bX} y={bY} width={barW} height={bH}
              fill={net >= 0 ? ORANGE : BLUE} rx="1.5" />
          )
        })}
        {data.map((d, i) =>
          showLabel(i) ? (
            <text key={i} x={centerX(i)} y={VH - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

// ── Chart 4 & 5: 꺾은선 그래프 ──────────────────────────────────────────────

function LineChart({ data, valueKey, color, title }) {
  if (!data.length) return null

  const VW = 320, VH = 148
  const pad = { top: 14, right: 8, bottom: 28, left: 46 }
  const cW = VW - pad.left - pad.right
  const cH = VH - pad.top - pad.bottom

  const values = data.map((d) => d[valueKey])
  const maxV = Math.max(...values, 100)

  const px = (i) => pad.left + (data.length < 2 ? cW / 2 : (i / (data.length - 1)) * cW)
  const py = (v) => pad.top + (1 - v / (maxV || 1)) * cH

  const pts = data.map((d, i) => [px(i), py(d[valueKey])])
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ')
  const areaPath = linePath
    + ` L ${pts[pts.length - 1][0]},${pad.top + cH}`
    + ` L ${pts[0][0]},${pad.top + cH} Z`

  const gridVals = [0, Math.round(maxV / 2), maxV]
  const showLabel = (i) =>
    data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0
  const gradId = `grad-${valueKey}`
  const fmtV = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">{title}</h3>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: VH }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridVals.map((v) => (
          <g key={v}>
            <line x1={pad.left} y1={py(v)} x2={pad.left + cW} y2={py(v)}
              stroke="#f3f4f6" strokeWidth="0.8" />
            <text x={pad.left - 4} y={py(v) + 3.5} textAnchor="end" fontSize="8" fill="#9ca3af">
              {fmtV(v)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill={color} />
        ))}
        {data.map((d, i) =>
          showLabel(i) ? (
            <text key={i} x={px(i)} y={VH - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

// ── Chart: 체중 변화 꺾은선 ──────────────────────────────────────────────────

function WeightLineChart({ data }) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">체중 변화</h3>
        <div className="h-20 flex items-center justify-center text-sm text-outline-variant">
          체중을 업데이트하면 변화 추이를 볼 수 있어요
        </div>
      </div>
    )
  }

  const VW = 320, VH = 160
  const pad = { top: 26, right: 24, bottom: 28, left: 46 }
  const cW = VW - pad.left - pad.right
  const cH = VH - pad.top - pad.bottom

  const weights = data.map((d) => d.weight)
  const minW = Math.floor(Math.min(...weights) - 1)
  const maxW = Math.ceil(Math.max(...weights) + 1)
  const range = maxW - minW || 2

  const px = (i) => pad.left + (data.length < 2 ? cW / 2 : (i / (data.length - 1)) * cW)
  const py = (v) => pad.top + (1 - (v - minW) / range) * cH

  const pts = data.map((d, i) => [px(i), py(d.weight)])
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ')
  const areaPath = linePath
    + ` L ${pts[pts.length - 1][0]},${pad.top + cH}`
    + ` L ${pts[0][0]},${pad.top + cH} Z`

  const gridVals = [minW, Math.round((minW + maxW) / 2), maxW]
  const showXLabel = (i) =>
    data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">체중 변화</h3>
        <span className="text-[11px] font-bold" style={{ color: PURPLE }}>
          현재 {weights[weights.length - 1]}kg
        </span>
      </div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: VH }}>
        <defs>
          <linearGradient id="grad-weight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.2" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridVals.map((v) => (
          <g key={v}>
            <line x1={pad.left} y1={py(v)} x2={pad.left + cW} y2={py(v)}
              stroke="#f3f4f6" strokeWidth="0.8" />
            <text x={pad.left - 4} y={py(v) + 3.5} textAnchor="end" fontSize="8" fill="#9ca3af">
              {v}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#grad-weight)" />
        <path d={linePath} fill="none" stroke={PURPLE} strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" />

        {pts.map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="4" fill="white" stroke={PURPLE} strokeWidth="2" />
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="8" fontWeight="bold" fill={PURPLE}>
              {data[i].weight}
            </text>
          </g>
        ))}

        {data.map((d, i) =>
          showXLabel(i) ? (
            <text key={i} x={px(i)} y={VH - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

// ── Period Toggle ─────────────────────────────────────────────────────────────

const PERIODS = [
  { val: 7,     label: '7일' },
  { val: 30,    label: '30일' },
  { val: 'all', label: '전체' },
]

function PeriodToggle({ period, onChange }) {
  return (
    <div className="flex p-1 bg-surface-container rounded-full">
      {PERIODS.map(({ val, label }) => (
        <button key={val} onClick={() => onChange(val)}
          className={[
            'flex-1 py-1.5 text-xs transition-all rounded-full',
            period === val ? 'font-bold bg-white shadow-sm' : 'font-medium text-on-surface-variant',
          ].join(' ')}
          style={period === val ? { color: BLUE } : {}}>
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState(7)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  // 가입일로부터 오늘까지의 일수 계산
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
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="뒤로">
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
        {/* Chart 1: 기초대사량 카드 */}
        <BmrCard
          bmr={bmr}
          gender={user?.gender}
          weight={user?.weight}
          height={user?.height}
          age={user?.age}
          onEditProfile={() => navigate('/profile/body', { state: { from: '/record/dashboard' } })}
        />

        {/* Chart 2: 오늘 순 칼로리 링 */}
        <TodayRingChart intake={today.intake} burned={today.burned} bmr={bmr} />

        {/* 기간 토글 */}
        <PeriodToggle period={period} onChange={setPeriod} />

        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-outline-variant">
            불러오는 중...
          </div>
        ) : (
          <>
            {/* Chart 3: 순 칼로리 막대 그래프 */}
            <NetCalorieBarChart data={data} bmr={bmr} />

            {/* Chart 4: 섭취 칼로리 꺾은선 */}
            <LineChart data={data} valueKey="intake" color={BLUE} title="섭취 칼로리 추이" />

            {/* Chart 5: 운동 소비 칼로리 꺾은선 */}
            <LineChart data={data} valueKey="burned" color={GREEN} title="운동 소비 칼로리 추이" />

            {/* Chart 6: 체중 변화 */}
            <WeightLineChart data={weightLogs} />
          </>
        )}
      </div>
    </PageLayout>
  )
}

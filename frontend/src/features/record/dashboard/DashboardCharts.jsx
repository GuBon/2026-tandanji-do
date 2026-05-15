import DashboardCard from './DashboardCard.jsx'
import { BLUE, GREEN, ORANGE, PURPLE } from './dashboardConstants.js'

export function TodayRingChart({ intake, burned, bmr }) {
  const totalBurn = (bmr ?? 0) + burned
  const net = intake - totalBurn
  const isDeficit = net <= 0
  const goal = bmr ?? 2000

  const R = 48
  const C = 2 * Math.PI * R
  const intakePct = Math.min(intake / (goal * 1.5), 1)
  const burnedPct = Math.min(burned / (goal * 1.5), 1)
  const bmrPct = Math.min((bmr ?? 0) / (goal * 1.5), 1)

  return (
    <DashboardCard className="p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline mb-4">오늘 순 칼로리</h3>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: 112, height: 112 }}>
          <svg viewBox="0 0 112 112" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="56" cy="56" r={R} fill="none" stroke="#f3f4f6" strokeWidth="11" />
            <circle cx="56" cy="56" r={R} fill="none" stroke={GREEN} strokeWidth="11" strokeOpacity="0.3" strokeDasharray={`${bmrPct * C} ${C}`} strokeLinecap="round" />
            <circle cx="56" cy="56" r={R} fill="none" stroke={GREEN} strokeWidth="11" strokeOpacity="0.75" strokeDasharray={`${burnedPct * C} ${C}`} strokeLinecap="round" />
            <circle cx="56" cy="56" r={R} fill="none" stroke={BLUE} strokeWidth="11" strokeDasharray={`${intakePct * C} ${C}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[13px] font-bold font-headline leading-tight" style={{ color: isDeficit ? BLUE : ORANGE }}>
              {net > 0 ? '+' : ''}{net.toLocaleString()}
            </span>
            <span className="text-[8px] text-outline-variant mt-0.5">kcal</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <LegendStat color={BLUE} label="섭취" value={intake} />
          <LegendStat color={GREEN} opacity={0.75} label="활동 소비" value={burned} />
          {bmr != null && <LegendStat color={GREEN} opacity={0.3} label="기초대사량" value={bmr} />}
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
    </DashboardCard>
  )
}

function LegendStat({ color, opacity = 1, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, opacity }} />
      <div>
        <p className="text-[10px] font-bold text-outline-variant leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold font-headline text-on-surface">
          {value.toLocaleString()} <span className="text-[10px] font-normal text-outline-variant">kcal</span>
        </p>
      </div>
    </div>
  )
}

export function NetCalorieBarChart({ data, bmr }) {
  if (!data.length) return null

  const VW = 320
  const VH = 170
  const pad = { top: 18, right: 8, bottom: 28, left: 46 }
  const cW = VW - pad.left - pad.right
  const cH = VH - pad.top - pad.bottom

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
    <DashboardCard className="p-4">
      <div className="flex items-center mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">순 칼로리 추이</h3>
        <div className="flex items-center gap-3 ml-auto text-[9px] font-bold text-outline-variant">
          <Swatch color={ORANGE} label="과잉" />
          <Swatch color={BLUE} label="적자" />
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
    </DashboardCard>
  )
}

function Swatch({ color, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-sm inline-block" style={{ background: color }} />
      {label}
    </span>
  )
}

export function LineChart({ data, valueKey, color, title }) {
  if (!data.length) return null

  const VW = 320
  const VH = 148
  const pad = { top: 14, right: 8, bottom: 28, left: 46 }
  const cW = VW - pad.left - pad.right
  const cH = VH - pad.top - pad.bottom

  const values = data.map((d) => d[valueKey])
  const maxV = Math.max(...values, 100)

  const px = (i) => pad.left + (data.length < 2 ? cW / 2 : (i / (data.length - 1)) * cW)
  const py = (v) => pad.top + (1 - v / (maxV || 1)) * cH

  const pts = data.map((d, i) => [px(i), py(d[valueKey])])
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ')
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]},${pad.top + cH} L ${pts[0][0]},${pad.top + cH} Z`

  const gridVals = [0, Math.round(maxV / 2), maxV]
  const showLabel = (i) =>
    data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0
  const gradId = `grad-${valueKey}`
  const fmtV = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))

  return (
    <DashboardCard className="p-4">
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
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
    </DashboardCard>
  )
}

export function WeightLineChart({ data }) {
  if (!data.length) {
    return (
      <DashboardCard className="p-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">체중 변화</h3>
        <div className="h-20 flex items-center justify-center text-sm text-outline-variant">
          체중을 업데이트하면 변화 추이를 볼 수 있어요
        </div>
      </DashboardCard>
    )
  }

  const VW = 320
  const VH = 160
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
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]},${pad.top + cH} L ${pts[0][0]},${pad.top + cH} Z`

  const gridVals = [minW, Math.round((minW + maxW) / 2), maxW]
  const showXLabel = (i) =>
    data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0

  return (
    <DashboardCard className="p-4">
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
        <path d={linePath} fill="none" stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

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
    </DashboardCard>
  )
}

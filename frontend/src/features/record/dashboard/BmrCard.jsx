import { useState } from 'react'
import BottomSheet from '../../../components/BottomSheet.jsx'
import Button from '../../../components/Button.jsx'
import DashboardCard from './DashboardCard.jsx'
import { BLUE } from './dashboardConstants.js'

export default function BmrCard({ bmr, gender, weight, height, age, onEditProfile }) {
  const [infoOpen, setInfoOpen] = useState(false)

  if (bmr == null) {
    return (
      <DashboardCard className="p-5">
        <BmrCardHeader onInfoClick={() => setInfoOpen(true)} />
        <p className="text-sm text-on-surface-variant mb-4">
          기초대사량 계산을 위해 성별·나이·키·체중 정보가 필요해요.
        </p>
        <Button variant="gradient-blue" onClick={onEditProfile} className="text-xs">
          신체 정보 입력하기
        </Button>
        {infoOpen && <BmrInfoSheet onClose={() => setInfoOpen(false)} />}
      </DashboardCard>
    )
  }

  return (
    <>
      <DashboardCard className="p-5">
        <BmrCardHeader onInfoClick={() => setInfoOpen(true)} />

        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-bold font-headline" style={{ color: BLUE }}>
            {bmr.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-outline-variant mb-1">kcal / 일</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-outline-variant">
          <BmrMetric label="성별" value={gender === 'M' ? '남성' : '여성'} />
          <BmrMetric label="나이" value={`${age}세`} />
          <BmrMetric label="키" value={`${height}cm`} />
          <BmrMetric label="체중" value={`${weight}kg`} />
        </div>
      </DashboardCard>

      {infoOpen && <BmrInfoSheet onClose={() => setInfoOpen(false)} />}
    </>
  )
}

function BmrCardHeader({ onInfoClick }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-outline">기초대사량 (BMR)</h3>
      <button
        onClick={onInfoClick}
        className="w-6 h-6 flex items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors"
        style={{ borderColor: BLUE, color: BLUE }}
        aria-label="기초대사량 정보"
      >
        i
      </button>
    </div>
  )
}

function BmrMetric({ label, value }) {
  return (
    <span className="flex items-center gap-1">
      <span className="font-bold text-on-surface-variant">{label}</span> {value}
    </span>
  )
}

function BmrInfoSheet({ onClose }) {
  return (
    <BottomSheet onClose={onClose} defaultExpanded>
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-outline-variant/10">
        <h2 className="text-base font-bold font-headline text-on-surface">기초대사량이란?</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant text-xl"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 pb-10">
        <div className="bg-surface-container rounded-2xl p-4 mb-4">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            <span className="font-bold text-on-surface">기초대사량(BMR, Basal Metabolic Rate)</span><br />
            아무것도 하지 않고 완전히 안정된 상태에서 생명 유지에 필요한 최소한의 에너지양이에요.<br />
            호흡, 심장박동, 체온 유지 등 기본 신체 기능에 소비되며, 하루 총 소비 칼로리의
            약 60~70%를 차지해요.
          </p>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-3">해리스-베네딕트 공식 (개정판)</h3>
        <div className="space-y-3 mb-5">
          <FormulaCard
            title="남성"
            titleClassName="text-[#49AFE6]"
            className="bg-blue-50"
            lines={['(88.4 + 13.4 × 체중kg)', '+ (4.8 × 키cm)', '− (5.68 × 나이)']}
          />
          <FormulaCard
            title="여성"
            titleClassName="text-pink-500"
            className="bg-pink-50"
            lines={['(447.6 + 9.25 × 체중kg)', '+ (3.1 × 키cm)', '− (4.33 × 나이)']}
          />
        </div>

        <div className="border-t border-outline-variant/10 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-2">순 칼로리 계산</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface">순 칼로리 = 섭취 − (기초대사량 + 활동 소비)</span><br />
            적자(−)이면 체중 감소 방향, 과잉(+)이면 체중 증가 방향이에요.
          </p>
        </div>
      </div>
    </BottomSheet>
  )
}

function FormulaCard({ title, titleClassName, className, lines }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <p className={`text-[11px] font-bold mb-2 ${titleClassName}`}>{title}</p>
      <p className="text-xs font-mono text-on-surface leading-relaxed">
        {lines.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  )
}

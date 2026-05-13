import BottomSheet from '../../components/BottomSheet.jsx'

const GRADE_LEGEND = [
  { emoji: '🟢', name: '균형 식단', desc: '근육을 키우고 체지방은 줄이는 조합', border: '#4ADE80' },
  { emoji: '🟡', name: '일반 식단', desc: '평범한 구성, 목적에 따라 조절 필요',  border: '#FACC15' },
  { emoji: '🔴', name: '주의 식단', desc: '특정 영양소가 과하거나 부족해요',    border: '#F87171' },
]

function GradeRow({ item }) {
  return (
    <div className="flex items-center gap-3 py-2.5 pl-3" style={{ borderLeft: `3px solid ${item.border}` }}>
      <span className="text-xl w-7 text-center">{item.emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">{item.name}</span>
        <span className="text-xs text-on-surface-variant mt-0.5">{item.desc}</span>
      </div>
    </div>
  )
}

export default function FilterLegendSheet({ onClose }) {
  return (
    <BottomSheet onClose={onClose}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 pt-2 pb-3 shrink-0">
        <div>
          <h2 className="text-base font-bold font-headline text-on-surface">필터 안내</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">마커 색상과 태그의 의미를 알려드려요</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors text-lg"
        >
          ×
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">마커 색상</p>
          <div className="flex flex-col gap-0.5">
            {GRADE_LEGEND.map((item) => <GradeRow key={item.name} item={item} />)}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}

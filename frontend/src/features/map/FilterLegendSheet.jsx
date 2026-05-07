import { useState, useRef, useEffect } from 'react'

const GRADE_LEGEND = [
  { emoji: '🟢', name: '균형 식단', desc: '근육을 키우고 체지방은 줄이는 조합', border: '#4ADE80' },
  { emoji: '🟡', name: '일반 식단', desc: '평범한 구성, 목적에 따라 조절 필요',  border: '#FACC15' },
  { emoji: '🔴', name: '주의 식단', desc: '특정 영양소가 과하거나 부족해요',    border: '#F87171' },
]

const TAG_LEGEND = [
  { name: '고단백', desc: '근성장에 유리한 단백질 비중' },
  { name: '고지방', desc: '키토식이거나 칼로리 밀도가 높아요' },
  { name: '고탄수', desc: '에너지원이 풍부, 운동 전 식사로 적합' },
  { name: '저탄수', desc: '탄수화물을 제한한 식단' },
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

function TagRow({ item }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">
          <span className="text-primary mr-0.5">#</span>{item.name}
        </span>
        <span className="text-xs text-on-surface-variant mt-0.5">{item.desc}</span>
      </div>
    </div>
  )
}

export default function FilterLegendSheet({ onClose }) {
  const [translateY, setTranslateY] = useState(0)
  const dragStartY = useRef(null)
  const isDragging = useRef(false)
  const currentDelta = useRef(0)

  const startDrag = (clientY) => {
    dragStartY.current = clientY
    isDragging.current = true
  }
  const moveDrag = (clientY) => {
    if (!isDragging.current) return
    const delta = clientY - dragStartY.current
    if (delta > 0) { currentDelta.current = delta; setTranslateY(delta) }
  }
  const endDrag = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (currentDelta.current > 100) { onClose() }
    else { currentDelta.current = 0; setTranslateY(0) }
  }

  useEffect(() => {
    const onMove = (e) => moveDrag(e.clientY)
    const onUp = () => endDrag()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-modal bg-black/30 backdrop-blur-sm flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full bg-white rounded-t-3xl flex flex-col max-h-[75dvh]"
        style={{ transform: `translateY(${translateY}px)`, transition: isDragging.current ? 'none' : 'transform 0.25s ease' }}
      >
        {/* 드래그 핸들 */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab select-none shrink-0"
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          onTouchMove={(e) => moveDrag(e.touches[0].clientY)}
          onTouchEnd={endDrag}
          onMouseDown={(e) => startDrag(e.clientY)}
        >
          <div className="w-10 h-1 bg-outline-variant/40 rounded-full" />
        </div>

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
          {/* Grade 섹션 */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">마커 색상</p>
            <div className="flex flex-col gap-0.5">
              {GRADE_LEGEND.map((item) => <GradeRow key={item.name} item={item} />)}
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-outline-variant/20" />

          {/* Tag 섹션 */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">영양소 태그</p>
            <div className="flex flex-col gap-0.5">
              {TAG_LEGEND.map((item) => <TagRow key={item.name} item={item} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

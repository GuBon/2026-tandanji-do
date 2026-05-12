import { useState, useRef } from 'react'

/**
 * 공통 바텀시트 컴포넌트
 *
 * Props:
 *   onClose         - 시트를 닫을 때 호출
 *   overlay         - 딤 배경 표시 여부 (기본: true)
 *   mapMode         - 지도 위에서 사용 시 true → 외부 pointer-events-none (기본: false)
 *   defaultExpanded - 처음부터 확장 상태로 열기 (기본: false)
 *   children        - 시트 내용 (flex-col 컨테이너 안에 렌더링)
 *
 * 드래그 동작:
 *   핸들을 위로 60px+ → 확장 (92dvh)
 *   핸들을 아래로 80px+ (축소 상태) → 닫기
 *   핸들을 아래로 60px+ (확장 상태) → 축소 (65dvh)
 */
export default function BottomSheet({
  children,
  onClose,
  overlay = true,
  mapMode = false,
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(null)

  function dragStart(y) {
    startY.current = y
    setDragging(true)
  }

  function dragMove(y) {
    if (startY.current == null) return
    setDragY(Math.max(0, y - startY.current))
  }

  function dragEnd(y) {
    if (startY.current == null) return
    const delta = y - startY.current
    startY.current = null
    setDragging(false)
    setDragY(0)

    if (!expanded) {
      if (delta < -60) setExpanded(true)
      else if (delta > 80) onClose?.()
    } else {
      if (delta > 60) setExpanded(false)
    }
  }

  const tStart = (e) => dragStart(e.touches[0].clientY)
  const tMove  = (e) => dragMove(e.touches[0].clientY)
  const tEnd   = (e) => dragEnd(e.changedTouches[0].clientY)

  function mDown(e) {
    dragStart(e.clientY)
    const mm = (ev) => dragMove(ev.clientY)
    const mu = (ev) => {
      dragEnd(ev.clientY)
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', mu)
    }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu)
  }

  const panel = (
    <div
      className="w-full bg-white rounded-t-3xl shadow-xl flex flex-col"
      style={{
        maxHeight: expanded ? '92dvh' : '65dvh',
        transform: `translateY(${dragY}px)`,
        transition: dragging
          ? 'none'
          : 'transform 0.3s cubic-bezier(0.32,0.72,0,1), max-height 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="shrink-0 flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
        onTouchStart={tStart}
        onTouchMove={tMove}
        onTouchEnd={tEnd}
        onMouseDown={mDown}
      >
        <div className={`w-10 h-1 rounded-full transition-colors duration-300 ${expanded ? 'bg-gray-400' : 'bg-gray-200'}`} />
      </div>

      {children}
    </div>
  )

  if (mapMode) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-modal pointer-events-none">
        <div className="pointer-events-auto">{panel}</div>
      </div>
    )
  }

  return (
    <>
      {overlay && (
        <div className="fixed inset-0 z-modal bg-black/40" onClick={onClose} />
      )}
      <div className="fixed inset-x-0 bottom-0 z-modal">
        {panel}
      </div>
    </>
  )
}

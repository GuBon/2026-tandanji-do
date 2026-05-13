import { useState, useRef } from 'react'

const DEFAULT_HEIGHT = 52  // dvh — 기본 높이
const MAX_HEIGHT = 92      // dvh — 최대 높이
const CLOSE_THRESHOLD = 10 // dvh — 이 아래로 내리면 닫힘

export default function BottomSheet({
  children,
  onClose,
  overlay = true,
  mapMode = false,
  defaultExpanded = false,
}) {
  const [height, setHeight] = useState(defaultExpanded ? MAX_HEIGHT : DEFAULT_HEIGHT)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(null)
  const startHeight = useRef(null)

  function toDvh(px) {
    return px / (window.innerHeight / 100)
  }

  function dragStart(y) {
    startY.current = y
    startHeight.current = height
    setDragging(true)
  }

  function dragMove(y) {
    if (startY.current == null) return
    const delta = toDvh(startY.current - y)
    setHeight(Math.min(MAX_HEIGHT, Math.max(CLOSE_THRESHOLD, startHeight.current + delta)))
  }

  function dragEnd() {
    if (startY.current == null) return
    startY.current = null
    setDragging(false)
    setHeight(prev => {
      if (prev <= CLOSE_THRESHOLD) { onClose?.(); return DEFAULT_HEIGHT }
      return prev
    })
  }

  const tStart = (e) => dragStart(e.touches[0].clientY)
  const tMove  = (e) => dragMove(e.touches[0].clientY)
  const tEnd   = () => dragEnd()

  function mDown(e) {
    dragStart(e.clientY)
    const mm = (ev) => dragMove(ev.clientY)
    const mu = () => {
      dragEnd()
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
        height: `${height}dvh`,
        transition: dragging ? 'none' : 'height 0.3s cubic-bezier(0.32,0.72,0,1)',
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
        <div className={`w-10 h-1 rounded-full transition-colors duration-300 ${height > 60 ? 'bg-gray-400' : 'bg-gray-200'}`} />
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

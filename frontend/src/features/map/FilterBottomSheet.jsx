import { useState } from 'react'
import Button from '../../components/Button.jsx'

const NUTRIENTS = [
  { key: 'carbs',   label: '탄수화물', sub: 'CARBOHYDRATES', sliderMax: 300, defaultMin: 0,  defaultMax: 150 },
  { key: 'protein', label: '단백질',   sub: 'PROTEIN',       sliderMax: 300, defaultMin: 20, defaultMax: 80  },
  { key: 'fat',     label: '지방',     sub: 'FAT',           sliderMax: 150, defaultMin: 0,  defaultMax: 40  },
  { key: 'sugar',   label: '당류',     sub: 'SUGAR',         sliderMax: 80,  defaultMin: 0,  defaultMax: 15  },
]

const DEFAULTS = {
  carbs:   { min: 0,  max: 150 },
  protein: { min: 20, max: 80  },
  fat:     { min: 0,  max: 40  },
  sugar:   { min: 0,  max: 15  },
}

const THUMB =
  'appearance-none w-full h-full absolute bg-transparent pointer-events-none ' +
  '[&::-webkit-slider-runnable-track]:bg-transparent ' +
  '[&::-webkit-slider-thumb]:appearance-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto ' +
  '[&::-webkit-slider-thumb]:w-[22px] ' +
  '[&::-webkit-slider-thumb]:h-[22px] ' +
  '[&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:bg-primary ' +
  '[&::-webkit-slider-thumb]:shadow-md ' +
  '[&::-webkit-slider-thumb]:cursor-pointer ' +
  '[&::-moz-range-track]:bg-transparent ' +
  '[&::-moz-range-thumb]:pointer-events-auto ' +
  '[&::-moz-range-thumb]:w-[22px] ' +
  '[&::-moz-range-thumb]:h-[22px] ' +
  '[&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:bg-primary ' +
  '[&::-moz-range-thumb]:border-0 ' +
  '[&::-moz-range-thumb]:shadow-md ' +
  '[&::-moz-range-thumb]:cursor-pointer'

function NutrientSlider({ label, sub, sliderMax, minVal, maxVal, onMinChange, onMaxChange }) {
  const minPct = (minVal / sliderMax) * 100
  const maxPct = (maxVal / sliderMax) * 100

  const handleMin = (e) => {
    const v = Number(e.target.value)
    if (v < maxVal) onMinChange(v)
  }
  const handleMax = (e) => {
    const v = Number(e.target.value)
    if (v > minVal) onMaxChange(v)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {label} <span className="text-xs text-gray-400">({sub})</span>
        </span>
        <span className="text-base font-bold text-primary">
          {minVal}g - {maxVal}g
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        {/* 트랙 배경 */}
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-gray-200" />
        {/* min~max 구간 채움 */}
        <div
          className="absolute h-[3px] rounded-full bg-primary/30"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* min 핸들 */}
        <input
          type="range"
          min={0}
          max={sliderMax}
          value={minVal}
          onChange={handleMin}
          className={THUMB}
        />
        {/* max 핸들 */}
        <input
          type="range"
          min={0}
          max={sliderMax}
          value={maxVal}
          onChange={handleMax}
          className={THUMB}
        />
      </div>
    </div>
  )
}

export default function FilterBottomSheet({ onClose }) {
  const [values, setValues] = useState(DEFAULTS)

  const setMin = (key, v) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], min: v } }))
  const setMax = (key, v) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], max: v } }))

  return (
    <>
      <div className="fixed inset-0 z-modal bg-black/40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-modal bg-white rounded-t-3xl">
        {/* Pull Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2">
          <span className="text-xl font-bold text-[#1E293B]">영양성분 필터</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 슬라이더 목록 */}
        <div className="px-6 pt-4 pb-6 flex flex-col gap-8">
          {NUTRIENTS.map(({ key, label, sub, sliderMax }) => (
            <NutrientSlider
              key={key}
              label={label}
              sub={sub}
              sliderMax={sliderMax}
              minVal={values[key].min}
              maxVal={values[key].max}
              onMinChange={(v) => setMin(key, v)}
              onMaxChange={(v) => setMax(key, v)}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="px-6 pb-10 flex gap-3">
          <Button variant="sheet-cancel" onClick={() => setValues(DEFAULTS)}>초기화</Button>
          <Button variant="sheet-confirm" onClick={onClose}>적용하기</Button>
        </div>
      </div>
    </>
  )
}

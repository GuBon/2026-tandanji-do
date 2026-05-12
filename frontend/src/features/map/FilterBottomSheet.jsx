import { useState } from 'react'
import Button from '../../components/Button.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import FilterLegendSheet from './FilterLegendSheet.jsx'

const GRADES = [
  { key: 'GREEN',  label: '균형식', color: '#4ADE80', bg: '#F0FDF4' },
  { key: 'YELLOW', label: '일반식', color: '#FACC15', bg: '#FEFCE8' },
  { key: 'RED',    label: '주의식', color: '#F87171', bg: '#FFF1F2' },
]

const TAGS = [
  { key: '#고단백', label: '고단백' },
  { key: '#고지방', label: '고지방' },
  { key: '#고탄수', label: '고탄수' },
  { key: '#저탄수', label: '저탄수' },
]

const NUTRIENTS = [
  { key: 'carbs',   label: '탄수화물', sub: 'CARBOHYDRATES', sliderMax: 150, defaultMin: 0, defaultMax: 150 },
  { key: 'protein', label: '단백질',   sub: 'PROTEIN',       sliderMax: 100, defaultMin: 0, defaultMax: 100 },
  { key: 'fat',     label: '지방',     sub: 'FAT',           sliderMax: 100, defaultMin: 0, defaultMax: 100 },
]

const DEFAULTS = {
  carbs:   { min: 0, max: 150 },
  protein: { min: 0, max: 100 },
  fat:     { min: 0, max: 100 },
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
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-gray-200" />
        <div
          className="absolute h-[3px] rounded-full bg-primary/30"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <input type="range" min={0} max={sliderMax} value={minVal}
          onChange={(e) => { const v = Number(e.target.value); if (v < maxVal) onMinChange(v) }}
          className={THUMB}
        />
        <input type="range" min={0} max={sliderMax} value={maxVal}
          onChange={(e) => { const v = Number(e.target.value); if (v > minVal) onMaxChange(v) }}
          className={THUMB}
        />
      </div>
    </div>
  )
}

export default function FilterBottomSheet({
  onClose,
  activeFilters,
  onFilterChange,
  onApplyNutritionFilters,
  onResetNutritionFilters,
}) {
  const [values, setValues] = useState(DEFAULTS)
  const [legendOpen, setLegendOpen] = useState(false)

  const setMin = (key, v) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], min: v } }))
  const setMax = (key, v) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], max: v } }))

  const handleReset = () => {
    setValues(DEFAULTS)
    onFilterChange(null)
    onResetNutritionFilters?.()
  }

  const handleApply = () => {
    onApplyNutritionFilters?.(values)
    onClose()
  }

  return (
    <>
      <BottomSheet onClose={onClose} defaultExpanded>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1E293B]">필터</span>
            <button
              onClick={() => setLegendOpen(true)}
              className="w-6 h-6 flex items-center justify-center"
            >
              <img src="/images/question-mark.png" alt="필터 안내" className="w-5 h-5 object-contain drop-shadow" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-6 pb-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">매장 등급</span>
            <div className="flex gap-2">
              {GRADES.map(({ key, label, color, bg }) => {
                const isActive = activeFilters?.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => onFilterChange(key)}
                    className="flex-1 h-9 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={{
                      borderColor: isActive ? color : '#E5E7EB',
                      backgroundColor: isActive ? bg : 'white',
                      color: isActive ? color : '#9CA3AF',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">영양소 태그</span>
            <div className="flex gap-2">
              {TAGS.map(({ key, label }) => {
                const isActive = activeFilters?.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => onFilterChange(key)}
                    className={[
                      'flex-1 h-9 rounded-xl text-sm font-semibold border-2 transition-all',
                      isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-500',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">영양성분 상세</span>
            <div className="flex flex-col gap-8 pt-2">
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
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 pb-10 flex gap-3 shrink-0 border-t border-gray-100">
          <Button variant="sheet-cancel" onClick={handleReset}>초기화</Button>
          <Button variant="sheet-confirm" onClick={handleApply}>적용하기</Button>
        </div>
      </BottomSheet>

      {legendOpen && <FilterLegendSheet onClose={() => setLegendOpen(false)} />}
    </>
  )
}

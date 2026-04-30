import { useState } from 'react'

function MealChip({ label, value }) {
  return (
    <div className="text-[10px]">
      <span className="text-on-surface-variant uppercase font-medium mr-1">{label}</span>
      <span className="font-bold text-on-surface">{value}</span>
    </div>
  )
}

export default function DietMealCard({ meal, onRemove }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="flex items-center p-4 gap-4">
        {/* 썸네일 */}
        <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-3xl shrink-0">
          {meal.emoji ?? '🍽️'}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-base font-bold font-headline text-on-surface truncate pr-2">
              {meal.name}
            </h4>

            {/* ⋮ 메뉴 */}
            {onRemove && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                  className="p-1 hover:bg-surface-container rounded-full transition-colors"
                  aria-label="메뉴"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-outline-variant">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-outline-variant/30 rounded-xl shadow-xl z-10 min-w-[100px] py-1">
                    <button
                      onClick={() => { onRemove(); setMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors text-error"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 영양 칩 */}
          <div className="flex gap-4 mt-1">
            {meal.carbs > 0 && <MealChip label="탄" value={`${meal.carbs}g`} />}
            {meal.protein > 0 && <MealChip label="단" value={`${meal.protein}g`} />}
            {meal.fat > 0 && <MealChip label="지" value={`${meal.fat}g`} />}
          </div>
        </div>
      </div>
    </div>
  )
}

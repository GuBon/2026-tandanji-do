import PageLayout from '../../components/PageLayout.jsx'
import { useDiet } from './useDiet.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DietRecordPage() {
  const navigate = useNavigate()
  const { addMealEntry } = useDiet()
  const [form, setForm] = useState({ name: '', calories: '', carbs: '', protein: '', fat: '' })

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!form.name || !form.calories) return
    addMealEntry(form.name, form.calories, form.carbs, form.protein, form.fat)
    navigate('/record')
  }

  return (
    <PageLayout header={{ title: '식단 기록', left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button> }}>
      <div className="px-6 py-4 flex flex-col gap-6">
        {/* Hero — Visual Prompt */}
        <div className="w-full h-32 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-4xl">🍽️</span>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            { key: 'name',     label: '음식 이름',     type: 'text',   placeholder: '예) 된장찌개' },
            { key: 'calories', label: '칼로리 (kcal)', type: 'number', placeholder: '예) 350' },
            { key: 'carbs',    label: '탄수화물 (g)',  type: 'number', placeholder: '예) 45' },
            { key: 'protein',  label: '단백질 (g)',    type: 'number', placeholder: '예) 20' },
            { key: 'fat',      label: '지방 (g)',      type: 'number', placeholder: '예) 8' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="h-12 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
          ))}
        </form>

        {/* AI 분석 CTA */}
        <div className="h-[124px] bg-emerald-50 rounded-2xl flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">🤖</span>
          <p className="text-sm font-medium text-emerald-700">AI가 영양 성분을 자동 분석해드려요</p>
          <button className="text-xs text-emerald-600 underline">AI 분석 요청</button>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-colors"
        >
          기록 저장
        </button>
      </div>
    </PageLayout>
  )
}

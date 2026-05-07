import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useDiet } from './useDiet.js'

const MEAL_TYPES = ['아침', '점심', '저녁', '간식']

export default function DietRecordPage() {
  const navigate = useNavigate()
  const { addMealEntry } = useDiet()
  const [form, setForm] = useState({
    name: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    mealType: '간식',
  })
  const [imgUrl, setImgUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!form.name || !form.calories) return
    setSaving(true)
    setErr(null)
    try {
      await addMealEntry({
        name: form.name,
        calories: form.calories,
        carbs: form.carbs,
        protein: form.protein,
        fat: form.fat,
        mealType: form.mealType,
        ateAt: new Date().toISOString().slice(0, 19),
        imgUrl,
      })
      navigate('/record')
    } catch {
      setErr('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout header={{ title: '식단 기록', left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button> }}>
      <div className="px-6 py-4 flex flex-col gap-6">

        {/* 식사 사진 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500">식사 사진 <span className="text-gray-400">(선택)</span></label>
          <ImageUploader domain="diet" onChange={setImgUrl} aspectRatio="4/3" />
        </div>

        {/* 식사 유형 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">식사 유형</label>
          <div className="flex gap-2">
            {MEAL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, mealType: t }))}
                className={[
                  'flex-1 py-2 text-sm rounded-xl border transition-colors',
                  form.mealType === t
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'border-gray-200 text-gray-600',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
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

        {err && <p className="text-sm text-red-500 text-center">{err}</p>}

        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.calories || saving}
          className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-colors disabled:opacity-40"
        >
          {saving ? '저장 중...' : '기록 저장'}
        </button>
      </div>
    </PageLayout>
  )
}

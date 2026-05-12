import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useDiet } from './useDiet.js'
import { toLocalDateTimeStr } from '../../api/recordApi.js'
import { analyzeNutrition } from '../../api/chatbotApi.js'
import AiNutritionModal from './AiNutritionModal.jsx'

const MEAL_TYPES = ['아침', '점심', '저녁', '간식']

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

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
  const [aiFile, setAiFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiModalResult, setAiModalResult] = useState(null) // 'success' | 'fail'

  const handleAiAnalyze = async () => {
    if (!aiFile) return
    setAiAnalyzing(true)
    try {
      const dataUrl = await fileToDataUrl(aiFile)
      const data = await analyzeNutrition({ image: dataUrl })
      const hasMenu = data.menuId != null && data.menuName != null
      if (hasMenu) {
        setForm((f) => ({
          ...f,
          name: data.menuName ?? f.name,
          calories: data.kcal != null ? String(data.kcal) : f.calories,
          carbs: data.carbs != null ? String(data.carbs) : f.carbs,
          protein: data.protein != null ? String(data.protein) : f.protein,
          fat: data.fat != null ? String(data.fat) : f.fat,
        }))
        setAiModalResult('success')
      } else {
        setAiModalResult('fail')
      }
    } catch {
      setAiModalResult('fail')
    } finally {
      setAiAnalyzing(false)
    }
  }

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
        ateAt: toLocalDateTimeStr(),
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
    <>
      <PageLayout header={{ title: '식단 기록', left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button> }}>
        <div className="px-6 py-4 flex flex-col gap-6">

          {/* 식사 사진 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-500">식사 사진 <span className="text-gray-400">(선택)</span></label>
            <ImageUploader domain="diet" onChange={setImgUrl} onFile={setAiFile} aspectRatio="4/3" />

            {/* AI 영양성분 분석 */}
            <button
              type="button"
              onClick={handleAiAnalyze}
              disabled={!aiFile || aiAnalyzing}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 text-emerald-600 text-sm font-semibold transition-colors hover:bg-emerald-50 disabled:opacity-50"
            >
              {aiAnalyzing ? (
                <span className="animate-pulse">분석 중...</span>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H3zm11.25 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM5.05 14.888a.75.75 0 001.06-1.06l-1.06-1.062a.75.75 0 10-1.062 1.061l1.061 1.06zm8.841-1.06a.75.75 0 10-1.061-1.062l-1.062 1.061a.75.75 0 001.061 1.062l1.062-1.061zM10 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 13zM6.75 10a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z" clipRule="evenodd" />
                  </svg>
                  AI 영양성분 분석
                </>
              )}
            </button>
            {!aiFile && (
              <p className="text-xs text-gray-400 text-center">사진을 업로드하면 AI 영양성분 분석이 가능합니다</p>
            )}
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

      {aiModalResult && (
        <AiNutritionModal
          success={aiModalResult === 'success'}
          onClose={() => setAiModalResult(null)}
        />
      )}
    </>
  )
}

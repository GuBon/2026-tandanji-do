import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fromLonLat } from 'ol/proj'
import PageLayout from '../../components/PageLayout.jsx'
import { useChatbot } from './useChatbot.js'
import useMapStore from '../../store/useMapStore.js'

const GRADE_STYLE = {
  GREEN:  'bg-green-50 text-green-700 border-green-200',
  YELLOW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  RED:    'bg-red-50 text-red-700 border-red-200',
}
const GRADE_LABEL = { GREEN: '균형식', YELLOW: '일반식', RED: '주의식' }

function MacroRow({ item }) {
  if (item.carbs == null && item.protein == null && item.fat == null) return null
  return (
    <div className="flex gap-3 mt-1.5 text-[11px] text-gray-500">
      {item.carbs   != null && <span>탄 {item.carbs}g</span>}
      {item.protein != null && <span>단 {item.protein}g</span>}
      {item.fat     != null && <span>지 {item.fat}g</span>}
      {item.kcal    != null && <span className="ml-auto">{item.kcal}kcal</span>}
    </div>
  )
}

function RecommendCard({ item, onStoreClick }) {
  return (
    <button
      onClick={() => onStoreClick?.(item)}
      className="mt-2 w-full text-left bg-gray-50 border border-gray-100 rounded-xl p-3 active:bg-gray-100 transition-colors"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 truncate">{item.menuName}</p>
          <p className="text-[11px] text-gray-500 truncate">{item.storeName}</p>
        </div>
        {item.nutritionGrade && (
          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${GRADE_STYLE[item.nutritionGrade] ?? ''}`}>
            {GRADE_LABEL[item.nutritionGrade]}
          </span>
        )}
      </div>
      <MacroRow item={item} />
    </button>
  )
}

function AnalysisCard({ item }) {
  return (
    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 truncate">{item.menuName}</p>
          <p className="text-[11px] text-blue-500">가장 유사한 메뉴</p>
        </div>
        {item.nutritionGrade && (
          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${GRADE_STYLE[item.nutritionGrade] ?? ''}`}>
            {GRADE_LABEL[item.nutritionGrade]}
          </span>
        )}
      </div>
      <MacroRow item={item} />
    </div>
  )
}

function AssistantBubble({ msg, onStoreClick }) {
  return (
    <div className="self-start max-w-[85%]">
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white text-gray-700 shadow-sm text-sm whitespace-pre-wrap">
        {msg.text}
      </div>
      {msg.recommendations?.map((item, i) => (
        <RecommendCard key={i} item={item} onStoreClick={onStoreClick} />
      ))}
      {msg.analysis && <AnalysisCard item={msg.analysis} />}
    </div>
  )
}

export default function ChatbotPage() {
  const navigate = useNavigate()
  const { messages, loading, send, sendImage, isConfirming, confirmDiet } = useChatbot()
  const setPendingStore = useMapStore((s) => s.setPendingStore)
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState(null) // { file, previewUrl }
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleStoreClick = (item) => {
    if (!item.lat || !item.lon) return
    const [x, y] = fromLonLat([item.lon, item.lat])
    setPendingStore({ id: item.storeId, name: item.storeName, lat: item.lat, lon: item.lon, grade: item.nutritionGrade ?? null, x, y })
    navigate('/map')
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // pendingImage가 교체되거나 컴포넌트 언마운트 시 이전 ObjectURL 해제
  useEffect(() => {
    const url = pendingImage?.previewUrl
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [pendingImage])

  const setPendingImageFromFile = (file) => {
    setPendingImage({ file, previewUrl: URL.createObjectURL(file) })
  }

  const clearPendingImage = () => {
    setPendingImage(null)
  }

  const handleSend = () => {
    if (loading) return
    const text = input.trim()

    if (pendingImage) {
      sendImage(pendingImage.file, text || null)
      clearPendingImage()
      setInput('')
      return
    }

    if (!text) return
    setInput('')
    send(text)
  }

  const handleImageClick = () => {
    if (!loading) fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPendingImageFromFile(file)
      e.target.value = ''
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items ?? []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setPendingImageFromFile(file)
          e.preventDefault()
          break
        }
      }
    }
  }

  return (
    <PageLayout
      header={{
        title: 'AI 식단 도우미',
        left: (
          <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">
            ←
          </button>
        ),
      }}
      className="flex flex-col"
    >
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="self-end max-w-[85%] flex flex-col items-end gap-1">
              {msg.imageDataUrl && (
                <img
                  src={msg.imageDataUrl}
                  alt="분석 이미지"
                  className="max-w-full rounded-2xl rounded-br-sm border border-gray-200"
                />
              )}
              {msg.text && (
                <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-emerald-500 text-white text-sm">
                  {msg.text}
                </div>
              )}
            </div>
          ) : (
            <AssistantBubble key={msg.id} msg={msg} onStoreClick={handleStoreClick} />
          )
        )}

        {loading && (
          <div className="self-start max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white shadow-sm text-sm text-gray-400">
            분석 중...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 식단 추가 확인 버튼 */}
      {isConfirming && (
        <div className="mx-5 mb-2 flex gap-2 shrink-0">
          <button
            onClick={() => confirmDiet(true)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
          >
            네
          </button>
          <button
            onClick={() => confirmDiet(false)}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
          >
            아니오
          </button>
        </div>
      )}

      <div className="mx-5 mb-4 shrink-0">
        {/* 이미지 미리보기 */}
        {pendingImage && (
          <div className="mb-1.5 flex justify-end">
            <div className="relative inline-block">
              <img
                src={pendingImage.previewUrl}
                alt="첨부 이미지"
                className="h-20 max-w-[160px] object-cover rounded-xl border border-gray-200"
              />
              <button
                onClick={clearPendingImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white rounded-full text-[11px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="h-[58px] bg-white rounded-2xl shadow-lg flex items-center px-4 gap-2">
          {/* 이미지 업로드 버튼 */}
          <button
            onClick={handleImageClick}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center text-gray-500 shrink-0 transition-colors"
            title="음식 사진으로 영양성분 분석"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            onPaste={handlePaste}
            placeholder="원하는 식단이나 영양소를 입력하세요"
            disabled={loading}
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && !pendingImage)}
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white text-sm flex items-center justify-center transition-colors shrink-0"
          >
            ↑
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

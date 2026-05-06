import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CameraIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const RATIO_OPTIONS = [
  { label: '1:1', value: '1/1' },
  { label: '4:5', value: '4/5' },
  { label: '16:9', value: '16/9' },
]

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [ratio, setRatio] = useState('4/3')

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
      <Header
        left={
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <CloseIcon />
          </button>
        }
        title="게시글 작성"
        right={
          <button className="h-9 px-5 bg-primary hover:opacity-90 text-white text-sm font-bold rounded-full transition-opacity">
            등록
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-5 py-5 pb-10">

          {/* 이미지 업로드 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">이미지 업로드</span>
              <div className="flex items-center gap-1.5">
                {RATIO_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRatio(r.value)}
                    className={[
                      'text-[11px] font-semibold px-2 py-1 rounded-md transition-colors',
                      ratio === r.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500',
                    ].join(' ')}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-surface-container-low rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 py-12 transition-colors hover:border-primary/40"
              style={{ aspectRatio: ratio }}
            >
              <div className="relative">
                <CameraIcon />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-[11px] font-bold leading-none">+</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">사진을 추가하려면 탭하세요</p>
            </button>
          </div>

          {/* 내용 작성 */}
          <div className="flex flex-col gap-3">
            <span className="text-base font-bold text-gray-900">내용 작성</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이웃들과 건강한 정보를 공유해보세요..."
              rows={6}
              className="w-full bg-surface-container-low rounded-2xl px-4 py-3.5 text-sm text-gray-700 outline-none resize-none placeholder-gray-400"
            />
          </div>

          <p className="text-xs text-gray-400 leading-relaxed text-center">
            커뮤니티 가이드라인을 준수해주세요. 부적절한 게시글은 관리자에 의해 삭제될 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  )
}

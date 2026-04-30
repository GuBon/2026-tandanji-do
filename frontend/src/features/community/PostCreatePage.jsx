import PageLayout from '../../components/PageLayout.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [text, setText] = useState('')

  return (
    <PageLayout
      header={{
        title: '게시글 작성',
        left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button>,
        right: (
          <button className="h-9 px-5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-full transition-colors">
            게시
          </button>
        ),
      }}
    >
      <div className="px-6 py-4 flex flex-col gap-5">
        {/* 이미지 업로드 */}
        <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">📷</span>
          <p className="text-sm text-gray-400">사진을 추가하세요</p>
        </div>

        {/* 텍스트 입력 */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘의 식단을 공유해보세요..."
          className="w-full h-40 px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 resize-none bg-white"
        />

        {/* 태그 */}
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500">태그</p>
          <div className="flex flex-wrap gap-2">
            {['#식단', '#건강', '#다이어트'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 정책 안내 */}
        <p className="text-xs text-gray-400 leading-relaxed">
          커뮤니티 가이드라인을 준수하여 건강한 식문화를 만들어요.
        </p>
      </div>
    </PageLayout>
  )
}

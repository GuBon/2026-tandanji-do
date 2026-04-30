import PageLayout from '../../components/PageLayout.jsx'
import { useNavigate } from 'react-router-dom'

export default function PostDetailPage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      header={{
        left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button>,
        right: <button className="h-8 px-4 border border-gray-200 rounded-full text-xs text-gray-500">공유</button>,
      }}
    >
      {/* 이미지 영역 */}
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-sm shrink-0">
        게시글 이미지
      </div>

      {/* 댓글 영역 */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <p className="text-sm font-semibold text-gray-700">댓글</p>
        <div className="flex items-center justify-center text-sm text-gray-400 py-8">
          댓글 영역 (구현 예정)
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="w-full py-4 border-t border-gray-100 flex items-center px-5 gap-3 shrink-0 bg-white">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 h-[52px] bg-gray-50 rounded-2xl flex items-center px-4">
          <input type="text" placeholder="댓글을 입력하세요" className="flex-1 text-sm text-gray-700 bg-transparent outline-none" />
        </div>
        <button className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm flex items-center justify-center transition-colors">↑</button>
      </div>
    </PageLayout>
  )
}

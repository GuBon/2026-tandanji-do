import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import { useStoreDetail } from './useStoreDetail.js'
import {
  MenuToolbar,
  StoreDetailContent,
  StoreHero,
  StoreInfoSection,
  StoreTabs,
} from './StoreDetailSections.jsx'

export default function MapStorePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('메뉴')
  const [gradeFilter, setGradeFilter] = useState(null)
  const [sortKey, setSortKey] = useState('protein')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const { store, reviews, loading, error, submitReview, toggleReviewLike } = useStoreDetail(id)
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share && store) {
      await navigator.share({ title: store.name, url })
      return
    }
    await navigator.clipboard?.writeText(url)
  }

  const handleCreateReview = ({ star, content }) => {
    return requireAuth(async () => {
      try {
        setReviewSubmitting(true)
        setReviewError(null)
        await submitReview({ star, content })
        return true
      } catch {
        setReviewError('리뷰 작성에 실패했습니다.')
        return false
      } finally {
        setReviewSubmitting(false)
      }
    })
  }

  const handleToggleReviewLike = (reviewId) => {
    return requireAuth(() => toggleReviewLike(reviewId).catch(() => null))
  }

  if (loading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-sm text-gray-400">
        불러오는 중…
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-sm text-gray-400">
        가게 정보를 찾을 수 없어요
      </div>
    )
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-white">
      <StoreHero
        store={store}
        onBack={() => navigate(-1)}
        onShare={() => handleShare().catch(() => {})}
      />
      <StoreInfoSection store={store} />
      <StoreTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === '메뉴' && (
        <MenuToolbar
          gradeFilter={gradeFilter}
          onGradeChange={setGradeFilter}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <StoreDetailContent
          activeTab={activeTab}
          store={store}
          reviews={reviews}
          gradeFilter={gradeFilter}
          sortKey={sortKey}
          onCreateReview={handleCreateReview}
          onToggleReviewLike={handleToggleReviewLike}
          reviewSubmitting={reviewSubmitting}
          reviewError={reviewError}
        />
      </div>
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </div>
  )
}

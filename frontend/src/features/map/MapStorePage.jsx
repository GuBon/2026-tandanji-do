import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const { store, reviews, loading, error } = useStoreDetail(id)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share && store) {
      await navigator.share({ title: store.name, url })
      return
    }
    await navigator.clipboard?.writeText(url)
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
        />
      </div>
    </div>
  )
}

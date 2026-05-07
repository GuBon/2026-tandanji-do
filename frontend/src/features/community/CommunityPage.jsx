import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'

const TABS = ['식단 공유', '오운완', '자유 게시판']

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()

  return (
    <PageLayout
      customHeader={
        <Header
          right={<Button variant="gradient" onClick={() => navigate('/community/create', { state: { postType: TABS[activeTab] } })}>작성하기</Button>}
        />
      }
    >
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 shrink-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={[
              'shrink-0 h-9 px-4 rounded-full text-sm font-semibold transition-colors',
              activeTab === i
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 border border-gray-200',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-5 pb-28">
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          아직 게시글이 없어요
        </div>
      </div>
    </PageLayout>
  )
}

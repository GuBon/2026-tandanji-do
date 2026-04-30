import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import FAB from '../../components/FAB.jsx'
import DietTab from './DietTab.jsx'
import ExerciseTab from './ExerciseTab.jsx'
import ExerciseAddModal from './ExerciseAddModal.jsx'

const TABS = ['식단', '운동']

function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-white shrink-0">
      <div className="flex p-1 bg-surface-container rounded-full mx-5 mb-4">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => onTabChange(idx)}
            className={[
              'flex-1 py-2 text-sm transition-all rounded-full',
              activeTab === idx
                ? 'font-bold text-primary-dim bg-white shadow-sm'
                : 'font-medium text-on-surface-variant',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleFAB = () => {
    if (activeTab === 0) navigate('/diet')
    else setExerciseModalOpen(true)
  }

  return (
    <>
      <PageLayout
        customHeader={
          <>
            <Header right={<span className="text-base font-bold text-gray-700">기록</span>} />
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        }
        className="relative"
      >
        {activeTab === 0 ? <DietTab /> : <ExerciseTab />}

        <FAB onClick={handleFAB} className="absolute right-6 bottom-6 z-ui" />
      </PageLayout>

      {exerciseModalOpen && (
        <ExerciseAddModal onClose={() => setExerciseModalOpen(false)} />
      )}
    </>
  )
}

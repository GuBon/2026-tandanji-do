import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import Button from '../../components/Button.jsx'
import DietTab from './DietTab.jsx'
import ExerciseTab from './ExerciseTab.jsx'
import ExerciseAddModal from './ExerciseAddModal.jsx'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import { useExercise } from './useExercise.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'

const TABS = ['식단', '운동']

function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-white shrink-0">
      <div className="flex p-1 bg-surface-container rounded-full mx-4 mb-3">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => onTabChange(idx)}
            className={[
              'flex-1 py-1.5 text-xs transition-all rounded-full',
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
  const { requireAuth, modalOpen: authModalOpen, closeModal: closeAuthModal } = useAuthRequired()

  // 운동 데이터는 여기서 한 번만 로드 — ExerciseTab과 ExerciseAddModal에 props로 공유
  const {
    exercises,
    exerciseTypes,
    typesLoading,
    totalCalories,
    totalMinutes,
    loading: exerciseLoading,
    addExerciseEntry,
    removeExerciseEntry,
  } = useExercise()

  const handleAdd = () => {
    requireAuth(() => {
      if (activeTab === 0) navigate('/diet')
      else setExerciseModalOpen(true)
    })
  }

  return (
    <>
      <PageLayout
        customHeader={
          <>
            <Header right={<Button variant="gradient" onClick={handleAdd}>기록하기</Button>} />
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        }
      >
        {activeTab === 0 ? (
          <DietTab />
        ) : (
          <ExerciseTab
            exercises={exercises}
            totalCalories={totalCalories}
            totalMinutes={totalMinutes}
            loading={exerciseLoading}
            onRemove={removeExerciseEntry}
          />
        )}
      </PageLayout>

      {exerciseModalOpen && (
        <ExerciseAddModal
          exerciseTypes={exerciseTypes}
          typesLoading={typesLoading}
          onAdd={addExerciseEntry}
          onClose={() => setExerciseModalOpen(false)}
        />
      )}
      {authModalOpen && <AuthRequiredModal onClose={closeAuthModal} />}
    </>
  )
}

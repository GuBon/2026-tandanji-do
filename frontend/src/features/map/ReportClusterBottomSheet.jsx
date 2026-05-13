import { useState, useCallback } from 'react'
import { voteOnReport } from '../../api/reportApi.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import ReportVoteCard from './ReportVoteCard.jsx'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function ReportClusterBottomSheet({ cluster, onClose, onVoteSuccess }) {
  const [reports, setReports] = useState(cluster.reports)
  const { requireAuth, modalOpen: authOpen, closeModal: closeAuth } = useAuthRequired()

  const handleVote = useCallback((reportId, voteType) => (
    new Promise((resolve, reject) => {
      const called = requireAuth(async () => {
        try {
          const result = await voteOnReport(reportId, voteType)
          setReports((prev) =>
            prev.map((r) => r.reportId === reportId
              ? { ...r, upVotes: result.upVotes, downVotes: result.downVotes, myVote: result.myVote }
              : r
            )
          )
          onVoteSuccess?.()
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
      if (called === null) reject(new Error('auth_required'))
    })
  ), [requireAuth, onVoteSuccess])

  return (
    <>
      <div className="fixed inset-0 z-modal bg-black/40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-modal bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[75dvh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{cluster.storeName || '제보된 매장'}</h2>
            {cluster.storeAddress
              ? <p className="text-xs text-gray-400 mt-0.5 truncate">{cluster.storeAddress}</p>
              : <p className="text-xs text-gray-400 mt-0.5">투표 진행 중인 영양정보 제보</p>
            }
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3 shrink-0" />
        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {reports.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-gray-400">
              제보가 없어요
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reports.map((report) => (
                <ReportVoteCard key={report.reportId} report={report} onVote={handleVote} />
              ))}
            </div>
          )}
        </div>
      </div>
      {authOpen && <AuthRequiredModal onClose={closeAuth} />}
    </>
  )
}

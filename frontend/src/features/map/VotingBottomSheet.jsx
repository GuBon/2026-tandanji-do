import { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchPublicReports, voteOnReport } from '../../api/reportApi.js'
import { useAuthRequired } from '../../hooks/useAuthRequired.js'
import AuthRequiredModal from '../../components/AuthRequiredModal.jsx'
import ReportVoteCard from './ReportVoteCard.jsx'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function VotingBottomSheet({ onClose, onNavigate }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const { requireAuth, modalOpen: authOpen, closeModal: closeAuth } = useAuthRequired()

  useEffect(() => {
    fetchPublicReports()
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [])

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
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
      if (called === null) reject(new Error('auth_required'))
    })
  ), [requireAuth])

  const grouped = useMemo(() => reports.reduce((acc, r) => {
    const key = r.storeId ?? r.storeName
    if (!acc[key]) acc[key] = {
      storeName: r.storeName,
      storeAddress: r.storeAddress,
      storeLat: r.storeLat,
      storeLon: r.storeLon,
      storeId: r.storeId,
      items: [],
    }
    acc[key].items.push(r)
    return acc
  }, {}), [reports])

  return (
    <>
      <div className="fixed inset-0 z-modal bg-black/40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-modal bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[80dvh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">투표하기</h2>
            <p className="text-xs text-gray-400 mt-0.5">제보된 영양정보에 찬성/반대 투표를 해주세요</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3 shrink-0" />

        {/* 콘텐츠 */}
        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              불러오는 중…
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-gray-400">아직 등록된 제보가 없어요</p>
              <p className="text-xs text-gray-300">지도 화면에서 제보하기로 새 영양정보를 제보해 보세요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.values(grouped).map((group, gi) => (
                <div key={gi}>
                  <button
                    type="button"
                    disabled={group.storeLat == null}
                    onClick={() => { onNavigate?.(group); onClose() }}
                    className="w-full text-left mb-2 flex items-center justify-between gap-2 disabled:cursor-default active:opacity-70 transition-opacity"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800">{group.storeName}</p>
                      {group.storeAddress && (
                        <p className="text-xs text-gray-400 truncate">{group.storeAddress}</p>
                      )}
                    </div>
                    {group.storeLat != null && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-blue-400">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex flex-col gap-2">
                    {group.items.map((report) => (
                      <ReportVoteCard key={report.reportId} report={report} onVote={handleVote} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {authOpen && <AuthRequiredModal onClose={closeAuth} />}
    </>
  )
}

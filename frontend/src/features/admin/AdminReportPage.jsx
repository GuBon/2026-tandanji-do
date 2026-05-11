import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import Header from '../../components/Header.jsx'
import { useAdminReports } from './useAdminReports.js'

const STATUS_LABEL = {
  PENDING:  { text: '검토 중', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { text: '승인됨',  className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { text: '반려됨',  className: 'bg-red-100 text-red-600' },
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
      aria-label="뒤로가기"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function NutritionBadge({ label, value }) {
  return (
    <div className="flex-1 bg-surface-container-low rounded-xl px-2 py-1.5 flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-700">{value != null ? `${value}g` : '—'}</span>
    </div>
  )
}

function ActionButton({ label, onClick, variant }) {
  const base = 'flex-1 h-9 rounded-xl text-xs font-semibold transition-colors'
  const styles = {
    approve: 'bg-emerald-500 text-white active:bg-emerald-600',
    reject:  'bg-red-100 text-red-600 active:bg-red-200',
  }
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {label}
    </button>
  )
}

function ReportCard({ report, onApprove, onReject }) {
  const badge = STATUS_LABEL[report.status] ?? { text: report.status, className: 'bg-gray-100 text-gray-600' }
  const isPending = report.status === 'PENDING'

  return (
    <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-3 shadow-sm">

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-sm font-bold text-gray-800">{report.storeName ?? '—'}</span>
          {report.storeAddress && (
            <span className="text-[11px] text-gray-400 truncate">{report.storeAddress}</span>
          )}
          <span className="text-xs text-gray-500">{report.menuName}</span>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
          {badge.text}
        </span>
      </div>

      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={`${report.menuName} 제보 이미지`}
          className="h-36 w-full rounded-xl object-cover bg-surface-container-low"
        />
      )}

      <div className="flex gap-2">
        <NutritionBadge label="탄수화물" value={report.carbs} />
        <NutritionBadge label="단백질"   value={report.protein} />
        <NutritionBadge label="지방"     value={report.fat} />
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-2">
        <span className="text-xs text-gray-400">{report.userNickname}</span>
        <span className="text-xs text-gray-400">
          {new Date(report.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {isPending && (
        <div className="flex gap-2 pt-1">
          <ActionButton label="승인" variant="approve" onClick={() => onApprove(report.reportId)} />
          <ActionButton label="반려" variant="reject"  onClick={() => onReject(report.reportId)} />
        </div>
      )}

    </div>
  )
}

export default function AdminReportPage() {
  const navigate = useNavigate()
  const { reports, loading, error, reload, changeStatus } = useAdminReports()

  const pending  = reports.filter((r) => r.status === 'PENDING')
  const resolved = reports.filter((r) => r.status !== 'PENDING')

  return (
    <PageLayout
      customHeader={
        <Header
          title="제보 관리"
          left={<BackButton onClick={() => navigate(-1)} />}
        />
      }
    >
      <div className="flex flex-col gap-3 px-4 py-4">

        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">
            검토 중 <span className="font-semibold text-yellow-600">{pending.length}</span>건
            &nbsp;·&nbsp;
            처리 완료 <span className="font-semibold text-gray-500">{resolved.length}</span>건
          </span>
          <button
            onClick={reload}
            disabled={loading}
            className="text-xs text-emerald-600 font-medium underline underline-offset-2 disabled:opacity-40"
          >
            새로고침
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <span className="text-sm text-gray-400">불러오는 중...</span>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="flex justify-center py-12">
            <span className="text-sm text-gray-400">접수된 제보가 없습니다.</span>
          </div>
        )}

        {pending.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">검토 중</span>
            {pending.map((r) => (
              <ReportCard
                key={r.reportId}
                report={r}
                onApprove={(id) => changeStatus(id, 'APPROVED')}
                onReject={(id) => changeStatus(id, 'REJECTED')}
              />
            ))}
          </section>
        )}

        {resolved.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-2">처리 완료</span>
            {resolved.map((r) => (
              <ReportCard
                key={r.reportId}
                report={r}
                onApprove={(id) => changeStatus(id, 'APPROVED')}
                onReject={(id) => changeStatus(id, 'REJECTED')}
              />
            ))}
          </section>
        )}

      </div>
    </PageLayout>
  )
}

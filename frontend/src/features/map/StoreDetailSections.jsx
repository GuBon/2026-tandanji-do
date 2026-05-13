import { useState, useMemo } from 'react'

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const WalkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <path d="M9 20l3-7 3 4" /><path d="M6 10l6-2 4 4" />
  </svg>
)

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
  </svg>
)

const RatingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
    <path d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 2.8z" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

function formatRating(rating) {
  return rating != null ? Number(rating).toFixed(1) : '--'
}

export const SORT_OPTIONS = [
  { key: 'protein', label: '단백질순' },
  { key: 'carbs',   label: '탄수화물순' },
  { key: 'fat',     label: '지방순' },
]

const GRADE_CONFIG = {
  GREEN:  { border: '#4ADE80', bg: '#F0FDF4', badgeCls: 'bg-green-100 text-green-700',   label: '우수' },
  YELLOW: { border: '#FACC15', bg: '#FEFCE8', badgeCls: 'bg-yellow-100 text-yellow-700', label: '보통' },
  RED:    { border: '#F87171', bg: '#FFF5F5', badgeCls: 'bg-red-100 text-red-600',       label: '주의' },
}

const GRADE_FILTERS = [
  { key: null, label: '전체' },
  { key: 'GREEN', label: '🟢 우수' },
  { key: 'YELLOW', label: '🟡 보통' },
  { key: 'RED', label: '🔴 주의' },
]

function gradeFilterClass(key, active) {
  if (key === null) return active ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
  if (key === 'GREEN') return active ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700'
  if (key === 'YELLOW') return active ? 'bg-yellow-400 text-white' : 'bg-yellow-50 text-yellow-700'
  return active ? 'bg-red-400 text-white' : 'bg-red-50 text-red-600'
}

export function StoreHero({ store, onBack, onShare }) {
  return (
    <div className="relative w-full aspect-[16/9] bg-gray-200 shrink-0 flex items-center justify-center text-gray-300 text-sm">
      {store.image
        ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        : <span>사진</span>}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors"
      >
        <BackIcon />
      </button>
      <button
        onClick={onShare}
        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors"
      >
        <ShareIcon />
      </button>
    </div>
  )
}

export function StoreInfoSection({ store }) {
  return (
    <div className="px-5 pt-3 pb-3 bg-white border-b border-gray-100 shrink-0">
      <h1 className="text-xl font-bold text-gray-900 leading-tight">{store.name}</h1>
      <p className="text-xs text-gray-400 mt-0.5">{store.category}</p>
      <div className="mt-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <PinIcon /><span className="truncate">{store.address}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <span className="flex items-center gap-1.5">
            <WalkIcon />{store.distance} · 도보 {store.walkTime}
          </span>
          <span className="flex items-center gap-1.5">
            <FlameIcon /><span className="text-orange-500 font-medium">{store.kcal}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <RatingIcon />
            <span className="font-semibold text-amber-500">{formatRating(store.rating)}</span>
            <span className="text-gray-400">/ 5.0</span>
          </span>
        </div>
      </div>

      {store.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {store.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function StoreTabs({ activeTab, onChange }) {
  return (
    <div className="flex bg-white border-b border-gray-100 shrink-0">
      {['메뉴', '리뷰'].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={
            'flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ' +
            (activeTab === tab ? 'text-emerald-600 border-emerald-500' : 'text-gray-400 border-transparent')
          }
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function MenuToolbar({ gradeFilter, onGradeChange, sortKey, onSortChange }) {
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 shrink-0">
      <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-none">
        {GRADE_FILTERS.map(({ key, label }) => {
          const active = gradeFilter === key
          return (
            <button
              key={String(key)}
              onClick={() => onGradeChange(key)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${gradeFilterClass(key, active)}`}
            >
              {label}
            </button>
          )
        })}
      </div>
      <div className="relative shrink-0">
        <button
          onClick={() => setSortOpen((o) => !o)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 py-1.5"
        >
          {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
          <ChevronIcon open={sortOpen} />
        </button>
        {sortOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden min-w-[96px]">
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { onSortChange(key); setSortOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                    sortKey === key ? 'text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MenuReportVoteRow({ report, onToggleVote }) {
  const [optimistic, setOptimistic] = useState(null)
  const counts = optimistic ?? { upVotes: report.upVotes, downVotes: report.downVotes, myVote: report.myVote }

  const handleVote = async (type) => {
    const newMyVote = counts.myVote === type ? null : type
    setOptimistic({
      upVotes:   counts.upVotes   + (type === 'UP'   ? (newMyVote ? 1 : -1) : 0),
      downVotes: counts.downVotes + (type === 'DOWN' ? (newMyVote ? 1 : -1) : 0),
      myVote:    newMyVote,
    })
    try {
      const next = await onToggleVote(report.reportId, type)
      if (next) setOptimistic({ upVotes: next.upVotes, downVotes: next.downVotes, myVote: next.myVote })
    } catch {
      setOptimistic(null)
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5 bg-blue-50/60 rounded-xl px-3 py-2 border border-blue-100">
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-bold text-blue-600 mr-1">제보</span>
        {report.carbs != null && (
          <span className="text-[10px] bg-white text-blue-500 px-2 py-0.5 rounded-full border border-blue-100 font-semibold">탄 {report.carbs}g</span>
        )}
        {report.protein != null && (
          <span className="text-[10px] bg-white text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold">단 {report.protein}g</span>
        )}
        {report.fat != null && (
          <span className="text-[10px] bg-white text-orange-500 px-2 py-0.5 rounded-full border border-orange-100 font-semibold">지 {report.fat}g</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleVote('UP')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
            counts.myVote === 'UP' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-blue-50'
          }`}
        >
          <ThumbUpIcon filled={counts.myVote === 'UP'} />
          찬성 {counts.upVotes}
        </button>
        <button
          onClick={() => handleVote('DOWN')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
            counts.myVote === 'DOWN' ? 'bg-red-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-red-50'
          }`}
        >
          <ThumbDownIcon filled={counts.myVote === 'DOWN'} />
          반대 {counts.downVotes}
        </button>
      </div>
    </div>
  )
}

function MenuItem({ menu, reportGroup, onToggleReportVote }) {
  const conf = GRADE_CONFIG[menu.grade]
  return (
    <div
      className="flex flex-col px-5 py-2.5 border-b border-gray-100 last:border-0"
      style={conf ? { borderLeft: `3px solid ${conf.border}`, backgroundColor: conf.bg } : {}}
    >
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-xl bg-white/70 shrink-0 overflow-hidden flex items-center justify-center text-gray-300 text-xs border border-white/50">
          {menu.imageUrl
            ? <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
            : '사진'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800 leading-snug">{menu.name}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              {conf && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${conf.badgeCls}`}>
                  {conf.label}
                </span>
              )}
              {menu.price != null && menu.price > 0 && (
                <span className="text-sm font-bold text-emerald-700">{menu.price.toLocaleString()}원</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-1">{menu.description}</p>
          <div className="flex gap-1.5 mt-1.5">
            <span className="text-xs bg-blue-50 text-blue-500 px-2.5 py-0.5 rounded-full font-semibold">탄 {menu.nutrition.carbs}</span>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full font-semibold">단 {menu.nutrition.protein}</span>
            <span className="text-xs bg-orange-50 text-orange-500 px-2.5 py-0.5 rounded-full font-semibold">지 {menu.nutrition.fat}</span>
          </div>
          {menu.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {menu.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded-full bg-white/60 border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {reportGroup?.reports?.map((r) => (
        <MenuReportVoteRow key={r.reportId} report={r} onToggleVote={onToggleReportVote} />
      ))}
    </div>
  )
}

const ThumbUpIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
  </svg>
)

const ThumbDownIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
    <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6c-1.6-1.5-4.1-1.4-5.6.2L12 8.1 8.8 4.8C7.3 3.2 4.8 3.1 3.2 4.6c-1.8 1.7-1.9 4.5-.2 6.3l9 9.1 9-9.1c1.7-1.8 1.6-4.6-.2-6.3z" />
  </svg>
)

function ReviewItem({ review, onToggleLike }) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-800">{review.nickname ?? '익명'}</span>
        <span className="text-xs font-bold text-amber-500">★ {review.star}</span>
      </div>
      {review.content && (
        <p className="mt-2 text-sm leading-6 text-gray-600 whitespace-pre-wrap">{review.content}</p>
      )}
      <p className="mt-2 text-xs text-gray-400">
        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('ko-KR') : ''}
      </p>
      <button
        type="button"
        onClick={() => onToggleLike?.(review.reviewId)}
        className={`mt-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors ${
          review.liked ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 text-gray-500'
        }`}
      >
        <HeartIcon filled={review.liked} />
        {review.likeCount ?? 0}
      </button>
    </div>
  )
}

function ReviewComposer({ onCreateReview, submitting, error }) {
  const [star, setStar] = useState(5)
  const [content, setContent] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    const result = onCreateReview?.({ star, content })
    if (!result) return
    if (result && typeof result.then === 'function') {
      const ok = await result
      if (!ok) return
    }
    setStar(5)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-gray-900">리뷰 작성</p>
        <div className="flex items-center gap-1" aria-label="별점 선택">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStar(value)}
              className={`text-xl leading-none transition-colors ${value <= star ? 'text-amber-400' : 'text-gray-200'}`}
              aria-label={`${value}점`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value.slice(0, 1000))}
        placeholder="방문 경험을 남겨주세요"
        className="mt-3 min-h-24 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm leading-6 text-gray-700 outline-none focus:border-emerald-500 focus:bg-white"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className={`text-xs ${error ? 'text-red-500' : 'text-gray-400'}`}>
          {error ?? `${content.length}/1000`}
        </span>
        <button
          type="submit"
          disabled={submitting}
          className="h-9 px-4 rounded-full bg-primary text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? '등록 중' : '등록'}
        </button>
      </div>
    </form>
  )
}

export function StoreDetailContent({
  activeTab,
  store,
  reviews,
  menuReports,
  gradeFilter,
  sortKey,
  onCreateReview,
  onToggleReviewLike,
  onToggleMenuReportVote,
  reviewSubmitting,
  reviewError,
}) {
  const reportGroupById = useMemo(() => {
    const map = {}
    for (const group of menuReports ?? []) {
      if (group.menuId != null) map[group.menuId] = group
    }
    return map
  }, [menuReports])

  const reportGroupByName = useMemo(() => {
    const map = {}
    for (const group of menuReports ?? []) {
      if (group.menuId == null && group.menuName) map[group.menuName] = group
    }
    return map
  }, [menuReports])

  if (activeTab === '리뷰') {
    return (
      <div className="flex flex-col">
        <ReviewComposer
          onCreateReview={onCreateReview}
          submitting={reviewSubmitting}
          error={reviewError}
        />
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.reviewId}
              review={review}
              onToggleLike={onToggleReviewLike}
            />
          ))
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            아직 리뷰가 없어요
          </div>
        )}
      </div>
    )
  }

  const menus = (gradeFilter
    ? (store.menus?.filter((menu) => menu.grade === gradeFilter) ?? [])
    : (store.menus ?? [])
  ).slice().sort((a, b) => (b.raw?.[sortKey] ?? 0) - (a.raw?.[sortKey] ?? 0))

  return menus.length ? (
    <div className="flex flex-col">
      {menus.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          reportGroup={reportGroupById[menu.id] ?? reportGroupByName[menu.name]}
          onToggleReportVote={onToggleMenuReportVote}
        />
      ))}
    </div>
  ) : (
    <div className="h-40 flex items-center justify-center text-sm text-gray-400">
      {gradeFilter ? '해당 등급의 메뉴가 없어요' : '등록된 메뉴가 없어요'}
    </div>
  )
}

import { useEffect, useState } from 'react'
import {
  createStoreReview,
  fetchStoreReviews,
  fetchStoreWithMenus,
  toggleStoreReviewLike,
} from '../../api/storeApi.js'
import { fetchMenuReports, voteOnReport } from '../../api/reportApi.js'
import { useStoreDistance } from './useStoreDistance.js'

export function useStoreDetail(storeId) {
  const [baseStore, setBaseStore] = useState(null)
  const [reviews, setReviews] = useState([])
  const [menuReports, setMenuReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchStoreWithMenus(Number(storeId)),
      fetchStoreReviews(Number(storeId)).catch(() => []),
      fetchMenuReports(Number(storeId)).catch(() => []),
    ])
      .then(([storeData, reviewData, reportData]) => {
        if (cancelled) return
        setBaseStore(storeData)
        setReviews(reviewData ?? [])
        setMenuReports(reportData ?? [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [storeId])

  const distances = useStoreDistance(baseStore ? [baseStore] : [])
  const store = baseStore ? { ...baseStore, ...distances[baseStore.id] } : null

  const submitReview = async ({ star, content }) => {
    const created = await createStoreReview(Number(storeId), { star, content })
    setReviews((prev) => [created, ...prev])
    return created
  }

  const toggleReviewLike = async (reviewId) => {
    const next = await toggleStoreReviewLike(Number(storeId), reviewId)
    setReviews((prev) => prev.map((review) => (
      review.reviewId === reviewId
        ? { ...review, liked: next.liked, likeCount: next.likeCount }
        : review
    )))
    return next
  }

  const toggleMenuReportVote = async (reportId, voteType) => {
    const next = await voteOnReport(reportId, voteType)
    setMenuReports((prev) => prev.map((group) => ({
      ...group,
      reports: group.reports.map((r) =>
        r.reportId === reportId
          ? { ...r, upVotes: next.upVotes, downVotes: next.downVotes, myVote: next.myVote }
          : r
      ),
    })))
    return next
  }

  return { store, reviews, menuReports, loading, error, submitReview, toggleReviewLike, toggleMenuReportVote }
}

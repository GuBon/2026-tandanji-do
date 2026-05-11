import { useEffect, useState } from 'react'
import {
  createStoreReview,
  fetchStoreReviews,
  fetchStoreWithMenus,
  toggleStoreReviewLike,
} from '../../api/storeApi.js'
import { useStoreDistance } from './useStoreDistance.js'

export function useStoreDetail(storeId) {
  const [baseStore, setBaseStore] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchStoreWithMenus(Number(storeId)),
      fetchStoreReviews(Number(storeId)).catch(() => []),
    ])
      .then(([storeData, reviewData]) => {
        if (cancelled) return
        setBaseStore(storeData)
        setReviews(reviewData ?? [])
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

  return { store, reviews, loading, error, submitReview, toggleReviewLike }
}

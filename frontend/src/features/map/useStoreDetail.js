import { useEffect, useState } from 'react'
import { fetchStoreReviews, fetchStoreWithMenus } from '../../api/storeApi.js'
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

  return { store, reviews, loading, error }
}

import { apiClient } from './apiClient.js'

function deriveTagsFromMacro(carbs, protein, fat) {
  const tags = []
  if (protein >= 25) tags.push('고단백')
  if (carbs <= 40)   tags.push('저탄수')
  if (carbs >= 80)   tags.push('고탄수')
  if (fat <= 10)     tags.push('저지방')
  if (fat >= 25)     tags.push('고지방')
  return tags
}

function normalizeMarker(raw) {
  const { carbs, protein, fat, nutritionGrade } = raw.markerMacro ?? {}
  const nutritionTags = raw.markerMacro?.nutritionTags
  const lr = raw.latestReportMacro
  return {
    id:           raw.storeId,
    name:         raw.storeName,
    address:      raw.address,
    lat:          raw.latitude,
    lon:          raw.longitude,
    category:     raw.category,
    brandLogoUrl: raw.brandLogoUrl ?? null,
    rating:       raw.rating ?? null,
    grade:        nutritionGrade ?? null,
    tags:         nutritionTags?.length ? nutritionTags : deriveTagsFromMacro(carbs ?? 0, protein ?? 0, fat ?? 0),
    nutrition: {
      carbs:   carbs   != null ? `${carbs}g`   : '--',
      protein: protein != null ? `${protein}g` : '--',
      fat:     fat     != null ? `${fat}g`     : '--',
    },
    raw: {
      carbs:   carbs   ?? null,
      protein: protein ?? null,
      fat:     fat     ?? null,
    },
    reportCount: raw.reportCount ?? 0,
    latestReport: lr ? {
      carbs:   lr.carbs   != null ? `${lr.carbs}g`   : '--',
      protein: lr.protein != null ? `${lr.protein}g` : '--',
      fat:     lr.fat     != null ? `${lr.fat}g`     : '--',
    } : null,
  }
}

function normalizeStoreDetail(rawDetail, rawMenus) {
  return {
    id:        rawDetail.storeId,
    name:      rawDetail.storeName,
    category:  rawDetail.category,
    address:   rawDetail.address,
    lat:       rawDetail.latitude,
    lon:       rawDetail.longitude,
    image:     rawDetail.imageUrl ?? null,
    rating:    rawDetail.rating ?? null,
    grade:     null,
    tags:      [],
    nutrition: { carbs: '--', protein: '--', fat: '--' },
    menus:     (rawMenus ?? []).map((m) => ({
      id:          m.menuId,
      name:        m.menuName,
      description: '',
      price:       null,
      imageUrl:    m.menuUrl ?? null,
      grade:       m.nutritionGrade ?? null,
      tags:        m.nutritionTags ?? [],
      nutrition: {
        carbs:   m.carbs   != null ? `${m.carbs}g`   : '--',
        protein: m.protein != null ? `${m.protein}g` : '--',
        fat:     m.fat     != null ? `${m.fat}g`     : '--',
      },
      raw: {
        carbs:   m.carbs   ?? 0,
        protein: m.protein ?? 0,
        fat:     m.fat     ?? 0,
      },
    })),
  }
}

export async function searchStores({ swLat, swLng, neLat, neLng, filters = null, signal } = {}) {
  const params = new URLSearchParams({
    sw_lat: swLat, sw_lng: swLng, ne_lat: neLat, ne_lng: neLng,
  })
  if (filters?.keyword?.trim()) params.set('q', filters.keyword.trim())
  if (filters?.category) params.set('category', filters.category)
  const res = await apiClient(`/stores/search?${params}`, { signal })
  if (!res.ok) throw new Error(`searchStores ${res.status}`)
  const { data } = await res.json()
  return (data ?? []).map(normalizeMarker)
}

export async function fetchStoreWithMenus(storeId) {
  const [detailRes, menusRes] = await Promise.all([
    apiClient(`/stores/${storeId}`),
    apiClient(`/stores/${storeId}/menus`),
  ])
  if (!detailRes.ok) throw new Error(`fetchStoreDetail ${detailRes.status}`)
  const { data: rawDetail } = await detailRes.json()
  const { data: rawMenus } = menusRes.ok ? await menusRes.json() : { data: [] }
  return normalizeStoreDetail(rawDetail, rawMenus)
}

export async function fetchStoreReviews(storeId) {
  const res = await apiClient(`/stores/${storeId}/reviews`)
  if (!res.ok) throw new Error(`fetchStoreReviews ${res.status}`)
  const { data } = await res.json()
  return data ?? []
}

export async function createStoreReview(storeId, { star, content }) {
  const res = await apiClient(`/stores/${storeId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({
      star,
      content: content?.trim() ? content.trim() : null,
    }),
  })
  if (!res.ok) throw new Error(`createStoreReview ${res.status}`)
  const { data } = await res.json()
  return data
}

export async function toggleStoreReviewLike(storeId, reviewId) {
  const res = await apiClient(`/stores/${storeId}/reviews/${reviewId}/likes`, { method: 'POST' })
  if (!res.ok) throw new Error(`toggleStoreReviewLike ${res.status}`)
  const { data } = await res.json()
  return data
}

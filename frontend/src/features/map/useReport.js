import { useState } from 'react'
import { submitReport } from '../../api/reportApi.js'

const INITIAL_FORM = {
  storeName: '',
  storeAddress: '',
  storeLat: null,
  storeLon: null,
  menuName: '',
  carbs: '',
  protein: '',
  fat: '',
}

export function useReport({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setFieldValue = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const setPlace = ({ placeName, address, lat, lon }) => {
    setForm((f) => ({ ...f, storeName: placeName, storeAddress: address, storeLat: lat, storeLon: lon }))
  }

  const clearPlaceDetails = () => {
    setForm((f) => ({ ...f, storeAddress: '', storeLat: null, storeLon: null }))
  }

  const clearPlace = () => setForm((f) => ({ ...f, storeName: '', storeAddress: '', storeLat: null, storeLon: null }))

  const reset = () => setForm(INITIAL_FORM)

  const submit = async (imageUrl = null) => {
    if (!form.storeName.trim() || !form.menuName.trim()) {
      setError('매장명과 메뉴명은 필수입니다.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      await submitReport({
        storeName:    form.storeName.trim(),
        storeAddress: form.storeAddress || null,
        storeLat:     form.storeLat,
        storeLon:     form.storeLon,
        menuName:     form.menuName.trim(),
        carbs:        form.carbs   ? Number(form.carbs)   : null,
        protein:      form.protein ? Number(form.protein) : null,
        fat:          form.fat     ? Number(form.fat)     : null,
        imageUrl,
      })
      reset()
      onSuccess?.()
    } catch {
      setError('제보 전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return { form, setField, setFieldValue, setPlace, clearPlaceDetails, clearPlace, loading, error, submit }
}

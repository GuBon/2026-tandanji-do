import { useState } from 'react'
import { submitReport } from '../../api/reportApi.js'

const INITIAL_FORM = { storeName: '', menuName: '', carbs: '', protein: '', fat: '' }

export function useReport({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

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
        storeName: form.storeName.trim(),
        menuName: form.menuName.trim(),
        carbs:    form.carbs   ? Number(form.carbs)   : null,
        protein:  form.protein ? Number(form.protein) : null,
        fat:      form.fat     ? Number(form.fat)     : null,
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

  return { form, setField, loading, error, submit }
}

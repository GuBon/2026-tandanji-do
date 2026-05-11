import { useState } from 'react'
import useMapStore from '../../store/useMapStore.js'
import { getRecommendations, analyzeNutrition } from '../../api/chatbotApi.js'
import { createDietLog, toLocalDateTimeStr } from '../../api/recordApi.js'

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'assistant',
  text: '안녕하세요! \n당신의 건강을 위한 AI탄단지봇 입니다.\n날씨나, 조건에 따라 현재 위치 주변의 건강한 메뉴를 추천해드릴게요.\n원하시는 식단이나 영양소를 입력하거나, 음식 사진을 올려 영양성분을 분석해보세요.',
}

function getMealType() {
  const h = new Date().getHours()
  if (h >= 6 && h < 11) return '아침'
  if (h >= 11 && h < 15) return '점심'
  if (h >= 18 && h < 22) return '저녁'
  return '간식'
}

function fileToJpegDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지 로드 실패'))
    }
    img.src = url
  })
}

export function useChatbot() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [loading, setLoading] = useState(false)
  const [pendingDietItems, setPendingDietItems] = useState(null)

  const latLon = useMapStore((s) => s.latLon)
  const weather = useMapStore((s) => s.weather)
  const temperature = useMapStore((s) => s.temperature)

  const appendMsgs = (newMsgs) =>
    setMessages((prev) => [
      ...prev,
      ...newMsgs.map((m) => ({ id: crypto.randomUUID(), ...m })),
    ])

  const addAssistant = (text, extras = {}) =>
    appendMsgs([{ role: 'assistant', text, ...extras }])

  const promptDietAdd = (items) => {
    const addable = items.filter((item) => item.menuName != null)
    if (addable.length === 0) return
    appendMsgs([{ role: 'assistant', text: '식단 기록에 추가하시겠어요?' }])
    setPendingDietItems(addable)
  }

  const confirmDiet = async (isYes) => {
    const items = pendingDietItems
    setPendingDietItems(null)

    if (!isYes) {
      addAssistant('네 도움되셨길 바래요~')
      return
    }

    setLoading(true)
    try {
      await Promise.all(
        items.map((item) =>
          createDietLog({
            foodName: item.menuName,
            mealType: getMealType(),
            logKcal: Number(item.kcal ?? 0),
            logCarbs: Number(item.carbs ?? 0),
            logProtein: Number(item.protein ?? 0),
            logFat: Number(item.fat ?? 0),
            logSugar: 0,
            ateAt: toLocalDateTimeStr(),
          })
        )
      )
      addAssistant('식단기록에 추가되었어요. 기록탭에서 확인해보세요.')
    } catch (e) {
      if (String(e.message) === '401') {
        addAssistant('식단 기록을 추가하려면 로그인이 필요해요.')
      } else {
        addAssistant('식단 기록 추가에 실패했어요. 다시 시도해 주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  const send = async (text) => {
    if (!text.trim() || loading) return

    appendMsgs([{ role: 'user', text }])

    // 식단 추가 확인 대기 중 — 네/아니오 처리
    if (pendingDietItems !== null) {
      const isYes = text.trim() === '네' || text.trim().startsWith('네')
      await confirmDiet(isYes)
      return
    }

    setLoading(true)

    if (!latLon?.lat || !latLon?.lon) {
      addAssistant('위치 정보가 없어요. 지도 화면에서 현재 위치를 먼저 설정해 주세요.')
      setLoading(false)
      return
    }

    try {
      const data = await getRecommendations({
        lat: latLon.lat,
        lng: latLon.lon,
        weather,
        temperature,
        message: text,
      })
      const recs = data.recommendations ?? []
      const newMsgs = [{ role: 'assistant', text: data.reason, recommendations: recs }]
      if (recs.length > 0) {
        newMsgs.push({ role: 'assistant', text: '원하시는 메뉴를 누르시면 해당 매장으로 이동합니다.' })
      }
      appendMsgs(newMsgs)
    } catch {
      addAssistant('요청을 처리하지 못했어요. 위치나 입력을 다시 확인한 뒤 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const sendImage = async (file) => {
    if (loading) return
    setLoading(true)

    let dataUrl
    try {
      dataUrl = await fileToJpegDataUrl(file)
    } catch {
      addAssistant('이미지를 읽지 못했어요. 다시 시도해 주세요.')
      setLoading(false)
      return
    }

    appendMsgs([{ role: 'user', imageDataUrl: dataUrl }])

    try {
      const data = await analyzeNutrition({ image: dataUrl })
      const hasMenu = data.menuId != null && data.menuName != null
      appendMsgs([{ role: 'assistant', text: data.reason, analysis: hasMenu ? data : null }])
      if (hasMenu) promptDietAdd([data])
    } catch {
      addAssistant('이미지 분석을 처리하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return {
    messages,
    loading,
    send,
    sendImage,
    isConfirming: pendingDietItems !== null,
    confirmDiet,
  }
}

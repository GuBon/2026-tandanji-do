import { apiClient } from './apiClient.js'

export async function getRecommendations({ lat, lng, weather, temperature, message }) {
  const body = { lat, lng, message }
  if (weather) body.weather = weather
  if (temperature != null) body.temperature = temperature

  const res = await apiClient('/chatbot/recommend', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`chatbot ${res.status}`)
  const { data } = await res.json()
  return data
}

export async function analyzeNutrition({ image }) {
  const res = await apiClient('/chatbot/analyze', {
    method: 'POST',
    body: JSON.stringify({ image }),
  })
  if (!res.ok) throw new Error(`analyze ${res.status}`)
  const { data } = await res.json()
  return data
}

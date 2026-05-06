import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (import.meta.env.VITE_KAKAO_APP_KEY && window.Kakao) {
  window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

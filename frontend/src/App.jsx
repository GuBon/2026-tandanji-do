import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './features/auth/AuthGuard.jsx'
import MapPage from './features/map/MapPage.jsx'
import MapStorePage from './features/map/MapStorePage.jsx'
import DietRecordPage from './features/record/DietRecordPage.jsx'
import RecordPage from './features/record/RecordPage.jsx'
import ChatbotPage from './features/chatbot/ChatbotPage.jsx'
import CommunityPage from './features/community/CommunityPage.jsx'
import PostCreatePage from './features/community/PostCreatePage.jsx'
import PostDetailPage from './features/community/PostDetailPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map/store/:id" element={<MapStorePage />} />
          <Route path="/diet" element={<DietRecordPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/create" element={<PostCreatePage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  )
}

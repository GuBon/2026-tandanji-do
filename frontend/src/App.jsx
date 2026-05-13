import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './features/auth/AuthGuard.jsx'
import AdminGuard from './features/admin/AdminGuard.jsx'
import OAuthCallbackPage from './features/auth/OAuthCallbackPage.jsx'
import MapPage from './features/map/MapPage.jsx'
import MapStorePage from './features/map/MapStorePage.jsx'
import DietRecordPage from './features/record/DietRecordPage.jsx'
import RecordPage from './features/record/RecordPage.jsx'
import ChatbotPage from './features/chatbot/ChatbotPage.jsx'
import CommunityPage from './features/community/CommunityPage.jsx'
import PostCreatePage from './features/community/PostCreatePage.jsx'
import PostDetailPage from './features/community/PostDetailPage.jsx'
import AdminReportPage from './features/admin/AdminReportPage.jsx'
import BodyProfilePage from './features/user/BodyProfilePage.jsx'
import DashboardPage from './features/record/DashboardPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 카카오 OAuth 콜백 — AuthGuard 바깥에서 처리 */}
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        <Route
          path="/*"
          element={
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Navigate to="/map" replace />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/map/store/:id" element={<MapStorePage />} />
                <Route path="/diet" element={<DietRecordPage />} />
                <Route path="/record" element={<RecordPage />} />
                <Route path="/record/dashboard" element={<DashboardPage />} />
                <Route path="/profile/body" element={<BodyProfilePage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/create" element={<PostCreatePage />} />
                <Route path="/community/post/:id" element={<PostDetailPage />} />

                {/* 관리자 전용 라우트 */}
                <Route
                  path="/admin/reports"
                  element={
                    <AdminGuard>
                      <AdminReportPage />
                    </AdminGuard>
                  }
                />
              </Routes>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

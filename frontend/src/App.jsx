import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './features/auth/AuthGuard.jsx'
import AdminGuard from './features/admin/AdminGuard.jsx'

const OAuthCallbackPage = lazy(() => import('./features/auth/OAuthCallbackPage.jsx'))
const MapPage = lazy(() => import('./features/map/MapPage.jsx'))
const MapStorePage = lazy(() => import('./features/map/MapStorePage.jsx'))
const DietRecordPage = lazy(() => import('./features/record/DietRecordPage.jsx'))
const RecordPage = lazy(() => import('./features/record/RecordPage.jsx'))
const DashboardPage = lazy(() => import('./features/record/DashboardPage.jsx'))
const BodyProfilePage = lazy(() => import('./features/user/BodyProfilePage.jsx'))
const ChatbotPage = lazy(() => import('./features/chatbot/ChatbotPage.jsx'))
const CommunityPage = lazy(() => import('./features/community/CommunityPage.jsx'))
const PostCreatePage = lazy(() => import('./features/community/PostCreatePage.jsx'))
const PostDetailPage = lazy(() => import('./features/community/PostDetailPage.jsx'))
const AdminReportPage = lazy(() => import('./features/admin/AdminReportPage.jsx'))

function RouteFallback() {
  return (
    <div className="h-dvh flex items-center justify-center bg-surface text-sm font-medium text-on-surface-variant">
      불러오는 중...
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </BrowserRouter>
  )
}

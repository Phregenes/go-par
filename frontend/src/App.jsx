import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppLayout } from './layouts/AppLayout.jsx'
import { AccountPage } from './pages/AccountPage.jsx'
import { ActivitiesPage } from './pages/ActivitiesPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/account" element={<AccountPage />} />
            {/* Legacy Portuguese paths */}
            <Route
              path="/atividades"
              element={<Navigate to="/activities" replace />}
            />
            <Route path="/entrar" element={<Navigate to="/login" replace />} />
            <Route
              path="/cadastro"
              element={<Navigate to="/signup" replace />}
            />
            <Route path="/conta" element={<Navigate to="/account" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
}

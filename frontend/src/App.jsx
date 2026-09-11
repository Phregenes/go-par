import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppLayout } from './layouts/AppLayout.jsx'
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
            <Route path="/atividades" element={<ActivitiesPage />} />
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastro" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
}

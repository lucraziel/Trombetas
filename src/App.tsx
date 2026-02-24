import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import Home from './pages/Home'
import PrayPage from './pages/Pray'
import EventsPage from './pages/Events'
import CommunityPage from './pages/Community'
import ProfilePage from './pages/Profile'
import TrophiesPage from './pages/Trophies'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'

// ─────────────────────────────────────────────
// Layout protegido (apenas usuários autenticados)
// ─────────────────────────────────────────────
function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const { user } = useUser()

    // Monta o objeto de usuário a partir do Clerk
    const currentUser = user
        ? {
            full_name: user.fullName ?? user.firstName ?? 'Usuário',
            username: user.username ?? user.primaryEmailAddress?.emailAddress.split('@')[0] ?? 'user',
            avatar_url: user.imageUrl ?? '',
        }
        : { full_name: 'Carregando...', username: '', avatar_url: '' }

    return (
        <div className="app-shell">
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 25 }}
                />
            )}

            <Sidebar
                open={sidebarOpen}
                currentPath={location.pathname}
                user={currentUser}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="main-content">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/pray" element={<PrayPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/trophies" element={<TrophiesPage />} />
                        {/* Redireciona rotas de auth para home se já logado */}
                        <Route path="/sign-in" element={<Navigate to="/" replace />} />
                        <Route path="/sign-up" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>

            <BottomNav currentPath={location.pathname} />
        </div>
    )
}

// ─────────────────────────────────────────────
// Roteador raiz — separa rotas públicas das protegidas
// ─────────────────────────────────────────────
function RootRouter() {
    return (
        <Routes>
            {/* Rotas públicas de auth */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Todas as outras rotas exigem auth */}
            <Route
                path="/*"
                element={
                    <>
                        <SignedIn>
                            <AppShell />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                }
            />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <RootRouter />
        </BrowserRouter>
    )
}

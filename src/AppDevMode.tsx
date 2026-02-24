// AppDevMode — versão sem Clerk para testes locais
// Remover após configurar VITE_CLERK_PUBLISHABLE_KEY no .env

import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import Home from './pages/Home'
import PrayPage from './pages/Pray'
import EventsPage from './pages/Events'
import CommunityPage from './pages/Community'
import ProfilePage from './pages/Profile'
import TrophiesPage from './pages/Trophies'

// Usuário de demonstração (substitui Clerk em modo dev)
const DEV_USER = {
    full_name: 'David Miller',
    username: 'davidm_prayer',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRXQywJD8I1k0hwr2T6V6LHfjcMnXww3JIR9uoPDklFHasKp4ggFtABxoDYRP8hsHeMeVocc1h1lNjh8HPbyjn-Fnag8Jei3qR1FyOZvm6iVdFSIy5SK_OYvyLRrhI3HuP6yYeOJzPisWTe6bY3dNARPrpulNeahAqvtvXH_HJtyP_tlsUAnr4MG-LpwA1dT-xYaph7IIQL8tKFsD5h8LaApXHYjwIQxIdGmPhaTOo3mCEUJC7BJMd35Ftf6l1ij3zAX6jZUaeBJg',
}

function DevShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    return (
        <div className="app-shell">
            {/* Banner de modo dev */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                background: 'linear-gradient(90deg, #f5a623, #f76b1c)',
                color: '#000', fontSize: 12, fontWeight: 800,
                textAlign: 'center', padding: '5px 0',
                letterSpacing: '0.04em',
            }}>
                ⚠️ MODO DEV — Sem autenticação real. Configure VITE_CLERK_PUBLISHABLE_KEY no .env para ativar o Clerk.
            </div>

            {/* Ajusta espaço do banner */}
            <style>{`
        .sidebar { top: 27px !important; height: calc(100vh - 27px) !important; }
        .main-content { padding-top: 27px; }
      `}</style>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 25 }}
                />
            )}

            <Sidebar
                open={sidebarOpen}
                currentPath={location.pathname}
                user={DEV_USER}
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
                    </Routes>
                </div>
            </div>

            <BottomNav currentPath={location.pathname} />
        </div>
    )
}

export default function AppDevMode() {
    return (
        <BrowserRouter>
            <DevShell />
        </BrowserRouter>
    )
}

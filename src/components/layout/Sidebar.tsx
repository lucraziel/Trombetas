import { useNavigate } from 'react-router-dom'

interface NavItem { path: string; label: string; icon: string; iconFilled: string }

const NAV_ITEMS: NavItem[] = [
    { path: '/', label: 'Home', icon: 'home', iconFilled: 'home' },
    { path: '/pray', label: 'Orar', icon: 'diversity_2', iconFilled: 'diversity_2' },
    { path: '/events', label: 'Eventos', icon: 'event', iconFilled: 'event' },
    { path: '/community', label: 'Comunidade', icon: 'groups', iconFilled: 'groups' },
    { path: '/trophies', label: 'Ranking 🏆', icon: 'emoji_events', iconFilled: 'emoji_events' },
    { path: '/profile', label: 'Perfil', icon: 'person', iconFilled: 'person' },
]

interface SidebarProps {
    open: boolean
    currentPath: string
    user: { full_name: string; username: string; avatar_url?: string }
    onClose: () => void
}

export default function Sidebar({ open, currentPath, user, onClose }: SidebarProps) {
    const navigate = useNavigate()

    // useClerk só existe quando ClerkProvider está ativo
    let signOut: (() => void) | null = null
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const clerk = (window as any).Clerk
        if (clerk) signOut = () => clerk.signOut().then(() => navigate('/sign-in'))
    } catch { /* modo dev sem Clerk */ }

    const handleNav = (path: string) => {
        navigate(path)
        onClose()
    }

    const handleSignOut = () => {
        if (signOut) {
            signOut()
        } else {
            // Modo dev — apenas navega para sign-in
            navigate('/sign-in')
        }
    }

    return (
        <aside className={`sidebar${open ? ' open' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <span className="material-symbols-outlined filled" style={{ color: 'white', fontSize: 28 }}>volunteer_activism</span>
                    </div>
                    <div className="sidebar-logo-text">
                        <h1>Trombetas</h1>
                        <p>Trombetas de Oração</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentPath === item.path
                        return (
                            <button
                                key={item.path}
                                className={`nav-link${isActive ? ' active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                <span className={`material-symbols-outlined${isActive ? ' filled' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* New Request */}
                <button className="sidebar-new-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                    Novo Pedido
                </button>

                {/* User profile + Logout */}
                <div className="sidebar-user">
                    <div className="avatar avatar-sm" style={{ width: 40, height: 40 }}>
                        {user.avatar_url
                            ? <img src={user.avatar_url} alt={user.full_name} />
                            : <span className="material-symbols-outlined">person</span>
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="sidebar-user-name">{user.full_name}</div>
                        <div className="sidebar-user-handle">@{user.username}</div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        title="Sair"
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: 4, borderRadius: 8,
                            display: 'flex', alignItems: 'center',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}

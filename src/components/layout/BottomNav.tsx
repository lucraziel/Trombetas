import { useNavigate } from 'react-router-dom'

const ITEMS = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/pray', label: 'Orar', icon: 'diversity_2' },
    { path: '/events', label: 'Eventos', icon: 'event' },
    { path: '/community', label: 'Comunidade', icon: 'groups' },
    { path: '/profile', label: 'Perfil', icon: 'person' },
]

interface BottomNavProps { currentPath: string }

export default function BottomNav({ currentPath }: BottomNavProps) {
    const navigate = useNavigate()
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-items">
                {ITEMS.map((item) => (
                    <button
                        key={item.path}
                        className={`bottom-nav-item${currentPath === item.path ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className={`material-symbols-outlined${currentPath === item.path ? ' filled' : ''}`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}

interface HeaderProps { onMenuClick: () => void }

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="header">
            {/* Mobile brand */}
            <div className="header-mobile-brand">
                <button className="icon-btn" onClick={onMenuClick}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--forest-green)' }}>Trombetas</h1>
            </div>

            {/* Search */}
            <div className="header-search">
                <label>
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder="Buscar orações, pessoas ou eventos no Trombetas..." />
                </label>
            </div>

            {/* Actions */}
            <div className="header-actions">
                <button className="icon-btn" title="Notificações">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="notification-dot" />
                </button>
                <button className="icon-btn" title="Configurações">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    )
}

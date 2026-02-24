import TrophyDisplay from '../components/trophies/TrophyDisplay'
import { useNavigate } from 'react-router-dom'

// Mock de troféus do David Miller (147 adesões totais)
// 50 adesões = 1 bronze | floor(147/50) = 2 bronzes | bronze não zera
const MOCK_TROPHIES = {
    totalAdhesions: 147,
    platinum: 0,
    gold: 0,
    silver: 0,            // floor(147/5000) = 0
    bronze: 2,            // floor(147/50)   = 2
    nextLevel: {
        bronzeProgress: '94.0',   // (147%50)/50*100 = 47/50*100
        silverProgress: '2.0',    // (2%100)/100*100
        goldProgress: '0.0',
        platinumProgress: '0.0',
        toNextBronze: 3,        // 150 - 147
        toNextSilver: 98,       // 100 - 2 bronzes
        toNextGold: 100,
        toNextPlatinum: 100,
    }
}

export default function ProfilePage() {
    const navigate = useNavigate()

    const user = {
        full_name: 'David Miller',
        username: 'davidm_prayer',
        bio: 'Intercessor e adorador. Crendo por avivamento no Brasil. 🔥',
        city: 'São Paulo',
        church: 'Igreja Central SP',
        favorite_verse: '"Mais do que tudo, guarda o teu coração, pois dele procedem as fontes da vida." — Pv 4:23',
        streak_days: 21,
        total_prayers: 147,
        circles_count: 3,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRXQywJD8I1k0hwr2T6V6LHfjcMnXww3JIR9uoPDklFHasKp4ggFtABxoDYRP8hsHeMeVocc1h1lNjh8HPbyjn-Fnag8Jei3qR1FyOZvm6iVdFSIy5SK_OYvyLRrhI3HuP6yYeOJzPisWTe6bY3dNARPrpulNeahAqvtvXH_HJtyP_tlsUAnr4MG-LpwA1dT-xYaph7IIQL8tKFsD5h8LaApXHYjwIQxIdGmPhaTOo3mCEUJC7BJMd35Ftf6l1ij3zAX6jZUaeBJg',
        interests: ['Intercessão', 'Missões', 'Louvor'],
    }

    const stats = [
        { icon: 'volunteer_activism', label: 'Orações', value: user.total_prayers },
        { icon: 'local_fire_department', label: 'Dias seguidos', value: user.streak_days },
        { icon: 'diversity_3', label: 'Círculos', value: user.circles_count },
    ]

    const achievements = [
        { icon: '🔥', label: 'Iniciante', desc: '7 dias seguidos', unlocked: true },
        { icon: '⭐', label: 'Intercessor', desc: '21 dias seguidos', unlocked: true },
        { icon: '👑', label: 'Guerreiro', desc: 'Círculo completo sem falhar', unlocked: false },
        { icon: '🌍', label: 'Missionário', desc: '3 círculos diferentes', unlocked: true },
    ]

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Hero do perfil */}
            <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: '40px 24px' }}>
                <div className="avatar avatar-xl" style={{ margin: '0 auto 16px', width: 88, height: 88 }}>
                    <img src={user.avatar_url} alt={user.full_name} />
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--forest-green)' }}>{user.full_name}</h1>
                <p style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 600, marginTop: 4 }}>@{user.username}</p>
                {user.bio && (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '12px auto', maxWidth: 400, lineHeight: 1.6 }}>{user.bio}</p>
                )}
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                    📍 {user.city} · {user.church}
                </p>

                {/* Interesses */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                    {user.interests.map(i => (
                        <span key={i} style={{
                            padding: '4px 14px', borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-warm)', color: 'var(--primary-dark)',
                            fontSize: 12, fontWeight: 700, border: '1px solid var(--border)',
                        }}>{i}</span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
                    <button className="pray-btn primary" style={{ padding: '10px 24px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        Editar Perfil
                    </button>
                    <button className="pray-btn secondary" style={{ padding: '10px 16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                    </button>
                </div>
            </div>

            {/* Estatísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 12px' }}>
                        <span className="material-symbols-outlined filled" style={{ fontSize: 28, color: 'var(--primary)', display: 'block', marginBottom: 8 }}>{s.icon}</span>
                        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--forest-green)' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* TROFÉUS — seção central do perfil               */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)' }}>
                        🏆 Meus Troféus
                    </h3>
                    <button
                        className="section-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => navigate('/trophies')}
                    >
                        Ver Ranking
                    </button>
                </div>
                <TrophyDisplay trophies={MOCK_TROPHIES} />
            </div>

            {/* Versículo favorito */}
            {user.favorite_verse && (
                <div className="verse-card" style={{ marginBottom: 24 }}>
                    <div className="verse-glow-1" />
                    <div className="verse-glow-2" />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="verse-label">Versículo Favorito</div>
                        <p className="verse-text">{user.favorite_verse}</p>
                    </div>
                </div>
            )}

            {/* Conquistas */}
            <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)', marginBottom: 16 }}>Conquistas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {achievements.map(a => (
                        <div key={a.label} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px', borderRadius: 'var(--radius-md)',
                            background: a.unlocked ? 'var(--bg-warm)' : '#f9fafb',
                            border: `1px solid ${a.unlocked ? 'var(--border)' : '#f3f4f6'}`,
                            opacity: a.unlocked ? 1 : 0.45,
                        }}>
                            <span style={{ fontSize: 28 }}>{a.icon}</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{a.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{a.desc}</div>
                            </div>
                            {a.unlocked && (
                                <span className="material-symbols-outlined filled" style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 20 }}>check_circle</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

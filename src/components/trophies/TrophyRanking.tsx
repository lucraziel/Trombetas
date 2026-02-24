// ============================================================
// TrophyRanking — ranking público dos usuários por troféus
// ============================================================

interface RankUser {
    position: number
    user_id: string
    total_adhesions: number
    platinum: number
    gold: number
    silver: number
    bronze: number
    profiles: {
        id: string
        username: string
        full_name: string
        avatar_url: string
        city?: string
    }
    rank: { rank: string; icon: string; color: string }
}

// Mock de ranking — nova fórmula: 50 adesões = 1 bronze, acumula
const MOCK_RANKING: RankUser[] = [
    {
        position: 1, user_id: 'u1', total_adhesions: 248, platinum: 0, gold: 0, silver: 0, bronze: 4, // floor(248/50)=4
        profiles: { id: 'u1', username: 'ana_intercessora', full_name: 'Ana Beatriz', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtQAhvowxcNeW0BUCKgc64AZ-yKuDxGEb6dSqIwBui7_BgssmSwGQ1DsNsZKqflbgmK35Ru2LdbKE39QLpF7qglBkRQPTDwxBm4qNsD8OUQ3MNz-jt1QUbo75_dsqgiE-efushDm48M0v_Xmn5OMGGQHxgPJfl4Ml2Mt2bfaDrF0WiXhJaMjpjZhBjeWw3zPR5MhHKajG-pFIFBRoMQi8PC0YhgWoY_hbipKWpUeZO627TMlykeC4oedRdhEvXt9-dy5OAB8zCmkw_', city: 'São Paulo' },
        rank: { rank: 'Bronze', icon: '🥉', color: '#cd7f32' }
    },
    {
        position: 2, user_id: 'u2', total_adhesions: 183, platinum: 0, gold: 0, silver: 0, bronze: 3, // floor(183/50)=3
        profiles: { id: 'u2', username: 'pedro_missoes', full_name: 'Pedro Alves', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA80JJzf6E0TVzAGLveT0Qls7o-59_nuiSMu4QWA7NO_Ysxe-c68hzFcqvyTYpdS2xEQO439M6senBIvAxUCdVCEt2kstyjPlCBGlnQZCgGY9MPSaH-OmcKC5fD22Rcx1J0AqFgImZMCgavIXYTddgCh74Jg3_JfbEEawoerEuPw1Rj8LF-xZKvowR8rvy2UJ3xbE50jwnHzvk034Xcd8KNYRnJ8VKdQFrQ_ciFha0Ny_021UGObKn_Sce_q4hLtb5AD8KAlTMKQrJB', city: 'BH' },
        rank: { rank: 'Bronze', icon: '🥉', color: '#cd7f32' }
    },
    {
        position: 3, user_id: 'u3', total_adhesions: 147, platinum: 0, gold: 0, silver: 0, bronze: 2, // floor(147/50)=2
        profiles: { id: 'u3', username: 'davidm_prayer', full_name: 'David Miller', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTRXQywJD8I1k0hwr2T6V6LHfjcMnXww3JIR9uoPDklFHasKp4ggFtABxoDYRP8hsHeMeVocc1h1lNjh8HPbyjn-Fnag8Jei3qR1FyOZvm6iVdFSIy5SK_OYvyLRrhI3HuP6yYeOJzPisWTe6bY3dNARPrpulNeahAqvtvXH_HJtyP_tlsUAnr4MG-LpwA1dT-xYaph7IIQL8tKFsD5h8LaApXHYjwIQxIdGmPhaTOo3mCEUJC7BJMd35Ftf6l1ij3zAX6jZUaeBJg', city: 'SP' },
        rank: { rank: 'Bronze', icon: '🥉', color: '#cd7f32' }
    },
    {
        position: 4, user_id: 'u4', total_adhesions: 72, platinum: 0, gold: 0, silver: 0, bronze: 1, // floor(72/50)=1
        profiles: { id: 'u4', username: 'maria_louvor', full_name: 'Maria Clara', avatar_url: '', city: 'RJ' },
        rank: { rank: 'Bronze', icon: '🥉', color: '#cd7f32' }
    },
    {
        position: 5, user_id: 'u5', total_adhesions: 31, platinum: 0, gold: 0, silver: 0, bronze: 0, // floor(31/50)=0 — Iniciante
        profiles: { id: 'u5', username: 'joao_discipulo', full_name: 'João Victor', avatar_url: '', city: 'Curitiba' },
        rank: { rank: 'Iniciante', icon: '🙏', color: '#a0aec0' }
    },
]

const POSITION_MEDALS = ['🥇', '🥈', '🥉']

export default function TrophyRanking() {
    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                    <h1 className="section-title">🏆 Ranking de Troféus</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                        Baseado em adesões a eventos e círculos de oração
                    </p>
                </div>
            </div>

            {/* Legenda */}
            <div className="card" style={{ marginBottom: 24, background: 'var(--bg-warm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { icon: '🥉', label: 'Bronze', desc: '50 adesões', color: '#cd7f32' },
                        { icon: '🥈', label: 'Prata', desc: '100 bronzes', color: '#adb5bd' },
                        { icon: '🥇', label: 'Ouro', desc: '100 pratas', color: '#f5c518' },
                        { icon: '💎', label: 'Platina', desc: '100 ouros', color: '#7ab8f5' },
                    ].map(t => (
                        <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 24 }}>{t.icon}</span>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: t.color }}>{t.label}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lista de ranking */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_RANKING.map((user, i) => (
                    <div key={user.user_id} className="card fade-in-up" style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px',
                        background: i === 0 ? 'linear-gradient(135deg, #1a1a00, #3d3500)' :
                            i === 1 ? 'linear-gradient(135deg, #1a1a1d, #2d2d35)' :
                                i === 2 ? 'linear-gradient(135deg, #1a0f00, #3d2200)' :
                                    'var(--bg-surface)',
                        border: i === 0 ? '1px solid rgba(245,197,24,0.3)' :
                            i === 1 ? '1px solid rgba(192,200,212,0.2)' :
                                i === 2 ? '1px solid rgba(205,127,50,0.3)' :
                                    '1px solid var(--border)',
                    }}>
                        {/* Posição */}
                        <div style={{
                            width: 36, height: 36, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: i < 3 ? 24 : 16,
                            fontWeight: 900,
                            color: i < 3 ? undefined : 'var(--text-muted)',
                        }}>
                            {i < 3 ? POSITION_MEDALS[i] : `#${user.position}`}
                        </div>

                        {/* Avatar */}
                        <div className="avatar avatar-md" style={{ flexShrink: 0 }}>
                            {user.profiles.avatar_url
                                ? <img src={user.profiles.avatar_url} alt={user.profiles.full_name} />
                                : <span className="material-symbols-outlined" style={{ fontSize: 22 }}>person</span>
                            }
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 14, fontWeight: 800,
                                color: i < 3 ? (i === 0 ? '#f5c518' : i === 1 ? '#c0c8d4' : '#cd7f32') : 'var(--text-main)',
                            }}>
                                {user.profiles.full_name}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                                @{user.profiles.username}
                                {user.profiles.city && ` · 📍 ${user.profiles.city}`}
                            </div>
                        </div>

                        {/* Troféus compactos */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {user.platinum > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#7ab8f5' }}>💎 ×{user.platinum}</span>
                            )}
                            {user.gold > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#f5c518' }}>🥇 ×{user.gold}</span>
                            )}
                            {user.silver > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#adb5bd' }}>🥈 ×{user.silver}</span>
                            )}
                            {user.bronze > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#cd7f32' }}>🥉 ×{user.bronze}</span>
                            )}
                            <span style={{
                                fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 800,
                                background: 'rgba(255,255,255,0.08)',
                                color: user.rank.color,
                            }}>
                                {user.rank.icon} {user.total_adhesions} adesões
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

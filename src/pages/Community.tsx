const MOCK_USERS = [
    { id: 'u1', username: 'ana_intercessora', full_name: 'Ana Beatriz', city: 'São Paulo', church: 'Igreja Renascer', interests: ['Intercessão', 'Missões'], circles: 3, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtQAhvowxcNeW0BUCKgc64AZ-yKuDxGEb6dSqIwBui7_BgssmSwGQ1DsNsZKqflbgmK35Ru2LdbKE39QLpF7qglBkRQPTDwxBm4qNsD8OUQ3MNz-jt1QUbo75_dsqgiE-efushDm48M0v_Xmn5OMGGQHxgPJfl4Ml2Mt2bfaDrF0WiXhJaMjpjZhBjeWw3zPR5MhHKajG-pFIFBRoMQi8PC0YhgWoY_hbipKWpUeZO627TMlykeC4oedRdhEvXt9-dy5OAB8zCmkw_' },
    { id: 'u2', username: 'pedro_missoes', full_name: 'Pedro Alves', city: 'Belo Horizonte', church: 'IBB Missões', interests: ['Evangelismo', 'Jovens'], circles: 5, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA80JJzf6E0TVzAGLveT0Qls7o-59_nuiSMu4QWA7NO_Ysxe-c68hzFcqvyTYpdS2xEQO439M6senBIvAxUCdVCEt2kstyjPlCBGlnQZCgGY9MPSaH-OmcKC5fD22Rcx1J0AqFgImZMCgavIXYTddgCh74Jg3_JfbEEawoerEuPw1Rj8LF-xZKvowR8rvy2UJ3xbE50jwnHzvk034Xcd8KNYRnJ8VKdQFrQ_ciFha0Ny_021UGObKn_Sce_q4hLtb5AD8KAlTMKQrJB' },
    { id: 'u3', username: 'maria_louvor', full_name: 'Maria Clara', city: 'Rio de Janeiro', church: 'AD Madureira', interests: ['Louvor', 'Intercessão'], circles: 2, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCShNM9I5_qHTXF38Ny23d2iqQsrK8J7w5Rhmd9IZE_53wuuuX3Msv2-8g6Sced7IRGV0Ikq3DC7HFpNpV_J1PybnHvaAXxC6lMgxuDcAcvhlIhoqRnaaKWDzl00L2qN9dOMdssfWf6Y464-BEEGjjo_Wg_cWMw3IgJVShTqp_Ks8svqDoKkyCKpK0S9xeWrWX47BMZA_u8Mlct7mZ-SiUuVAAS5yEorJudeHqZ6MjXcYdiWPN9mYCvY_WscuhtUJWtdQPwYyyJ73R' },
    { id: 'u4', username: 'joao_discipulo', full_name: 'João Victor', city: 'Curitiba', church: 'Lagoinha Curitiba', interests: ['Discipulado', 'Estudo Bíblico'], circles: 4, avatar_url: '' },
]

export default function CommunityPage() {
    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h1 className="section-title">🌍 Comunidade</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                        Conecte-se com cristãos próximos a você
                    </p>
                </div>
            </div>

            {/* Filtros por cidade */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {['🌎 Todos', '📍 São Paulo', '📍 Rio de Janeiro', '📍 BH', '📍 Curitiba'].map(f => (
                    <button key={f} style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)', background: f.includes('Todos') ? 'var(--forest-green)' : 'var(--bg-surface)',
                        color: f.includes('Todos') ? 'white' : 'var(--text-muted)',
                        fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Grade de usuários */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {MOCK_USERS.map(user => (
                    <div key={user.id} className="card fade-in-up" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0' }}>
                            <div className="avatar avatar-xl" style={{ marginBottom: 12 }}>
                                {user.avatar_url
                                    ? <img src={user.avatar_url} alt={user.full_name} />
                                    : <span className="material-symbols-outlined" style={{ fontSize: 32 }}>person</span>
                                }
                            </div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>{user.full_name}</h3>
                            <p style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600, marginTop: 2 }}>@{user.username}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
                                📍 {user.city} · {user.church}
                            </p>

                            {/* Interesses */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', margin: '12px 0' }}>
                                {user.interests.map(i => (
                                    <span key={i} style={{
                                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                        background: 'var(--bg-warm)', color: 'var(--primary-dark)',
                                        fontSize: 11, fontWeight: 700, border: '1px solid var(--border)',
                                    }}>{i}</span>
                                ))}
                            </div>

                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>diversity_3</span>
                                {user.circles} círculos ativos
                            </div>

                            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                                <button className="pray-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined filled" style={{ fontSize: 16 }}>volunteer_activism</span>
                                    Orar Junto
                                </button>
                                <button className="pray-btn secondary" style={{ padding: '10px 14px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

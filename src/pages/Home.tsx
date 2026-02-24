import PrayerSessionCard from '../components/prayer/PrayerSessionCard'
import PrayerRequestCard from '../components/prayer/PrayerRequestCard'
import { PrayerSession, PrayerRequest, FaithEvent, PrayerCircle } from '../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// ---- Dados de demonstração (mock do design Stitch) ----
const MOCK_SESSIONS: PrayerSession[] = [
    {
        id: '1', creator_id: 'u1', title: 'Devoção Matinal', description: '',
        category: 'gratitude', scheduled_at: new Date(Date.now() + 15 * 60000).toISOString(),
        duration_minutes: 30, visibility: 'public', status: 'scheduled', participant_count: 234,
        created_at: new Date().toISOString(),
        profiles: { id: 'u1', username: 'grace_community', full_name: 'Grace Community', plan: 'premium', streak_days: 0, total_prayers: 0, created_at: '' }
    },
    {
        id: '2', creator_id: 'u2', title: 'Oração Global de Cura', description: '',
        category: 'healing', scheduled_at: new Date().toISOString().replace('T', 'T').slice(0, 11) + '20:00:00.000Z',
        duration_minutes: 60, visibility: 'public', status: 'scheduled', participant_count: 89,
        created_at: new Date().toISOString(),
        profiles: { id: 'u2', username: 'intercessory_team', full_name: 'Time de Intercessão', plan: 'free', streak_days: 0, total_prayers: 0, created_at: '' }
    },
]

const MOCK_REQUESTS: PrayerRequest[] = [
    {
        id: 'r1', user_id: 'u3', content: 'Por favor, orem pela minha mãe que entrará em cirurgia amanhã de manhã. Estamos confiando em Deus por um procedimento bem-sucedido e uma recuperação rápida. 🙏',
        category: 'health', urgency: 'urgent', visibility: 'public', is_anonymous: false,
        status: 'active', prayer_count: 44, comment_count: 5, created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        profiles: {
            id: 'u3', username: 'sarah_jr', full_name: 'Sarah Jenkins', plan: 'free', streak_days: 0, total_prayers: 0, created_at: '',
            avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtQAhvowxcNeW0BUCKgc64AZ-yKuDxGEb6dSqIwBui7_BgssmSwGQ1DsNsZKqflbgmK35Ru2LdbKE39QLpF7qglBkRQPTDwxBm4qNsD8OUQ3MNz-jt1QUbo75_dsqgiE-efushDm48M0v_Xmn5OMGGQHxgPJfl4Ml2Mt2bfaDrF0WiXhJaMjpjZhBjeWw3zPR5MhHKajG-pFIFBRoMQi8PC0YhgWoY_hbipKWpUeZO627TMlykeC4oedRdhEvXt9-dy5OAB8zCmkw_'
        }
    },
    {
        id: 'r2', user_id: 'u4', content: 'Começando um novo capítulo na minha carreira na próxima semana. Sentindo uma mistura de empolgação e ansiedade. Orando por sabedoria e paz nessa transição.',
        category: 'guidance', urgency: 'regular', visibility: 'public', is_anonymous: false,
        status: 'active', prayer_count: 17, comment_count: 2, created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
        profiles: {
            id: 'u4', username: 'marcus_t', full_name: 'Marcus Thorne', plan: 'free', streak_days: 0, total_prayers: 0, created_at: '',
            avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA80JJzf6E0TVzAGLveT0Qls7o-59_nuiSMu4QWA7NO_Ysxe-c68hzFcqvyTYpdS2xEQO439M6senBIvAxUCdVCEt2kstyjPlCBGlnQZCgGY9MPSaH-OmcKC5fD22Rcx1J0AqFgImZMCgavIXYTddgCh74Jg3_JfbEEawoerEuPw1Rj8LF-xZKvowR8rvy2UJ3xbE50jwnHzvk034Xcd8KNYRnJ8VKdQFrQ_ciFha0Ny_021UGObKn_Sce_q4hLtb5AD8KAlTMKQrJB'
        }
    },
]

const MOCK_EVENTS: FaithEvent[] = [
    {
        id: 'e1', organizer_id: 'u5', title: 'Worship Night: Hillsong', type: 'worship',
        starts_at: new Date(2026, 9, 24, 19, 0).toISOString(), ends_at: new Date(2026, 9, 24, 22, 0).toISOString(),
        is_online: false, visibility: 'public', rsvp_count: 14,
        location_name: 'Arena Central City', location_address: '7:00 PM',
        status: 'upcoming', created_at: new Date().toISOString(),
    },
    {
        id: 'e2', organizer_id: 'u6', title: 'Estudo Bíblico Comunitário', type: 'bible_study',
        starts_at: new Date(2026, 10, 2, 18, 30).toISOString(), ends_at: new Date(2026, 10, 2, 20, 0).toISOString(),
        is_online: false, visibility: 'public', rsvp_count: 8,
        location_name: 'Hall da Primeira Batista', location_address: '6:30 PM',
        status: 'upcoming', created_at: new Date().toISOString(),
    },
]

const MOCK_CIRCLES: Array<{ icon: string; iconColor: string; bgColor: string; name: string; members: number; badge?: number }> = [
    { icon: 'church', iconColor: '#4f46e5', bgColor: '#eef2ff', name: 'Pequeno Grupo', members: 12, badge: undefined },
    { icon: 'public', iconColor: '#0d9488', bgColor: '#f0fdfa', name: 'Time de Missões', members: 8 },
    { icon: 'book', iconColor: '#7c3aed', bgColor: '#f5f3ff', name: 'Leitura Bíblica', members: 45, badge: 3 },
]

// ---- Verse do Dia ----
const VERSE = { text: '"Onde dois ou três estão reunidos em meu nome, ali estou eu no meio deles."', ref: '— Mateus 18:20' }

export default function Home() {
    return (
        <div className="content-grid">
            {/* ---- Coluna principal ---- */}
            <div className="content-main">

                {/* Orações Marcadas */}
                <section>
                    <div className="section-header">
                        <h2 className="section-title">Próximas Orações</h2>
                        <a href="/pray" className="section-link">Ver Todas</a>
                    </div>
                    <div className="sessions-grid">
                        {MOCK_SESSIONS.map(session => (
                            <PrayerSessionCard key={session.id} session={session} />
                        ))}
                    </div>
                </section>

                {/* Feed de Pedidos */}
                <section>
                    <div className="section-header">
                        <h2 className="section-title">Feed de Oração</h2>
                        <button className="pray-btn primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                            Novo Pedido
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {MOCK_REQUESTS.map(request => (
                            <PrayerRequestCard key={request.id} request={request} />
                        ))}
                    </div>
                </section>
            </div>

            {/* ---- Sidebar direita ---- */}
            <div className="content-sidebar">

                {/* Eventos Próximos */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)' }}>Eventos Próximos</h3>
                        <button style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Ver Mapa
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {MOCK_EVENTS.map(event => {
                            const d = new Date(event.starts_at)
                            return (
                                <div className="event-item" key={event.id}>
                                    <div className="event-date-box">
                                        <span className="event-date-month">{format(d, 'MMM', { locale: ptBR })}</span>
                                        <span className="event-date-day">{format(d, 'dd')}</span>
                                    </div>
                                    <div className="event-info">
                                        <h4>{event.title}</h4>
                                        <p>{event.location_name} · {event.location_address}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, color: 'var(--text-light)', fontWeight: 700 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span>
                                            +{event.rsvp_count} confirmados
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Seus Círculos */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)' }}>Seus Círculos</h3>
                        <button className="icon-btn" style={{ width: 32, height: 32 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                        </button>
                    </div>
                    <div className="circles-list">
                        {MOCK_CIRCLES.map((c) => (
                            <div className="circle-list-item" key={c.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="circle-list-icon" style={{ background: c.bgColor, borderColor: c.bgColor, color: c.iconColor }}>
                                        <span className="material-symbols-outlined">{c.icon}</span>
                                    </div>
                                    <div>
                                        <div className="circle-list-name">{c.name}</div>
                                        <div className="circle-list-members">{c.members} membros</div>
                                    </div>
                                </div>
                                {c.badge !== undefined
                                    ? <span className="circle-badge">{c.badge}</span>
                                    : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                                }
                            </div>
                        ))}
                    </div>
                </div>

                {/* Versículo do Dia */}
                <div className="verse-card">
                    <div className="verse-glow-1" />
                    <div className="verse-glow-2" />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="verse-label">Versículo do Dia</div>
                        <p className="verse-text">{VERSE.text}</p>
                        <p className="verse-ref">{VERSE.ref}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

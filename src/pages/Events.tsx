import { FaithEvent, EVENT_TYPE_LABELS } from '../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const MOCK_EVENTS: FaithEvent[] = [
    {
        id: 'e1', organizer_id: 'u1', title: 'Worship Night: Hillsong',
        type: 'worship', description: 'Uma noite especial de louvor e adoração com músicos convidados.',
        starts_at: new Date(2026, 9, 24, 19, 0).toISOString(), ends_at: new Date(2026, 9, 24, 22, 0).toISOString(),
        is_online: false, visibility: 'public', rsvp_count: 142,
        location_name: 'Arena Central City', location_address: 'Av. Central, 1000',
        status: 'upcoming', created_at: new Date().toISOString(),
    },
    {
        id: 'e2', organizer_id: 'u2', title: 'Estudo Bíblico Comunitário',
        type: 'bible_study', description: 'Estudo do livro de Romanos com o pastor João.',
        starts_at: new Date(2026, 10, 2, 18, 30).toISOString(), ends_at: new Date(2026, 10, 2, 20, 0).toISOString(),
        is_online: false, visibility: 'public', rsvp_count: 28,
        location_name: 'Hall da Primeira Batista', location_address: 'Rua das Flores, 200',
        status: 'upcoming', created_at: new Date().toISOString(),
    },
    {
        id: 'e3', organizer_id: 'u3', title: 'Vigília de Oração',
        type: 'vigil', description: 'Uma noite toda em oração e adoração.',
        starts_at: new Date(2026, 10, 7, 22, 0).toISOString(), ends_at: new Date(2026, 10, 8, 4, 0).toISOString(),
        is_online: false, visibility: 'public', rsvp_count: 67,
        location_name: 'Igreja Boas Novas', location_address: 'Rua da Liberdade, 50',
        status: 'upcoming', created_at: new Date().toISOString(),
    },
    {
        id: 'e4', organizer_id: 'u4', title: 'Célula Online — Jovens',
        type: 'cell_group', description: 'Células semanais de jovens.',
        starts_at: new Date(Date.now() + 3 * 86400000).toISOString(), ends_at: new Date(Date.now() + 3 * 86400000 + 7200000).toISOString(),
        is_online: true, online_url: 'https://meet.google.com/abc', visibility: 'public', rsvp_count: 15,
        status: 'upcoming', created_at: new Date().toISOString(),
    },
]

const EVENT_ICONS: Record<string, string> = {
    worship: 'music_note',
    bible_study: 'book',
    vigil: 'bedtime',
    cell_group: 'groups',
    church_service: 'church',
    evangelism: 'travel_explore',
    collective_fast: 'spa',
    prayer_meeting: 'volunteer_activism',
    conference: 'stadium',
    retreat: 'nature',
}

const EVENT_COLORS: Record<string, { bg: string; color: string }> = {
    worship: { bg: '#fef3c7', color: '#92400e' },
    bible_study: { bg: '#dbeafe', color: '#1e40af' },
    vigil: { bg: '#ede9fe', color: '#5b21b6' },
    cell_group: { bg: '#d1fae5', color: '#065f46' },
    church_service: { bg: '#f0fdf4', color: '#166534' },
    evangelism: { bg: '#fee2e2', color: '#991b1b' },
    collective_fast: { bg: '#f3f4f6', color: '#374151' },
    prayer_meeting: { bg: '#fef9c3', color: '#854d0e' },
    conference: { bg: '#e0f2fe', color: '#0c4a6e' },
    retreat: { bg: '#f0fdf4', color: '#14532d' },
}

export default function EventsPage() {
    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div className="section-header">
                <div>
                    <h1 className="section-title">📅 Eventos de Fé</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                        Cultos, células, vigílias e mais perto de você
                    </p>
                </div>
                <button className="sidebar-new-btn" style={{ width: 'auto', padding: '0 20px', height: 44, fontSize: 13 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Criar Evento
                </button>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {['Todos', 'Culto', 'Célula', 'Vigília', 'Estudo Bíblico', 'Louvor', 'Online'].map(f => (
                    <button key={f} style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)', background: f === 'Todos' ? 'var(--forest-green)' : 'var(--bg-surface)',
                        color: f === 'Todos' ? 'white' : 'var(--text-muted)',
                        fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Lista de eventos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {MOCK_EVENTS.map(event => {
                    const d = new Date(event.starts_at)
                    const colors = EVENT_COLORS[event.type] ?? EVENT_COLORS.worship
                    const icon = EVENT_ICONS[event.type] ?? 'event'
                    return (
                        <div key={event.id} className="prayer-request-card fade-in-up" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                {/* Data */}
                                <div style={{
                                    width: 64, height: 64, flexShrink: 0,
                                    background: 'var(--bg-warm)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-dark)' }}>
                                        {format(d, 'MMM', { locale: ptBR })}
                                    </span>
                                    <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
                                        {format(d, 'dd')}
                                    </span>
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '4px 10px', borderRadius: 6,
                                            background: colors.bg, color: colors.color,
                                            fontSize: 11, fontWeight: 800, border: `1px solid ${colors.bg}`,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>
                                            {EVENT_TYPE_LABELS[event.type]}
                                        </span>
                                        {event.is_online && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', borderRadius: 6,
                                                background: '#f0fdf4', color: '#166534',
                                                fontSize: 11, fontWeight: 800, border: '1px solid #bbf7d0',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>videocam</span>
                                                Online
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{event.title}</h3>
                                    {event.description && (
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>{event.description}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>
                                        {event.location_name && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                                                {event.location_name} · {format(d, 'HH:mm')}
                                            </span>
                                        )}
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span>
                                            {event.rsvp_count} confirmados
                                        </span>
                                    </div>
                                </div>

                                {/* RSVP */}
                                <button className="pray-btn primary" style={{ flexShrink: 0 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

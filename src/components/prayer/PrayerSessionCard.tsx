import { useState } from 'react'
import { PrayerSession, CATEGORY_LABELS } from '../../types'
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PrayerSessionCardProps {
    session: PrayerSession
    onJoin?: (id: string) => void
    onPray?: (id: string) => void
}

function getSessionBadge(session: PrayerSession): { label: string; className: string } {
    const now = new Date()
    const scheduled = new Date(session.scheduled_at)
    const diffMin = differenceInMinutes(scheduled, now)

    if (session.status === 'live') return { label: 'Ao Vivo', className: 'badge-live' }
    if (diffMin <= 15 && diffMin > 0) return { label: `Em ${diffMin}min`, className: 'badge-live' }
    if (isToday(scheduled)) return { label: `Hoje ${format(scheduled, 'HH:mm')}`, className: 'badge-soon' }
    if (isTomorrow(scheduled)) return { label: `Amanhã ${format(scheduled, 'HH:mm')}`, className: 'badge-soon' }
    return { label: format(scheduled, "dd/MM 'às' HH:mm", { locale: ptBR }), className: 'badge-general' }
}

export default function PrayerSessionCard({ session, onJoin, onPray }: PrayerSessionCardProps) {
    const [joined, setJoined] = useState(false)
    const badge = getSessionBadge(session)
    const isGold = session.status !== 'live'

    const handleJoin = () => {
        setJoined(true)
        onJoin?.(session.id)
    }

    return (
        <div className="prayer-session-card fade-in-up">
            <div className={`session-accent${isGold ? ' gold' : ''}`} />

            {/* Image / Icon */}
            <div className="session-img">
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary)', opacity: 0.8 }}>
                    volunteer_activism
                </span>
            </div>

            <div className="session-body">
                <div>
                    <span className={`session-badge ${badge.className}`}>{badge.label}</span>
                    <h3 className="session-title">{session.title}</h3>
                    {session.profiles && (
                        <p className="session-subtitle">
                            Por {session.profiles.full_name} · {CATEGORY_LABELS[session.category]}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <div className="session-meta">
                        <span className="material-symbols-outlined">group</span>
                        <span>{session.participant_count} participando</span>
                    </div>
                    {!joined ? (
                        <button className="pray-btn primary" onClick={handleJoin}>
                            <span className="material-symbols-outlined filled" style={{ fontSize: 16 }}>volunteer_activism</span>
                            Participar
                        </button>
                    ) : (
                        <button className="pray-btn primary" onClick={() => onPray?.(session.id)}>
                            <span className="material-symbols-outlined filled" style={{ fontSize: 16 }}>check_circle</span>
                            Estou Orando
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

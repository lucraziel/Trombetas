import { useState } from 'react'
import { PrayerRequest, CATEGORY_LABELS } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PrayerRequestCardProps {
    request: PrayerRequest
    onReact?: (id: string) => void
    onComment?: (id: string) => void
}

export default function PrayerRequestCard({ request, onReact, onComment }: PrayerRequestCardProps) {
    const [praying, setPraying] = useState(false)
    const [count, setCount] = useState(request.prayer_count)

    const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })
    const displayName = request.is_anonymous ? 'Anônimo' : (request.profiles?.full_name ?? 'Usuário')
    const avatarUrl = request.is_anonymous ? null : request.profiles?.avatar_url

    const handleReact = () => {
        if (!praying) { setCount(c => c + 1) } else { setCount(c => Math.max(0, c - 1)) }
        setPraying(p => !p)
        onReact?.(request.id)
    }

    return (
        <div className="prayer-request-card fade-in-up">
            {/* Header */}
            <div className="request-header">
                <div className="request-user">
                    <div className="avatar avatar-md">
                        {avatarUrl
                            ? <img src={avatarUrl} alt={displayName} />
                            : <span className="material-symbols-outlined" style={{ fontSize: 24 }}>person</span>
                        }
                    </div>
                    <div className="request-user-info">
                        <h4>{displayName}</h4>
                        <p>
                            {timeAgo} · <span className="request-category">{CATEGORY_LABELS[request.category]}</span>
                            {request.urgency === 'urgent' && (
                                <span className="urgency-badge urgency-urgent" style={{ marginLeft: 6 }}>🔴 Urgente</span>
                            )}
                        </p>
                    </div>
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32 }}>
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>

            {/* Content */}
            <p className="request-content">{request.content}</p>

            {/* Footer */}
            <div className="request-footer">
                <div className="prayer-count-avatars">
                    {count > 0 && (
                        <div className="mini-avatar-count">
                            {count > 99 ? '+99' : `+${count}`}
                        </div>
                    )}
                    {count === 0 && (
                        <span style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>
                            Seja o primeiro a orar 🙏
                        </span>
                    )}
                </div>
                <div className="request-actions">
                    <button
                        className={`pray-btn${praying ? ' primary' : ' secondary'}`}
                        onClick={handleReact}
                    >
                        <span className={`material-symbols-outlined${praying ? ' filled' : ''}`} style={{ fontSize: 18 }}>
                            volunteer_activism
                        </span>
                        {praying ? 'Orando 🙏' : 'Orar'}
                    </button>
                    <button className="pray-btn secondary" onClick={() => onComment?.(request.id)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat_bubble</span>
                        Comentar
                    </button>
                </div>
            </div>
        </div>
    )
}

import { PrayerCircle, CIRCLE_TYPE_LABELS } from '../../types'
import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PrayerCircleCardProps {
    circle: PrayerCircle
    onJoin?: (id: string) => void
}

export default function PrayerCircleCard({ circle, onJoin }: PrayerCircleCardProps) {
    const startDate = new Date(circle.starts_at)
    const endDate = new Date(circle.ends_at)
    const today = new Date()

    const daysElapsed = circle.status === 'active'
        ? Math.min(differenceInDays(today, startDate), circle.duration_days)
        : 0
    const progressPercent = Math.round((daysElapsed / circle.duration_days) * 100)
    const daysLeft = Math.max(0, differenceInDays(endDate, today))

    const isFull = circle.current_members >= circle.max_members

    return (
        <div className="circle-card fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <span style={{
                        fontSize: 11, fontWeight: 800, color: 'var(--primary-dark)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4
                    }}>
                        {CIRCLE_TYPE_LABELS[circle.type]}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.3 }}>
                        {circle.name}
                    </h3>
                </div>
                <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                    background: circle.status === 'active' ? '#dcfce7' : 'var(--bg-warm)',
                    color: circle.status === 'active' ? '#166534' : 'var(--text-muted)',
                    border: `1px solid ${circle.status === 'active' ? '#bbf7d0' : 'var(--border)'}`,
                    whiteSpace: 'nowrap',
                }}>
                    {circle.status === 'active' ? `Dia ${daysElapsed}/${circle.duration_days}` : circle.duration_days + ' dias'}
                </span>
            </div>

            {circle.goal && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 500 }}>
                    🎯 {circle.goal}
                </p>
            )}

            {/* Progresso */}
            {circle.status === 'active' && (
                <div>
                    <div className="circle-progress">
                        <div className="circle-progress-bar" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-light)', fontWeight: 700 }}>
                        <span>{daysElapsed} dias completos</span>
                        <span>{daysLeft} dias restantes</span>
                    </div>
                </div>
            )}

            {circle.verse && (
                <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', margin: '10px 0', padding: '8px 12px', borderLeft: '3px solid var(--primary)', background: 'var(--bg-warm)', borderRadius: '0 8px 8px 0' }}>
                    {circle.verse}
                </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span>
                    {circle.current_members}/{circle.max_members} membros
                </div>
                <button
                    className="pray-btn primary"
                    onClick={() => !isFull && onJoin?.(circle.id)}
                    style={{ opacity: isFull ? 0.5 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
                >
                    {isFull ? 'Círculo cheio' : 'Entrar no círculo'}
                </button>
            </div>
        </div>
    )
}

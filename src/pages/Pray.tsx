import PrayerCircleCard from '../components/prayer/PrayerCircleCard'
import { PrayerCircle } from '../types'

const MOCK_CIRCLES: PrayerCircle[] = [
    {
        id: 'c1', creator_id: 'u1', name: '21 Dias de Oração pela Família',
        goal: 'Cobertura espiritual para cada membro da família', type: 'campaign',
        duration_days: 21, max_members: 12, current_members: 8,
        visibility: 'public', invite_code: 'FAM21', starts_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        ends_at: new Date(Date.now() + 16 * 86400000).toISOString(),
        status: 'active', verse: '"Como eu vos amei, que também vos ameis uns aos outros." — Jo 13:34',
        created_at: new Date().toISOString(),
    },
    {
        id: 'c2', creator_id: 'u2', name: 'Jejum 7 Dias pelo Brasil',
        goal: 'Interceder pelas nações e pelo avivamento no Brasil', type: 'collective_fast',
        duration_days: 7, max_members: 50, current_members: 23,
        visibility: 'public', invite_code: 'BRASIL7', starts_at: new Date(Date.now() + 2 * 86400000).toISOString(),
        ends_at: new Date(Date.now() + 9 * 86400000).toISOString(),
        status: 'upcoming', created_at: new Date().toISOString(),
    },
    {
        id: 'c3', creator_id: 'u3', name: 'Desafio Leitura Bíblica',
        goal: 'Ler um capítulo por dia por 40 dias', type: 'bible_challenge',
        duration_days: 40, max_members: 45, current_members: 45,
        visibility: 'public', invite_code: 'BIBLIA40', starts_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'active', created_at: new Date().toISOString(),
    },
]

export default function PrayPage() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, var(--forest-green), #4a7562)',
                borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: 32,
                color: 'white', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(197,160,101,0.15)', borderRadius: '50%', filter: 'blur(40px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Orar 🙏</h1>
                    <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 24 }}>
                        Participe de orações marcadas ou crie seu próprio círculo de oração coletivo.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="sidebar-new-btn" style={{ width: 'auto', padding: '0 24px', background: 'var(--primary)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                            Nova Sessão
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '0 24px', height: 48, borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,255,255,0.15)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>diversity_3</span>
                            Criar Círculo
                        </button>
                    </div>
                </div>
            </div>

            {/* Círculos de Oração */}
            <div className="section-header">
                <h2 className="section-title">Círculos de Oração</h2>
                <a href="#" className="section-link">Ver Todos</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {MOCK_CIRCLES.map(circle => (
                    <PrayerCircleCard key={circle.id} circle={circle} />
                ))}
            </div>

            {/* Como funciona */}
            <div className="card" style={{ marginTop: 32, background: 'var(--bg-warm)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest-green)', marginBottom: 16 }}>
                    Como funcionam os Círculos?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { icon: 'group_add', text: 'Crie ou entre em um grupo de no máximo 50 pessoas' },
                        { icon: 'today', text: 'Ore e registre sua oração diariamente' },
                        { icon: 'trending_up', text: 'Acompanhe o progresso coletivo em tempo real' },
                        { icon: 'emoji_events', text: 'Conquiste badges ao completar campanhas' },
                    ].map(({ icon, text }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                                background: 'rgba(197,160,101,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-dark)' }}>{icon}</span>
                            </div>
                            <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

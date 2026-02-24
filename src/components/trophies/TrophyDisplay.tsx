// ============================================================
// TrophyDisplay — exibe os 4 tipos de troféus com progresso
// Lógica: 50 adesões = 1 bronze | tudo acumula, sem reset
// ============================================================

interface NextLevel {
    toNextBronze: number
    toNextSilver: number
    toNextGold: number
    toNextPlatinum: number
    bronzeProgress: string
    silverProgress: string
    goldProgress: string
    platinumProgress: string
}

interface Trophies {
    totalAdhesions: number
    platinum: number
    gold: number
    silver: number
    bronze: number
    nextLevel?: NextLevel
}

interface TrophyDisplayProps {
    trophies: Trophies
    compact?: boolean
}

const TROPHY_CONFIG = [
    {
        key: 'platinum' as const,
        label: 'Platina',
        icon: '💎',
        color: '#7ab8f5',
        bg: 'linear-gradient(135deg, #1a3a5c, #2d5d8e)',
        border: 'rgba(122, 184, 245, 0.4)',
        glow: 'rgba(122,184,245,0.3)',
        progressKey: 'platinumProgress' as const,
        nextKey: 'toNextPlatinum' as const,
        nextUnit: 'ouros',
        threshold: '50M adesões → 1ª platina',
    },
    {
        key: 'gold' as const,
        label: 'Ouro',
        icon: '🥇',
        color: '#f5c518',
        bg: 'linear-gradient(135deg, #3d2c00, #7a5800)',
        border: 'rgba(245,197,24,0.4)',
        glow: 'rgba(245,197,24,0.3)',
        progressKey: 'goldProgress' as const,
        nextKey: 'toNextGold' as const,
        nextUnit: 'pratas',
        threshold: '500k adesões → 1º ouro',
    },
    {
        key: 'silver' as const,
        label: 'Prata',
        icon: '🥈',
        color: '#c0c8d4',
        bg: 'linear-gradient(135deg, #1e2633, #3a4a5c)',
        border: 'rgba(192,200,212,0.4)',
        glow: 'rgba(192,200,212,0.25)',
        progressKey: 'silverProgress' as const,
        nextKey: 'toNextSilver' as const,
        nextUnit: 'bronzes',
        threshold: '5.000 adesões → 1ª prata',
    },
    {
        key: 'bronze' as const,
        label: 'Bronze',
        icon: '🥉',
        color: '#cd7f32',
        bg: 'linear-gradient(135deg, #2e1a0a, #5c3516)',
        border: 'rgba(205,127,50,0.4)',
        glow: 'rgba(205,127,50,0.3)',
        progressKey: 'bronzeProgress' as const,
        nextKey: 'toNextBronze' as const,
        nextUnit: 'adesões',
        threshold: '50 adesões → 1 bronze',
    },
]

function TrophyCard({
    config,
    count,
    progress,
    nextLabel,
    compact,
}: {
    config: typeof TROPHY_CONFIG[0]
    count: number
    progress: string
    nextLabel: string
    compact?: boolean
}) {
    const pct = parseFloat(progress)
    const unlocked = count > 0

    if (compact) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '12px 8px', borderRadius: 12,
                background: unlocked ? config.bg : 'var(--bg-warm)',
                border: `1px solid ${unlocked ? config.border : 'var(--border)'}`,
                opacity: unlocked ? 1 : 0.45,
                minWidth: 64, flex: 1,
                boxShadow: unlocked ? `0 0 16px ${config.glow}` : 'none',
                transition: 'all 0.3s',
            }}>
                <span style={{ fontSize: 24 }}>{config.icon}</span>
                <span style={{
                    fontSize: 20, fontWeight: 900,
                    color: unlocked ? config.color : 'var(--text-light)',
                    textShadow: unlocked ? `0 0 12px ${config.glow}` : 'none',
                }}>{count.toLocaleString('pt-BR')}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? config.color : 'var(--text-light)', opacity: 0.85 }}>
                    {config.label}
                </span>
            </div>
        )
    }

    return (
        <div style={{
            padding: '20px', borderRadius: 16,
            background: unlocked ? config.bg : 'var(--bg-warm)',
            border: `1px solid ${unlocked ? config.border : 'var(--border)'}`,
            opacity: unlocked ? 1 : 0.5,
            boxShadow: unlocked ? `0 4px 24px ${config.glow}` : 'none',
            transition: 'all 0.3s',
            flex: 1, minWidth: 0,
        }}>
            {/* Header do card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 32 }}>{config.icon}</span>
                <div>
                    <div style={{
                        fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                        color: unlocked ? config.color : 'var(--text-muted)',
                    }}>
                        {config.label}
                    </div>
                    <div style={{
                        fontSize: 32, fontWeight: 900, lineHeight: 1,
                        color: unlocked ? config.color : 'var(--text-light)',
                        textShadow: unlocked ? `0 0 20px ${config.glow}` : 'none',
                    }}>
                        {count.toLocaleString('pt-BR')}
                    </div>
                </div>
            </div>

            {/* Barra de progresso */}
            <div>
                <div style={{
                    height: 6, borderRadius: 999,
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden', marginBottom: 6,
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(pct > 0 ? pct : (unlocked ? 2 : 0), 0))}%`,
                        background: config.color,
                        borderRadius: 999,
                        boxShadow: `0 0 8px ${config.glow}`,
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: unlocked ? config.color : 'var(--text-muted)', opacity: 0.8 }}>
                    {nextLabel}
                </div>
            </div>
        </div>
    )
}

export default function TrophyDisplay({ trophies, compact = false }: TrophyDisplayProps) {
    const nl = trophies.nextLevel

    function getNextLabel(config: typeof TROPHY_CONFIG[0]): string {
        if (!nl) return config.threshold
        if (config.key === 'bronze') return `Faltam ${nl.toNextBronze} adesões para próximo bronze`
        if (config.key === 'silver') return `Faltam ${nl.toNextSilver} bronzes para próxima prata`
        if (config.key === 'gold') return `Faltam ${nl.toNextGold} pratas para próximo ouro`
        if (config.key === 'platinum') return `Faltam ${nl.toNextPlatinum} ouros para próxima platina`
        return ''
    }

    return (
        <div>
            {/* Total de adesões */}
            <div style={{
                textAlign: 'center', marginBottom: compact ? 12 : 20,
                padding: compact ? '10px' : '16px',
                background: 'var(--bg-warm)', borderRadius: 12,
                border: '1px solid var(--border)',
            }}>
                <div style={{ fontSize: compact ? 20 : 28, fontWeight: 900, color: 'var(--forest-green)' }}>
                    {trophies.totalAdhesions.toLocaleString('pt-BR')}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                    Adesões Totais 🙏
                </div>
            </div>

            {/* Cards dos troféus */}
            <div style={{ display: 'flex', gap: compact ? 8 : 12 }}>
                {TROPHY_CONFIG.map(config => (
                    <TrophyCard
                        key={config.key}
                        config={config}
                        count={trophies[config.key]}
                        progress={nl ? nl[config.progressKey] : '0'}
                        nextLabel={getNextLabel(config)}
                        compact={compact}
                    />
                ))}
            </div>

            {/* Legenda de conversão (modo completo) */}
            {!compact && (
                <div style={{
                    marginTop: 16, padding: '14px 16px', borderRadius: 12,
                    background: 'var(--bg-warm)', border: '1px solid var(--border)',
                    fontSize: 12, color: 'var(--text-muted)', fontWeight: 600,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span>📌 50 adesões = 🥉 1 bronze</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span>🥉 100 bronzes = 🥈 1 prata</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span>🥈 100 pratas = 🥇 1 ouro</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span>🥇 100 ouros = 💎 1 platina</span>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                        Os troféus se acumulam — bronzes não são removidos ao gerar prata
                    </div>
                </div>
            )}
        </div>
    )
}

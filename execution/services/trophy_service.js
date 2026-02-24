// ============================================================
// Trophy Service — Trombetas
// Lógica de cálculo e concessão de troféus
// ============================================================

/**
 * Calcula os troféus a partir do número total de adesões.
 *
 * Regras:
 *   50 adesões  → 1 bronze  (bronzes ACUMULAM, não zeram)
 *   100 bronzes → 1 prata   (5.000 adesões acumuladas)
 *   100 pratas  → 1 ouro    (500.000 adesões acumuladas)
 *   100 ouros   → 1 platina (50.000.000 adesões acumuladas)
 *
 * Todos os níveis são independentes e crescem sem reset.
 *
 * @param {number} totalAdhesions - Total de adesões acumuladas do usuário
 */
export function calculateTrophies(totalAdhesions) {
    const n = Math.max(0, Math.floor(totalAdhesions))

    // Todos acumulam — sem reset em nenhum nível
    const bronze = Math.floor(n / 50)
    const silver = Math.floor(n / 5_000)       // 100 × 50 = 5.000 adesões
    const gold = Math.floor(n / 500_000)      // 100 × 5.000 = 500.000
    const platinum = Math.floor(n / 50_000_000)   // 100 × 500.000 = 50.000.000

    // Faltam para o próximo troféu de cada nível
    const toNextBronze = 50 - (n % 50)
    const toNextSilver = 100 - (bronze % 100)   // bronzes extras até próxima prata
    const toNextGold = 100 - (silver % 100)   // pratas extras até próximo ouro
    const toNextPlatinum = 100 - (gold % 100)     // ouros extras até próxima platina

    // Progresso em % dentro do nível atual (0–100%)
    const bronzeProgress = (((n % 50) / 50) * 100).toFixed(1)
    const silverProgress = (((bronze % 100) / 100) * 100).toFixed(1)
    const goldProgress = (((silver % 100) / 100) * 100).toFixed(1)
    const platinumProgress = (((gold % 100) / 100) * 100).toFixed(1)

    return {
        totalAdhesions: n,
        platinum,
        gold,
        silver,
        bronze,
        nextLevel: {
            toNextBronze,
            toNextSilver,
            toNextGold,
            toNextPlatinum,
            bronzeProgress,
            silverProgress,
            goldProgress,
            platinumProgress,
        }
    }
}

/**
 * Retorna o label e cor do nível mais alto alcançado.
 * @param {{ platinum, gold, silver, bronze }} trophies
 */
export function getTrophyRank(trophies) {
    if (trophies.platinum > 0) return { rank: 'Platina', icon: '💎', color: '#7ab8f5' }
    if (trophies.gold > 0) return { rank: 'Ouro', icon: '🥇', color: '#f5c518' }
    if (trophies.silver > 0) return { rank: 'Prata', icon: '🥈', color: '#adb5bd' }
    if (trophies.bronze > 0) return { rank: 'Bronze', icon: '🥉', color: '#cd7f32' }
    return { rank: 'Iniciante', icon: '🙏', color: '#a0aec0' }
}

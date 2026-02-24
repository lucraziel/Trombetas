import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { TrophyRepository } from '../../execution/repositories/trophy_repository.js'
import { calculateTrophies, getTrophyRank } from '../../execution/services/trophy_service.js'

const router = express.Router()

// GET /api/trophies/me — troféus do usuário autenticado
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const raw = await TrophyRepository.getByUser(req.user.id)
        const computed = calculateTrophies(raw.total_adhesions)
        const rank = getTrophyRank(raw)
        res.json({ ...raw, ...computed, rank })
    } catch (err) { next(err) }
})

// GET /api/trophies/user/:userId — troféus de outro usuário (público)
router.get('/user/:userId', async (req, res, next) => {
    try {
        const raw = await TrophyRepository.getByUser(req.params.userId)
        const computed = calculateTrophies(raw.total_adhesions)
        const rank = getTrophyRank(raw)
        res.json({ ...raw, ...computed, rank })
    } catch (err) { next(err) }
})

// GET /api/trophies/ranking — ranking global top 20
router.get('/ranking', async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query
        const data = await TrophyRepository.getRanking({ limit: +limit, offset: +offset })
        const ranked = data.map((row, i) => ({
            position: offset + i + 1,
            ...row,
            rank: getTrophyRank(row),
            computed: calculateTrophies(row.total_adhesions),
        }))
        res.json(ranked)
    } catch (err) { next(err) }
})

// GET /api/trophies/history — histórico de adesões do usuário autenticado
router.get('/history', authMiddleware, async (req, res, next) => {
    try {
        const data = await TrophyRepository.getAdhesionHistory(req.user.id)
        res.json(data)
    } catch (err) { next(err) }
})

export default router

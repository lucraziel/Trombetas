import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { PrayerCircleRepository } from '../../execution/repositories/prayer_circle_repository.js'
import { TrophyRepository } from '../../execution/repositories/trophy_repository.js'

const router = express.Router()

// GET /api/prayer-circles
router.get('/', async (req, res, next) => {
    try {
        const data = await PrayerCircleRepository.findPublic()
        res.json(data)
    } catch (err) { next(err) }
})

// GET /api/prayer-circles/:id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await PrayerCircleRepository.findById(req.params.id)
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-circles — criar círculo
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { name, description, goal, type, duration_days, max_members, visibility, daily_prayer_time, starts_at, verse } = req.body
        if (!name || !goal || !type || !duration_days || !starts_at) {
            return res.status(400).json({ error: 'Campos obrigatórios: name, goal, type, duration_days, starts_at' })
        }
        const data = await PrayerCircleRepository.create(req.user.id, {
            name, description, goal, type, duration_days, max_members, visibility, daily_prayer_time, starts_at, verse
        })
        res.status(201).json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-circles/:id/join
router.post('/:id/join', authMiddleware, async (req, res, next) => {
    try {
        const circle = await PrayerCircleRepository.findById(req.params.id)
        const data = await PrayerCircleRepository.join(req.params.id, req.user.id)
        // Concede +1 bronze pelo ingresso no círculo (idempotente)
        const trophies = await TrophyRepository.grantAdhesion(
            req.user.id, 'circle_join', req.params.id, circle.name
        )
        res.json({ ...data, trophies })
    } catch (err) { next(err) }
})

// POST /api/prayer-circles/join-by-code
router.post('/join-by-code', authMiddleware, async (req, res, next) => {
    try {
        const { invite_code } = req.body
        const circle = await PrayerCircleRepository.findByInviteCode(invite_code)
        const data = await PrayerCircleRepository.join(circle.id, req.user.id)
        // Concede +1 bronze pelo ingresso via código
        const trophies = await TrophyRepository.grantAdhesion(
            req.user.id, 'circle_join', circle.id, circle.name
        )
        res.json({ ...data, trophies })
    } catch (err) { next(err) }
})

// POST /api/prayer-circles/:id/log — registrar oração do dia
router.post('/:id/log', authMiddleware, async (req, res, next) => {
    try {
        const { prayed, duration_min, note } = req.body
        const data = await PrayerCircleRepository.logPrayer(req.params.id, req.user.id, { prayed, duration_min, note })
        res.json(data)
    } catch (err) { next(err) }
})

// GET /api/prayer-circles/:id/progress
router.get('/:id/progress', async (req, res, next) => {
    try {
        const data = await PrayerCircleRepository.getProgress(req.params.id)
        res.json(data)
    } catch (err) { next(err) }
})

export default router

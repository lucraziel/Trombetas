import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { PrayerSessionRepository } from '../../execution/repositories/prayer_session_repository.js'

const router = express.Router()

// GET /api/prayer-sessions — sessões públicas futuras
router.get('/', async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query
        const data = await PrayerSessionRepository.findPublic({ limit: +limit, offset: +offset })
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-sessions — criar sessão (autenticado)
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { title, category, scheduled_at, duration_minutes, visibility, description } = req.body
        if (!title || !category || !scheduled_at || !duration_minutes) {
            return res.status(400).json({ error: 'Campos obrigatórios: title, category, scheduled_at, duration_minutes' })
        }
        if (new Date(scheduled_at) < new Date(Date.now() + 30 * 60000)) {
            return res.status(400).json({ error: 'Sessão deve ser agendada com pelo menos 30 minutos de antecedência' })
        }
        const session = await PrayerSessionRepository.create(req.user.id, {
            title, category, scheduled_at, duration_minutes, visibility, description
        })
        res.status(201).json(session)
    } catch (err) { next(err) }
})

// POST /api/prayer-sessions/:id/join — participar
router.post('/:id/join', authMiddleware, async (req, res, next) => {
    try {
        const data = await PrayerSessionRepository.join(req.params.id, req.user.id)
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-sessions/:id/pray — marcar como "estou orando"
router.post('/:id/pray', authMiddleware, async (req, res, next) => {
    try {
        const data = await PrayerSessionRepository.markPraying(req.params.id, req.user.id)
        res.json(data)
    } catch (err) { next(err) }
})

// DELETE /api/prayer-sessions/:id — cancelar sessão
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const data = await PrayerSessionRepository.cancel(req.params.id, req.user.id)
        res.json(data)
    } catch (err) { next(err) }
})

export default router

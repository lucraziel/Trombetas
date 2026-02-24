import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { PrayerRequestRepository } from '../../execution/repositories/prayer_request_repository.js'

const router = express.Router()

// GET /api/prayer-requests — feed público
router.get('/', async (req, res, next) => {
    try {
        const { limit = 20, offset = 0, category } = req.query
        const data = await PrayerRequestRepository.findPublicFeed({ limit: +limit, offset: +offset, category })
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-requests — criar pedido
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { content, category, urgency, visibility, is_anonymous } = req.body
        if (!content || !category) {
            return res.status(400).json({ error: 'Campos obrigatórios: content, category' })
        }
        const data = await PrayerRequestRepository.create(req.user.id, {
            content, category, urgency, visibility, is_anonymous
        })
        res.status(201).json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-requests/:id/react — reagir com 🙏
router.post('/:id/react', authMiddleware, async (req, res, next) => {
    try {
        const { type = 'praying' } = req.body
        const data = await PrayerRequestRepository.react(req.params.id, req.user.id, type)
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/prayer-requests/:id/comment — comentar
router.post('/:id/comment', authMiddleware, async (req, res, next) => {
    try {
        const { content } = req.body
        if (!content) return res.status(400).json({ error: 'Conteúdo do comentário é obrigatório' })
        const data = await PrayerRequestRepository.comment(req.params.id, req.user.id, content)
        res.status(201).json(data)
    } catch (err) { next(err) }
})

// PATCH /api/prayer-requests/:id/answered
router.patch('/:id/answered', authMiddleware, async (req, res, next) => {
    try {
        const data = await PrayerRequestRepository.markAnswered(req.params.id, req.user.id)
        res.json(data)
    } catch (err) { next(err) }
})

export default router

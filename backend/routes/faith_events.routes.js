import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { FaithEventRepository } from '../../execution/repositories/faith_event_repository.js'
import { TrophyRepository } from '../../execution/repositories/trophy_repository.js'

const router = express.Router()

// GET /api/faith-events
router.get('/', async (req, res, next) => {
    try {
        const { limit = 20, offset = 0, type } = req.query
        const data = await FaithEventRepository.findPublic({ limit: +limit, offset: +offset, type })
        res.json(data)
    } catch (err) { next(err) }
})

// GET /api/faith-events/:id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await FaithEventRepository.findById(req.params.id)
        res.json(data)
    } catch (err) { next(err) }
})

// POST /api/faith-events — criar evento
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { title, type, description, starts_at, ends_at, location_name, location_address, is_online, online_url, visibility, max_participants } = req.body
        if (!title || !type || !starts_at || !ends_at) {
            return res.status(400).json({ error: 'Campos obrigatórios: title, type, starts_at, ends_at' })
        }
        const data = await FaithEventRepository.create(req.user.id, {
            title, type, description, starts_at, ends_at, location_name, location_address, is_online, online_url, visibility, max_participants
        })
        res.status(201).json(data)
    } catch (err) { next(err) }
})

// POST /api/faith-events/:id/rsvp
router.post('/:id/rsvp', authMiddleware, async (req, res, next) => {
    try {
        const { status = 'going' } = req.body
        const event = await FaithEventRepository.findById(req.params.id)
        const data = await FaithEventRepository.rsvp(req.params.id, req.user.id, status)
        // Concede +1 bronze apenas quando confirma presença (going)
        let trophies = null
        if (status === 'going') {
            trophies = await TrophyRepository.grantAdhesion(
                req.user.id, 'event_rsvp', req.params.id, event.title
            )
        }
        res.json({ ...data, trophies })
    } catch (err) { next(err) }
})

export default router

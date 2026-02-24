import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config() // fallback para .env

// ── Validação obrigatória de variáveis de ambiente ──────────
const REQUIRED_ENV = ['CLERK_SECRET_KEY', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
for (const key of REQUIRED_ENV) {
    if (!process.env[key] || process.env[key].includes('SUBSTITUA')) {
        console.error(`❌ Variável de ambiente obrigatória não configurada: ${key}`)
        process.exit(1)
    }
}

import prayerSessionRoutes from './routes/prayer_sessions.routes.js'
import prayerRequestRoutes from './routes/prayer_requests.routes.js'
import prayerCircleRoutes from './routes/prayer_circles.routes.js'
import faithEventRoutes from './routes/faith_events.routes.js'
import trophyRoutes from './routes/trophies.routes.js'

const app = express()
const PORT = process.env.PORT || 3001
const isDev = process.env.NODE_ENV !== 'production'

// ── Segurança: cabeçalhos HTTP seguros ──────────────────────
app.use(helmet({
    contentSecurityPolicy: isDev ? false : {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            fontSrc: ["'self'", 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", 'https://*.supabase.co', 'https://*.clerk.accounts.dev'],
        }
    }
}))

// ── CORS restritivo ──────────────────────────────────────────
const ALLOWED_ORIGINS = isDev
    ? ['http://localhost:5173', 'http://localhost:4173']
    : [process.env.FRONTEND_URL].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Permite requests sem origin (ex: mobile, Postman em dev)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
        callback(new Error(`Origin não permitida: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Rate limiting ────────────────────────────────────────────
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200,                  // máx 200 requests por IP por janela
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente novamente em instantes.' }
}))

// Rate limit mais restritivo para rotas de escrita
const writeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 30,
    message: { error: 'Limite de requisições atingido.' }
})

app.use(express.json({ limit: '512kb' })) // reduzido de 1mb para 512kb

// ── Health check (sem dados sensíveis) ──────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Rotas ────────────────────────────────────────────────────
// REMOVIDO: /api/auth — autenticação agora é via Clerk (frontend)
app.use('/api/prayer-sessions', prayerSessionRoutes)
app.use('/api/prayer-requests', writeLimiter, prayerRequestRoutes)
app.use('/api/prayer-circles', writeLimiter, prayerCircleRoutes)
app.use('/api/faith-events', writeLimiter, faithEventRoutes)
app.use('/api/trophies', trophyRoutes)

// ── Error handler global (sem stack trace em produção) ───────
app.use((err, _req, res, _next) => {
    const status = err.status || 500
    if (!isDev) {
        console.error(`[Error] ${status} — ${err.message}`)
        return res.status(status).json({ error: 'Erro interno do servidor', code: err.code || 'INTERNAL_ERROR' })
    }
    res.status(status).json({ error: err.message, code: err.code || 'INTERNAL_ERROR', stack: err.stack })
})

app.listen(PORT, () => {
    console.log(`🙏 Trombetas API rodando na porta ${PORT} [${process.env.NODE_ENV}]`)
})

export default app

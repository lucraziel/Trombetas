import { createClerkClient } from '@clerk/backend'

// Initializa o cliente Clerk admin (valida JWTs emitidos pelo Clerk)
const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})

/**
 * Middleware de autenticação — valida o JWT assinado pelo Clerk.
 * Injeta req.user = { id, email, ... } para uso nas rotas.
 */
export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization ?? ''
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' })
        }

        const token = authHeader.slice(7)

        // Verifica o JWT com a chave pública do Clerk
        const payload = await clerk.verifyToken(token)

        // sub = userId do Clerk (ex: user_2abc...)
        req.user = {
            id: payload.sub,
            email: payload.email ?? null,
            sessionId: payload.sid,
        }

        next()
    } catch (err) {
        console.error('[Auth] Token inválido:', err.message)
        return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
}

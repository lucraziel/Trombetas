// auth.routes.js — DEPRECADO
// A autenticação agora é feita pelo Clerk no frontend.
// Este arquivo é mantido apenas por compatibilidade de imports existentes.
// Pode ser removido em uma futura versão de limpeza.

import express from 'express'
const router = express.Router()

// Rota legada — retorna 410 Gone para indicar que foi removida
router.all('*', (_req, res) => {
    res.status(410).json({
        error: 'Estas rotas de autenticação foram removidas.',
        message: 'A autenticação agora é gerenciada pelo Clerk. Consulte a documentação.',
    })
})

export default router

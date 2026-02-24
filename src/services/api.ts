import axios from 'axios'

// Cliente Axios base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
    headers: { 'Content-Type': 'application/json' },
})

/**
 * Injeta automaticamente o JWT do Clerk em cada request.
 * O token é buscado via window.__clerk (instância global do SDK).
 * Funciona sem depender de contexto React.
 */
api.interceptors.request.use(async (config) => {
    try {
        // @ts-expect-error — Clerk injeta __clerk no window após inicializar
        const clerk = window.Clerk
        if (clerk?.session) {
            const token = await clerk.session.getToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
    } catch {
        // sem token — request continua sem auth (rotas públicas)
    }
    return config
})

// Handler global de erros
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status
        if (status === 401) {
            // Redireciona para login se o token expirou
            window.location.href = '/sign-in'
        }
        return Promise.reject(err)
    }
)

export default api

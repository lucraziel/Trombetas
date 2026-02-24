import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './styles/index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('VITE_CLERK_PUBLISHABLE_KEY não encontrada no .env.local')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/sign-in"
            localization={{
                signIn: {
                    start: {
                        title: 'Entrar no Trombetas',
                        subtitle: 'Bem-vindo de volta 🙏',
                        actionText: 'Não tem conta?',
                        actionLink: 'Criar conta',
                    },
                },
                signUp: {
                    start: {
                        title: 'Criar conta no Trombetas',
                        subtitle: 'Junte-se à comunidade de fé 🙏',
                        actionText: 'Já tem conta?',
                        actionLink: 'Entrar',
                    },
                },
            }}
        >
            <App />
        </ClerkProvider>
    </StrictMode>,
)

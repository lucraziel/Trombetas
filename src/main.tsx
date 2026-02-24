import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import AppDevMode from './AppDevMode.tsx'
import './styles/index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Modo dev: ativa quando não há chave ou ainda tem placeholder
const isDevMode = !PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes('SUBSTITUA')

if (isDevMode) {
    console.warn([
        '⚠️  MODO DEV ATIVO — sem autenticação Clerk',
        '   Para ativar: preencha VITE_CLERK_PUBLISHABLE_KEY no .env.local',
        '   Obtenha em: https://dashboard.clerk.com',
    ].join('\n'))
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {isDevMode ? (
            <AppDevMode />
        ) : (
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
        )}
    </StrictMode>,
)

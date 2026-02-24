import { useUser, useAuth } from '@clerk/clerk-react'

/**
 * Retorna o usuário autenticado mapeado para o formato dos componentes Trombetas.
 * Se não autenticado, retorna null.
 */
export function useClerkUser() {
    const { user, isLoaded, isSignedIn } = useUser()
    const { getToken } = useAuth()

    if (!isLoaded || !isSignedIn || !user) {
        return { user: null, isLoaded, isSignedIn: false, getToken }
    }

    const mapped = {
        id: user.id,
        full_name: user.fullName ?? user.firstName ?? 'Usuário',
        username: user.username ?? user.primaryEmailAddress?.emailAddress.split('@')[0] ?? 'user',
        avatar_url: user.imageUrl ?? '',
        email: user.primaryEmailAddress?.emailAddress ?? '',
    }

    return { user: mapped, isLoaded, isSignedIn: true, getToken }
}

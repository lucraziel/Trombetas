import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

/**
 * Sincroniza o usuário Clerk com a tabela `profiles` do Supabase.
 * Cria o perfil na primeira vez, atualiza avatar/nome se mudar.
 * Chamar no componente raiz após login.
 */
export function useProfileSync() {
    const { user, isLoaded, isSignedIn } = useUser()

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return

        const syncProfile = async () => {
            const profile = {
                id: user.id,  // Clerk user ID (ex: user_2abc...)
                full_name: user.fullName ?? user.firstName ?? 'Usuário',
                username: user.username
                    ?? user.primaryEmailAddress?.emailAddress.split('@')[0]
                    ?? `user_${user.id.slice(-6)}`,
                avatar_url: user.imageUrl ?? null,
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(profile, {
                    onConflict: 'id',
                    ignoreDuplicates: false, // atualiza se existir
                })

            if (error) {
                console.error('[ProfileSync] Erro ao sincronizar perfil:', error.message)
            } else {
                console.log('[ProfileSync] Perfil sincronizado:', profile.username)
            }
        }

        syncProfile()
    }, [isLoaded, isSignedIn, user?.id]) // roda quando o user muda
}

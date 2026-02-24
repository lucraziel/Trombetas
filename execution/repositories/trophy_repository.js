import { supabase } from '../db/supabase_client.js'
import { calculateTrophies } from '../services/trophy_service.js'

export const TrophyRepository = {

    /**
     * Registra uma adesão e recalcula os troféus via função SQL.
     * Idempotente: ignora se o usuário já tinha aderido ao mesmo recurso.
     */
    async grantAdhesion(userId, sourceType, sourceId, sourceTitle = '') {
        // 1. Insere adesão (UNIQUE garante idempotência)
        const { error: insErr } = await supabase
            .from('user_adhesions')
            .insert({ user_id: userId, source_type: sourceType, source_id: sourceId, source_title: sourceTitle })
            .select()
            .single()

        // Conflito = já tinha aderido → não faz nada (não é erro)
        if (insErr && insErr.code !== '23505') throw insErr
        if (insErr?.code === '23505') return await this.getByUser(userId) // retorna estado atual

        // 2. Recalcula via stored function no Supabase
        const { data, error } = await supabase.rpc('recalculate_trophies', { p_user_id: userId })
        if (error) throw error
        return data
    },

    /** Busca troféus de um usuário */
    async getByUser(userId) {
        const { data, error } = await supabase
            .from('user_trophies')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error && error.code === 'PGRST116') {
            // Usuário ainda sem linha → zero troféus
            return { user_id: userId, total_adhesions: 0, platinum: 0, gold: 0, silver: 0, bronze: 0 }
        }
        if (error) throw error
        return data
    },

    /** Ranking global — top usuários por troféus */
    async getRanking({ limit = 20, offset = 0 } = {}) {
        const { data, error } = await supabase
            .from('user_trophies')
            .select(`
        *,
        profiles!user_id(id, username, full_name, avatar_url, city)
      `)
            .order('platinum', { ascending: false })
            .order('gold', { ascending: false })
            .order('silver', { ascending: false })
            .order('bronze', { ascending: false })
            .range(offset, offset + limit - 1)
        if (error) throw error
        return data
    },

    /** Histórico de adesões de um usuário (últimas N) */
    async getAdhesionHistory(userId, { limit = 30 } = {}) {
        const { data, error } = await supabase
            .from('user_adhesions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) throw error
        return data
    }
}

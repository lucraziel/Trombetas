import { supabase } from '../db/supabase_client.js'

export const PrayerSessionRepository = {
    async findPublic({ limit = 20, offset = 0 } = {}) {
        const { data, error } = await supabase
            .from('prayer_sessions')
            .select(`*, profiles!creator_id(id, username, full_name, avatar_url)`)
            .eq('visibility', 'public')
            .in('status', ['scheduled', 'live'])
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true })
            .range(offset, offset + limit - 1)
        if (error) throw error
        return data
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('prayer_sessions')
            .select(`*, profiles!creator_id(id, username, full_name, avatar_url)`)
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    async create(userId, sessionData) {
        const { data, error } = await supabase
            .from('prayer_sessions')
            .insert({ creator_id: userId, ...sessionData })
            .select()
            .single()
        if (error) throw error
        return data
    },

    async join(sessionId, userId) {
        const { data, error } = await supabase
            .from('prayer_participants')
            .insert({ session_id: sessionId, user_id: userId, status: 'confirmed' })
            .select()
            .single()
        if (error) throw error
        // Incrementa contador
        await supabase.rpc('increment_participant_count', { session_id: sessionId })
        return data
    },

    async markPraying(sessionId, userId) {
        const { data, error } = await supabase
            .from('prayer_participants')
            .update({ status: 'praying', started_at: new Date().toISOString() })
            .eq('session_id', sessionId)
            .eq('user_id', userId)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async cancel(sessionId, userId) {
        const { data, error } = await supabase
            .from('prayer_sessions')
            .update({ status: 'cancelled' })
            .eq('id', sessionId)
            .eq('creator_id', userId)
            .select()
            .single()
        if (error) throw error
        return data
    }
}

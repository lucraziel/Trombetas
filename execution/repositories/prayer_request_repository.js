import { supabase } from '../db/supabase_client.js'

export const PrayerRequestRepository = {
    async findPublicFeed({ limit = 20, offset = 0, category } = {}) {
        let query = supabase
            .from('prayer_requests')
            .select(`
        *,
        profiles!user_id(id, username, full_name, avatar_url)
      `)
            .eq('visibility', 'public')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (category) query = query.eq('category', category)

        const { data, error } = await query
        if (error) throw error

        // Mascarar dados de usuário anônimo
        return data.map(req => req.is_anonymous
            ? { ...req, profiles: { id: null, username: 'Anônimo', full_name: 'Anônimo', avatar_url: null } }
            : req
        )
    },

    async create(userId, requestData) {
        const { data, error } = await supabase
            .from('prayer_requests')
            .insert({ user_id: userId, ...requestData })
            .select()
            .single()
        if (error) throw error
        return data
    },

    async react(requestId, userId, type = 'praying') {
        const { data, error } = await supabase
            .from('prayer_reactions')
            .upsert({ request_id: requestId, user_id: userId, type }, { onConflict: 'request_id,user_id' })
            .select()
            .single()
        if (error) throw error
        // Atualiza contador
        const { count } = await supabase
            .from('prayer_reactions')
            .select('id', { count: 'exact', head: true })
            .eq('request_id', requestId)
        await supabase.from('prayer_requests').update({ prayer_count: count }).eq('id', requestId)
        return data
    },

    async comment(requestId, userId, content) {
        const { data, error } = await supabase
            .from('prayer_comments')
            .insert({ request_id: requestId, user_id: userId, content })
            .select(`*, profiles!user_id(id, username, full_name, avatar_url)`)
            .single()
        if (error) throw error
        return data
    },

    async markAnswered(requestId, userId) {
        const { data, error } = await supabase
            .from('prayer_requests')
            .update({ status: 'answered' })
            .eq('id', requestId)
            .eq('user_id', userId)
            .select()
            .single()
        if (error) throw error
        return data
    }
}

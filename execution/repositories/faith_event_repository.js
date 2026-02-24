import { supabase } from '../db/supabase_client.js'

export const FaithEventRepository = {
    async findPublic({ limit = 20, offset = 0, type, city } = {}) {
        let query = supabase
            .from('faith_events')
            .select(`*, profiles!organizer_id(id, username, full_name, avatar_url)`)
            .eq('visibility', 'public')
            .in('status', ['upcoming', 'live'])
            .gte('starts_at', new Date().toISOString())
            .order('starts_at', { ascending: true })
            .range(offset, offset + limit - 1)

        if (type) query = query.eq('type', type)

        const { data, error } = await query
        if (error) throw error
        return data
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('faith_events')
            .select(`
        *,
        profiles!organizer_id(id, username, full_name, avatar_url),
        event_rsvps(user_id, status, profiles(id, username, avatar_url))
      `)
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    async create(userId, eventData) {
        const { data, error } = await supabase
            .from('faith_events')
            .insert({ organizer_id: userId, ...eventData })
            .select()
            .single()
        if (error) throw error
        return data
    },

    async rsvp(eventId, userId, status = 'going') {
        const { data, error } = await supabase
            .from('event_rsvps')
            .upsert(
                { event_id: eventId, user_id: userId, status },
                { onConflict: 'event_id,user_id' }
            )
            .select()
            .single()
        if (error) throw error
        // Atualiza contador
        const { count } = await supabase
            .from('event_rsvps')
            .select('id', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .eq('status', 'going')
        await supabase.from('faith_events').update({ rsvp_count: count }).eq('id', eventId)
        return data
    }
}

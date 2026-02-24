import { supabase } from '../db/supabase_client.js'

export const PrayerCircleRepository = {
    async findPublic({ limit = 20, offset = 0 } = {}) {
        const { data, error } = await supabase
            .from('prayer_circles')
            .select(`*, profiles!creator_id(id, username, full_name, avatar_url)`)
            .eq('visibility', 'public')
            .in('status', ['upcoming', 'active'])
            .order('starts_at', { ascending: true })
            .range(offset, offset + limit - 1)
        if (error) throw error
        return data
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('prayer_circles')
            .select(`
        *,
        profiles!creator_id(id, username, full_name, avatar_url),
        circle_members(user_id, role, streak, profiles(id, username, avatar_url))
      `)
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    async findByInviteCode(code) {
        const { data, error } = await supabase
            .from('prayer_circles')
            .select('*')
            .eq('invite_code', code.toUpperCase())
            .single()
        if (error) throw error
        return data
    },

    async create(userId, circleData) {
        const { data, error } = await supabase
            .from('prayer_circles')
            .insert({ creator_id: userId, ...circleData })
            .select()
            .single()
        if (error) throw error
        // Leader entra automaticamente
        await supabase.from('circle_members').insert({ circle_id: data.id, user_id: userId, role: 'leader' })
        return data
    },

    async join(circleId, userId) {
        // Verificar se há espaço
        const circle = await this.findById(circleId)
        if (circle.current_members >= circle.max_members) throw new Error('Círculo cheio')

        const { data, error } = await supabase
            .from('circle_members')
            .insert({ circle_id: circleId, user_id: userId, role: 'member' })
            .select()
            .single()
        if (error) throw error

        await supabase
            .from('prayer_circles')
            .update({ current_members: circle.current_members + 1 })
            .eq('id', circleId)

        return data
    },

    async logPrayer(circleId, userId, { prayed, duration_min, note } = {}) {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('circle_prayer_logs')
            .upsert(
                { circle_id: circleId, user_id: userId, log_date: today, prayed, duration_min, note },
                { onConflict: 'circle_id,user_id,log_date' }
            )
            .select()
            .single()
        if (error) throw error
        return data
    },

    async getProgress(circleId) {
        const { data, error } = await supabase
            .from('circle_prayer_logs')
            .select('log_date, prayed, user_id')
            .eq('circle_id', circleId)
            .order('log_date', { ascending: true })
        if (error) throw error
        return data
    }
}

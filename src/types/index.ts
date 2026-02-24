// ============================================================
// EzerHub — Tipos TypeScript do Domínio
// ============================================================

export type PrayerCategory =
    | 'family' | 'health' | 'guidance' | 'financial' | 'healing'
    | 'nations' | 'gratitude' | 'intercession' | 'personal_growth'

export type EventType =
    | 'church_service' | 'cell_group' | 'vigil' | 'bible_study'
    | 'collective_fast' | 'evangelism' | 'worship' | 'prayer_meeting'
    | 'conference' | 'retreat'

export type CircleType =
    | 'daily_prayer' | 'collective_fast' | 'campaign' | 'intercession' | 'bible_challenge'

export type Visibility = 'public' | 'friends' | 'private' | 'circles' | 'invite_only' | 'community'

export interface Profile {
    id: string
    username: string
    full_name: string
    bio?: string
    avatar_url?: string
    favorite_verse?: string
    city?: string
    neighborhood?: string
    church_name?: string
    plan: 'free' | 'premium'
    streak_days: number
    total_prayers: number
    created_at: string
}

export interface PrayerSession {
    id: string
    creator_id: string
    title: string
    description?: string
    category: PrayerCategory
    scheduled_at: string
    duration_minutes: number
    visibility: Visibility
    status: 'scheduled' | 'live' | 'completed' | 'cancelled'
    participant_count: number
    created_at: string
    profiles?: Profile
}

export interface PrayerRequest {
    id: string
    user_id: string
    content: string
    category: PrayerCategory
    urgency: 'urgent' | 'regular'
    visibility: Visibility
    is_anonymous: boolean
    status: 'active' | 'answered' | 'archived'
    prayer_count: number
    comment_count: number
    created_at: string
    profiles?: Profile
}

export interface PrayerComment {
    id: string
    request_id: string
    user_id: string
    content: string
    created_at: string
    profiles?: Profile
}

export interface PrayerCircle {
    id: string
    creator_id: string
    name: string
    description?: string
    goal: string
    type: CircleType
    duration_days: number
    max_members: number
    current_members: number
    visibility: Visibility
    daily_prayer_time?: string
    starts_at: string
    ends_at: string
    verse?: string
    cover_image_url?: string
    invite_code: string
    status: 'upcoming' | 'active' | 'completed' | 'abandoned'
    created_at: string
    profiles?: Profile
    circle_members?: CircleMember[]
}

export interface CircleMember {
    user_id: string
    role: 'leader' | 'member'
    streak: number
    joined_at: string
    profiles?: Profile
}

export interface FaithEvent {
    id: string
    organizer_id: string
    title: string
    description?: string
    type: EventType
    starts_at: string
    ends_at: string
    location_name?: string
    location_address?: string
    is_online: boolean
    online_url?: string
    visibility: Visibility
    max_participants?: number
    rsvp_count: number
    cover_image_url?: string
    status: 'upcoming' | 'live' | 'completed' | 'cancelled'
    created_at: string
    profiles?: Profile
}

// Mapeamentos de label
export const CATEGORY_LABELS: Record<PrayerCategory, string> = {
    family: 'Família',
    health: 'Saúde',
    guidance: 'Direção',
    financial: 'Provisão',
    healing: 'Cura',
    nations: 'Nações',
    gratitude: 'Gratidão',
    intercession: 'Intercessão',
    personal_growth: 'Crescimento',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    church_service: 'Culto',
    cell_group: 'Célula',
    vigil: 'Vigília',
    bible_study: 'Estudo Bíblico',
    collective_fast: 'Jejum',
    evangelism: 'Evangelismo',
    worship: 'Louvor',
    prayer_meeting: 'Reunião de Oração',
    conference: 'Conferência',
    retreat: 'Retiro',
}

export const CIRCLE_TYPE_LABELS: Record<CircleType, string> = {
    daily_prayer: 'Oração Diária',
    collective_fast: 'Jejum Coletivo',
    campaign: 'Campanha',
    intercession: 'Intercessão',
    bible_challenge: 'Desafio Bíblico',
}

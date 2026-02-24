-- ============================================================
-- EzerHub — Schema do Banco de Dados (Supabase / PostgreSQL)
-- ============================================================
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensão para geolocalização e UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- TABELA: profiles (extensão da auth.users do Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL,
  bio             TEXT,
  avatar_url      TEXT,
  favorite_verse  TEXT,
  city            TEXT,
  neighborhood    TEXT,
  church_name     TEXT,
  location        GEOGRAPHY(POINT, 4326), -- lat/lng para busca por proximidade
  location_privacy TEXT DEFAULT 'neighborhood' CHECK (location_privacy IN ('city', 'neighborhood', 'hidden')),
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'followers', 'private')),
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  streak_days     INTEGER DEFAULT 0,
  total_prayers   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: user_interests (interesses espirituais)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_interests (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest   TEXT NOT NULL CHECK (interest IN (
    'intercession', 'worship', 'evangelism', 'discipleship',
    'missions', 'bible_study', 'youth_ministry', 'children_ministry',
    'counseling'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, interest)
);

-- ============================================================
-- TABELA: follows (seguir/ser seguido)
-- ============================================================
CREATE TABLE IF NOT EXISTS follows (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================
-- TABELA: prayer_sessions (orações em horário marcado)
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL CHECK (category IN (
    'family', 'health', 'guidance', 'financial', 'healing',
    'nations', 'gratitude', 'intercession', 'personal_growth'
  )),
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (15, 30, 60, 90, 120, 180)),
  visibility       TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  status           TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  participant_count INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: prayer_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_participants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES prayer_sessions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'praying', 'completed')),
  started_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, user_id)
);

-- ============================================================
-- TABELA: prayer_requests (feed de pedidos de oração)
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content      TEXT NOT NULL CHECK (char_length(content) <= 500),
  category     TEXT NOT NULL CHECK (category IN (
    'family', 'health', 'financial', 'healing', 'guidance',
    'relationships', 'nations', 'gratitude', 'personal', 'intercession'
  )),
  urgency      TEXT DEFAULT 'regular' CHECK (urgency IN ('urgent', 'regular')),
  visibility   TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'circles')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
  prayer_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: prayer_reactions (reações nos pedidos)
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_reactions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT DEFAULT 'praying' CHECK (type IN ('praying', 'love', 'faith', 'cross')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (request_id, user_id)
);

-- ============================================================
-- TABELA: prayer_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL CHECK (char_length(content) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: prayer_circles
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_circles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  goal                TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN (
    'daily_prayer', 'collective_fast', 'campaign', 'intercession', 'bible_challenge'
  )),
  duration_days       INTEGER NOT NULL CHECK (duration_days IN (7, 14, 21, 40)),
  max_members         INTEGER DEFAULT 12 CHECK (max_members <= 50),
  current_members     INTEGER DEFAULT 1,
  visibility          TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'invite_only')),
  daily_prayer_time   TIME,
  starts_at           DATE NOT NULL,
  ends_at             DATE GENERATED ALWAYS AS (starts_at + duration_days - 1) STORED,
  verse               TEXT,
  cover_image_url     TEXT,
  invite_code         TEXT UNIQUE DEFAULT UPPER(SUBSTRING(md5(random()::TEXT), 1, 8)),
  status              TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'abandoned')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: circle_members
-- ============================================================
CREATE TABLE IF NOT EXISTS circle_members (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id  UUID NOT NULL REFERENCES prayer_circles(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  streak     INTEGER DEFAULT 0,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id)
);

-- ============================================================
-- TABELA: circle_prayer_logs (registro diário de oração)
-- ============================================================
CREATE TABLE IF NOT EXISTS circle_prayer_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id      UUID NOT NULL REFERENCES prayer_circles(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  prayed         BOOLEAN NOT NULL,
  duration_min   INTEGER,
  note           TEXT CHECK (char_length(note) <= 300),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id, log_date)
);

-- ============================================================
-- TABELA: faith_events (eventos de fé)
-- ============================================================
CREATE TABLE IF NOT EXISTS faith_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  type              TEXT NOT NULL CHECK (type IN (
    'church_service', 'cell_group', 'vigil', 'bible_study',
    'collective_fast', 'evangelism', 'worship', 'prayer_meeting',
    'conference', 'retreat'
  )),
  starts_at         TIMESTAMPTZ NOT NULL,
  ends_at           TIMESTAMPTZ NOT NULL,
  is_recurring      BOOLEAN DEFAULT FALSE,
  location_name     TEXT,
  location_address  TEXT,
  location          GEOGRAPHY(POINT, 4326),
  is_online         BOOLEAN DEFAULT FALSE,
  online_url        TEXT,
  visibility        TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'community', 'private')),
  max_participants  INTEGER,
  rsvp_count        INTEGER DEFAULT 0,
  cover_image_url   TEXT,
  status            TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: event_rsvps
-- ============================================================
CREATE TABLE IF NOT EXISTS event_rsvps (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id   UUID NOT NULL REFERENCES faith_events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- ============================================================
-- TABELA: invites (convites pessoais)
-- ============================================================
CREATE TABLE IF NOT EXISTS invites (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type           TEXT NOT NULL CHECK (type IN ('prayer_session', 'faith_event', 'prayer_circle', 'app_invite')),
  resource_id    UUID,
  personal_message TEXT CHECK (char_length(personal_message) <= 200),
  invite_token   TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faith_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê o próprio perfil sempre; outros conforme visibility
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_public" ON profiles FOR SELECT USING (profile_visibility = 'public');

-- Prayer sessions: visibilidade public, ou criador, ou participante
CREATE POLICY "sessions_own" ON prayer_sessions FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "sessions_public" ON prayer_sessions FOR SELECT USING (visibility = 'public');

-- Prayer requests
CREATE POLICY "requests_own" ON prayer_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "requests_public" ON prayer_requests FOR SELECT USING (visibility = 'public');

-- Prayer circles
CREATE POLICY "circles_own" ON prayer_circles FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "circles_public" ON prayer_circles FOR SELECT USING (visibility = 'public');

-- Logs de círculo: apenas o próprio usuário cria/edita
CREATE POLICY "logs_own" ON circle_prayer_logs FOR ALL USING (auth.uid() = user_id);

-- Faith events
CREATE POLICY "events_own" ON faith_events FOR ALL USING (auth.uid() = organizer_id);
CREATE POLICY "events_public" ON faith_events FOR SELECT USING (visibility = 'public');

-- Invites: remetente e destinatário podem ver
CREATE POLICY "invites_sender" ON invites FOR ALL USING (auth.uid() = sender_id);
CREATE POLICY "invites_recipient" ON invites FOR SELECT USING (auth.uid() = recipient_id);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_faith_events_location ON faith_events USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_prayer_sessions_scheduled ON prayer_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created ON prayer_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_logs_date ON circle_prayer_logs(circle_id, log_date);

-- ============================================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON prayer_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER circles_updated_at BEFORE UPDATE ON prayer_circles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON faith_events FOR EACH ROW EXECUTE FUNCTION update_updated_at();

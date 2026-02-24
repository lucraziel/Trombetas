-- ================================================================
-- Trombetas — Schema Completo para Supabase
-- ================================================================
-- ⚠️  IMPORTANTE: Este app usa CLERK para autenticação (não Supabase Auth).
--     O backend usa a SERVICE_ROLE_KEY para bypassar o RLS nas escritas.
--     O RLS está habilitado para leituras públicas seguras.
--
-- INSTRUÇÕES:
--   1. Abra: https://supabase.com/dashboard → seu projeto → SQL Editor
--   2. Cole e execute este script inteiro (clique em RUN)
-- ================================================================

-- ── Extensões ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- PARTE 1: TABELAS PRINCIPAIS
-- ================================================================

-- ── profiles ─────────────────────────────────────────────────
-- ID aqui é o clerk_user_id (ex: "user_2abc...") — não UUID
CREATE TABLE IF NOT EXISTS profiles (
  id                  TEXT PRIMARY KEY,           -- Clerk user ID
  username            TEXT UNIQUE NOT NULL,
  full_name           TEXT NOT NULL,
  bio                 TEXT,
  avatar_url          TEXT,
  favorite_verse      TEXT,
  city                TEXT,
  neighborhood        TEXT,
  church_name         TEXT,
  location_privacy    TEXT DEFAULT 'neighborhood'
                      CHECK (location_privacy IN ('city','neighborhood','hidden')),
  profile_visibility  TEXT DEFAULT 'public'
                      CHECK (profile_visibility IN ('public','followers','private')),
  plan                TEXT DEFAULT 'free'
                      CHECK (plan IN ('free','premium')),
  streak_days         INTEGER DEFAULT 0,
  total_prayers       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── user_interests ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_interests (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest   TEXT NOT NULL CHECK (interest IN (
    'intercession','worship','evangelism','discipleship',
    'missions','bible_study','youth_ministry','children_ministry','counseling'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, interest)
);

-- ── follows ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ── prayer_sessions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL CHECK (category IN (
    'family','health','guidance','financial','healing',
    'nations','gratitude','intercession','personal_growth'
  )),
  scheduled_at      TIMESTAMPTZ NOT NULL,
  duration_minutes  INTEGER NOT NULL CHECK (duration_minutes IN (15,30,60,90,120,180)),
  visibility        TEXT DEFAULT 'public' CHECK (visibility IN ('public','friends','private')),
  status            TEXT DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled','live','completed','cancelled')),
  participant_count INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── prayer_participants ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_participants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES prayer_sessions(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','praying','completed')),
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, user_id)
);

-- ── prayer_requests ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) <= 500),
  category      TEXT NOT NULL CHECK (category IN (
    'family','health','financial','healing','guidance',
    'relationships','nations','gratitude','personal','intercession'
  )),
  urgency       TEXT DEFAULT 'regular' CHECK (urgency IN ('urgent','regular')),
  visibility    TEXT DEFAULT 'public' CHECK (visibility IN ('public','friends','circles')),
  is_anonymous  BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','answered','archived')),
  prayer_count  INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── prayer_reactions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_reactions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT DEFAULT 'praying' CHECK (type IN ('praying','love','faith','cross')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (request_id, user_id)
);

-- ── prayer_comments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL CHECK (char_length(content) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── prayer_circles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_circles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  goal              TEXT NOT NULL,
  type              TEXT NOT NULL CHECK (type IN (
    'daily_prayer','collective_fast','campaign','intercession','bible_challenge'
  )),
  duration_days     INTEGER NOT NULL CHECK (duration_days IN (7,14,21,40)),
  max_members       INTEGER DEFAULT 12 CHECK (max_members <= 50),
  current_members   INTEGER DEFAULT 1,
  visibility        TEXT DEFAULT 'public' CHECK (visibility IN ('public','invite_only')),
  daily_prayer_time TIME,
  starts_at         DATE NOT NULL,
  ends_at           DATE GENERATED ALWAYS AS (starts_at + duration_days - 1) STORED,
  verse             TEXT,
  cover_image_url   TEXT,
  invite_code       TEXT UNIQUE DEFAULT UPPER(SUBSTRING(md5(random()::TEXT), 1, 8)),
  status            TEXT DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming','active','completed','abandoned')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── circle_members ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_members (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES prayer_circles(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role      TEXT DEFAULT 'member' CHECK (role IN ('leader','member')),
  streak    INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id)
);

-- ── circle_prayer_logs ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_prayer_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id    UUID NOT NULL REFERENCES prayer_circles(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  prayed       BOOLEAN NOT NULL,
  duration_min INTEGER,
  note         TEXT CHECK (char_length(note) <= 300),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id, log_date)
);

-- ── faith_events ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faith_events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id     TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL CHECK (type IN (
    'church_service','cell_group','vigil','bible_study','collective_fast',
    'evangelism','worship','prayer_meeting','conference','retreat'
  )),
  starts_at        TIMESTAMPTZ NOT NULL,
  ends_at          TIMESTAMPTZ NOT NULL,
  is_recurring     BOOLEAN DEFAULT FALSE,
  location_name    TEXT,
  location_address TEXT,
  is_online        BOOLEAN DEFAULT FALSE,
  online_url       TEXT,
  visibility       TEXT DEFAULT 'public' CHECK (visibility IN ('public','community','private')),
  max_participants INTEGER,
  rsvp_count       INTEGER DEFAULT 0,
  cover_image_url  TEXT,
  status           TEXT DEFAULT 'upcoming'
                   CHECK (status IN ('upcoming','live','completed','cancelled')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── event_rsvps ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_rsvps (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id   UUID NOT NULL REFERENCES faith_events(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT DEFAULT 'going' CHECK (status IN ('going','interested','not_going')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- ── invites ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invites (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id     TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  type             TEXT NOT NULL CHECK (type IN ('prayer_session','faith_event','prayer_circle','app_invite')),
  resource_id      UUID,
  personal_message TEXT CHECK (char_length(personal_message) <= 200),
  invite_token     TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired')),
  expires_at       TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- PARTE 2: SISTEMA DE TROFÉUS
-- ================================================================

-- ── user_adhesions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_adhesions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type  TEXT NOT NULL CHECK (source_type IN ('circle_join','event_rsvp')),
  source_id    UUID NOT NULL,
  source_title TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, source_type, source_id)
);

-- ── user_trophies ─────────────────────────────────────────────
-- 50 adesões = 1 bronze | 100 bronzes = 1 prata | acumula sem reset
CREATE TABLE IF NOT EXISTS user_trophies (
  user_id         TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_adhesions INTEGER DEFAULT 0,
  bronze          INTEGER DEFAULT 0,   -- floor(total / 50)
  silver          INTEGER DEFAULT 0,   -- floor(total / 5.000)
  gold            INTEGER DEFAULT 0,   -- floor(total / 500.000)
  platinum        INTEGER DEFAULT 0,   -- floor(total / 50.000.000)
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- PARTE 3: ROW LEVEL SECURITY
-- ================================================================
-- ⚠️  O backend usa SERVICE_ROLE_KEY → bypassa RLS automaticamente.
--     RLS aqui protege leituras diretas via anon_key (ex: frontend).

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows            ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_reactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_comments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_circles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faith_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps        ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites            ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_adhesions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trophies      ENABLE ROW LEVEL SECURITY;

-- Perfis: leitura pública para perfis públicos
CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (profile_visibility = 'public');
CREATE POLICY "profiles_anon_read"    ON profiles FOR SELECT USING (true); -- ajuste conforme necessário

-- Prayer requests: leitura pública
CREATE POLICY "requests_public_read"  ON prayer_requests FOR SELECT USING (visibility = 'public');

-- Prayer sessions: leitura pública
CREATE POLICY "sessions_public_read"  ON prayer_sessions FOR SELECT USING (visibility = 'public');

-- Prayer circles: leitura pública
CREATE POLICY "circles_public_read"   ON prayer_circles FOR SELECT USING (visibility = 'public');

-- Faith events: leitura pública
CREATE POLICY "events_public_read"    ON faith_events FOR SELECT USING (visibility = 'public');

-- Troféus: leitura pública (ranking)
CREATE POLICY "trophies_public_read"  ON user_trophies FOR SELECT USING (true);

-- Adesões: leitura pública (ranking)
CREATE POLICY "adhesions_public_read" ON user_adhesions FOR SELECT USING (true);

-- ================================================================
-- PARTE 4: ÍNDICES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_prayer_sessions_scheduled  ON prayer_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created    ON prayer_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle      ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_logs_date           ON circle_prayer_logs(circle_id, log_date);
CREATE INDEX IF NOT EXISTS idx_user_adhesions_user        ON user_adhesions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_trophies_ranking      ON user_trophies(platinum DESC, gold DESC, silver DESC, bronze DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username          ON profiles(username);

-- ================================================================
-- PARTE 5: TRIGGERS updated_at
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at        BEFORE UPDATE ON profiles         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sessions_updated_at        BEFORE UPDATE ON prayer_sessions  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER requests_updated_at        BEFORE UPDATE ON prayer_requests  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER circles_updated_at         BEFORE UPDATE ON prayer_circles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at          BEFORE UPDATE ON faith_events     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- PARTE 6: FUNÇÃO recalculate_trophies
-- ================================================================

CREATE OR REPLACE FUNCTION recalculate_trophies(p_user_id TEXT)
RETURNS user_trophies AS $$
DECLARE
  v_total  INTEGER;
  v_record user_trophies;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM user_adhesions
  WHERE user_id = p_user_id;

  -- Todos os níveis acumulam sem reset
  -- 50 adesões = 1 bronze
  -- 100 bronzes = 1 prata  (5.000 adesões)
  -- 100 pratas  = 1 ouro   (500.000 adesões)
  -- 100 ouros   = 1 platina (50.000.000 adesões)
  v_record.user_id         := p_user_id;
  v_record.total_adhesions := v_total;
  v_record.bronze          := v_total / 50;
  v_record.silver          := v_total / 5000;
  v_record.gold            := v_total / 500000;
  v_record.platinum        := v_total / 50000000;
  v_record.updated_at      := NOW();

  INSERT INTO user_trophies (user_id, total_adhesions, bronze, silver, gold, platinum, updated_at)
  VALUES (v_record.user_id, v_record.total_adhesions, v_record.bronze, v_record.silver, v_record.gold, v_record.platinum, v_record.updated_at)
  ON CONFLICT (user_id) DO UPDATE SET
    total_adhesions = EXCLUDED.total_adhesions,
    bronze          = EXCLUDED.bronze,
    silver          = EXCLUDED.silver,
    gold            = EXCLUDED.gold,
    platinum        = EXCLUDED.platinum,
    updated_at      = EXCLUDED.updated_at;

  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- ✅ Script concluído!
-- Tabelas criadas: profiles, user_interests, follows,
--   prayer_sessions, prayer_participants, prayer_requests,
--   prayer_reactions, prayer_comments, prayer_circles,
--   circle_members, circle_prayer_logs, faith_events,
--   event_rsvps, invites, user_adhesions, user_trophies
-- Função criada: recalculate_trophies(p_user_id TEXT)
-- ================================================================

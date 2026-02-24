-- ============================================================
-- Trombetas — Trophy System Migration
-- Execute APÓS o schema.sql principal
-- ============================================================

-- ============================================================
-- TABELA: user_adhesions (log de cada adesão que gera bronze)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_adhesions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type   TEXT NOT NULL CHECK (source_type IN ('circle_join', 'event_rsvp')),
  source_id     UUID NOT NULL,           -- ID do círculo ou evento
  source_title  TEXT,                    -- Nome do círculo/evento (snapshot)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, source_type, source_id)  -- sem duplicata por recurso
);

-- ============================================================
-- TABELA: user_trophies (snapshot calculado dos troféus)
-- Mantemos denormalizado para queries rápidas de ranking
-- ============================================================
CREATE TABLE IF NOT EXISTS user_trophies (
  user_id         UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_adhesions INTEGER DEFAULT 0,
  bronze          INTEGER DEFAULT 0,  -- total_adhesions % 100
  silver          INTEGER DEFAULT 0,  -- floor((total % 10.000) / 100)
  gold            INTEGER DEFAULT 0,  -- floor((total % 1.000.000) / 10.000)
  platinum        INTEGER DEFAULT 0,  -- floor(total / 1.000.000)
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE user_adhesions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trophies  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "adhesions_own"       ON user_adhesions FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "trophies_own"        ON user_trophies  FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "trophies_public_sel" ON user_trophies  FOR SELECT USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_adhesions_user    ON user_adhesions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_trophies_platinum ON user_trophies(platinum DESC, gold DESC, silver DESC, bronze DESC);

-- ============================================================
-- FUNÇÃO: recalcular troféus de um usuário
-- Chamada pelo backend após cada adesão
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_trophies(p_user_id UUID)
RETURNS user_trophies AS $$
DECLARE
  v_total  INTEGER;
  v_record user_trophies;
BEGIN
  -- Conta total de adesões únicas
  SELECT COUNT(*) INTO v_total
  FROM user_adhesions
  WHERE user_id = p_user_id;

  -- Bronzes NÃO ZERAM — todos acumulam de forma independente
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

  -- Upsert no snapshot
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

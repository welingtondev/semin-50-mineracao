-- ====================================================================================
-- MINERAX - SUPABASE POSTGRESQL SCHEMA
-- Copie e cole este código inteiro no SQL Editor do seu projeto Supabase e execute.
-- ====================================================================================

-- 1. Criação das Tabelas
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  consent_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
  max_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  referred_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  pergunta TEXT NOT NULL,
  alternativas JSONB NOT NULL,
  resposta_correta INTEGER NOT NULL,
  dificuldade TEXT NOT NULL CHECK(dificuldade IN ('facil','medio','dificil'))
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL DEFAULT 0,
  total_acertos INTEGER NOT NULL DEFAULT 0,
  total_erros INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_answers (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  answer_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  invited_user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL DEFAULT 0,
  tipo TEXT NOT NULL CHECK(tipo IN ('global','semanal','grupo')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tipo)
);

CREATE TABLE IF NOT EXISTS share_assets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  tipo TEXT NOT NULL CHECK(tipo IN ('top1','top3','top10')),
  imagem_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para Otimização de Performance
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_tipo_score ON rankings(tipo, score DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_user ON rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_users_max_score ON users(max_score DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_user ON referrals(user_id);

-- ====================================================================================
-- MIGRAÇÃO: Reações com Emojis + Respostas a Comentários
-- Cole este SQL no SQL Editor do Supabase e execute.
-- ====================================================================================

-- ── 1. Adicionar campo parent_id para respostas (threads) ──
ALTER TABLE gallery_comments ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES gallery_comments(id) ON DELETE CASCADE;

-- ── 2. Tabela de reações com emojis ──
CREATE TABLE IF NOT EXISTS comment_reactions (
  id BIGSERIAL PRIMARY KEY,
  comment_id BIGINT NOT NULL REFERENCES gallery_comments(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('❤️', '😂', '👏', '🔥', '⛏️')),
  visitor_id TEXT NOT NULL, -- ID do localStorage para evitar duplicatas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, emoji, visitor_id) -- Um visitante só pode dar um tipo de reação por comentário
);

-- ── 3. Índices ──
CREATE INDEX IF NOT EXISTS idx_comments_parent ON gallery_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment ON comment_reactions(comment_id);

-- ── 4. RLS: permitir leitura e inserção pública de reações ──
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reactions" ON comment_reactions;
CREATE POLICY "Anyone can read reactions" ON comment_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert reactions" ON comment_reactions;
CREATE POLICY "Anyone can insert reactions" ON comment_reactions FOR INSERT WITH CHECK (true);

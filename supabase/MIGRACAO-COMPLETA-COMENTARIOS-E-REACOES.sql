-- ====================================================================================
-- MIGRAÇÃO UNIFICADA: REAÇÕES, COMENTÁRIOS EM THREADS E VINCULAÇÃO DE CONTAS (LGPD)
-- Cole este SQL no SQL Editor do Supabase e clique em RUN.
-- Ele cria todas as tabelas e campos necessários em ordem garantida.
-- ====================================================================================

-- ── 1. Adicionar campos de relacionamento na tabela de COMENTÁRIOS ──
-- Note: O ID original do comentário é do tipo UUID, portanto parent_id precisa ser UUID.
ALTER TABLE gallery_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES gallery_comments(id) ON DELETE CASCADE;
ALTER TABLE gallery_comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_comments_parent ON gallery_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_gallery_comments_user ON gallery_comments(user_id);

-- ── 2. Adicionar campo de relacionamento na tabela de FOTOS SUBMETIDAS ──
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user ON gallery_photos(user_id);

-- ── 3. Criar a Tabela de REAÇÕES COM EMOJIS (se não existir) ──
-- Note: O ID do comentário é UUID, portanto comment_id precisa ser UUID.
CREATE TABLE IF NOT EXISTS comment_reactions (
  id BIGSERIAL PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES gallery_comments(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('❤️', '😂', '👏', '🔥', '⛏️')),
  visitor_id TEXT NOT NULL, -- Para usuários anônimos / fallback
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Vinculado à conta do usuário
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices e restrições de unicidade
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user ON comment_reactions(user_id);

-- Garantir que a restrição de unicidade para reações considere tanto user_id quanto visitor_id de forma flexível
ALTER TABLE comment_reactions DROP CONSTRAINT IF EXISTS comment_reactions_comment_id_emoji_visitor_id_key;
ALTER TABLE comment_reactions DROP CONSTRAINT IF EXISTS comment_reactions_comment_id_emoji_user_id_key;
ALTER TABLE comment_reactions ADD CONSTRAINT comment_reactions_comment_id_emoji_user_id_key UNIQUE(comment_id, emoji, user_id);

-- ── 4. RLS (Segurança de Linha) para as reações ──
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reactions" ON comment_reactions;
CREATE POLICY "Anyone can read reactions" ON comment_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert reactions" ON comment_reactions;
CREATE POLICY "Anyone can insert reactions" ON comment_reactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete reactions" ON comment_reactions;
CREATE POLICY "Anyone can delete reactions" ON comment_reactions FOR DELETE USING (true);

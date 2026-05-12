-- ====================================================================================
-- MIGRAÇÃO: VINCULAÇÃO TOTAL DE INTERAÇÕES E SUBMISSÕES ÀS CONTAS DE USUÁRIOS (LGPD)
-- Cole este SQL no SQL Editor do Supabase e execute.
-- ====================================================================================

-- ── 1. Vincular Comentários (gallery_comments) à conta do usuário ──
ALTER TABLE gallery_comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_comments_user ON gallery_comments(user_id);

-- ── 2. Vincular Fotos Submetidas (gallery_photos) à conta do usuário ──
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user ON gallery_photos(user_id);

-- ── 3. Vincular Reações de Comentários (comment_reactions) à conta do usuário ──
ALTER TABLE comment_reactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user ON comment_reactions(user_id);

-- Atualizar restrição única das reações de forma segura, limpando restrições antigas primeiro
ALTER TABLE comment_reactions DROP CONSTRAINT IF EXISTS comment_reactions_comment_id_emoji_visitor_id_key;
ALTER TABLE comment_reactions DROP CONSTRAINT IF EXISTS comment_reactions_comment_id_emoji_user_id_key;
ALTER TABLE comment_reactions ADD CONSTRAINT comment_reactions_comment_id_emoji_user_id_key UNIQUE(comment_id, emoji, user_id);

-- ====================================================================================
-- MIGRAÇÃO: Curtidas Salvas por Usuário Vinculado à Conta + Sincronização Automática
-- Cole este SQL no SQL Editor do Supabase e execute.
-- ====================================================================================

-- ── 1. Criar a tabela de curtidas vinculadas aos usuários ──
CREATE TABLE IF NOT EXISTS photo_likes (
  id BIGSERIAL PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES gallery_photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- ── 2. Índices para performance ultra-rápida ──
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo ON photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_user ON photo_likes(user_id);

-- ── 3. Habilitar Row Level Security (RLS) ──
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS públicas e seguras
DROP POLICY IF EXISTS "Anyone can read photo_likes" ON photo_likes;
CREATE POLICY "Anyone can read photo_likes" ON photo_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own photo_likes" ON photo_likes;
CREATE POLICY "Users can insert own photo_likes" ON photo_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own photo_likes" ON photo_likes;
CREATE POLICY "Users can delete own photo_likes" ON photo_likes FOR DELETE USING (auth.uid() = user_id);

-- ── 4. Trigger de sincronização automática da coluna likes_count ──
CREATE OR REPLACE FUNCTION update_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gallery_photos
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = NEW.photo_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE gallery_photos
    SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
    WHERE id = OLD.photo_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_photo_likes_count ON photo_likes;
CREATE TRIGGER trg_update_photo_likes_count
AFTER INSERT OR DELETE ON photo_likes
FOR EACH ROW
EXECUTE FUNCTION update_photo_likes_count();

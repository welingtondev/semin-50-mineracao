-- ====================================================================================
-- SISTEMA DE TEMPORADA MENSAL AUTOMATIZADO - DESAFIO SEMIN 26
-- Cole este código no SQL Editor do Supabase e execute.
-- O sistema fecha o mês automaticamente via pg_cron (sem intervenção manual).
-- ====================================================================================

-- ===== 1. TABELA DE VENCEDORES MENSAIS =====
CREATE TABLE IF NOT EXISTS monthly_winners (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  season_month TEXT NOT NULL,             -- Ex: '2026-05' (ano-mês)
  total_score INTEGER NOT NULL DEFAULT 0, -- Pontuação acumulada no mês
  total_matches INTEGER NOT NULL DEFAULT 0,
  total_acertos INTEGER NOT NULL DEFAULT 0,
  total_erros INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER NOT NULL DEFAULT 1,
  sponsor_name TEXT DEFAULT '',           -- Nome do patrocinador do mês
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_month, rank_position)     -- Apenas um por posição/mês
);

-- RLS
ALTER TABLE monthly_winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "monthly_winners: anyone can read" ON monthly_winners;
CREATE POLICY "monthly_winners: anyone can read" ON monthly_winners
  FOR SELECT USING (true);

-- Índice
CREATE INDEX IF NOT EXISTS idx_monthly_winners_month ON monthly_winners(season_month DESC);

-- ===== 2. RANKING DO MÊS ATUAL =====

DROP FUNCTION IF EXISTS get_monthly_ranking(INTEGER);

CREATE OR REPLACE FUNCTION get_monthly_ranking(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  rank_position BIGINT,
  user_id UUID,
  nickname TEXT,
  month_score BIGINT,
  match_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC) as rank_position,
    p.id as user_id,
    p.nickname,
    MAX(m.score)::BIGINT as month_score,
    COUNT(m.id)::BIGINT as match_count
  FROM matches m
  JOIN profiles p ON p.id = m.user_id
  WHERE DATE_TRUNC('month', m.created_at) = DATE_TRUNC('month', NOW())
  GROUP BY p.id, p.nickname
  HAVING MAX(m.score) > 0
  ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== 3. MINHA POSIÇÃO NO MÊS =====

DROP FUNCTION IF EXISTS get_my_monthly_ranking();

CREATE OR REPLACE FUNCTION get_my_monthly_ranking()
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_my_month_score BIGINT;
  v_month_pos BIGINT;
  v_match_count BIGINT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  SELECT COALESCE(MAX(score), 0), COUNT(id)
  INTO v_my_month_score, v_match_count
  FROM matches
  WHERE user_id = v_user_id
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());

  SELECT COUNT(*) + 1 INTO v_month_pos
  FROM (
    SELECT m.user_id, MAX(m.score) as total
    FROM matches m
    WHERE DATE_TRUNC('month', m.created_at) = DATE_TRUNC('month', NOW())
    GROUP BY m.user_id
    HAVING MAX(m.score) > v_my_month_score
  ) ranked;

  RETURN jsonb_build_object(
    'rank_position', v_month_pos,
    'month_score', v_my_month_score,
    'match_count', v_match_count,
    'season_month', TO_CHAR(NOW(), 'YYYY-MM')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== 4. FECHAR O MÊS (chamada manual ou automática) =====

DROP FUNCTION IF EXISTS close_monthly_season(TEXT, TEXT);

CREATE OR REPLACE FUNCTION close_monthly_season(
  p_season_month TEXT,            -- Ex: '2026-05'
  p_sponsor_name TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
  v_winner RECORD;
  v_saved INTEGER := 0;
BEGIN
  -- Verificar se já foi fechado (evitar duplicidade)
  IF EXISTS (SELECT 1 FROM monthly_winners WHERE season_month = p_season_month) THEN
    RETURN jsonb_build_object(
      'error', 'Mês já foi fechado anteriormente',
      'season_month', p_season_month
    );
  END IF;

  -- Salvar top 3 do mês
  FOR v_winner IN
    SELECT
      ROW_NUMBER() OVER (ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC) as pos,
      p.id as uid,
      p.nickname as nick,
      MAX(m.score)::INTEGER as total_score,
      COUNT(m.id)::INTEGER as total_matches,
      SUM(m.total_acertos)::INTEGER as acertos,
      SUM(m.total_erros)::INTEGER as erros
    FROM matches m
    JOIN profiles p ON p.id = m.user_id
    WHERE TO_CHAR(m.created_at, 'YYYY-MM') = p_season_month
    GROUP BY p.id, p.nickname
    HAVING MAX(m.score) > 0
    ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC
    LIMIT 3
  LOOP
    INSERT INTO monthly_winners (user_id, nickname, season_month, total_score, total_matches, total_acertos, total_erros, rank_position, sponsor_name)
    VALUES (v_winner.uid, v_winner.nick, p_season_month, v_winner.total_score, v_winner.total_matches, v_winner.acertos, v_winner.erros, v_winner.pos, p_sponsor_name);
    v_saved := v_saved + 1;
  END LOOP;

  -- Resetar max_score de todos os jogadores para o novo mês
  UPDATE profiles SET max_score = 0;

  RETURN jsonb_build_object(
    'season_closed', p_season_month,
    'winners_saved', v_saved,
    'all_scores_reset', true,
    'sponsor', p_sponsor_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== 5. FUNÇÃO AUTOMÁTICA (executada pelo cron) =====
-- Fecha automaticamente o mês ANTERIOR no dia 1 de cada mês

CREATE OR REPLACE FUNCTION auto_close_previous_month()
RETURNS void AS $$
DECLARE
  v_previous_month TEXT;
  v_result JSONB;
BEGIN
  -- Calcula o mês anterior (ex: se hoje é 01/06, fecha '2026-05')
  v_previous_month := TO_CHAR(NOW() - INTERVAL '1 day', 'YYYY-MM');
  
  -- Só fecha se ainda não foi fechado
  IF NOT EXISTS (SELECT 1 FROM monthly_winners WHERE season_month = v_previous_month) THEN
    v_result := close_monthly_season(v_previous_month, '');
    RAISE NOTICE 'Temporada % fechada: %', v_previous_month, v_result;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== 6. AGENDAR CRON AUTOMATICO =====
-- Executa no dia 1 de cada mês às 00:05 (horário UTC)
-- IMPORTANTE: O pg_cron deve estar habilitado no Supabase
-- (Dashboard > Database > Extensions > pg_cron > Enable)

-- Habilitar extensão pg_cron (se ainda não estiver)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remover job anterior se existir
SELECT cron.unschedule('close-monthly-season')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'close-monthly-season'
);

-- Agendar: todo dia 1 às 00:05 UTC
SELECT cron.schedule(
  'close-monthly-season',               -- nome do job
  '5 0 1 * *',                           -- cron: minuto 5, hora 0, dia 1, todo mês
  $$SELECT auto_close_previous_month()$$ -- comando SQL
);

-- ===== 7. LISTAR VENCEDORES PASSADOS =====

DROP FUNCTION IF EXISTS get_past_winners(INTEGER);

CREATE OR REPLACE FUNCTION get_past_winners(p_limit INTEGER DEFAULT 12)
RETURNS TABLE(
  season_month TEXT,
  rank_position INTEGER,
  nickname TEXT,
  total_score INTEGER,
  sponsor_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mw.season_month,
    mw.rank_position,
    mw.nickname,
    mw.total_score,
    mw.sponsor_name
  FROM monthly_winners mw
  ORDER BY mw.season_month DESC, mw.rank_position ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== 8. ATUALIZAR get_global_ranking PARA MÊS ATUAL =====

CREATE OR REPLACE FUNCTION get_global_ranking(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  rank_position BIGINT,
  user_id UUID,
  nickname TEXT,
  max_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC) as rank_position,
    p.id as user_id,
    p.nickname,
    MAX(m.score)::INTEGER as max_score
  FROM matches m
  JOIN profiles p ON p.id = m.user_id
  WHERE DATE_TRUNC('month', m.created_at) = DATE_TRUNC('month', NOW())
  GROUP BY p.id, p.nickname
  HAVING MAX(m.score) > 0
  ORDER BY MAX(m.score) DESC, MIN(m.created_at) ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

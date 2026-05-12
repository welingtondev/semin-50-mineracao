-- ====================================================================================
-- MIGRAÇÃO: Sistema de Ranking Mensal (Melhor Partida Única)
-- 
-- INSTRUÇÕES: Cole este SQL no SQL Editor do Supabase e execute.
--
-- O que muda:
--   1. Adiciona coluna max_score_month para rastrear qual mês o recorde pertence
--   2. submit_match agora salva apenas a MAIOR pontuação do mês corrente
--   3. Rankings calculados com base na melhor partida do mês atual
--   4. Ao virar o mês, o recorde reseta automaticamente
-- ====================================================================================

-- ── 1. Adicionar coluna de mês na tabela profiles ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS max_score_month TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM');

-- ── 2. Recalcular max_score de todos os jogadores baseado na melhor partida do mês atual ──
-- (Corrige os valores acumulados que estavam errados)
UPDATE profiles p
SET 
  max_score = COALESCE((
    SELECT MAX(m.score) 
    FROM matches m 
    WHERE m.user_id = p.id 
      AND TO_CHAR(m.created_at, 'YYYY-MM') = TO_CHAR(NOW(), 'YYYY-MM')
  ), 0),
  max_score_month = TO_CHAR(NOW(), 'YYYY-MM');

-- ── 3. Recriar função submit_match ──
CREATE OR REPLACE FUNCTION submit_match(
  p_answers JSONB,
  p_duration_ms INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_score INTEGER := 0;
  v_total_acertos INTEGER := 0;
  v_total_erros INTEGER := 0;
  v_streak INTEGER := 0;
  v_combo_max INTEGER := 0;
  v_answer JSONB;
  v_question RECORD;
  v_is_correct BOOLEAN;
  v_base_points INTEGER;
  v_combo_bonus NUMERIC;
  v_earned_points INTEGER;
  v_match_id INTEGER;
  v_current_max INTEGER;
  v_current_month TEXT;
  v_saved_month TEXT;
  v_match_count INTEGER;
BEGIN
  -- Get authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  -- Rate limit: max 10 matches per hour
  SELECT COUNT(*) INTO v_match_count
  FROM matches
  WHERE user_id = v_user_id AND created_at >= NOW() - INTERVAL '1 hour';
  
  IF v_match_count >= 10 THEN
    RAISE EXCEPTION 'Limite de 10 partidas por hora atingido. Tente novamente mais tarde.';
  END IF;

  -- Validate answers array
  IF p_answers IS NULL OR jsonb_array_length(p_answers) = 0 THEN
    RAISE EXCEPTION 'Respostas inválidas';
  END IF;

  -- Process each answer
  FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    -- Lookup question
    SELECT q.resposta_correta, q.dificuldade
    INTO v_question
    FROM questions q
    WHERE q.id = (v_answer->>'question_id')::INTEGER;

    IF NOT FOUND THEN
      CONTINUE;
    END IF;

    v_is_correct := (v_answer->>'answer_index')::INTEGER = v_question.resposta_correta;

    IF v_is_correct THEN
      v_total_acertos := v_total_acertos + 1;
      v_streak := v_streak + 1;
      IF v_streak > v_combo_max THEN v_combo_max := v_streak; END IF;

      -- Base points by difficulty
      v_base_points := CASE v_question.dificuldade
        WHEN 'facil' THEN 10
        WHEN 'medio' THEN 20
        WHEN 'dificil' THEN 40
        ELSE 10
      END;

      -- Combo bonus
      v_combo_bonus := CASE
        WHEN v_streak >= 10 THEN 0.50
        WHEN v_streak >= 5 THEN 0.25
        WHEN v_streak >= 3 THEN 0.10
        ELSE 0
      END;

      -- Speed bonus
      DECLARE
        v_answer_time INTEGER;
        v_speed_bonus NUMERIC;
      BEGIN
        v_answer_time := COALESCE((v_answer->>'time_ms')::INTEGER, 15000);
        IF v_answer_time <= 3000 THEN
          v_speed_bonus := 0.50;
        ELSIF v_answer_time >= 10000 THEN
          v_speed_bonus := 0.0;
        ELSE
          v_speed_bonus := 0.50 * (1.0 - ((v_answer_time - 3000)::NUMERIC / 7000.0));
        END IF;

        v_earned_points := ROUND(v_base_points * (1 + v_combo_bonus + v_speed_bonus));
      END;

      v_score := v_score + v_earned_points;
    ELSE
      v_total_erros := v_total_erros + 1;
      v_streak := 0;
      v_score := v_score - 15;
    END IF;
  END LOOP;

  -- Floor at 0
  IF v_score < 0 THEN v_score := 0; END IF;

  -- Insert match record
  INSERT INTO matches (user_id, score, total_acertos, total_erros, combo_max, duration_ms)
  VALUES (v_user_id, v_score, v_total_acertos, v_total_erros, v_combo_max, p_duration_ms)
  RETURNING id INTO v_match_id;

  -- ── Monthly best-score system ──
  -- Only keep the highest score from a single match within the current month
  v_current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  SELECT max_score, COALESCE(max_score_month, '1970-01') 
  INTO v_current_max, v_saved_month
  FROM profiles WHERE id = v_user_id;

  IF v_saved_month != v_current_month THEN
    -- New month → reset score and save this one as the new record
    UPDATE profiles 
    SET max_score = v_score, max_score_month = v_current_month 
    WHERE id = v_user_id;
    v_current_max := 0; -- For is_new_record calculation
  ELSIF v_score > COALESCE(v_current_max, 0) THEN
    -- Same month, but beat the record → update
    UPDATE profiles 
    SET max_score = v_score, max_score_month = v_current_month 
    WHERE id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'match_id', v_match_id,
    'score', v_score,
    'total_acertos', v_total_acertos,
    'total_erros', v_total_erros,
    'combo_max', v_combo_max,
    'is_new_record', v_score > COALESCE(v_current_max, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 4. Recriar ranking global (agora é mensal: melhor partida do mês) ──
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
    ROW_NUMBER() OVER (ORDER BY p.max_score DESC, p.created_at ASC) as rank_position,
    p.id as user_id,
    p.nickname,
    p.max_score
  FROM profiles p
  WHERE p.max_score > 0
    AND p.max_score_month = TO_CHAR(NOW(), 'YYYY-MM')
  ORDER BY p.max_score DESC, p.created_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 5. Recriar ranking do jogador (posição no mês atual) ──
CREATE OR REPLACE FUNCTION get_my_ranking()
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_my_score INTEGER;
  v_my_month TEXT;
  v_current_month TEXT;
  v_global_pos BIGINT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  v_current_month := TO_CHAR(NOW(), 'YYYY-MM');

  SELECT max_score, COALESCE(max_score_month, '1970-01') 
  INTO v_my_score, v_my_month
  FROM profiles WHERE id = v_user_id;

  -- If stored score is from a previous month, treat as 0
  IF v_my_month != v_current_month THEN
    v_my_score := 0;
  END IF;

  SELECT COUNT(*) + 1 INTO v_global_pos
  FROM profiles
  WHERE max_score > COALESCE(v_my_score, 0)
    AND max_score_month = v_current_month;

  RETURN jsonb_build_object(
    'rank_position', v_global_pos,
    'score', COALESCE(v_my_score, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 6. Recriar ranking semanal (melhor partida dos últimos 7 dias) ──
CREATE OR REPLACE FUNCTION get_weekly_ranking(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  rank_position BIGINT,
  user_id UUID,
  nickname TEXT,
  best_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY MAX(m.score) DESC) as rank_position,
    p.id as user_id,
    p.nickname,
    MAX(m.score) as best_score
  FROM matches m
  JOIN profiles p ON p.id = m.user_id
  WHERE m.created_at >= NOW() - INTERVAL '7 days'
  GROUP BY p.id, p.nickname
  ORDER BY MAX(m.score) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

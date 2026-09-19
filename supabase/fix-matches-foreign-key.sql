-- ============================================================================
-- FIX DEFINITIVO: Chave Estrangeira Matches & Tratamento Total de Unicidade
-- ============================================================================

-- 1. Sincroniza usuários de auth.users que ainda NÃO estão em public.profiles
INSERT INTO public.profiles (id, email, full_name, nickname, phone, consent_lgpd, max_score)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.nickname = COALESCE(u.raw_user_meta_data->>'nickname', split_part(u.email, '@', 1))
      AND p.id != u.id
    ) THEN COALESCE(u.raw_user_meta_data->>'nickname', split_part(u.email, '@', 1)) || '_' || substring(u.id::text, 1, 4)
    ELSE COALESCE(u.raw_user_meta_data->>'nickname', split_part(u.email, '@', 1))
  END AS nickname,
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  true,
  0
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.profiles)
  AND (u.email IS NULL OR u.email NOT IN (SELECT email FROM public.profiles WHERE email IS NOT NULL))
ON CONFLICT (id) DO NOTHING;

-- 2. Recria a chave estrangeira apontando com integridade para public.profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'matches_user_id_fkey' AND table_name = 'matches'
  ) THEN
    ALTER TABLE matches DROP CONSTRAINT matches_user_id_fkey;
  END IF;

  ALTER TABLE matches 
    ADD CONSTRAINT matches_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
END $$;

-- 3. Trigger automático para novos cadastros
CREATE OR REPLACE FUNCTION public.handle_new_quiz_user()
RETURNS TRIGGER AS $$
DECLARE
  v_base_nick TEXT;
  v_final_nick TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id OR (email IS NOT NULL AND email = NEW.email)) THEN
    RETURN NEW;
  END IF;

  v_base_nick := COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1));
  
  IF EXISTS (SELECT 1 FROM public.profiles WHERE nickname = v_base_nick) THEN
    v_final_nick := v_base_nick || '_' || substring(NEW.id::text, 1, 4);
  ELSE
    v_final_nick := v_base_nick;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, nickname, phone, consent_lgpd, max_score)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    v_final_nick,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    true,
    0
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_quiz ON auth.users;
CREATE TRIGGER on_auth_user_created_quiz
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_quiz_user();

-- 4. Remove a versão anterior da função submit_match antes de recriar
DROP FUNCTION IF EXISTS public.submit_match(jsonb, integer);
DROP FUNCTION IF EXISTS public.submit_match;

-- 5. Criação da função submit_match com auto-cura completa
CREATE OR REPLACE FUNCTION public.submit_match(
  p_answers JSONB,
  p_duration_ms INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  v_match_count INTEGER;
  v_current_month TEXT;
  v_saved_month TEXT;
  v_is_new_record BOOLEAN := false;
  v_base_nick TEXT;
  v_final_nick TEXT;
  v_user_email TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  -- Auto-cura caso o usuário não tenha perfil
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
    SELECT email, COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1))
    INTO v_user_email, v_base_nick
    FROM auth.users WHERE id = v_user_id;

    IF v_base_nick IS NULL THEN v_base_nick := 'usuario'; END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE nickname = v_base_nick) THEN
      v_final_nick := v_base_nick || '_' || substring(v_user_id::text, 1, 4);
    ELSE
      v_final_nick := v_base_nick;
    END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = v_user_email AND id != v_user_id) THEN
      v_user_email := NULL;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, nickname, phone, consent_lgpd, max_score)
    SELECT 
      v_user_id,
      v_user_email,
      COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
      v_final_nick,
      COALESCE(u.raw_user_meta_data->>'phone', ''),
      true,
      0
    FROM auth.users u
    WHERE u.id = v_user_id
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Rate limit: máximo 15 partidas por hora
  SELECT COUNT(*) INTO v_match_count
  FROM matches
  WHERE user_id = v_user_id AND created_at >= NOW() - INTERVAL '1 hour';
  
  IF v_match_count >= 15 THEN
    RAISE EXCEPTION 'Limite de partidas por hora atingido. Aguarde alguns instantes.';
  END IF;

  IF p_answers IS NULL OR jsonb_array_length(p_answers) = 0 THEN
    RAISE EXCEPTION 'Respostas inválidas';
  END IF;

  -- Processa as respostas
  FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    SELECT q.resposta_correta, q.dificuldade
    INTO v_question
    FROM questions q
    WHERE q.id = (v_answer->>'question_id')::INTEGER;

    IF NOT FOUND THEN CONTINUE; END IF;

    v_is_correct := (v_answer->>'answer_index')::INTEGER = v_question.resposta_correta;

    IF v_is_correct THEN
      v_total_acertos := v_total_acertos + 1;
      v_streak := v_streak + 1;
      IF v_streak > v_combo_max THEN v_combo_max := v_streak; END IF;

      v_base_points := CASE v_question.dificuldade
        WHEN 'facil' THEN 10
        WHEN 'medio' THEN 20
        WHEN 'dificil' THEN 40
        ELSE 10
      END;

      v_combo_bonus := CASE
        WHEN v_streak >= 10 THEN 0.50
        WHEN v_streak >= 5 THEN 0.25
        WHEN v_streak >= 3 THEN 0.10
        ELSE 0
      END;

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

  IF v_score < 0 THEN v_score := 0; END IF;

  INSERT INTO matches (user_id, score, total_acertos, total_erros, combo_max, duration_ms)
  VALUES (v_user_id, v_score, v_total_acertos, v_total_erros, v_combo_max, p_duration_ms)
  RETURNING id INTO v_match_id;

  v_current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  SELECT max_score, COALESCE(max_score_month, '1970-01') 
  INTO v_current_max, v_saved_month
  FROM profiles WHERE id = v_user_id;

  IF v_saved_month != v_current_month THEN
    UPDATE profiles 
    SET max_score = v_score, max_score_month = v_current_month 
    WHERE id = v_user_id;
    v_is_new_record := true;
  ELSIF v_score > COALESCE(v_current_max, 0) THEN
    UPDATE profiles 
    SET max_score = v_score, max_score_month = v_current_month 
    WHERE id = v_user_id;
    v_is_new_record := true;
  END IF;

  RETURN jsonb_build_object(
    'match_id', v_match_id,
    'score', v_score,
    'total_acertos', v_total_acertos,
    'total_erros', v_total_erros,
    'combo_max', v_combo_max,
    'is_new_record', v_is_new_record,
    'max_score', GREATEST(COALESCE(v_current_max, 0), v_score),
    'season_month', v_current_month
  );
END;
$$;

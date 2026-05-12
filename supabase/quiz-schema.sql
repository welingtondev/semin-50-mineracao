-- ====================================================================================
-- QUIZ SEMIN 2026 - SUPABASE-ONLY SCHEMA
-- Cole este código no SQL Editor do Supabase e execute.
-- Usa Supabase Auth (auth.uid()) para autenticação — sem backend separado!
-- ====================================================================================

-- ===== 1. TABELAS =====

-- Perfis de usuário (extensão da tabela auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  nickname TEXT UNIQUE NOT NULL,
  phone TEXT,
  max_score INTEGER DEFAULT 0,
  max_score_month TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM'),
  consent_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permite atualizar banco antigo sem quebrar
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.constraint_column_usage 
    WHERE table_name = 'profiles' AND constraint_name = 'unique_profile_email'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT unique_profile_email UNIQUE (email);
  END IF;
END $$;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS max_score_month TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM');

-- Perguntas do quiz
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  pergunta TEXT NOT NULL,
  alternativas JSONB NOT NULL,
  resposta_correta INTEGER NOT NULL,
  dificuldade TEXT NOT NULL CHECK(dificuldade IN ('facil','medio','dificil')),
  tag TEXT DEFAULT 'geral', -- Ex: 'geral', 'maio2026', 'patrocinadorX'
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adiciona colunas se a tabela já existia antes
ALTER TABLE questions ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT 'geral';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Partidas
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_acertos INTEGER NOT NULL DEFAULT 0,
  total_erros INTEGER NOT NULL DEFAULT 0,
  combo_max INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_created ON matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_max_score ON profiles(max_score DESC);
CREATE INDEX IF NOT EXISTS idx_questions_dificuldade ON questions(dificuldade);

-- ===== 3. RLS (Row Level Security) =====

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles: anyone can read" ON profiles;
CREATE POLICY "Profiles: anyone can read" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles: users can insert own" ON profiles;
CREATE POLICY "Profiles: users can insert own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: users can update own" ON profiles;
CREATE POLICY "Profiles: users can update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: users can delete own" ON profiles;
CREATE POLICY "Profiles: users can delete own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Questions (read-only para todos logados)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions: authenticated can read" ON questions;
CREATE POLICY "Questions: authenticated can read" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Matches: users can read own" ON matches;
CREATE POLICY "Matches: users can read own" ON matches
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Matches: users can insert own" ON matches;
CREATE POLICY "Matches: users can insert own" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== 4. FUNÇÕES RPC (lógica server-side) =====

-- Apagar função antiga caso o tipo de retorno tenha mundado
DROP FUNCTION IF EXISTS get_quiz_questions(INTEGER);
DROP FUNCTION IF EXISTS get_quiz_questions(INTEGER, TEXT);

-- Buscar perguntas randomizadas com respostas e tag (dando ênfase a UFBA e sua história)
CREATE OR REPLACE FUNCTION get_quiz_questions(
  total_count INTEGER DEFAULT 20,
  p_tag TEXT DEFAULT NULL
)
RETURNS TABLE(
  id INTEGER,
  pergunta TEXT,
  alternativas JSONB,
  dificuldade TEXT,
  resposta_correta INTEGER
) AS $$
DECLARE
  hist_count INTEGER;
  gen_count INTEGER;
  easy_count INTEGER;
  medium_count INTEGER;
  hard_count INTEGER;
BEGIN
  -- Se p_tag for fornecido, buscamos apenas aquela tag.
  -- Senão, damos ênfase mesclando 5 históricas da UFBA e o restante gerais.
  IF p_tag IS NOT NULL THEN
    easy_count := ROUND(total_count * 0.4);
    medium_count := ROUND(total_count * 0.35);
    hard_count := total_count - easy_count - medium_count;

    RETURN QUERY
    SELECT * FROM (
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'facil' AND q.ativo = true AND q.tag = p_tag
       ORDER BY RANDOM() LIMIT easy_count)
      UNION ALL
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'medio' AND q.ativo = true AND q.tag = p_tag
       ORDER BY RANDOM() LIMIT medium_count)
      UNION ALL
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'dificil' AND q.ativo = true AND q.tag = p_tag
       ORDER BY RANDOM() LIMIT hard_count)
    ) combined
    ORDER BY RANDOM();
  ELSE
    -- Sem tag específica (padrão do jogo): garante 5 perguntas históricas/ufba_historia e 15 gerais.
    hist_count := 5;
    gen_count := total_count - hist_count;
    
    easy_count := ROUND(gen_count * 0.4);
    medium_count := ROUND(gen_count * 0.35);
    hard_count := gen_count - easy_count - medium_count;

    RETURN QUERY
    SELECT * FROM (
      -- 5 Históricas da UFBA
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.tag = 'ufba_historia' AND q.ativo = true
       ORDER BY RANDOM() LIMIT hist_count)
      UNION ALL
      -- Gerais: Fáceis
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'facil' AND q.ativo = true AND q.tag = 'geral'
       ORDER BY RANDOM() LIMIT easy_count)
      UNION ALL
      -- Gerais: Médias
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'medio' AND q.ativo = true AND q.tag = 'geral'
       ORDER BY RANDOM() LIMIT medium_count)
      UNION ALL
      -- Gerais: Difíceis
      (SELECT q.id, q.pergunta, q.alternativas, q.dificuldade, q.resposta_correta
       FROM questions q WHERE q.dificuldade = 'dificil' AND q.ativo = true AND q.tag = 'geral'
       ORDER BY RANDOM() LIMIT hard_count)
    ) combined
    ORDER BY RANDOM();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Submeter partida (validação + scoring server-side)
-- Recebe: array de {question_id, answer_index, time_ms}
-- Retorna: score, acertos, erros, combo_max
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
  DECLARE
    v_current_month TEXT;
    v_saved_month TEXT;
  BEGIN
    v_current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    SELECT max_score, COALESCE(max_score_month, '1970-01') 
    INTO v_current_max, v_saved_month
    FROM profiles WHERE id = v_user_id;

    IF v_saved_month != v_current_month THEN
      -- New month → reset score and save this one as the new record
      UPDATE profiles 
      SET max_score = v_score, max_score_month = v_current_month 
      WHERE id = v_user_id;
      v_current_max := 0;
    ELSIF v_score > COALESCE(v_current_max, 0) THEN
      -- Same month, but beat the record → update
      UPDATE profiles 
      SET max_score = v_score, max_score_month = v_current_month 
      WHERE id = v_user_id;
    END IF;
  END;

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

-- Ranking global (top N do mês atual — melhor partida única)
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

-- Ranking semanal (top N último 7 dias por score de match)
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

-- Posição do usuário atual no ranking (mês atual)
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

-- ===== 5. SEED DE PERGUNTAS =====
-- (Insere apenas se a tabela estiver vazia)

INSERT INTO questions (pergunta, alternativas, resposta_correta, dificuldade, tag, ativo)
SELECT * FROM (VALUES
  ('Qual é o mineral mais comum na crosta terrestre?', '["Quartzo", "Feldspato", "Mica", "Calcita"]'::JSONB, 1, 'facil', 'geral', true),
  ('O que é um minério?', '["Qualquer rocha", "Mineral com valor econômico extraível", "Rocha metamórfica", "Sedimento marinho"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual o principal minério de ferro?', '["Bauxita", "Hematita", "Cassiterita", "Galena"]'::JSONB, 1, 'facil', 'geral', true),
  ('O que é uma mina a céu aberto?', '["Mina debaixo d''água", "Mina subterrânea", "Escavação na superfície", "Mina de sal"]'::JSONB, 2, 'facil', 'geral', true),
  ('Qual destes é um mineral?', '["Granito", "Quartzo", "Basalto", "Arenito"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual é a escala utilizada para medir a dureza de minerais?', '["Escala Richter", "Escala de Mohs", "Escala Beaufort", "Escala Celsius"]'::JSONB, 1, 'facil', 'geral', true),
  ('O diamante é composto predominantemente de qual elemento?', '["Silício", "Carbono", "Oxigênio", "Nitrogênio"]'::JSONB, 1, 'facil', 'geral', true),
  ('O que é britagem na mineração?', '["Processo de fundição", "Redução do tamanho de rochas", "Transporte de minério", "Perfuração de túneis"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual o nome do processo de separação de minério por densidade na água?', '["Flotação", "Lixiviação", "Calcinação", "Eletrólise"]'::JSONB, 0, 'facil', 'geral', true),
  ('O Brasil é um dos maiores produtores mundiais de qual minério?', '["Cobre", "Ferro", "Estanho", "Zinco"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual é o estado brasileiro com maior produção mineral?', '["São Paulo", "Minas Gerais", "Bahia", "Goiás"]'::JSONB, 1, 'facil', 'geral', true),
  ('O que é um geólogo?', '["Especialista em geografia", "Profissional que estuda a Terra e suas rochas", "Engenheiro de solos", "Biólogo marinho"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual mineral é a principal fonte de alumínio?', '["Hematita", "Bauxita", "Magnetita", "Pirita"]'::JSONB, 1, 'facil', 'geral', true),
  ('O que é EPI na mineração?', '["Equipamento de Pesquisa Industrial", "Equipamento de Proteção Individual", "Estação de Processamento Interno", "Estudo de Planejamento Integrado"]'::JSONB, 1, 'facil', 'geral', true),
  ('Qual rocha é formada pelo resfriamento do magma?', '["Sedimentar", "Metamórfica", "Ígnea", "Orgânica"]'::JSONB, 2, 'facil', 'geral', true),
  ('Qual é a função principal de uma barragem de rejeitos?', '["Gerar energia", "Armazenar resíduos do beneficiamento mineral", "Filtrar água potável", "Irrigar plantações"]'::JSONB, 1, 'medio', 'geral', true),
  ('O que é o teor de corte (cut-off grade) em mineração?', '["Ângulo máximo da cava", "Teor mínimo para viabilidade econômica", "Profundidade máxima da mina", "Volume de explosivos"]'::JSONB, 1, 'medio', 'geral', true),
  ('Qual método de lavra é mais utilizado para depósitos profundos?', '["Lavra a céu aberto", "Lavra subterrânea", "Dragagem", "Garimpo manual"]'::JSONB, 1, 'medio', 'geral', true),
  ('O que é lixiviação na metalurgia extrativa?', '["Fundição de metais", "Dissolução seletiva de minerais por soluções", "Moagem de rochas", "Separação magnética"]'::JSONB, 1, 'medio', 'geral', true),
  ('Qual é o principal impacto ambiental da mineração a céu aberto?', '["Poluição sonora", "Alteração da paisagem e do solo", "Aumento da biodiversidade", "Redução da temperatura"]'::JSONB, 1, 'medio', 'geral', true),
  ('O que é o plano de fogo na mineração?', '["Plano de evacuação", "Projeto de detonação de explosivos", "Mapa de incêndios", "Esquema de ventilação"]'::JSONB, 1, 'medio', 'geral', true),
  ('Qual a função do ciclone na etapa de classificação mineral?', '["Separar partículas por tamanho", "Secar o minério", "Transportar material", "Medir a temperatura"]'::JSONB, 0, 'medio', 'geral', true),
  ('O que significa DNPM no contexto da mineração brasileira?', '["Departamento Nacional de Produção Mineral", "Divisão Nacional de Pesquisa Mineral", "Diretoria de Normas e Procedimentos Minerais", "Departamento de Normatização e Planejamento Mineral"]'::JSONB, 0, 'medio', 'geral', true),
  ('Qual é o reagente coletor mais usado na flotação de sulfetos?', '["Cal", "Xantato", "Soda cáustica", "Ácido sulfúrico"]'::JSONB, 1, 'medio', 'geral', true),
  ('O que é o REM (Relação Estéril/Minério)?', '["Razão entre material estéril removido e minério extraído", "Rendimento energético da mina", "Relação entre empregados e máquinas", "Registro estadual de mineração"]'::JSONB, 0, 'medio', 'geral', true),
  ('Qual mineral é conhecido como ''ouro dos tolos''?', '["Calcopirita", "Pirita", "Marcassita", "Arsenopirita"]'::JSONB, 1, 'medio', 'geral', true),
  ('O que é subsidência em mineração subterrânea?', '["Inundação de galerias", "Afundamento da superfície", "Acúmulo de gases", "Vibração do solo"]'::JSONB, 1, 'medio', 'geral', true),
  ('Qual técnica é usada para prospecção geofísica?', '["Análise de DNA", "Sísmica de reflexão", "Cromatografia", "Espectroscopia UV"]'::JSONB, 1, 'medio', 'geral', true),
  ('Qual é o método de lavra subterrânea indicado para corpos tabulares de grande extensão com baixo mergulho?', '["Câmaras e pilares", "Recalque (shrinkage)", "Abatimento por subnível", "Cut and fill"]'::JSONB, 0, 'dificil', 'geral', true),
  ('Na classificação JORC, qual é a hierarquia de confiança dos recursos minerais?', '["Medido > Indicado > Inferido", "Inferido > Indicado > Medido", "Provável > Provado > Possível", "Indicado > Medido > Inferido"]'::JSONB, 0, 'dificil', 'geral', true),
  ('Qual é o principal fenômeno que governa a flotação de minérios?', '["Gravidade específica", "Hidrofobicidade de superfícies minerais", "Magnetismo residual", "Condutividade elétrica"]'::JSONB, 1, 'dificil', 'geral', true),
  ('O que é o fator de potência (powder factor) em desmonte de rocha?', '["Capacidade energética do detonador", "Quantidade de explosivo por volume de rocha", "Pressão máxima de detonação", "Velocidade de detonação do ANFO"]'::JSONB, 1, 'dificil', 'geral', true),
  ('Qual é o critério de Laubscher utilizado em mineração subterrânea?', '["Análise de estabilidade de taludes", "Classificação geomecânica para dimensionamento de aberturas", "Cálculo de ventilação", "Projeto de barragens"]'::JSONB, 1, 'dificil', 'geral', true),
  ('O que é o índice de Bond (Work Index)?', '["Resistência à compressão da rocha", "Energia necessária para reduzir o tamanho de partículas", "Índice de deformação elástica", "Taxa de recuperação metalúrgica"]'::JSONB, 1, 'dificil', 'geral', true),
  ('Na análise de Whittle para otimização de cavas, qual parâmetro define o contorno final da mina?', '["Volume de estéril", "Fluxo de caixa descontado máximo (NPV)", "Ângulo de talude global", "Produção diária de ROM"]'::JSONB, 1, 'dificil', 'geral', true),
  ('Qual é a velocidade típica de detonação (VOD) do ANFO?', '["1.500 m/s", "3.200 m/s", "4.500 m/s", "7.000 m/s"]'::JSONB, 2, 'dificil', 'geral', true),
  ('O que é o conceito de ''geometalurgia''?', '["Geometria aplicada a minas", "Integração de dados geológicos e metalúrgicos para planejamento", "Medição topográfica de cavas", "Estudo de formas cristalinas"]'::JSONB, 1, 'dificil', 'geral', true),
  ('Na classificação RMR de Bieniawski, qual é a faixa de valores para rocha de qualidade ''Boa''?', '["0-20", "21-40", "41-60", "61-80"]'::JSONB, 3, 'dificil', 'geral', true),
  ('O que é o efeito Coanda aplicado em classificação de partículas?', '["Desvio de um fluido ao longo de superfície curva", "Separação magnética de alta intensidade", "Filtração por pressão negativa", "Centrifugação de polpa"]'::JSONB, 0, 'dificil', 'geral', true),
  ('Qual legislação brasileira regulamenta a pesquisa e lavra de recursos minerais?', '["Lei 6.938/81", "Código de Mineração (Decreto-Lei 227/67)", "Lei 12.305/10", "Resolução CONAMA 001/86"]'::JSONB, 1, 'dificil', 'geral', true)
) AS data(pergunta, alternativas, resposta_correta, dificuldade, tag, ativo)
WHERE NOT EXISTS (SELECT 1 FROM questions LIMIT 1);

-- ===== 6. SEED ADICIONAL DE PERGUNTAS HISTÓRICAS DA UFBA =====
-- (Insere as perguntas sobre a história do curso se elas ainda não estiverem no banco, de forma idempotente)

INSERT INTO public.questions (pergunta, alternativas, resposta_correta, dificuldade, tag, ativo)
SELECT *
FROM (VALUES
  ('Em que ano foi fundado o curso de Engenharia de Minas da UFBA, que hoje comemora seu Jubileu de Ouro?', '["1976", "1980", "1968", "1991"]'::JSONB, 0, 'facil', 'ufba_historia', true),
  ('Como é chamado o jubileu comemorativo de 50 anos do curso de Engenharia de Minas da UFBA?', '["Jubileu de Prata", "Jubileu de Ouro", "Jubileu de Diamante", "Jubileu de Rubi"]'::JSONB, 1, 'facil', 'ufba_historia', true),
  ('Qual é a sigla do Diretório Acadêmico representativo dos estudantes de Engenharia de Minas da UFBA?', '["DAENG", "DAEMIN", "CAMINAS", "DAEMA"]'::JSONB, 1, 'facil', 'ufba_historia', true),
  ('Qual o nome do tradicional evento anual que celebra a integração acadêmica e profissional da Engenharia de Minas da UFBA?', '["MINERAS", "SEMIN", "GEOMIN", "SEMANAMINAS"]'::JSONB, 1, 'medio', 'ufba_historia', true),
  ('A Bahia se destaca na produção de minerais industriais. Qual município baiano abriga as maiores reservas de magnesita e talco do país?', '["Jacobina", "Brumado", "Caetité", "Jaguarari"]'::JSONB, 1, 'medio', 'ufba_historia', true),
  ('O curso de Engenharia de Minas da UFBA foi criado em 1976 sob influência de qual grande plano nacional para atender à demanda de expansão do setor mineral?', '["Plano de Metas de JK", "Plano Nacional de Desenvolvimento (II PND)", "Programa Grande Carajás", "Plano Trienal de Goulart"]'::JSONB, 1, 'dificil', 'ufba_historia', true),
  ('A Bahia possui a única mina subterrânea de extração de cromita em operação no Brasil. Em qual município baiano ela se localiza?', '["Andorinha", "Campo Formoso", "Jaguarari", "Pindobaçu"]'::JSONB, 0, 'dificil', 'ufba_historia', true),
  ('Qual metal nobre tem sua extração no norte da Bahia (região de Curaçá/Jaguarari) realizada pela empresa Mineração Caraíba, polo de empregabilidade da UFBA?', '["Cobre", "Níquel", "Ferro", "Bauxita"]'::JSONB, 0, 'medio', 'ufba_historia', true)
) AS data(pergunta, alternativas, resposta_correta, dificuldade, tag, ativo)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.questions q
  WHERE q.pergunta = data.pergunta
    AND q.tag = data.tag
);

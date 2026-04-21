/**
 * MINERAX Question Seed Script
 * Run: npm run seed
 *
 * Populates the Supabase database with mining-themed quiz questions.
 */
import 'dotenv/config';
import pool from '../src/config/database.js';

const questions = [
  // ── FÁCIL (10 pts) ──
  {
    pergunta: "Qual é o mineral mais comum na crosta terrestre?",
    alternativas: ["Quartzo", "Feldspato", "Mica", "Calcita"],
    resposta_correta: 1, // Feldspato
    dificuldade: "facil"
  },
  {
    pergunta: "O que é um minério?",
    alternativas: ["Qualquer rocha", "Mineral com valor econômico extraível", "Rocha metamórfica", "Sedimento marinho"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual o principal minério de ferro?",
    alternativas: ["Bauxita", "Hematita", "Cassiterita", "Galena"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "O que é uma mina a céu aberto?",
    alternativas: ["Mina debaixo d'água", "Mina subterrânea", "Escavação na superfície", "Mina de sal"],
    resposta_correta: 2,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual destes é um mineral?",
    alternativas: ["Granito", "Quartzo", "Basalto", "Arenito"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual é a escala utilizada para medir a dureza de minerais?",
    alternativas: ["Escala Richter", "Escala de Mohs", "Escala Beaufort", "Escala Celsius"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "O diamante é composto predominantemente de qual elemento?",
    alternativas: ["Silício", "Carbono", "Oxigênio", "Nitrogênio"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "O que é britagem na mineração?",
    alternativas: ["Processo de fundição", "Redução do tamanho de rochas", "Transporte de minério", "Perfuração de túneis"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual o nome do processo de separação de minério por densidade na água?",
    alternativas: ["Flotação", "Lixiviação", "Calcinação", "Eletrólise"],
    resposta_correta: 0,
    dificuldade: "facil"
  },
  {
    pergunta: "O Brasil é um dos maiores produtores mundiais de qual minério?",
    alternativas: ["Cobre", "Ferro", "Estanho", "Zinco"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual é o estado brasileiro com maior produção mineral?",
    alternativas: ["São Paulo", "Minas Gerais", "Bahia", "Goiás"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "O que é um geólogo?",
    alternativas: ["Especialista em geografia", "Profissional que estuda a Terra e suas rochas", "Engenheiro de solos", "Biólogo marinho"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual mineral é a principal fonte de alumínio?",
    alternativas: ["Hematita", "Bauxita", "Magnetita", "Pirita"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "O que é EPI na mineração?",
    alternativas: ["Equipamento de Pesquisa Industrial", "Equipamento de Proteção Individual", "Estação de Processamento Interno", "Estudo de Planejamento Integrado"],
    resposta_correta: 1,
    dificuldade: "facil"
  },
  {
    pergunta: "Qual rocha é formada pelo resfriamento do magma?",
    alternativas: ["Sedimentar", "Metamórfica", "Ígnea", "Orgânica"],
    resposta_correta: 2,
    dificuldade: "facil"
  },

  // ── MÉDIO (20 pts) ──
  {
    pergunta: "Qual é a função principal de uma barragem de rejeitos?",
    alternativas: ["Gerar energia", "Armazenar resíduos do beneficiamento mineral", "Filtrar água potável", "Irrigar plantações"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "O que é o teor de corte (cut-off grade) em mineração?",
    alternativas: ["Ângulo máximo da cava", "Teor mínimo para viabilidade econômica", "Profundidade máxima da mina", "Volume de explosivos"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual método de lavra é mais utilizado para depósitos profundos?",
    alternativas: ["Lavra a céu aberto", "Lavra subterrânea", "Dragagem", "Garimpo manual"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "O que é lixiviação na metalurgia extrativa?",
    alternativas: ["Fundição de metais", "Dissolução seletiva de minerais por soluções", "Moagem de rochas", "Separação magnética"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual é o principal impacto ambiental da mineração a céu aberto?",
    alternativas: ["Poluição sonora", "Alteração da paisagem e do solo", "Aumento da biodiversidade", "Redução da temperatura"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "O que é o plano de fogo na mineração?",
    alternativas: ["Plano de evacuação", "Projeto de detonação de explosivos", "Mapa de incêndios", "Esquema de ventilação"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual a função do ciclone na etapa de classificação mineral?",
    alternativas: ["Separar partículas por tamanho", "Secar o minério", "Transportar material", "Medir a temperatura"],
    resposta_correta: 0,
    dificuldade: "medio"
  },
  {
    pergunta: "O que significa DNPM no contexto da mineração brasileira?",
    alternativas: ["Departamento Nacional de Produção Mineral", "Divisão Nacional de Pesquisa Mineral", "Diretoria de Normas e Procedimentos Minerais", "Departamento de Normatização e Planejamento Mineral"],
    resposta_correta: 0,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual é o reagente coletor mais usado na flotação de sulfetos?",
    alternativas: ["Cal", "Xantato", "Soda cáustica", "Ácido sulfúrico"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "O que é o REM (Relação Estéril/Minério)?",
    alternativas: ["Razão entre material estéril removido e minério extraído", "Rendimento energético da mina", "Relação entre empregados e máquinas", "Registro estadual de mineração"],
    resposta_correta: 0,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual mineral é conhecido como 'ouro dos tolos'?",
    alternativas: ["Calcopirita", "Pirita", "Marcassita", "Arsenopirita"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "O que é subsidência em mineração subterrânea?",
    alternativas: ["Inundação de galerias", "Afundamento da superfície", "Acúmulo de gases", "Vibração do solo"],
    resposta_correta: 1,
    dificuldade: "medio"
  },
  {
    pergunta: "Qual técnica é usada para prospecção geofísica?",
    alternativas: ["Análise de DNA", "Sísmica de reflexão", "Cromatografia", "Espectroscopia UV"],
    resposta_correta: 1,
    dificuldade: "medio"
  },

  // ── DIFÍCIL (40 pts) ──
  {
    pergunta: "Qual é o método de lavra subterrânea indicado para corpos tabulares de grande extensão com baixo mergulho?",
    alternativas: ["Câmaras e pilares", "Recalque (shrinkage)", "Abatimento por subnível", "Cut and fill"],
    resposta_correta: 0,
    dificuldade: "dificil"
  },
  {
    pergunta: "Na classificação JORC, qual é a hierarquia de confiança dos recursos minerais?",
    alternativas: ["Medido > Indicado > Inferido", "Inferido > Indicado > Medido", "Provável > Provado > Possível", "Indicado > Medido > Inferido"],
    resposta_correta: 0,
    dificuldade: "dificil"
  },
  {
    pergunta: "Qual é o principal fenômeno que governa a flotação de minérios?",
    alternativas: ["Gravidade específica", "Hidrofobicidade de superfícies minerais", "Magnetismo residual", "Condutividade elétrica"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "O que é o fator de potência (powder factor) em desmonte de rocha?",
    alternativas: ["Capacidade energética do detonador", "Quantidade de explosivo por volume de rocha", "Pressão máxima de detonação", "Velocidade de detonação do ANFO"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "Qual é o critério de Laubscher utilizado em mineração subterrânea?",
    alternativas: ["Análise de estabilidade de taludes", "Classificação geomecânica para dimensionamento de aberturas", "Cálculo de ventilação", "Projeto de barragens"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "O que é o índice de Bond (Work Index)?",
    alternativas: ["Resistência à compressão da rocha", "Energia necessária para reduzir o tamanho de partículas", "Índice de deformação elástica", "Taxa de recuperação metalúrgica"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "Na análise de Whittle para otimização de cavas, qual parâmetro define o contorno final da mina?",
    alternativas: ["Volume de estéril", "Fluxo de caixa descontado máximo (NPV)", "Ângulo de talude global", "Produção diária de ROM"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "Qual é a velocidade típica de detonação (VOD) do ANFO?",
    alternativas: ["1.500 m/s", "3.200 m/s", "4.500 m/s", "7.000 m/s"],
    resposta_correta: 2,
    dificuldade: "dificil"
  },
  {
    pergunta: "O que é o conceito de 'geometalurgia'?",
    alternativas: ["Geometria aplicada a minas", "Integração de dados geológicos e metalúrgicos para planejamento", "Medição topográfica de cavas", "Estudo de formas cristalinas"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
  {
    pergunta: "Na classificação RMR de Bieniawski, qual é a faixa de valores para rocha de qualidade 'Boa'?",
    alternativas: ["0-20", "21-40", "41-60", "61-80"],
    resposta_correta: 3,
    dificuldade: "dificil"
  },
  {
    pergunta: "O que é o efeito Coanda aplicado em classificação de partículas?",
    alternativas: ["Desvio de um fluido ao longo de superfície curva", "Separação magnética de alta intensidade", "Filtração por pressão negativa", "Centrifugação de polpa"],
    resposta_correta: 0,
    dificuldade: "dificil"
  },
  {
    pergunta: "Qual legislação brasileira regulamenta a pesquisa e lavra de recursos minerais?",
    alternativas: ["Lei 6.938/81", "Código de Mineração (Decreto-Lei 227/67)", "Lei 12.305/10", "Resolução CONAMA 001/86"],
    resposta_correta: 1,
    dificuldade: "dificil"
  },
];

// ── Seed execution ──
async function runSeed() {
  console.log('⛏️  Seeding MINERAX questions no banco PostgreSQL da Supabase...\n');

  try {
    const client = await pool.connect();

    // Begin transaction
    await client.query('BEGIN');

    // Check if table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'questions'
      );
    `);

    if (!tableExists.rows[0].exists) {
      throw new Error("A tabela 'questions' não existe. Execute o script supabase-setup.sql no SQL Editor da Supabase primeiro.");
    }

    // Try to avoid duplicates if possible, or just insert
    for (const q of questions) {
      const check = await client.query('SELECT id FROM questions WHERE pergunta = $1', [q.pergunta]);
      if (check.rows.length === 0) {
        await client.query(`
          INSERT INTO questions (pergunta, alternativas, resposta_correta, dificuldade)
          VALUES ($1, $2, $3, $4)
        `, [q.pergunta, JSON.stringify(q.alternativas), q.resposta_correta, q.dificuldade]);
      }
    }

    await client.query('COMMIT');
    client.release();

    const { rows: counts } = await pool.query(`
      SELECT dificuldade, COUNT(*) as total FROM questions GROUP BY dificuldade
    `);

    console.log('✅ Seed finalizado!\n');
    console.log('📊 Perguntas por dificuldade:');
    for (const c of counts) {
      console.log(`   ${c.dificuldade}: ${c.total}`);
    }
    console.log(`\n   Total: ${counts.reduce((s, c) => s + parseInt(c.total, 10), 0)} perguntas\n`);

  } catch (err) {
    console.error("Erro durante o seed:", err);
  } finally {
    await pool.end();
  }
}

runSeed();

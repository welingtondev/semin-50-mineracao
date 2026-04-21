import pool from '../config/database.js';

/**
 * Get a randomized set of questions for a match session.
 */
export async function getMatchQuestions(count = 20) {
  const easy = Math.round(count * 0.4);
  const medium = Math.round(count * 0.35);
  const hard = count - easy - medium;

  const { rows: easyQ } = await pool.query(`
    SELECT * FROM questions WHERE dificuldade = 'facil' ORDER BY RANDOM() LIMIT $1
  `, [easy]);

  const { rows: mediumQ } = await pool.query(`
    SELECT * FROM questions WHERE dificuldade = 'medio' ORDER BY RANDOM() LIMIT $1
  `, [medium]);

  const { rows: hardQ } = await pool.query(`
    SELECT * FROM questions WHERE dificuldade = 'dificil' ORDER BY RANDOM() LIMIT $1
  `, [hard]);

  // Combine and shuffle
  const all = [...easyQ, ...mediumQ, ...hardQ];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  // strip correct answer from response
  return all.map(q => ({
    id: q.id,
    pergunta: q.pergunta,
    alternativas: typeof q.alternativas === 'string' ? JSON.parse(q.alternativas) : q.alternativas,
    dificuldade: q.dificuldade,
  }));
}

/**
 * Validate answers server-side by looking up the correct answers in the database.
 */
export async function validateAnswers(answers) {
  const questionIds = answers.map(a => a.question_id);
  
  if (questionIds.length === 0) return [];

  // Use ANY array for fast lookup
  const { rows: questions } = await pool.query(`
    SELECT id, resposta_correta, dificuldade FROM questions WHERE id = ANY($1::int[])
  `, [questionIds]);

  const questionMap = new Map();
  for (const q of questions) {
    questionMap.set(q.id, q);
  }

  return answers.map(answer => {
    const question = questionMap.get(answer.question_id);
    if (!question) {
      return { ...answer, is_correct: false, dificuldade: 'facil', valid: false };
    }
    const isCorrect = answer.answer_index === question.resposta_correta;
    return {
      ...answer,
      is_correct: isCorrect,
      dificuldade: question.dificuldade,
      valid: true,
    };
  });
}

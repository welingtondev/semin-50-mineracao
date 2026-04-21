import pool from '../config/database.js';

/**
 * Anti-fraud middleware: limits matches per hour per user.
 */
export async function matchRateLimit(req, res, next) {
  const maxPerHour = parseInt(process.env.MAX_MATCHES_PER_HOUR) || 5;
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(`
      SELECT COUNT(*) as count FROM matches
      WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '1 hour'
    `, [userId]);

    const count = parseInt(rows[0].count, 10);

    if (count >= maxPerHour) {
      return res.status(429).json({
        error: `Limite de ${maxPerHour} partidas por hora atingido. Tente novamente mais tarde.`
      });
    }

    next();
  } catch (err) {
    console.error('Rate limit DB error:', err);
    res.status(500).json({ error: 'Erro interno de servidor.' });
  }
}

/**
 * Validates that a submitted match doesn't have suspicious patterns.
 */
export function validateMatchIntegrity(answers, durationMs) {
  const minTimePerQuestion = parseInt(process.env.MIN_TIME_PER_QUESTION_MS) || 2000;
  const maxDuration = (parseInt(process.env.MATCH_DURATION_SECONDS) || 180) * 1000;
  const errors = [];

  // Check total duration
  if (durationMs && durationMs > maxDuration + 5000) {
    errors.push('Duração da partida excede o limite permitido.');
  }

  // Check individual answer times
  for (const answer of answers) {
    if (answer.time_ms < minTimePerQuestion) {
      errors.push(`Tempo muito curto na pergunta ${answer.question_id}: ${answer.time_ms}ms.`);
      break; // One is enough to flag
    }
  }

  // Check for duplicate questions
  const questionIds = answers.map(a => a.question_id);
  const uniqueIds = new Set(questionIds);
  if (uniqueIds.size !== questionIds.length) {
    errors.push('Perguntas duplicadas detectadas.');
  }

  return errors;
}

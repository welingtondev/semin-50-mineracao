import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { matchRateLimit, validateMatchIntegrity } from '../middleware/antifraud.js';
import { getMatchQuestions, validateAnswers } from '../services/quizService.js';
import { calculateScore } from '../utils/scoring.js';
import { updateRankings, checkTopPosition } from '../services/rankingService.js';
import { generateShareAsset } from '../services/shareService.js';
import pool from '../config/database.js';

const router = Router();

// ── GET /api/questions ──
// Returns a randomized set of questions for a new match session.
router.get('/questions', authenticate, async (req, res) => {
  try {
    const questions = await getMatchQuestions(20);
    res.json({
      questions,
      duration_seconds: parseInt(process.env.MATCH_DURATION_SECONDS) || 180,
      total: questions.length,
    });
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ error: 'Erro ao buscar perguntas.' });
  }
});

// ── POST /api/submit-match ──
// Receives the full match data and validates + scores it server-side.
router.post('/submit-match', authenticate, matchRateLimit, async (req, res) => {
  const { answers, duration_ms } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Respostas inválidas.' });
  }

  for (const a of answers) {
    if (typeof a.question_id !== 'number' || typeof a.answer_index !== 'number' || typeof a.time_ms !== 'number') {
      return res.status(400).json({ error: 'Formato de resposta inválido.' });
    }
  }

  const fraudErrors = validateMatchIntegrity(answers, duration_ms);
  if (fraudErrors.length > 0) {
    return res.status(422).json({
      error: 'Partida inválida detectada.',
      details: fraudErrors,
    });
  }

  const client = await pool.connect();

  try {
    const validatedAnswers = await validateAnswers(answers);
    const result = calculateScore(validatedAnswers);

    await client.query('BEGIN');

    const { rows: matchRows } = await client.query(`
      INSERT INTO matches (user_id, score, total_acertos, total_erros, duration_ms)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [userId, result.score, result.totalAcertos, result.totalErros, duration_ms || 0]);

    const matchId = matchRows[0].id;

    for (const a of validatedAnswers) {
      await client.query(`
        INSERT INTO match_answers (match_id, question_id, answer_index, is_correct, time_ms)
        VALUES ($1, $2, $3, $4, $5)
      `, [matchId, a.question_id, a.answer_index, a.is_correct, a.time_ms]);
    }

    await client.query('COMMIT');

    await updateRankings(userId, result.score);

    const topPosition = await checkTopPosition(userId);
    let shareUrl = null;
    if (topPosition) {
      shareUrl = await generateShareAsset(userId, topPosition);
    }

    res.json({
      match_id: matchId,
      score: result.score,
      total_acertos: result.totalAcertos,
      total_erros: result.totalErros,
      combo_max: result.comboMax,
      breakdown: result.breakdown,
      ranking_achievement: topPosition,
      share_url: shareUrl,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Submit match error:', err);
    res.status(500).json({ error: 'Erro ao processar partida.' });
  } finally {
    client.release();
  }
});

export default router;

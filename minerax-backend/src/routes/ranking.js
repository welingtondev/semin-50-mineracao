import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getGlobalRanking,
  getWeeklyRanking,
  getGroupRanking,
  getUserRanking,
} from '../services/rankingService.js';

const router = Router();

// ── GET /api/ranking/global ──
router.get('/global', async (req, res) => {
  try {
    const ranking = await getGlobalRanking(10);
    res.json({ tipo: 'global', ranking });
  } catch (err) {
    console.error('Global ranking error:', err);
    res.status(500).json({ error: 'Erro ao buscar ranking.' });
  }
});

// ── GET /api/ranking/semanal ──
router.get('/semanal', async (req, res) => {
  try {
    const ranking = await getWeeklyRanking(10);
    res.json({ tipo: 'semanal', ranking });
  } catch (err) {
    console.error('Weekly ranking error:', err);
    res.status(500).json({ error: 'Erro ao buscar ranking semanal.' });
  }
});

// ── GET /api/ranking/grupo ──
router.get('/grupo', async (req, res) => {
  try {
    const ranking = await getGroupRanking(10);
    res.json({ tipo: 'grupo', ranking });
  } catch (err) {
    console.error('Group ranking error:', err);
    res.status(500).json({ error: 'Erro ao buscar ranking por grupo.' });
  }
});

// ── GET /api/ranking/me ──
router.get('/me', authenticate, async (req, res) => {
  try {
    const ranking = await getUserRanking(req.user.id);
    res.json({ user_id: req.user.id, nickname: req.user.nickname, ...ranking });
  } catch (err) {
    console.error('User ranking error:', err);
    res.status(500).json({ error: 'Erro ao buscar seu ranking.' });
  }
});

export default router;

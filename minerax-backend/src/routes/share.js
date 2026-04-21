import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { checkTopPosition } from '../services/rankingService.js';
import { getOrCreateShareAsset, generateShareAsset } from '../services/shareService.js';

const router = Router();

// ── GET /api/share/top1 ──
router.get('/top1', authenticate, async (req, res) => {
  try {
    const position = await checkTopPosition(req.user.id);
    if (position !== 'top1') {
      return res.status(403).json({ error: 'Você não está no Top 1 do ranking.' });
    }
    const imageUrl = await getOrCreateShareAsset(req.user.id, 'top1');
    res.json({ tipo: 'top1', imagem_url: imageUrl });
  } catch (err) {
    console.error('Share top1 error:', err);
    res.status(500).json({ error: 'Erro ao gerar imagem.' });
  }
});

// ── GET /api/share/top3 ──
router.get('/top3', authenticate, async (req, res) => {
  try {
    const position = await checkTopPosition(req.user.id);
    if (!position || (position !== 'top1' && position !== 'top3')) {
      return res.status(403).json({ error: 'Você não está no Top 3 do ranking.' });
    }
    const tipo = position === 'top1' ? 'top1' : 'top3';
    const imageUrl = await getOrCreateShareAsset(req.user.id, tipo);
    res.json({ tipo, imagem_url: imageUrl });
  } catch (err) {
    console.error('Share top3 error:', err);
    res.status(500).json({ error: 'Erro ao gerar imagem.' });
  }
});

// ── GET /api/share/top10 ──
router.get('/top10', authenticate, async (req, res) => {
  try {
    const position = await checkTopPosition(req.user.id);
    if (!position) {
      return res.status(403).json({ error: 'Você não está no Top 10 do ranking.' });
    }
    const imageUrl = await getOrCreateShareAsset(req.user.id, position);
    res.json({ tipo: position, imagem_url: imageUrl });
  } catch (err) {
    console.error('Share top10 error:', err);
    res.status(500).json({ error: 'Erro ao gerar imagem.' });
  }
});

export default router;

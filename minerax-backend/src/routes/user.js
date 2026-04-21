import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = Router();

// ── GET /api/me ──
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows: userRows } = await pool.query(`
      SELECT id, email, nickname, max_score, created_at, consent_lgpd FROM users WHERE id = $1
    `, [req.user.id]);

    if (userRows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const user = userRows[0];

    // Get match stats
    const { rows: statsRows } = await pool.query(`
      SELECT
        COUNT(*) as total_partidas,
        COALESCE(MAX(score), 0) as melhor_pontuacao,
        COALESCE(SUM(total_acertos), 0) as total_acertos,
        COALESCE(SUM(total_erros), 0) as total_erros
      FROM matches WHERE user_id = $1
    `, [req.user.id]);

    const stats = statsRows[0] || {};
    // cast BigInt values from count/sum if needed, pg returns strings for BigInt
    stats.total_partidas = parseInt(stats.total_partidas) || 0;
    stats.total_acertos = parseInt(stats.total_acertos) || 0;
    stats.total_erros = parseInt(stats.total_erros) || 0;

    // Generate referral link
    const referralLink = `/desafio/${user.nickname}-${user.id}`;

    res.json({
      ...user,
      stats,
      referral_link: referralLink,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

// ── GET /api/me/referrals ──
router.get('/referrals', authenticate, async (req, res) => {
  try {
    const { rows: referrals } = await pool.query(`
      SELECT r.created_at, u.nickname, u.max_score
      FROM referrals r
      JOIN users u ON u.id = r.invited_user_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    const totalInvited = referrals.length;
    const groupScore = referrals.reduce((sum, r) => sum + r.max_score, 0);

    res.json({
      total_convidados: totalInvited,
      grupo_pontuacao: groupScore,
      convidados: referrals,
    });
  } catch (err) {
    console.error('Get referrals error:', err);
    res.status(500).json({ error: 'Erro ao buscar convites.' });
  }
});

// ── GET /api/me/matches ──
router.get('/matches', authenticate, async (req, res) => {
  try {
    const { rows: matches } = await pool.query(`
      SELECT id, score, total_acertos, total_erros, duration_ms, created_at
      FROM matches
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [req.user.id]);

    res.json({ matches });
  } catch (err) {
    console.error('Get matches error:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
});

// ── DELETE /api/me (LGPD - Direito ao Esquecimento) ──
router.delete('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Anonymize user instead of deleting to keep match integrity,
    // or entirely delete based on strict requirements.
    // Here we choose hard-delete for strict LGPD. Because of foreign keys,
    // we need to delete dependencies or set them to ON DELETE CASCADE in db.
    // For now we manually delete.
    
    await client.query('DELETE FROM share_assets WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM rankings WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM referrals WHERE user_id = $1 OR invited_user_id = $1', [userId]);
    
    const { rows: matches } = await client.query('SELECT id FROM matches WHERE user_id = $1', [userId]);
    if (matches.length > 0) {
      const matchIds = matches.map(m => m.id);
      await client.query(`DELETE FROM match_answers WHERE match_id = ANY($1::int[])`, [matchIds]);
      await client.query('DELETE FROM matches WHERE user_id = $1', [userId]);
    }

    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await client.query('COMMIT');
    res.json({ message: 'Sua conta e todos os seus dados foram apagados permanentemente (Direito ao esquecimento LGPD).' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Erro ao deletar conta.' });
  } finally {
    client.release();
  }
});

export default router;

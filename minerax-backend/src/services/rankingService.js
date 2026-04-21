import pool from '../config/database.js';

/**
 * Update all ranking tables for a given user after a match.
 */
export async function updateRankings(userId, matchScore) {
  const { rows } = await pool.query('SELECT max_score FROM users WHERE id = $1', [userId]);
  const user = rows[0];

  const currentMaxScore = user?.max_score || 0;
  
  // Update user max_score if new high score
  if (matchScore > currentMaxScore) {
    await pool.query('UPDATE users SET max_score = $1 WHERE id = $2', [matchScore, userId]);
  }

  const newMax = Math.max(matchScore, currentMaxScore);

  // ── Global ranking ──
  await pool.query(`
    INSERT INTO rankings (user_id, score, tipo, updated_at)
    VALUES ($1, $2, 'global', NOW())
    ON CONFLICT(user_id, tipo) DO UPDATE SET
      score = GREATEST(rankings.score, excluded.score),
      updated_at = NOW()
  `, [userId, newMax]);

  // ── Weekly ranking ──
  await pool.query(`
    INSERT INTO rankings (user_id, score, tipo, updated_at)
    VALUES ($1, $2, 'semanal', NOW())
    ON CONFLICT(user_id, tipo) DO UPDATE SET
      score = GREATEST(rankings.score, excluded.score),
      updated_at = NOW()
  `, [userId, matchScore]);

  // ── Group ranking (sum of referral group scores) ──
  await updateGroupRanking(userId);
}

/**
 * Get the global Top N ranking.
 */
export async function getGlobalRanking(limit = 10) {
  const { rows } = await pool.query(`
    SELECT r.score, r.updated_at, u.nickname, u.id as user_id
    FROM rankings r
    JOIN users u ON u.id = r.user_id
    WHERE r.tipo = 'global'
    ORDER BY r.score DESC, r.updated_at ASC
    LIMIT $1
  `, [limit]);
  return rows;
}

/**
 * Get the weekly Top N ranking.
 */
export async function getWeeklyRanking(limit = 10) {
  const { rows } = await pool.query(`
    SELECT r.score, r.updated_at, u.nickname, u.id as user_id
    FROM rankings r
    JOIN users u ON u.id = r.user_id
    WHERE r.tipo = 'semanal'
      AND r.updated_at >= NOW() - INTERVAL '7 days'
    ORDER BY r.score DESC, r.updated_at ASC
    LIMIT $1
  `, [limit]);
  return rows;
}

/**
 * Get group ranking (by referral groups).
 */
export async function getGroupRanking(limit = 10) {
  const { rows } = await pool.query(`
    SELECT r.score, r.updated_at, u.nickname, u.id as user_id,
      (SELECT COUNT(*) FROM referrals WHERE user_id = u.id) as total_convidados
    FROM rankings r
    JOIN users u ON u.id = r.user_id
    WHERE r.tipo = 'grupo'
    ORDER BY r.score DESC, r.updated_at ASC
    LIMIT $1
  `, [limit]);
  return rows;
}

/**
 * Get a user's position in all rankings.
 */
export async function getUserRanking(userId) {
  const { rows: globalQuery } = await pool.query(`
    SELECT COUNT(*) + 1 as position FROM rankings
    WHERE tipo = 'global' AND score > (
      SELECT COALESCE(score, 0) FROM rankings WHERE user_id = $1 AND tipo = 'global'
    )
  `, [userId]);

  const { rows: weeklyQuery } = await pool.query(`
    SELECT COUNT(*) + 1 as position FROM rankings
    WHERE tipo = 'semanal'
      AND updated_at >= NOW() - INTERVAL '7 days'
      AND score > (
        SELECT COALESCE(score, 0) FROM rankings WHERE user_id = $1 AND tipo = 'semanal'
      )
  `, [userId]);

  const { rows: userRankings } = await pool.query(`
    SELECT tipo, score FROM rankings WHERE user_id = $1
  `, [userId]);

  const scores = {};
  for (const r of userRankings) scores[r.tipo] = r.score;

  return {
    global: { position: parseInt(globalQuery[0]?.position) || null, score: scores.global || 0 },
    semanal: { position: parseInt(weeklyQuery[0]?.position) || null, score: scores.semanal || 0 },
    grupo: { score: scores.grupo || 0 },
  };
}

/**
 * Reset weekly rankings (should be called via a cron job or scheduled task).
 */
export async function resetWeeklyRanking() {
  await pool.query("DELETE FROM rankings WHERE tipo = 'semanal'");
}

/**
 * Update group ranking for a user based on their referrals' scores.
 */
async function updateGroupRanking(userId) {
  const { rows } = await pool.query('SELECT referred_by FROM users WHERE id = $1', [userId]);
  const leaderId = rows[0]?.referred_by || userId;

  const { rows: totals } = await pool.query(`
    SELECT COALESCE(
      (SELECT max_score FROM users WHERE id = $1) +
      (SELECT COALESCE(SUM(u.max_score), 0) FROM referrals r JOIN users u ON u.id = r.invited_user_id WHERE r.user_id = $2),
      0
    ) as total
  `, [leaderId, leaderId]);

  const totalScore = totals[0]?.total || 0;

  await pool.query(`
    INSERT INTO rankings (user_id, score, tipo, updated_at)
    VALUES ($1, $2, 'grupo', NOW())
    ON CONFLICT(user_id, tipo) DO UPDATE SET
      score = excluded.score,
      updated_at = NOW()
  `, [leaderId, totalScore]);
}

/**
 * Check if user entered Top 1, Top 3, or Top 10 after a match.
 */
export async function checkTopPosition(userId) {
  const { rows } = await pool.query(`
    SELECT COUNT(*) + 1 as pos FROM rankings
    WHERE tipo = 'global' AND score > (
      SELECT COALESCE(score, 0) FROM rankings WHERE user_id = $1 AND tipo = 'global'
    )
  `, [userId]);

  const pos = parseInt(rows[0]?.pos) || 999;

  if (pos === 1) return 'top1';
  if (pos <= 3) return 'top3';
  if (pos <= 10) return 'top10';
  return null;
}

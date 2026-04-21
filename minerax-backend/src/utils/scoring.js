/**
 * Scoring engine for MINERAX quiz.
 * 
 * Points per difficulty:
 *   Fácil  = 10 pts
 *   Médio  = 20 pts
 *   Difícil = 40 pts
 *
 * Wrong answer = -15 pts
 *
 * Combo system (consecutive correct answers):
 *   3 in a row  → +10% bonus on base points
 *   5 in a row  → +25% bonus on base points
 *   10 in a row → +50% bonus on base points
 */

const POINTS = {
  facil: 10,
  medio: 20,
  dificil: 40,
};

const PENALTY = -15;

const COMBO_THRESHOLDS = [
  { streak: 10, bonus: 0.50 },
  { streak: 5,  bonus: 0.25 },
  { streak: 3,  bonus: 0.10 },
];

/**
 * Calculate score for a completed match.
 * @param {Array} answers - Array of { question_id, answer_index, is_correct, dificuldade }
 * @returns {{ score, totalAcertos, totalErros, comboMax, breakdown }}
 */
export function calculateScore(answers) {
  let score = 0;
  let streak = 0;
  let comboMax = 0;
  let totalAcertos = 0;
  let totalErros = 0;
  const breakdown = [];

  for (const answer of answers) {
    if (answer.is_correct) {
      totalAcertos++;
      streak++;
      if (streak > comboMax) comboMax = streak;

      const basePoints = POINTS[answer.dificuldade] || 10;
      const comboBonus = getComboMultiplier(streak);
      const earnedPoints = Math.round(basePoints * (1 + comboBonus));

      score += earnedPoints;
      breakdown.push({
        question_id: answer.question_id,
        correct: true,
        basePoints,
        comboBonus,
        earnedPoints,
        streak,
      });
    } else {
      totalErros++;
      streak = 0;
      score += PENALTY;
      breakdown.push({
        question_id: answer.question_id,
        correct: false,
        earnedPoints: PENALTY,
        streak: 0,
      });
    }
  }

  // Floor score at 0 (no negative total)
  score = Math.max(0, score);

  return { score, totalAcertos, totalErros, comboMax, breakdown };
}

function getComboMultiplier(streak) {
  for (const { streak: threshold, bonus } of COMBO_THRESHOLDS) {
    if (streak >= threshold) return bonus;
  }
  return 0;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../../data/share-assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

/**
 * Generate a shareable image for a user's ranking achievement.
 * Uses pure SVG rendered to a file (no native canvas dependency).
 */
export async function generateShareAsset(userId, tipo) {
  const { rows } = await pool.query('SELECT nickname, max_score FROM users WHERE id = $1', [userId]);
  const user = rows[0];
  if (!user) return null;

  const positionLabel = tipo === 'top1' ? '🥇 1º LUGAR' : tipo === 'top3' ? '🥈 TOP 3' : '🏆 TOP 10';
  const accentColor = tipo === 'top1' ? '#FFD700' : tipo === 'top3' ? '#C0C0C0' : '#CD7F32';

  const svgContent = `
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="50%" style="stop-color:#1e293b"/>
      <stop offset="100%" style="stop-color:#020617"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accentColor}"/>
      <stop offset="100%" style="stop-color:#e67e22"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bg)"/>

  <!-- Border Frame (Story Aesthetic) -->
  <rect x="40" y="40" width="1000" height="1840" rx="40" fill="none" stroke="url(#accent)" stroke-width="4" stroke-opacity="0.5"/>

  <!-- QUIZ Logo text -->
  <text x="540" y="400" font-family="Arial Black, sans-serif" font-size="120" font-weight="900"
        fill="url(#accent)" text-anchor="middle" letter-spacing="8">QUIZ SEMIN</text>

  <!-- Subtitle -->
  <text x="540" y="460" font-family="Arial, sans-serif" font-size="32" fill="#ffffff80"
        text-anchor="middle" letter-spacing="6">EDIÇÃO DE OURO - 50 ANOS</text>

  <!-- Center Card (Glassmorphism look using opacity) -->
  <rect x="140" y="700" width="800" height="500" rx="50" fill="#ffffff" fill-opacity="0.05" stroke="url(#accent)" stroke-width="2"/>

  <!-- Position badge -->
  <rect x="290" y="750" width="500" height="90" rx="45" fill="${accentColor}30" stroke="${accentColor}" stroke-width="3"/>
  <text x="540" y="810" font-family="Arial Black, sans-serif" font-size="48" font-weight="900"
        fill="${accentColor}" text-anchor="middle">${positionLabel}</text>

  <!-- Nickname -->
  <text x="540" y="960" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
        fill="#ffffff" text-anchor="middle">${user.nickname}</text>

  <!-- Score -->
  <text x="540" y="1060" font-family="Arial, sans-serif" font-size="42" fill="#e2e8f0"
        text-anchor="middle">Pontuação Mestra: ${user.max_score.toLocaleString('pt-BR')} pts</text>

  <!-- Call to Action -->
  <rect x="240" y="1500" width="600" height="100" rx="50" fill="url(#accent)"/>
  <text x="540" y="1562" font-family="Arial Black, sans-serif" font-size="36" font-weight="900"
        fill="#0f172a" text-anchor="middle">Será que você me supera?</text>
        
  <!-- URL -->
  <text x="540" y="1800" font-family="Arial, sans-serif" font-size="28" fill="#ffffff60"
        text-anchor="middle" letter-spacing="4">www.semin.ufba.br</text>
</svg>`;

  const filename = `share_${userId}_${tipo}_${Date.now()}.svg`;
  const filepath = path.join(assetsDir, filename);
  fs.writeFileSync(filepath, svgContent.trim());

  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  const imageUrl = `${baseUrl}/assets/share/${filename}`;

  // Save to database
  await pool.query(`
    INSERT INTO share_assets (user_id, tipo, imagem_url, created_at)
    VALUES ($1, $2, $3, NOW())
  `, [userId, tipo, imageUrl]);

  return imageUrl;
}

/**
 * Get existing share asset or generate a new one.
 */
export async function getOrCreateShareAsset(userId, tipo) {
  const { rows } = await pool.query(`
    SELECT imagem_url FROM share_assets
    WHERE user_id = $1 AND tipo = $2
    ORDER BY created_at DESC LIMIT 1
  `, [userId, tipo]);

  if (rows.length > 0) return rows[0].imagem_url;
  return await generateShareAsset(userId, tipo);
}

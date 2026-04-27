import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize database (creates tables on import)
import './config/database.js';

// Route imports
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import rankingRoutes from './routes/ranking.js';
import userRoutes from './routes/user.js';
import shareRoutes from './routes/share.js';
import paymentRoutes from './routes/payment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ── Global Middleware ──
app.use(cors({
  origin: '*', // Configure for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// Global rate limiter: 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em alguns segundos.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Serve static files (Frontend Preview)
app.use(express.static(path.resolve(__dirname, '../public')));

// Serve share assets (SVG images)
app.use('/assets/share', express.static(path.resolve(__dirname, '../data/share-assets')));

// ── API Routes ──
app.use('/api', authRoutes);        // POST /api/register, POST /api/login
app.use('/api', quizRoutes);         // GET /api/questions, POST /api/submit-match
app.use('/api/ranking', rankingRoutes); // GET /api/ranking/global, semanal, grupo, me
app.use('/api/me', userRoutes);      // GET /api/me, /api/me/referrals, /api/me/matches
app.use('/api/share', shareRoutes);  // GET /api/share/top1, top3, top10
app.use('/api/payment', paymentRoutes); // POST /api/payment/checkout

// ── Referral redirect (landing page for invite links) ──
app.get('/desafio/:code', (req, res) => {
  const { code } = req.params;
  // In production, redirect to the frontend with the referral code
  res.json({
    message: 'Link de convite válido!',
    referral_code: code,
    register_url: `/api/register?ref=${code}`,
  });
});

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MINERAX Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`\n⛏️  MINERAX Backend running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/register`);
  console.log(`   POST /api/login`);
  console.log(`   GET  /api/questions`);
  console.log(`   POST /api/submit-match`);
  console.log(`   GET  /api/ranking/global`);
  console.log(`   GET  /api/ranking/semanal`);
  console.log(`   GET  /api/ranking/grupo`);
  console.log(`   GET  /api/ranking/me`);
  console.log(`   GET  /api/me`);
  console.log(`   GET  /api/me/referrals`);
  console.log(`   GET  /api/me/matches`);
  console.log(`   GET  /api/share/top1`);
  console.log(`   GET  /api/share/top3`);
  console.log(`   GET  /api/share/top10`);
  console.log(`   POST /api/payment/checkout`);
  console.log(`   GET  /api/health\n`);
});

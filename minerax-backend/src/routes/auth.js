import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';

const router = Router();

// ── POST /api/register ──
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  body('nickname')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Nickname deve ter 3-20 caracteres (letras, números, _ ou -).'),
  body('referral_code').optional().isString(),
  body('consent_lgpd').isBoolean().custom(val => val === true).withMessage('Você deve aceitar os termos da LGPD para se cadastrar.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, nickname, referral_code, consent_lgpd } = req.body;

  try {
    // Check existing user
    const { rows: existingEmail } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const { rows: existingNickname } = await pool.query('SELECT id FROM users WHERE nickname = $1', [nickname]);
    if (existingNickname.length > 0) {
      return res.status(409).json({ error: 'Nickname já em uso.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Parse referral code if present
    let referredBy = null;
    if (referral_code) {
      const parts = referral_code.split('-');
      const referrerId = parseInt(parts[parts.length - 1], 10);
      if (referrerId) {
        const { rows: referrer } = await pool.query('SELECT id FROM users WHERE id = $1', [referrerId]);
        if (referrer.length > 0) referredBy = referrer[0].id;
      }
    }

    // Insert user
    const { rows: userRows } = await pool.query(`
      INSERT INTO users (email, password_hash, nickname, referred_by, consent_lgpd)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [email, password_hash, nickname, referredBy, consent_lgpd]);

    const userId = userRows[0].id;

    // Create referral record
    if (referredBy) {
      await pool.query(`
        INSERT INTO referrals (user_id, invited_user_id) VALUES ($1, $2)
      `, [referredBy, userId]);
    }

    // Initialize rankings
    await pool.query(`INSERT INTO rankings (user_id, score, tipo) VALUES ($1, 0, 'global')`, [userId]);
    await pool.query(`INSERT INTO rankings (user_id, score, tipo) VALUES ($1, 0, 'semanal')`, [userId]);

    // Generate JWT
    const token = jwt.sign(
      { id: userId, nickname, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      user: { id: userId, nickname, email, max_score: 0 },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ── POST /api/login ──
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').notEmpty().withMessage('Senha obrigatória.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, nickname: user.nickname, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        max_score: user.max_score,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;

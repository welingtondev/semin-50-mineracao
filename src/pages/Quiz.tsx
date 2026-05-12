import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { Loader2 } from "lucide-react";

// ── Types ──
interface Question {
  id: number;
  pergunta: string;
  alternativas: string[];
  shuffledAlternativas?: { text: string; originalIndex: number }[];
  dificuldade: "facil" | "medio" | "dificil";
  resposta_correta?: number;
}

interface MatchResult {
  match_id: number;
  score: number;
  total_acertos: number;
  total_erros: number;
  combo_max: number;
  is_new_record: boolean;
}

interface RankingEntry {
  rank_position: number;
  user_id: string;
  nickname: string;
  max_score: number;
}

// UserProfile type is now imported from AuthContext

// ══════════════════════════════════════════════════════════
// ██  CONFIGURAÇÃO DO PATROCINADOR (Mude aqui todo mês!)  ██
// ══════════════════════════════════════════════════════════
const SPONSOR_CONFIG = {
  // Nome fixo do quiz (marca própria)
  brandName: "DESAFIO SEMIN UFBA",
  // Nome do desafio (sem patrocinador = só a marca)
  challengeName: "DESAFIO SEMIN UFBA",
  // Subtítulo (deixe "" quando não houver patrocinador)
  tagline: "",
  // URL do logo da empresa (deixe "" para não exibir)
  logoUrl: "",
  // Cores vibrantes
  accentFrom: "#d29b21",   // Gold Logo
  accentTo: "#b3821a",     // Dark Gold
  // Cor do texto sobre o botão CTA
  ctaTextColor: "#ffffff",
  // Cor de destaque para badges, bordas e textos especiais
  highlight: "#d29b21",    // Gold Logo
  // Fundo do quiz (escuro institucional)
  bgGradient: "radial-gradient(circle at top, #1e2633 0%, #161b22 100%)",
};
// ══════════════════════════════════════════════════════════

// ── Scoring constants (must match the Postgres function) ──
const MATCH_DURATION_SECONDS = 180;

// ── Sound Effects ──
let audioCtx: AudioContext | null = null;

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

// ── Procedural BGM Engine (Casino / Arcade Style) ──
let bgmInterval: ReturnType<typeof setInterval> | null = null;
let bgmStep = 0;
let bgmGainNode: GainNode | null = null;

// Escala pentatônica menor em A (tons que geram tensão e excitement)
const MELODY_NOTES = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.50, 1174.66];
const BASS_NOTES = [110, 130.81, 146.83, 164.81]; // A2, C3, D3, E3

function startBGM(urgent = false) {
  if (!audioCtx) return;
  stopBGM();

  bgmGainNode = audioCtx.createGain();
  bgmGainNode.gain.value = 0.06; // Volume suave pra não atrapalhar os SFX
  bgmGainNode.connect(audioCtx.destination);

  const bpm = urgent ? 180 : 130;
  const beatMs = (60 / bpm) * 1000 / 2; // Semiquaver speed
  bgmStep = 0;

  bgmInterval = setInterval(() => {
    if (!audioCtx || !bgmGainNode) return;
    const now = audioCtx.currentTime;
    const step = bgmStep % 16;

    // ── Bass (toca a cada 4 steps) ──
    if (step % 4 === 0) {
      const bassOsc = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bassOsc.connect(bassGain);
      bassGain.connect(bgmGainNode);
      bassOsc.type = "triangle";
      bassOsc.frequency.value = BASS_NOTES[Math.floor(step / 4) % BASS_NOTES.length];
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      bassOsc.start(now);
      bassOsc.stop(now + 0.25);
    }

    // ── Melody Arpeggio (padrão rítmico variado) ──
    if ([0, 2, 3, 5, 7, 8, 10, 12, 14, 15].includes(step)) {
      const melOsc = audioCtx.createOscillator();
      const melGain = audioCtx.createGain();
      melOsc.connect(melGain);
      melGain.connect(bgmGainNode);
      melOsc.type = urgent ? "square" : "sine";
      
      // Arpejo ascendente/descendente
      const noteIdx = step < 8 ? step % MELODY_NOTES.length : (MELODY_NOTES.length - 1) - (step % MELODY_NOTES.length);
      melOsc.frequency.value = MELODY_NOTES[noteIdx];
      
      const vol = urgent ? 0.07 : 0.04;
      melGain.gain.setValueAtTime(vol, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      melOsc.start(now);
      melOsc.stop(now + 0.12);
    }

    // ── Hi-hat percussivo (ruído branco filtrado) ──
    if (step % 2 === 0) {
      const bufSize = audioCtx.sampleRate * 0.02;
      const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const hihatGain = audioCtx.createGain();
      const hihatFilter = audioCtx.createBiquadFilter();
      hihatFilter.type = "highpass";
      hihatFilter.frequency.value = 8000;
      
      noise.connect(hihatFilter);
      hihatFilter.connect(hihatGain);
      hihatGain.connect(bgmGainNode);
      hihatGain.gain.setValueAtTime(urgent ? 0.03 : 0.015, now);
      hihatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      noise.start(now);
      noise.stop(now + 0.03);
    }

    bgmStep++;
  }, beatMs);
}

function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmGainNode) {
    bgmGainNode.gain.value = 0;
    bgmGainNode = null;
  }
  bgmStep = 0;
}

function playSound(type: "click" | "success" | "error" | "finish" | "tick" | "urgent-tick" | "combo" | "share") {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  switch (type) {
    case "success":
      // Cassino Coin Sweep (A5 -> C#6 -> E6)
      osc.type = "square";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1108, audioCtx.currentTime + 0.05);
      osc.frequency.setValueAtTime(1318, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start(); osc.stop(audioCtx.currentTime + 0.4);
      break;
    case "error":
      // Cassino Thud (Duplo dente de serra dissonante leve)
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start(); osc.stop(audioCtx.currentTime + 0.3);

      const errOsc = audioCtx.createOscillator();
      const errGain = audioCtx.createGain();
      errOsc.connect(errGain); errGain.connect(audioCtx.destination);
      errOsc.type = "sawtooth";
      errOsc.frequency.setValueAtTime(160, audioCtx.currentTime);
      errGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      errGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      errOsc.start(); errOsc.stop(audioCtx.currentTime + 0.3);
      break;
    case "click":
      // Sharp Tick
      osc.type = "square";
      osc.frequency.setValueAtTime(1500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.start(); osc.stop(audioCtx.currentTime + 0.03);
      break;
    case "finish":
      // Jackpot Big Win (Chuva de Ouro em notas que sobem a oitava)
      osc.disconnect();
      const winNotes = [523.25, 659.25, 783.99, 1046.50];
      for (let i = 0; i < 20; i++) {
         const wOsc = audioCtx.createOscillator();
         const wGain = audioCtx.createGain();
         wOsc.connect(wGain); wGain.connect(audioCtx.destination);
         wOsc.type = "sine";
         wOsc.frequency.value = winNotes[i % 4] * Math.pow(1.2, Math.floor(i/4)); 
         wGain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.04);
         wGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.04 + 0.15);
         wOsc.start(audioCtx.currentTime + i * 0.04); 
         wOsc.stop(audioCtx.currentTime + i * 0.04 + 0.15);
      }
      break;
    case "tick":
      // Tension Tick (Slot machine slowly stopping)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.start(); osc.stop(audioCtx.currentTime + 0.04);
      break;
    case "urgent-tick":
      // Urgent Tick (Red Heartbeat)
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start(); osc.stop(audioCtx.currentTime + 0.05);
      break;
    case "combo":
      // PG Combo Sweep (Sobe escada de tom rapidamente)
      osc.disconnect();
      const comboNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      for (let i = 0; i < comboNotes.length; i++) {
         const cOsc = audioCtx.createOscillator();
         const cGain = audioCtx.createGain();
         cOsc.connect(cGain); cGain.connect(audioCtx.destination);
         cOsc.type = "square";
         cOsc.frequency.value = comboNotes[i];
         cGain.gain.setValueAtTime(0.05, audioCtx.currentTime + i * 0.05);
         cGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.05 + 0.15);
         cOsc.start(audioCtx.currentTime + i * 0.05); 
         cOsc.stop(audioCtx.currentTime + i * 0.05 + 0.15);
      }
      break;
    case "share":
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start(); osc.stop(audioCtx.currentTime + 0.4);
      break;
  }
}

// ── Screen type ──
type Screen = "auth" | "profile" | "rules" | "quiz" | "result";

// Helper function for difficulty text
function getDifficultyLabel(diff: "facil" | "medio" | "dificil") {
  switch (diff) {
    case "facil": return "Fácil";
    case "medio": return "Médio";
    case "dificil": return "Difícil";
    default: return diff;
  }
}

// Helper function for difficulty badge styles
function getDifficultyStyle(diff: "facil" | "medio" | "dificil") {
  switch (diff) {
    case "facil": return "border-emerald-500/30 text-emerald-400 bg-emerald-500/5";
    case "medio": return "border-amber-500/30 text-amber-400 bg-amber-500/5";
    case "dificil": return "border-rose-500/30 text-rose-400 bg-rose-500/5";
    default: return "border-white/10 text-white/60 bg-white/5";
  }
}

const QuizPage = () => {
  const { session, profile: authProfile, loading: authLoading, refreshProfile, setProfile: setAuthProfile, logout } = useAuth();

  // Auth UI state (kept local to Quiz — only for screens/tabs)
  const [screen, setScreen] = useState<Screen>("auth");

  // Profile (alias from context for compatibility)
  const profile = authProfile;
  const setProfile = setAuthProfile;
  const [matchCount, setMatchCount] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [globalPlayerCount, setGlobalPlayerCount] = useState(0);
  const [globalMatchCount, setGlobalMatchCount] = useState(0);
  const [profileTop3, setProfileTop3] = useState<any[]>([]);

  // Quiz State Extras
  const [bgmMuted, setBgmMuted] = useState(false);
  const [prevRank, setPrevRank] = useState<number | null>(null);

  // Quiz
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION_SECONDS);
  const [answers, setAnswers] = useState<Array<{ question_id: number; answer_index: number; time_ms: number }>>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Derived values for current question and warning timer
  const currentQuestion = questions[currentIndex];
  const timerUrgent = timeLeft <= 30;

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setScreen("auth");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }, [logout]);

  // End quiz early
  const endQuizEarly = useCallback(() => {
    submitMatch(false);
  }, []);

  // Live feedback
  const [liveScore, setLiveScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [floatingPts, setFloatingPts] = useState<{ pts: number; id: number } | null>(null);
  const floatingIdRef = useRef(0);

  // Result
  const [result, setResult] = useState<MatchResult | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchStartRef = useRef(0);

  // BGM
  const bgmStartedRef = useRef(false);

  // ── Init: Check session from AuthContext ──
  useEffect(() => {
    // When AuthContext profile loads, navigate to profile screen
    if (!authLoading && authProfile) {
      loadProfileData(authProfile.id);
    } else if (!authLoading && !authProfile) {
      setScreen("auth");
    }
  }, [authLoading, authProfile]);

  // ── Profile data loading (quiz-specific stats) ──
  async function loadProfileData(userId: string) {
    try {
      // Executa todas as consultas de forma 100% paralela para velocidade máxima de conexão
      const [
        matchCountRes,
        matchHistoryRes,
        rankRes,
        totalPlayersRes,
        totalMatchesRes,
        top3Res
      ] = await Promise.all([
        supabase.from("matches").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("matches").select("score, created_at").eq("user_id", userId).order("created_at", { ascending: true }).limit(20),
        supabase.rpc("get_my_ranking"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("matches").select("*", { count: "exact", head: true }),
        supabase.rpc("get_global_ranking", { p_limit: 3 })
      ]);

      if (matchCountRes.count !== null) setMatchCount(matchCountRes.count);
      
      if (matchHistoryRes.data) {
        setMatchHistory(matchHistoryRes.data.map((m, i) => ({ partida: i + 1, pontuacao: m.score })));
      }

      if (rankRes.data && rankRes.data.rank_position) {
        setMyRank(rankRes.data.rank_position);
      }

      if (totalPlayersRes.count !== null) setGlobalPlayerCount(totalPlayersRes.count);
      if (totalMatchesRes.count !== null) setGlobalMatchCount(totalMatchesRes.count);

      if (top3Res.data) setProfileTop3(top3Res.data);
    } catch (e) {
      console.error("Erro ao carregar dados do perfil:", e);
    } finally {
      setScreen("profile");
    }
  }

  // ── Quiz ──
  const startQuiz = useCallback(async () => {
    initAudioContext();
    setQuizLoading(true);

    const { data, error } = await supabase.rpc("get_quiz_questions", { total_count: 20 });

    if (error || !data || data.length === 0) {
      alert("Erro ao buscar perguntas: " + (error?.message || "Nenhuma pergunta encontrada."));
      setQuizLoading(false);
      return;
    }

    // Parse alternativas from JSONB e embaralha mantendo o índice original salvo com Fisher-Yates (Sem viés)
    const parsed: Question[] = data.map((q: any) => {
      const parsedAlts: string[] = typeof q.alternativas === "string" ? JSON.parse(q.alternativas) : q.alternativas;
      
      const shuffled = parsedAlts.map((text, originalIndex) => ({ text, originalIndex }));
      // O Algoritmo de Fisher-Yates garante precisão matemática na aleatoriedade
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      return {
        ...q,
        alternativas: parsedAlts,
        shuffledAlternativas: shuffled
      };
    });

    setQuestions(parsed);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeLeft(MATCH_DURATION_SECONDS);
    setSelectedOption(null);
    setQuestionStartTime(Date.now());
    matchStartRef.current = Date.now();
    setLiveScore(0);
    setComboCount(0);
    setFloatingPts(null);
    setQuizLoading(false);
    setPrevRank(myRank); // Save pre-match rank
    setScreen("quiz");

    // Start BGM
    startBGM(false);
    bgmStartedRef.current = true;

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    let t = MATCH_DURATION_SECONDS;
    let wasUrgent = false;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t > 0 && t <= 10) playSound("urgent-tick");
      else if (t > 10) playSound("tick");

      // Acelerar BGM quando fica urgente
      if (t <= 30 && !wasUrgent) {
        wasUrgent = true;
        if (bgmStartedRef.current) startBGM(true);
      }

      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        submitMatch(true);
      }
    }, 1000);
  }, []);

  function selectOption(idx: number) {
    if (selectedOption !== null) return; // already selected
    playSound("click");
    setSelectedOption(idx);
    const timeTaken = Date.now() - questionStartTime;
    const q = questions[currentIndex];

    const newAnswers = [...answers, {
      question_id: q.id,
      answer_index: idx,
      time_ms: timeTaken,
    }];
    setAnswers(newAnswers);

    const isCorrect = q.resposta_correta === idx;
    if (isCorrect) {
      playSound("success");
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      // Calcular pontos ganhos (espelhando a lógica do Postgres)
      let basePts = q.dificuldade === "facil" ? 10 : q.dificuldade === "medio" ? 20 : 40;
      
      let comboBonus = 0;
      if (newCombo >= 10) comboBonus = 0.50;
      else if (newCombo >= 5) comboBonus = 0.25;
      else if (newCombo >= 3) comboBonus = 0.10;

      let speedBonus = 0;
      if (timeTaken <= 3000) speedBonus = 0.50;
      else if (timeTaken >= 10000) speedBonus = 0;
      else speedBonus = 0.50 * (1 - (timeTaken - 3000) / 7000);

      const earnedPts = Math.round(basePts * (1 + comboBonus + speedBonus));
      setLiveScore(prev => prev + earnedPts);

      // Animação flutuante de pontos
      floatingIdRef.current++;
      setFloatingPts({ pts: earnedPts, id: floatingIdRef.current });
      setTimeout(() => setFloatingPts(null), 1000);

      if (newCombo >= 3) {
        setTimeout(() => playSound("combo"), 150);
      }
    } else {
      playSound("error");
      setComboCount(0);
      setLiveScore(prev => Math.max(0, prev - 15));

      // Animação flutuante de penalidade
      floatingIdRef.current++;
      setFloatingPts({ pts: -15, id: floatingIdRef.current });
      setTimeout(() => setFloatingPts(null), 1000);
    }

    // Move to next after brief delay
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        submitMatch(false, newAnswers);
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setQuestionStartTime(Date.now());
      }
    }, 1200);
  }

  async function submitMatch(isTimeout = false, finalAnswers?: typeof answers) {
    if (timerRef.current) clearInterval(timerRef.current);
    stopBGM();
    bgmStartedRef.current = false;
    const answersToSubmit = finalAnswers || answers;
    const durationMs = Date.now() - matchStartRef.current;

    if (answersToSubmit.length === 0) {
      alert("Nenhuma resposta submetida.");
      setScreen("profile");
      if (profile) loadProfileData(profile.id);
      return;
    }

    setScreen("result");
    setResult(null);

    const { data, error } = await supabase.rpc("submit_match", {
      p_answers: answersToSubmit,
      p_duration_ms: durationMs,
    });

    if (error) {
      alert("Erro ao processar partida: " + error.message);
      if (profile) loadProfileData(profile.id);
      return;
    }

    playSound("finish");
    setResult(data as MatchResult);

    // Fetch ranking (top 5)
    const { data: rankData } = await supabase.rpc("get_global_ranking", { p_limit: 5 });
    if (rankData) setRanking(rankData);

    // Refresh profile local (use server truth for max_score)
    if (profile) {
      supabase.from("profiles").select("*").eq("id", profile.id).single().then(({ data: refreshed }) => {
        if (refreshed) setProfile(refreshed);
      });
    }
  }

  // ── Share Logic ──
  // ── Month name helper ──
  function getMonthLabel() {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  async function shareToInstagram() {
    if (!profile) return;
    playSound("share");
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Try to load Canva template as background ──
    let hasTemplate = false;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => { ctx.drawImage(img, 0, 0, 1080, 1920); hasTemplate = true; resolve(); };
        img.onerror = () => reject();
        img.src = "/share-template.png";
      });
    } catch {
      // Fallback: fundo programático escuro
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
      bgGrad.addColorStop(0, "#08090d");
      bgGrad.addColorStop(0.4, "#0d1117");
      bgGrad.addColorStop(1, "#0a0c12");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Glow sutil dourado
      const ambientGlow = ctx.createRadialGradient(540, 750, 0, 540, 750, 600);
      ambientGlow.addColorStop(0, "rgba(245, 158, 11, 0.06)");
      ambientGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, 1080, 1920);

      // Linhas decorativas
      const lineGrad = ctx.createLinearGradient(140, 0, 940, 0);
      lineGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
      lineGrad.addColorStop(0.3, "rgba(245, 158, 11, 0.4)");
      lineGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.4)");
      lineGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(140, 180); ctx.lineTo(940, 180); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(140, 1740); ctx.lineTo(940, 1740); ctx.stroke();

      // Logo SEMIN + Marca (só no fallback — no template do Canva já está na imagem)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Carregar e desenhar a logo SEMIN
      try {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          logo.onload = () => {
            // Desenhar logo centralizada (180x180) no topo
            const logoSize = 180;
            ctx.drawImage(logo, 540 - logoSize / 2, 120, logoSize, logoSize);
            resolve();
          };
          logo.onerror = () => resolve(); // Continua sem logo se falhar
          logo.src = "/semin_logo.webp";
        });
      } catch { /* continua sem logo */ }

      // Texto "DESAFIO" abaixo da logo
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "600 28px 'Outfit', system-ui, sans-serif";
      ctx.letterSpacing = "12px";
      ctx.fillText("DESAFIO", 540, 350);

      // Nome da marca com gradiente
      ctx.letterSpacing = "4px";
      const brandGrad = ctx.createLinearGradient(200, 0, 880, 0);
      brandGrad.addColorStop(0, SPONSOR_CONFIG.accentFrom);
      brandGrad.addColorStop(1, SPONSOR_CONFIG.accentTo);
      ctx.fillStyle = brandGrad;
      ctx.font = "900 72px 'Outfit', system-ui, sans-serif";
      ctx.fillText("SEMIN UFBA", 540, 430);

      if (SPONSOR_CONFIG.tagline) {
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "500 24px 'Outfit', system-ui, sans-serif";
        ctx.letterSpacing = "6px";
        ctx.fillText(SPONSOR_CONFIG.tagline.toUpperCase(), 540, 500);
      }
    }

    // ══════════════════════════════════════════════════
    // ██  DADOS DINÂMICOS (sobrepostos ao template)  ██
    // ══════════════════════════════════════════════════
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ── PONTUAÇÃO ──
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "600 30px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("PONTUAÇÃO", 540, 560);

    // Score grande com glow
    ctx.shadowColor = `${SPONSOR_CONFIG.accentFrom}60`;
    ctx.shadowBlur = 40;
    const scoreGrad = ctx.createLinearGradient(200, 0, 880, 0);
    scoreGrad.addColorStop(0, "#ffffff");
    scoreGrad.addColorStop(0.5, SPONSOR_CONFIG.highlight);
    scoreGrad.addColorStop(1, "#ffffff");
    ctx.fillStyle = scoreGrad;
    ctx.font = "900 180px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText(profile.max_score.toLocaleString("pt-BR"), 540, 720);
    ctx.shadowBlur = 0;

    // Label "PONTOS"
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "500 26px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("PONTOS", 540, 840);

    // ── RANKING ──
    const displayRank = result && ranking.find(r => r.user_id === profile.id)?.rank_position || myRank;
    if (displayRank) {
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(340, 940); ctx.lineTo(740, 940); ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "600 24px 'Outfit', system-ui, sans-serif";
      ctx.letterSpacing = "8px";
      ctx.fillText("RANKING MENSAL", 540, 1010);

      // Posição
      ctx.fillStyle = SPONSOR_CONFIG.highlight;
      ctx.font = "900 100px 'Outfit', system-ui, sans-serif";
      ctx.letterSpacing = "0px";
      ctx.fillText(`#${displayRank}`, 540, 1130);

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath(); ctx.moveTo(340, 1230); ctx.lineTo(740, 1230); ctx.stroke();
    }

    // ── MÊS DA COMPETIÇÃO ──
    ctx.fillStyle = SPONSOR_CONFIG.highlight;
    ctx.font = "700 32px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText(getMonthLabel().toUpperCase(), 540, 1320);

    // ── JOGADOR ──
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "500 22px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("JOGADOR", 540, 1380);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 56px 'Outfit', system-ui, sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText(`@${profile.nickname}`, 540, 1460);

    // ── RODAPÉ (só se não tiver template — no Canva já está na imagem) ──
    if (!hasTemplate) {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "500 24px 'Outfit', system-ui, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("JOGUE TAMBÉM", 540, 1800);

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "600 28px 'Outfit', system-ui, sans-serif";
      ctx.letterSpacing = "0px";
      ctx.fillText("seminufba.com.br", 540, 1850);
    }

    // ── Export ──
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "semin-score.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Meu Score no ${SPONSOR_CONFIG.challengeName}`,
            text: `Fiz ${profile.max_score} pontos no ${SPONSOR_CONFIG.challengeName} — ${getMonthLabel()}!`,
            files: [file],
          });
        } catch (e) {
          downloadBlob(blob, "semin-score.png");
        }
      } else {
        downloadBlob(blob, "semin-score.png");
      }
    });
  }


  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Timer display ──
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // ── Render ──
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: SPONSOR_CONFIG.bgGradient }}>

      <div className="w-full max-w-2xl">
        {/* ── AUTH SCREEN ── */}
        <AnimatePresence mode="wait">
          {screen === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8 md:p-12 text-center shadow-2xl"
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Logo do Patrocinador ou ícone padrão */}
              {SPONSOR_CONFIG.logoUrl ? (
                <img src={SPONSOR_CONFIG.logoUrl} alt="Patrocinador" width="80" height="80" className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-4 rounded-xl" loading="lazy" />
              ) : (
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg"
                     style={{ background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})` }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}

              {/* Brand Name */}
              <h1 className="text-5xl md:text-7xl font-black mb-1 tracking-tighter"
                  style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <span className="text-transparent bg-clip-text"
                      style={{ backgroundImage: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo}, ${SPONSOR_CONFIG.highlight})` }}>
                  {SPONSOR_CONFIG.brandName}
                </span>
              </h1>

              {/* Sponsor collab (só aparece se tiver patrocinador) */}
              {SPONSOR_CONFIG.tagline && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-2"
                     style={{ background: `${SPONSOR_CONFIG.accentFrom}15`, border: `1px solid ${SPONSOR_CONFIG.accentFrom}30` }}>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: SPONSOR_CONFIG.highlight, fontFamily: "'Outfit', sans-serif" }}>
                    {SPONSOR_CONFIG.tagline}
                  </span>
                </div>
              )}

              <p className="text-slate-500 text-xs mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Desafie sua mente e teste seus conhecimentos em mineração
              </p>

              <div className="mt-8">
                {authLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Verificando sessão...</p>
                  </div>
                ) : (
                  <>
                    <LoginModal defaultTab="login">
                      <Button 
                        className="w-full py-8 rounded-xl text-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-transparent"
                        style={{ background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`, color: SPONSOR_CONFIG.ctaTextColor }}
                      >
                        FAZER LOGIN PARA JOGAR
                      </Button>
                    </LoginModal>
                    <p className="text-slate-400 text-sm mt-4">
                      O Desafio Semin usa o mesmo login do resto da plataforma.
                    </p>
                  </>
                )}
              </div>

              {/* Back to site */}
              <a href="/"
                className="mt-6 block text-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors py-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                ← Voltar para o site SEMIN UFBA
              </a>
            </motion.div>
          )}

          {/* ── PROFILE SCREEN ── */}
          {screen === "profile" && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8 md:p-12 shadow-2xl"
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                       style={{ background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`, fontFamily: "'Outfit', sans-serif" }}>
                    {profile.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      @{profile.nickname}
                    </h2>
                    <span className="text-xs uppercase tracking-widest font-bold" style={{ color: SPONSOR_CONFIG.highlight }}>Jogador Registrado</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors p-2" title="Sair">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl p-4 text-center flex flex-col justify-center"
                     style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Recorde</div>
                  <div className="text-xl md:text-2xl font-black text-white tabular-nums">{profile.max_score.toLocaleString("pt-BR")}</div>
                </div>
                <div className="rounded-2xl p-4 text-center flex flex-col justify-center"
                     style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Partidas</div>
                  <div className="text-xl md:text-2xl font-black text-white tabular-nums">{matchCount}</div>
                </div>
                <div className="rounded-2xl p-4 text-center flex flex-col justify-center"
                     style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Rank</div>
                  <div className="text-xl md:text-2xl font-black text-amber-400 tabular-nums">#{myRank || "-"}</div>
                </div>
              </div>

              {/* Evolution Chart */}
              {matchHistory.length > 0 && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">Evolução de Desempenho</div>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={matchHistory}>
                        <XAxis dataKey="partida" hide />
                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                          labelStyle={{ color: '#d29b21' }}
                        />
                        <Line type="monotone" dataKey="pontuacao" stroke="#d29b21" strokeWidth={3} dot={{ r: 4, fill: '#b3821a' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Global Community Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Jogadores</div>
                  <div className="text-xl md:text-2xl font-black text-sky-400 tabular-nums">{globalPlayerCount}</div>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Partidas Jogadas</div>
                  <div className="text-xl md:text-2xl font-black text-violet-400 tabular-nums">{globalMatchCount}</div>
                </div>
              </div>

              {/* Top 3 Ranking */}
              {profileTop3.length > 0 && (
                <div className="mb-6 p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4 text-center">👑 Top 3 — {getMonthLabel()}</h3>
                  <div className="flex flex-col gap-2">
                    {profileTop3.map((p) => {
                      const isMe = p.user_id === profile?.id;
                      return (
                        <div key={p.user_id}
                          className="flex justify-between items-center p-3 rounded-xl transition-all"
                          style={{
                            background: isMe ? "rgba(210,155,33,0.15)" : "rgba(30,41,59,0.5)",
                            border: isMe ? "1px solid rgba(210,155,33,0.4)" : "1px solid rgba(255,255,255,0.03)",
                          }}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl w-7 text-center">
                              {p.rank_position === 1 ? "🥇" : p.rank_position === 2 ? "🥈" : "🥉"}
                            </span>
                            <span className={`font-bold text-sm ${isMe ? "text-amber-300" : "text-white"}`}>{p.nickname} {isMe ? "(Você)" : ""}</span>
                          </div>
                          <span className="text-amber-400 font-black text-sm tabular-nums">{p.max_score.toLocaleString("pt-BR")} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand badge */}
              <div className="text-center mb-6">
                <span className="text-3xl font-black text-transparent bg-clip-text"
                      style={{ backgroundImage: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`, fontFamily: "'Outfit', sans-serif" }}>
                  {SPONSOR_CONFIG.brandName}
                </span>
              </div>

              {/* Play Button */}
              <button onClick={() => setScreen("rules")} disabled={quizLoading}
                className="w-full py-5 rounded-xl text-xl font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`,
                  boxShadow: `0 0 30px ${SPONSOR_CONFIG.accentFrom}40`,
                  color: SPONSOR_CONFIG.ctaTextColor,
                  fontFamily: "'Outfit', sans-serif",
                }}>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                JOGAR AGORA
              </button>

              {/* Share section */}
              {profile.max_score > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest text-center mb-1">
                    Compartilhe seu Recorde
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={shareToInstagram}
                      className="flex-1 py-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ 
                        background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        boxShadow: "0 6px 15px rgba(220, 39, 67, 0.2)",
                        color: "white"
                      }}>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.822a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      STORY INSTAGRAM
                    </button>
                    <button
                      onClick={() => {
                        const text = `🏆 Meu recorde no DESAFIO SEMIN (UFBA) é de ${profile.max_score} pontos!\nConsegue me superar? Jogue agora:`;
                        const url = window.location.origin + "/desafio-semin";
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
                      }}
                      className="flex-1 py-4 rounded-xl text-xs md:text-sm font-bold text-white transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: "#25D366" }}>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      DESAFIAR AMIGOS
                    </button>
                  </div>
                </div>
              )}

              {/* Back to site */}
              <a href="/"
                className="mt-4 block text-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors py-2">
                ← Voltar para o site SEMIN UFBA
              </a>
            </motion.div>
          )}

          {/* ── RULES SCREEN ── */}
          {screen === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl p-6 md:p-10 text-center shadow-2xl"
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="mb-5 inline-flex items-center justify-center p-4 rounded-full"
                   style={{ background: "rgba(210,155,33,0.15)", border: "1px solid rgba(210,155,33,0.4)" }}>
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-black mb-2 text-white font-display">Regras do Desafio</h2>
              <p className="text-slate-400 text-sm mb-6">Leia com atenção antes de iniciar sua partida</p>

              <div className="flex flex-col gap-3 md:gap-4 mb-8 text-left">
                <div className="p-4 md:p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">⏱️</span>
                    <h3 className="font-bold text-amber-400 text-sm md:text-base">Contra o Relógio</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">São <strong className="text-white">3 minutos</strong> para responder até <strong className="text-white">20 perguntas</strong> sobre mineração. Quando o tempo acabar, a partida encerra automaticamente.</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="font-bold text-emerald-400 text-sm md:text-base">Pontuação por Dificuldade</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Cada acerto vale pontos de acordo com a dificuldade: <strong className="text-emerald-300">Fácil = +10</strong>, <strong className="text-amber-300">Médio = +20</strong>, <strong className="text-rose-300">Difícil = +40</strong>.</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">⚠️</span>
                    <h3 className="font-bold text-red-400 text-sm md:text-base">Penalidade por Erro</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Errar não sai de graça! Cada resposta errada desconta <strong className="text-rose-300">−15 pontos</strong> da sua partida. Pense antes de chutar.</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🔥</span>
                    <h3 className="font-bold text-orange-400 text-sm md:text-base">Múltiplos Bônus</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Responda em <strong className="text-white">menos de 3 segundos</strong> para ganhar até <strong className="text-sky-300">+50% de Bônus de Velocidade</strong>. Além disso, a partir de <strong className="text-white">3 acertos seguidos</strong>, você ativa o <strong className="text-orange-300">Bônus de Combo (até +50%)</strong>! Ambos os bônus acumulam.</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(210,155,33,0.15)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="font-bold text-amber-400 text-sm md:text-base">Ranking Mensal = Melhor Partida</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Apenas a <strong className="text-amber-300">sua maior pontuação em uma única partida</strong> vale para o ranking do mês. A cada novo mês, o ranking é <strong className="text-white">zerado</strong> e uma nova competição começa! Supere seu recorde para subir de posição.</p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setScreen("profile")}
                  className="w-full sm:w-auto sm:flex-shrink-0 py-4 px-6 rounded-xl font-bold text-sm md:text-base transition-all text-slate-300 hover:text-white hover:bg-slate-700/60 active:scale-[0.98]"
                  style={{ border: "2px solid rgba(51,65,85,1)" }}>
                  ← VOLTAR
                </button>
                <button onClick={startQuiz} disabled={quizLoading}
                  className="w-full flex-1 py-4 rounded-xl text-base md:text-lg font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`,
                    boxShadow: `0 0 25px ${SPONSOR_CONFIG.accentFrom}40`,
                    color: SPONSOR_CONFIG.ctaTextColor,
                  }}>
                  {quizLoading ? "CARREGANDO..." : "🚀 ESTOU PRONTO!"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── QUIZ SCREEN ── */}
          {screen === "quiz" && currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              {/* Efeitos de Fundo Neon (Orbs) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] pointer-events-none" style={{ zIndex: -1 }}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] transition-all duration-700 animate-pulse ${timerUrgent ? "bg-rose-600/40" : "bg-amber-500/30"}`}></div>
                <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] transition-all duration-1000 delay-500 animate-pulse ${timerUrgent ? "bg-red-700/40" : "bg-fuchsia-600/20"}`}></div>
              </div>

              {/* Header bar — Timer mais destacado */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    timerUrgent ? "shadow-[0_0_25px_rgba(239,68,68,0.4)]" : "shadow-[0_0_15px_rgba(210,155,33,0.2)]"
                  }`}
                       style={{ background: timerUrgent ? "rgba(239,68,68,0.15)" : "rgba(30,41,59,0.8)", border: timerUrgent ? "2px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.05)" }}>
                    <svg className={`w-7 h-7 ${timerUrgent ? "text-rose-400 animate-pulse" : "text-amber-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Tempo</div>
                    <div className={`text-3xl md:text-4xl font-black tabular-nums transition-colors duration-300 ${timerUrgent ? "text-rose-400 animate-pulse" : "text-white"}`}>
                      {timerText}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Pergunta</div>
                  <div className="text-2xl md:text-3xl font-black text-amber-400 tabular-nums">
                    {currentIndex + 1}<span className="text-slate-500">/{questions.length}</span>
                  </div>
                </div>
              </div>

              {/* ── LIVE SCORE HUD ── */}
              <div className="flex items-center justify-between mb-6 px-4 py-3 rounded-2xl relative overflow-hidden"
                   style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Score */}
                <div className="flex items-center gap-2 relative">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Score</span>
                  <span className="text-xl font-black text-white tabular-nums">{liveScore}</span>
                  {/* Floating Points Animation */}
                  <AnimatePresence>
                    {floatingPts && (
                      <motion.span
                        key={floatingPts.id}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -30 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`absolute -top-2 left-16 text-lg font-black ${
                          floatingPts.pts > 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {floatingPts.pts > 0 ? `+${floatingPts.pts}` : floatingPts.pts}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {/* Combo Fire */}
                {comboCount >= 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: comboCount >= 5 ? "rgba(239,68,68,0.25)" : comboCount >= 3 ? "rgba(249,115,22,0.2)" : "rgba(210,155,33,0.15)",
                      border: comboCount >= 5 ? "1px solid rgba(239,68,68,0.5)" : comboCount >= 3 ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(210,155,33,0.3)",
                    }}
                  >
                    <span className="text-base">{comboCount >= 5 ? "🔥🔥" : comboCount >= 3 ? "🔥" : "⚡"}</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      comboCount >= 5 ? "text-rose-400" : comboCount >= 3 ? "text-orange-400" : "text-amber-400"
                    }`}>
                      x{comboCount} combo{comboCount >= 3 ? " · 1.5x" : ""}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Question card */}
              <div className="rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
                   style={{
                     background: "rgba(30, 41, 59, 0.7)",
                     backdropFilter: "blur(12px)",
                     border: "1px solid rgba(255,255,255,0.08)",
                   }}>
                {/* Progress bar */}
                <div className="absolute top-0 left-0 h-1 transition-all duration-300"
                     style={{ width: `${(currentIndex / questions.length) * 100}%`, background: `linear-gradient(90deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})` }} />

                {/* Difficulty badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyStyle(currentQuestion.dificuldade)}`}>
                    {getDifficultyLabel(currentQuestion.dificuldade)}
                  </span>
                </div>

                {/* Question text */}
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-2xl md:text-3xl font-extrabold mb-8 leading-relaxed tracking-tight text-white drop-shadow-sm"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                  >
                    {currentQuestion.pergunta}
                  </motion.h2>
                </AnimatePresence>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.shuffledAlternativas?.map((opt, displayIdx) => {
                    const originalIdx = opt.originalIndex;
                    const isSelected = selectedOption === originalIdx;
                    const isCorrectAnswer = currentQuestion.resposta_correta === originalIdx;
                    const hasSelected = selectedOption !== null;
                        
                    // Estilos de botões Premium Glassmorphism
                    let btnStyle = {
                      background: "rgba(30, 41, 59, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                    };

                    if (hasSelected) {
                      if (isCorrectAnswer) {
                        btnStyle = {
                          background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(20,83,45,0.4) 100%)",
                          borderColor: "rgba(34, 197, 94, 0.6)",
                          color: "#4ade80",
                          boxShadow: "0 0 25px rgba(34, 197, 94, 0.25)"
                        };
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyle = {
                          background: "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(127,29,29,0.4) 100%)",
                          borderColor: "rgba(239, 68, 68, 0.6)",
                          color: "#f87171",
                          boxShadow: "0 0 25px rgba(239, 68, 68, 0.25)"
                        };
                      } else {
                        btnStyle = {
                          background: "rgba(15, 23, 42, 0.4)",
                          borderColor: "rgba(255, 255, 255, 0.02)",
                          color: "rgba(255, 255, 255, 0.2)",
                          boxShadow: "none"
                        };
                      }
                    } else if (isSelected) {
                      btnStyle = {
                        background: "rgba(210,155,33,0.15)",
                        borderColor: "rgba(210,155,33,0.8)",
                        color: "white",
                        boxShadow: "0 0 20px rgba(210,155,33,0.2)"
                      };
                    }

                    return (
                      <motion.button
                        key={`${currentIndex}-${originalIdx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: displayIdx * 0.05 }}
                        onClick={() => selectOption(originalIdx)}
                        disabled={hasSelected}
                        className={`w-full text-left p-4 md:p-5 rounded-2xl font-semibold transition-all duration-300 shadow-sm relative overflow-hidden group ${
                          !hasSelected && "hover:border-amber-400/80 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(210,155,33,0.15)] cursor-pointer hover:-translate-y-1"
                        } ${isSelected ? "scale-[0.98] shadow-inner" : ""}`}
                        style={{ ...btnStyle, borderWidth: "2px" }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-10 h-10 rounded-xl border border-current text-sm font-black bg-white/5 opacity-90 shadow-sm">
                            {["A", "B", "C", "D", "E"][displayIdx]}
                          </span>
                          <span className="text-base md:text-lg font-medium tracking-tight" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{opt.text}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz footer: Mute + End early */}
              <div className="flex items-center justify-between mt-4 gap-4">
                <button
                  onClick={() => {
                    if (bgmMuted) {
                      setBgmMuted(false);
                      if (bgmStartedRef.current) startBGM(timeLeft <= 30);
                    } else {
                      setBgmMuted(true);
                      stopBGM();
                    }
                  }}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl text-slate-500 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {bgmMuted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">{bgmMuted ? "Som Off" : "Som On"}</span>
                </button>
                <button onClick={endQuizEarly}
                  className="py-3 px-4 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                  Finalizar Agora
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RESULT SCREEN ── */}
          {screen === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="rounded-3xl p-8 md:p-12 shadow-2xl"
                   style={{
                     background: "rgba(30, 41, 59, 0.7)",
                     backdropFilter: "blur(12px)",
                     border: "1px solid rgba(255,255,255,0.08)",
                   }}>
                {/* Award icon */}
                <div className="mb-6 inline-flex items-center justify-center p-6 rounded-full shadow-2xl"
                     style={{ background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`, boxShadow: "0 0 40px rgba(210,155,33,0.3)" }}>
                  <svg className="w-16 h-16 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>

                <h2 className="text-3xl font-black mb-2 text-white font-display">
                  Partida Concluída!
                </h2>

                {!result ? (
                  <p className="text-slate-400 mb-8 animate-pulse">Analisando seu desempenho...</p>
                ) : (
                  <>
                    {/* Mensagem motivacional contextual */}
                    <p className="mb-6">
                      {result.is_new_record && prevRank !== null && myRank !== null && (ranking.find(r => r.user_id === profile?.id)?.rank_position ?? myRank) < prevRank ? (
                        <span className="text-emerald-400 font-bold text-lg drop-shadow-md">🎉 Você subiu no Ranking!</span>
                      ) : result.is_new_record ? (
                        <span className="text-emerald-400 font-bold text-lg drop-shadow-md">🏅 Novo recorde pessoal!</span>
                      ) : result.total_acertos === 0 ? (
                        <span className="text-slate-400">Não desanime! Volte a jogar e conquiste seus primeiros pontos. 💪</span>
                      ) : !result.is_new_record ? (
                        <span className="text-slate-400">Quase lá! Jogue novamente e tente superar seu recorde de <strong className="text-amber-400">{profile?.max_score?.toLocaleString("pt-BR")}</strong> pontos. 🎯</span>
                      ) : result.total_acertos > result.total_erros ? (
                        <span className="text-amber-400 font-semibold">Belo desempenho! Você acertou mais do que errou. Continue assim! 💥</span>
                      ) : (
                        <span className="text-slate-400">Bom trabalho! Continue treinando para subir no ranking.</span>
                      )}
                    </p>

                    {/* Maior Pontuação (melhor partida única) */}
                    <div className="mb-8 p-1 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(210,155,33,0.4), rgba(230,126,34,0.1))" }}>
                      <div className="p-6 rounded-[1.4rem]" style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)" }}>
                        <div className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-1">Recorde do Mês</div>
                        <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 drop-shadow-sm tabular-nums">
                          {profile?.max_score?.toLocaleString("pt-BR") || 0}
                        </div>
                        {result && !result.is_new_record && (
                          <div className="mt-2 text-xs text-slate-400">Supere este recorde para subir no ranking!</div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-8">
                      <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent"></div>
                        <div className="text-[10px] tracking-widest text-slate-500 uppercase font-black mb-1 relative">Esta Partida</div>
                        <div className="text-2xl font-black text-amber-400 relative">+{result.score}</div>
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Acertos</div>
                        <div className="text-2xl font-black text-emerald-400">{result.total_acertos}</div>
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Erros</div>
                        <div className="text-2xl font-black text-rose-400">{result.total_erros}</div>
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Precisão</div>
                        <div className="text-2xl font-black text-sky-400">
                          {result.total_acertos + result.total_erros > 0
                            ? Math.round((result.total_acertos / (result.total_acertos + result.total_erros)) * 100)
                            : 0}%
                        </div>
                      </div>
                    </div>

                    {/* Combo */}
                    {result.combo_max >= 3 && (
                      <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(210,155,33,0.1)", border: "1px solid rgba(210,155,33,0.2)" }}>
                        <span className="text-amber-400 font-bold text-sm">🔥 Combo Máximo: {result.combo_max} acertos seguidos!</span>
                      </div>
                    )}
                  </>
                )}

                {/* Ranking Top 5 */}
                {ranking.length > 0 && (
                  <div className="mb-8 p-5 md:p-6 rounded-2xl" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-4">🏆 Top 5 — {getMonthLabel()}</h3>
                    <div className="flex flex-col gap-2">
                      {ranking.slice(0, 5).map((p) => {
                        const isMe = p.user_id === profile?.id;
                        return (
                          <div key={p.user_id}
                            className="flex justify-between items-center p-3 rounded-xl transition-all"
                            style={{
                              background: isMe ? "rgba(210,155,33,0.15)" : "rgba(30,41,59,0.5)",
                              border: isMe ? "1px solid rgba(210,155,33,0.4)" : "1px solid rgba(255,255,255,0.03)",
                            }}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg w-7 text-center">
                                {p.rank_position === 1 ? "🥇" : p.rank_position === 2 ? "🥈" : p.rank_position === 3 ? "🥉" : `#${p.rank_position}`}
                              </span>
                              <span className={`font-bold text-sm ${isMe ? "text-amber-300" : "text-white"}`}>{p.nickname} {isMe ? "(Você)" : ""}</span>
                            </div>
                            <span className="text-amber-400 font-black text-sm tabular-nums">{p.max_score.toLocaleString("pt-BR")} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button onClick={() => { if (profile) loadProfileData(profile.id); }}
                    className="flex-1 py-4 rounded-xl font-bold text-white transition-all hover:bg-slate-700 active:scale-[0.98]"
                    style={{ border: "2px solid rgba(51,65,85,1)" }}>
                    ← INÍCIO
                  </button>
                  <button onClick={startQuiz}
                    className="flex-1 py-4 rounded-xl font-bold shadow-lg transition-all hover:opacity-90 text-slate-900"
                    style={{
                      background: `linear-gradient(135deg, ${SPONSOR_CONFIG.accentFrom}, ${SPONSOR_CONFIG.accentTo})`,
                      boxShadow: "0 0 20px rgba(210, 155, 33, 0.2)",
                    }}>
                    JOGAR DE NOVO
                  </button>
                </div>

                {/* Share */}
                {result && (
                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={shareToInstagram}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:-translate-y-1"
                      style={{ 
                        background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        boxShadow: "0 10px 20px rgba(220, 39, 67, 0.3)",
                        color: "white"
                      }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.822a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      COMPARTILHAR NO INSTAGRAM
                    </button>
                    <button
                      onClick={() => {
                        const text = `🏆 Acabei de marcar ${result.score} pontos no DESAFIO SEMIN (UFBA)!\n${result.total_acertos} acertos, combo máximo de ${result.combo_max}!\nConsegue me superar? Jogue agora:`;
                        const url = window.location.origin + "/desafio-semin";
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
                      }}
                      className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ background: "#25D366" }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Desafie seus amigos no WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;

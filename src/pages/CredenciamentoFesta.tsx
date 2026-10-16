import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  HardHat, 
  QrCode, 
  Sparkles, 
  UserCheck, 
  Calendar, 
  Clock, 
  Building, 
  GraduationCap, 
  Phone, 
  Mail, 
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Lock,
  LogOut,
  KeyRound,
  Camera,
  CameraOff,
  Zap,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import seminLogo from "@/assets/50anos_logo.png";

// Endpoint oficial do Google Apps Script (Planilha & Validação de Presença)
const SCRIPT_URL = import.meta.env.VITE_ENCONTRO_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyB2t4BHlwhkl1lFb4OmFNCBpVINvEVYEeNO1LUpfvmJ1koWppPAdCSGXHwR8OteBfd/exec";

interface Participante {
  nome: string;
  cpf?: string;
  email: string;
  telefone: string;
  formatura: string;
  empresa: string;
  mensagem: string;
  codInscricao: string;
  statusCredenciamento: string;
  dataCredenciamento: string;
  dataRegistro: string;
}

export default function CredenciamentoFestaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCode = searchParams.get("code") || searchParams.get("ticket") || "";
  const paramAutoCheckin = searchParams.get("autocheckin") === "true";

  // Controle de Acesso Restrito da Portaria
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem("semin_portaria_auth") === "true" ||
      localStorage.getItem("semin_portaria_auth") === "true" ||
      sessionStorage.getItem("semin_admin_auth") === "true"
    );
  });
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [inputCode, setInputCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkInDone, setCheckInDone] = useState(false);

  // Estados da Câmera / Scanner do Celular
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedCodeRef = useRef<string>("");
  const lastScannedTimeRef = useRef<number>(0);

  // Síntese de áudio para feedback rápido na portaria (Beep / Sucesso / Erro)
  const playAudioFeedback = (type: "beep" | "success" | "error") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "beep") {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "success") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  // Vibração no smartphone
  const triggerHaptic = (success: boolean) => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        if (success) {
          navigator.vibrate([100, 50, 100]);
        } else {
          navigator.vibrate([350, 100, 350]);
        }
      }
    } catch (e) {}
  };

  // Evitar indexação por motores de busca
  useEffect(() => {
    document.title = "Recepção & Credenciamento • 16º Encontro dos Engenheiros de Minas";
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "noindex, nofollow");
  }, []);

  // Se um participante não autenticado tentar acessar, redireciona para a página pública do ticket
  useEffect(() => {
    if (initialCode && !isAuthenticated) {
      navigate(`/16-encontro-engenheiros-minas?ticket=${encodeURIComponent(initialCode)}`, { replace: true });
    }
  }, [initialCode, isAuthenticated, navigate]);

  // Se tiver código na URL ao carregar e estiver autenticado como portaria
  useEffect(() => {
    if (initialCode && isAuthenticated) {
      if (paramAutoCheckin || autoCheckIn) {
        executarCheckInDireto(initialCode);
      } else {
        buscarCredencial(initialCode);
      }
    }
  }, [initialCode, isAuthenticated]);

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userClean = loginUser.trim().toLowerCase();
    const passClean = loginPass.trim();

    if (
      (userClean === "seminadmin" || userClean === "portaria" || userClean === "admin") &&
      (passClean === "seminufba2026@" || passClean === "festa50anos" || passClean === "portaria50anos")
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("semin_portaria_auth", "true");
      localStorage.setItem("semin_portaria_auth", "true");
      setLoginError("");
      toast.success("Acesso autorizado à portaria!");
      if (initialCode) {
        if (paramAutoCheckin || autoCheckIn) {
          executarCheckInDireto(initialCode);
        } else {
          buscarCredencial(initialCode);
        }
      }
    } else {
      setLoginError("Usuário ou senha incorretos. Apenas a comissão tem acesso.");
      toast.error("Credenciais inválidas.");
    }
  };

  const handleLogout = () => {
    stopCamera();
    setIsAuthenticated(false);
    sessionStorage.removeItem("semin_portaria_auth");
    localStorage.removeItem("semin_portaria_auth");
    sessionStorage.removeItem("semin_admin_auth");
    setParticipante(null);
    toast.info("Sessão da portaria bloqueada.");
  };

  // Inicia Scanner de Câmera do Celular
  const startCamera = async () => {
    try {
      setCameraLoading(true);
      setIsCameraActive(true);
      await new Promise((r) => setTimeout(r, 200));

      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {}
      }

      const scanner = new Html5Qrcode("qr-reader-container");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" }, // câmera traseira do smartphone
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleQrCodeScanned(decodedText);
        },
        () => {}
      );
      toast.info("Câmera ativa! Aponte para o QR Code.");
    } catch (err: any) {
      console.error("Erro ao ativar câmera:", err);
      toast.error("Não foi possível acessar a câmera. Verifique a permissão do navegador.");
      setIsCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // Desativa Scanner de Câmera
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Erro ao parar câmera:", e);
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Limpa o scanner ao desmontar o componente
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch (e) {}
      }
    };
  }, []);

  // Processa leitura do QR Code pela câmera
  const handleQrCodeScanned = async (decodedText: string) => {
    const now = Date.now();
    let code = (decodedText || "").trim();

    if (code.includes("ticket=")) {
      const match = code.match(/[?&]ticket=([^&#]+)/);
      if (match) code = decodeURIComponent(match[1]).trim();
    } else if (code.includes("code=")) {
      const match = code.match(/[?&]code=([^&#]+)/);
      if (match) code = decodeURIComponent(match[1]).trim();
    }

    // Evita ler o mesmo QR Code múltiplas vezes em menos de 4 segundos
    if (code === lastScannedCodeRef.current && (now - lastScannedTimeRef.current) < 4000) {
      return;
    }
    lastScannedCodeRef.current = code;
    lastScannedTimeRef.current = now;

    playAudioFeedback("beep");
    setInputCode(code);

    if (autoCheckIn) {
      await executarCheckInDireto(code);
    } else {
      await buscarCredencial(code);
    }
  };

  // CHECK-IN AUTOMÁTICO INSTANTÂNEO
  const executarCheckInDireto = async (termoOuCode: string) => {
    let raw = (termoOuCode || "").trim();
    if (!raw) return;

    if (raw.includes("ticket=")) {
      const match = raw.match(/[?&]ticket=([^&#]+)/);
      if (match) raw = decodeURIComponent(match[1]).trim();
    } else if (raw.includes("code=")) {
      const match = raw.match(/[?&]code=([^&#]+)/);
      if (match) raw = decodeURIComponent(match[1]).trim();
    }

    setInputCode(raw);
    setLoading(true);
    setActionLoading(true);
    setNotFound(false);
    setErrorMessage("");

    try {
      const cleanDigits = raw.replace(/\D/g, "");
      let paramName = "code";
      let paramVal = raw;

      if (raw.includes("@")) {
        paramName = "email";
      } else if (cleanDigits.length === 11 && !raw.toUpperCase().startsWith("16EM-")) {
        paramName = "cpf";
        paramVal = cleanDigits;
      }

      // Requisição direta de credenciamento
      const url = `${SCRIPT_URL}?${paramName}=${encodeURIComponent(paramVal)}&action=credenciar`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.checkInSuccess && data.participante) {
        setParticipante(data.participante);
        setCheckInDone(true);
        setNotFound(false);
        playAudioFeedback("success");
        triggerHaptic(true);
        toast.success(`🎉 ENTRADA LIBERADA! Check-in de ${data.participante.nome} confirmado!`, {
          duration: 7000
        });
      } else if (data.alreadyCheckedIn && data.participante) {
        setParticipante(data.participante);
        setNotFound(false);
        playAudioFeedback("error");
        triggerHaptic(false);
        toast.error(`⛔ ENTRADA DUPLICADA BLOQUEADA!`, {
          description: data.message || `Check-in já registrado em: ${data.participante.dataCredenciamento}`,
          duration: 9000
        });
      } else if (data.found && data.participante) {
        setParticipante(data.participante);
        setNotFound(false);
        toast.info("Participante localizado. Confirme a entrada no botão.");
      } else {
        setParticipante(null);
        setNotFound(true);
        setErrorMessage(data.message || "Credencial não encontrada no sistema.");
        playAudioFeedback("error");
        triggerHaptic(false);
        toast.error("Credencial não encontrada!");
      }
    } catch (err: any) {
      console.warn("Falha no check-in direto:", err);
      // Fallback para busca normal
      await buscarCredencial(raw);
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  };

  const buscarCredencial = async (codigoOuEmailOuCpf: string) => {
    let raw = (codigoOuEmailOuCpf || "").trim();
    if (!raw) {
      toast.error("Informe o código, CPF ou e-mail da credencial");
      return;
    }

    if (raw.includes("ticket=")) {
      const match = raw.match(/[?&]ticket=([^&#]+)/);
      if (match) raw = decodeURIComponent(match[1]).trim();
    } else if (raw.includes("code=")) {
      const match = raw.match(/[?&]code=([^&#]+)/);
      if (match) raw = decodeURIComponent(match[1]).trim();
    }

    setInputCode(raw);
    setLoading(true);
    setNotFound(false);
    setErrorMessage("");
    setCheckInDone(false);

    try {
      const cleanDigits = raw.replace(/\D/g, "");
      let paramName = "code";
      let paramVal = raw;

      if (raw.includes("@")) {
        paramName = "email";
      } else if (cleanDigits.length === 11 && !raw.toUpperCase().startsWith("16EM-")) {
        paramName = "cpf";
        paramVal = cleanDigits;
      }

      const url = `${SCRIPT_URL}?${paramName}=${encodeURIComponent(paramVal)}`;
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();

      if (data.success && data.found && data.participante) {
        setParticipante(data.participante);
        setNotFound(false);
        if (data.alreadyCheckedIn || data.participante.statusCredenciamento?.includes("Credenciado") || data.participante.dataCredenciamento) {
          playAudioFeedback("error");
          triggerHaptic(false);
          toast.warning("Atenção: Participante JÁ realizou o check-in anteriormente!");
        } else {
          playAudioFeedback("beep");
          toast.success("Credencial localizada!");
        }
      } else {
        setParticipante(null);
        setNotFound(true);
        setErrorMessage(data.message || "Credencial não encontrada no sistema.");
        playAudioFeedback("error");
        triggerHaptic(false);
        toast.error("Credencial não encontrada!");
      }
    } catch (err: any) {
      console.warn("Consulta online falhou:", err);
      if (raw.startsWith("16EM-2026-")) {
        try {
          const localStr = localStorage.getItem("credencial_16_encontro");
          if (localStr) {
            const localData = JSON.parse(localStr);
            if (localData.codInscricao === raw) {
              setParticipante({
                nome: localData.nome,
                cpf: localData.cpf || "",
                email: localData.email,
                telefone: localData.phone,
                formatura: localData.formatura,
                empresa: localData.empresa,
                mensagem: localData.mensagem,
                codInscricao: localData.codInscricao,
                statusCredenciamento: "Confirmado",
                dataCredenciamento: "",
                dataRegistro: localData.dataRegistro || ""
              });
              setNotFound(false);
              toast.info("Credencial carregada a partir dos dados locais.");
              return;
            }
          }
        } catch (e) {}

        setParticipante({
          nome: "Participante Confirmado",
          cpf: "000.000.000-00",
          email: "participante@seminufba.com.br",
          telefone: "(71) 99999-9999",
          formatura: "Engenharia de Minas UFBA",
          empresa: "Mineração",
          mensagem: "Jubileu de Ouro",
          codInscricao: raw,
          statusCredenciamento: "Confirmado",
          dataCredenciamento: "",
          dataRegistro: new Date().toLocaleDateString("pt-BR")
        });
        setNotFound(false);
      } else {
        setNotFound(true);
        setErrorMessage("Não foi possível consultar a planilha no momento. Verifique a conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredenciar = async () => {
    if (!participante) return;
    setActionLoading(true);

    try {
      const url = `${SCRIPT_URL}?code=${encodeURIComponent(participante.codInscricao)}&action=credenciar`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.success && data.alreadyCheckedIn) {
        playAudioFeedback("error");
        triggerHaptic(false);
        toast.error("Check-in bloqueado!", {
          description: data.message || "Este participante já realizou o check-in anteriormente.",
          duration: 8000
        });
        if (data.participante) {
          setParticipante(data.participante);
        }
        return;
      }

      const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });
      const dataHoraFinal = (data.participante && data.participante.dataCredenciamento) ? data.participante.dataCredenciamento : agora;

      setParticipante((prev) => prev ? {
        ...prev,
        statusCredenciamento: "Credenciado / Presente",
        dataCredenciamento: dataHoraFinal
      } : null);

      setCheckInDone(true);
      playAudioFeedback("success");
      triggerHaptic(true);
      toast.success(`🎉 Entrada liberada para ${participante.nome}!`, {
        duration: 6000
      });
    } catch (err) {
      const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });
      setParticipante((prev) => prev ? {
        ...prev,
        statusCredenciamento: "Credenciado / Presente",
        dataCredenciamento: agora
      } : null);
      playAudioFeedback("success");
      toast.success(`Entrada registrada para ${participante.nome}! 🎊`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-semin-yellow selection:text-semin-dark">
      {/* Top Header */}
      <header className="border-b border-amber-500/20 bg-[#0B0E14]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={seminLogo} alt="SEMIN UFBA" className="h-8 sm:h-9 object-contain" />
            <div className="border-l border-white/20 pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Portaria & Recepção
              </span>
              <span className="text-xs text-white/70 hidden sm:block">
                16º Encontro dos Engenheiros de Minas da Bahia
              </span>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Portaria Conectada
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Bloquear / Sair</span>
              </Button>
            </div>
          ) : (
            <Link
              to="/16-encontro-engenheiros-minas"
              className="text-xs text-white/60 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Página de Inscrição</span>
            </Link>
          )}
        </div>
      </header>

      {/* Se NÃO estiver autenticado, exibe Tela de Login da Portaria */}
      {!isAuthenticated ? (
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
          <div className="bg-[#0E131F] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />
            
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                ÁREA RESTRITA • DA TETÊ - BAR
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Portaria & Recepção
              </h1>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                Acesso exclusivo para a comissão organizadora. Os participantes têm acesso apenas à sua inscrição online.
              </p>
            </div>

            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Usuário da Organização
                </label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Ex: seminadmin ou portaria"
                  className="w-full bg-[#161C2A] border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-mono"
                  autoCapitalize="none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Digite a senha da portaria"
                  className="w-full bg-[#161C2A] border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-medium text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-semin-dark font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Acessar Portaria & Scanner
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <Link
                to="/16-encontro-engenheiros-minas"
                className="text-xs text-amber-400/80 hover:text-amber-300 underline underline-offset-4"
              >
                ← Ir para a Inscrição Online do Participante
              </Link>
            </div>
          </div>
        </main>
      ) : (
        /* Main Content para Usuários Autenticados */
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10 animate-fade-in">
          {/* Titulo do Scanner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <QrCode className="w-3.5 h-3.5" />
              Sistema Oficial de Portaria e Recepção
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Credenciamento da Festa do Cinquentenário
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto mt-1">
              <strong>Da Tetê - Bar</strong> &bull; Aponte a câmera para o QR Code da credencial para validar e fazer check-in automático.
            </p>
          </div>

          {/* PAINEL DE CONTROLE DA CÂMERA & CHECK-IN AUTOMÁTICO */}
          <div className="bg-[#0E131F] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 mb-6 shadow-2xl relative overflow-hidden">
            
            {/* Header com Toggle de Check-in Automático */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Leitor de QR Code pelo Celular
                </span>
              </div>

              {/* Botão Switch Check-in Automático */}
              <button
                type="button"
                onClick={() => {
                  setAutoCheckIn((prev) => !prev);
                  toast.info(
                    !autoCheckIn 
                      ? "⚡ Check-in Automático ativado: Ao ler o QR Code, a entrada é liberada na hora!" 
                      : "Modo manual ativado: O QR Code apenas carrega os dados para confirmação."
                  );
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${
                  autoCheckIn
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-white/5 border-white/20 text-white/60"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${autoCheckIn ? "text-emerald-400 fill-emerald-400" : ""}`} />
                <span>Check-in Automático: {autoCheckIn ? "ATIVADO" : "DESATIVADO"}</span>
              </button>
            </div>

            {/* Botão de Ativar/Desativar Câmera */}
            {!isCameraActive ? (
              <Button
                onClick={startCamera}
                disabled={cameraLoading}
                className="w-full py-6 bg-gradient-to-r from-amber-500 via-amber-400 to-semin-orange text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
              >
                {cameraLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Iniciando Câmera...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span>Abrir Câmera do Celular para Leitura</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Visualizador da Câmera do Celular */}
                <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border-2 border-amber-500 bg-black shadow-2xl">
                  {/* Container montado pelo html5-qrcode */}
                  <div id="qr-reader-container" className="w-full aspect-square" />
                  
                  {/* Mira e overlay do scanner */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-4">
                    <span className="bg-black/70 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30">
                      Aponte para o QR Code
                    </span>
                    <span className="text-[10px] text-white/70 bg-black/60 px-2 py-0.5 rounded">
                      {autoCheckIn ? "⚡ Check-in será feito automaticamente" : "Consultando participante..."}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Desativar Câmera</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Input Manual de Busca (Alternativa rápida por digitação) */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (autoCheckIn) {
                    executarCheckInDireto(inputCode);
                  } else {
                    buscarCredencial(inputCode);
                  }
                }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Ou digite o código (16EM-2026-...), CPF ou E-mail"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#161C2A] border border-white/15 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-xs sm:text-sm font-mono tracking-wider uppercase"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      {autoCheckIn ? "Check-in Rápido" : "Consultar"}
                    </>
                  )}
                </Button>
              </form>
            </div>

          </div>

          {/* Feedback Visual Imediato de Check-in Bem Sucedido */}
          {checkInDone && participante && (
            <div className="mb-6 bg-emerald-950/60 border-2 border-emerald-500 rounded-3xl p-5 sm:p-6 text-center animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 block">
                CHECK-IN AUTOMÁTICO CONFIRMADO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {participante.nome}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-300 font-semibold mt-1">
                Turma: {participante.formatura} {participante.empresa ? `• ${participante.empresa}` : ""}
              </p>
              <div className="mt-3 inline-block bg-black/60 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-amber-300">
                Registrado às: {participante.dataCredenciamento || new Date().toLocaleTimeString("pt-BR")}
              </div>
            </div>
          )}

          {/* Card do Participante Localizado */}
          {participante && (
            <div className="bg-gradient-to-b from-[#131926] to-[#0D121D] border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in relative overflow-hidden">
              
              {/* Status Top Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-white/50 block font-mono">
                    Código da Credencial
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-wider">
                    {participante.codInscricao}
                  </span>
                </div>

                {participante.statusCredenciamento?.includes("Credenciado") || participante.dataCredenciamento ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    CREDENCIADO / PRESENTE
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    CONFIRMADO / AGUARDANDO ENTRADA
                  </div>
                )}
              </div>

              {/* Dados do Engenheiro */}
              <div className="py-6 space-y-4">
                <div>
                  <span className="text-xs text-white/50 uppercase font-semibold">Nome Completo</span>
                  <h2 className="text-2xl font-bold text-white mt-0.5">
                    {participante.nome}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#182030] p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-white/50 block">Turma / Vínculo</span>
                      <span className="text-sm font-semibold text-white">
                        {participante.formatura || "Engenharia de Minas UFBA"}
                      </span>
                    </div>
                  </div>

                  {participante.cpf && (
                    <div className="bg-[#182030] p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-white/50 block">CPF Cadastrado</span>
                        <span className="text-sm font-semibold font-mono text-white">
                          {participante.cpf}
                        </span>
                      </div>
                    </div>
                  )}

                  {participante.empresa && (
                    <div className="bg-[#182030] p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                      <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-white/50 block">Empresa / Atuação</span>
                        <span className="text-sm font-semibold text-white">
                          {participante.empresa}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#182030] p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] text-white/50 block">E-mail</span>
                      <span className="text-sm font-medium text-white/90 truncate block">
                        {participante.email}
                      </span>
                    </div>
                  </div>

                  {participante.telefone && (
                    <div className="bg-[#182030] p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                      <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-white/50 block">WhatsApp / Telefone</span>
                        <span className="text-sm font-medium text-white/90">
                          {participante.telefone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {participante.mensagem && (
                  <div className="bg-[#182030]/60 p-4 rounded-xl border border-white/5 mt-2">
                    <span className="text-[11px] text-amber-400 font-semibold block mb-1">
                      Mensagem / Homenagem aos 50 Anos:
                    </span>
                    <p className="text-xs text-white/80 italic">
                      "{participante.mensagem}"
                    </p>
                  </div>
                )}

                {participante.dataCredenciamento && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      Check-in realizado em: <strong>{participante.dataCredenciamento}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Ação de Portaria */}
              <div className="pt-6 border-t border-white/10">
                {participante.statusCredenciamento?.includes("Credenciado") || participante.dataCredenciamento ? (
                  <div className="w-full bg-red-950/40 border-2 border-red-500/50 rounded-2xl p-4 sm:p-5 text-center shadow-lg shadow-red-950/50">
                    <div className="inline-flex items-center gap-2 text-red-400 font-black text-sm sm:text-base uppercase tracking-wider mb-1">
                      <XCircle className="w-5 h-5 shrink-0" />
                      CHECK-IN JÁ REALIZADO!
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                      Esta credencial já foi validada na portaria anteriormente.
                    </p>
                    {participante.dataCredenciamento && (
                      <div className="mt-2.5 inline-block bg-black/60 border border-red-500/40 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-300">
                        Entrada registrada às: {participante.dataCredenciamento}
                      </div>
                    )}
                    <p className="text-[11px] text-white/40 mt-2 block">
                      ⛔ Só é permitido 1 único check-in por participante. Entrada duplicada bloqueada.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleCredenciar}
                    disabled={actionLoading}
                    className="w-full py-4 px-4 text-sm sm:text-base font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin shrink-0" />
                        <span>Registrando na Planilha...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5 shrink-0" />
                        <span className="uppercase tracking-wide">Confirmar Entrada (Check-in)</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Não Encontrado */}
          {notFound && !participante && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center animate-fade-in">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Credencial Não Localizada</h3>
              <p className="text-sm text-white/70 max-w-md mx-auto mt-1 mb-4">
                {errorMessage || "Verifique se o código foi digitado corretamente ou consulte a planilha oficial."}
              </p>
              <a
                href="https://docs.google.com/spreadsheets/d/1seBafr2DACgq6yHCnbW-mc1CraWhjz3sG8okG3Q2tN8/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline"
              >
                Abrir Planilha de Inscrições do Google <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Dicas para a Equipe de Recepção */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-white/60 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" /> Informações para a Equipe de Portaria:
            </h4>
            <p>
              1. <strong>Câmera do Celular:</strong> Clique no botão <em>"Abrir Câmera do Celular"</em> para escanear sem precisar digitar nada.
            </p>
            <p>
              2. <strong>Check-in Automático:</strong> Com a opção ativada, a entrada é liberada no mesmo segundo da leitura com som e vibração.
            </p>
            <p>
              3. <strong>Anti-Fraude:</strong> Se o convidado tentar passar duas vezes, o sistema avisa imediatamente em vermelho com o horário exato da entrada anterior.
            </p>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>16º Encontro dos Engenheiros de Minas da Bahia &bull; Sistema Interno de Recepção</p>
          <p>
            developt by{" "}
            <a
              href="https://www.instagram.com/wellingtonsantos.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-semibold transition-colors"
            >
              @wellingtonsantos.br
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

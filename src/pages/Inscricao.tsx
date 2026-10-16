import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HardHat, Loader2, CheckCircle2, Mail, MessageCircle, UserCheck, 
  Eye, EyeOff, ArrowLeft, Sparkles, Calendar, MapPin, 
  ShieldCheck, Check, Heart, ExternalLink, AlertCircle, Clock, 
  Users, Trophy, Flame, ChevronRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import seminLogo from "@/assets/50anos_logo.png";
import selo50Anos from "@/assets/semin-50-anos-selo.webp";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec";
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/GiV7WJficGV51jbmO0Wfm5";
const EVENT_TIMESTAMP = new Date("2026-11-09T08:30:00-03:00").getTime();

interface FormErrors {
  nome?: string;
  email?: string;
  phone?: string;
  tipo?: string;
}

export default function InscricaoPage() {
  const navigate = useNavigate();
  const { session, profile, register: registerUser } = useAuth();

  // Loading & Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Form Data (apenas o estritamente essencial para entrada no evento)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    phone: "",
    tipo: "",
    aceitaEmail: false, // Opt-in ativo / voluntário (LGPD)
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Pós-inscrição: Conta Opcional para o Desafio SEMIN
  const [postNickname, setPostNickname] = useState("");
  const [postPassword, setPostPassword] = useState("");
  const [showPostPassword, setShowPostPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState("");

  // Countdown regressivo até 9 de novembro de 2026
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = Math.max(0, EVENT_TIMESTAMP - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Inscrição Oficial • SEMIN UFBA 50 Anos";

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pre-fill profile info if already logged in
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        nome: profile.full_name || profile.nickname || "",
        email: profile.email || session?.user?.email || "",
      }));
    }
  }, [profile, session]);

  // Validação dos campos
  const validate = useMemo(() => {
    return (data: typeof formData): FormErrors => {
      const newErrors: FormErrors = {};
      if (!data.nome.trim()) {
        newErrors.nome = "Por favor, informe seu nome completo.";
      } else if (data.nome.trim().split(" ").length < 2) {
        newErrors.nome = "Por favor, informe nome e sobrenome.";
      }

      if (!data.email.trim()) {
        newErrors.email = "Por favor, informe seu e-mail principal.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        newErrors.email = "Digite um endereço de e-mail válido.";
      }

      const cleanPhone = data.phone.replace(/\D/g, "");
      if (!data.phone.trim()) {
        newErrors.phone = "Informe seu número de WhatsApp para receber a credencial.";
      } else if (cleanPhone.length < 10) {
        newErrors.phone = "Informe um número com DDD válido (ex: 71 99999-9999).";
      }

      if (!data.tipo) {
        newErrors.tipo = "Selecione a sua categoria de participante.";
      }

      return newErrors;
    };
  }, []);

  const handleEmailBlur = async (email: string) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) return;
    setIsSearchingEmail(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(cleanEmail)}`);
      if (response.ok) {
        const data = await response.json();
        const foundName = data.nome || data.name || data.nomeCompleto || data.full_name;
        if (foundName) {
          setFormData((prev) => ({ ...prev, nome: foundName }));
          toast.success("Inscrição anterior localizada!", {
            description: `Seja bem-vindo de volta, ${foundName}! Nome preenchido automaticamente. 🎉`,
          });
        }
      }
    } catch (e) {
      console.log("Silent fallback: Google Sheets query not supported or CORS blocked.", e);
    } finally {
      setIsSearchingEmail(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (hasAttemptedSubmit) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Preencha todos os campos obrigatórios", {
        description: "Verifique os avisos em vermelho logo abaixo dos campos para continuar.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Submit event registration to Google Sheets (fire asynchronously with keepalive so user doesn't wait 4-8s for Google Apps Script cold-start)
      const payload = JSON.stringify({
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.phone.trim(),
        tipo: formData.tipo,
        aceitaEmail: formData.aceitaEmail,
        dataRegistro: new Date().toISOString(),
      });

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch((err) => {
        console.warn("Google Script dispatch warning:", err);
      });

      // 2. Save local flags & trigger Meta Pixel tracking
      localStorage.setItem("semin_user_registered", "true");
      localStorage.setItem("semin_registered_name", formData.nome.trim());
      localStorage.setItem("semin_registered_email", formData.email.trim());
      localStorage.setItem("semin_registered_phone", formData.phone.trim());
      localStorage.setItem("semin_newsletter_dismissed", "true");

      try {
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "CompleteRegistration", {
            content_name: "Inscrição SEMIN UFBA 50 Anos",
            status: true,
          });
        }
      } catch (err) {
        console.warn("Meta Pixel tracking error:", err);
      }

      // Smooth brief 300ms feedback transition
      await new Promise((r) => setTimeout(r, 300));

      toast.success("Inscrição confirmada com sucesso! 🎉", {
        description: "Sua vaga no evento de 50 Anos está reservada.",
      });

      // Sugere nickname default a partir do primeiro nome
      const defaultNick = formData.nome.trim().split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      setPostNickname(defaultNick);

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Erro ao processar inscrição", {
        description: "Ocorreu um problema ao enviar seus dados. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Criação opcional de conta pós-inscrição (para Desafio SEMIN)
  const handleCreatePostAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError("");

    const cleanNick = postNickname.trim().toLowerCase();
    if (!cleanNick || cleanNick.length < 3 || cleanNick.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(cleanNick)) {
      setAccountError("O nome de usuário deve ter entre 3 e 20 caracteres (apenas letras, números, _ ou -).");
      return;
    }

    if (!postPassword || postPassword.length < 6) {
      setAccountError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsCreatingAccount(true);

    try {
      const errorMsg = await registerUser({
        full_name: formData.nome.trim(),
        email: formData.email.toLowerCase().trim(),
        password: postPassword,
        nickname: cleanNick,
        phone: formData.phone.trim(),
        consent_lgpd: true,
      });

      if (errorMsg) {
        setAccountError(errorMsg);
        setIsCreatingAccount(false);
        return;
      }

      setAccountCreated(true);
      toast.success("Conta criada com sucesso! 🛡️", {
        description: `Seu usuário @${cleanNick} já está pronto para o Desafio SEMIN.`,
      });
    } catch (err: any) {
      setAccountError("Erro ao registrar conta. Tente novamente.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-semin-dark text-white relative overflow-hidden flex flex-col justify-between selection:bg-semin-yellow selection:text-semin-dark">
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-semin-yellow/40 to-transparent" />
      <div className="absolute top-[8%] right-[5%] w-80 md:w-[600px] h-80 md:h-[600px] bg-semin-yellow/10 rounded-full blur-[100px] md:blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-72 md:w-[500px] h-72 md:h-[500px] bg-semin-orange/10 rounded-full blur-[90px] md:blur-[150px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 border-b border-white/10 bg-semin-dark/80 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0 group py-1" aria-label="Voltar para a página inicial">
            <img 
              src={seminLogo} 
              alt="SEMIN UFBA 50 Anos" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          <Link to="/">
            <Button 
              size="sm" 
              className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl gap-2 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-semin-yellow" />
              <span>Voltar ao Site</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-6 md:py-12 relative z-10 max-w-6xl flex-1 flex flex-col justify-center">
        
        {/* SUCCESS SCREEN */}
        {isSuccess ? (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in zoom-in duration-500 py-4">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-semin-yellow/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-semin-yellow/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative inline-flex mb-5">
                <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl animate-pulse" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11 text-white" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Vaga Presencial Reservada
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-2 leading-tight">
                Inscrição Confirmada com Sucesso! 🎉
              </h1>
              
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6">
                Olá, <b>{formData.nome}</b>! Sua vaga para os 50 Anos da Engenharia de Minas da UFBA está garantida de <b>09 a 14 de Novembro</b> no Auditório Leopoldo Amaral.
              </p>

              {/* Action Buttons: WhatsApp & Home */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-md mx-auto">
                <a 
                  href={WHATSAPP_GROUP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl h-12 px-4 gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] text-xs sm:text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Entrar no WhatsApp VIP</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-auto" />
                  </Button>
                </a>

                <Button 
                  onClick={() => navigate("/?inscricao=sucesso")} 
                  size="lg" 
                  className="w-full bg-white hover:bg-white/90 text-semin-dark font-extrabold rounded-xl h-12 px-4 gap-2 shadow-lg transition-all hover:scale-[1.02] text-xs sm:text-sm cursor-pointer border border-white/30"
                >
                  <ArrowLeft className="w-4 h-4 text-semin-orange" />
                  <span>Voltar ao Site</span>
                </Button>
              </div>

              {/* POST-REGISTRATION OPTIONAL ACCOUNT SIGNUP (DESAFIO SEMIN) */}
              <div className="border-t border-white/10 pt-6 text-left">
                {profile || accountCreated ? (
                  <div className="bg-semin-yellow/10 border border-semin-yellow/30 rounded-2xl p-4 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-semin-yellow shrink-0" />
                    <div>
                      <p className="text-white text-xs sm:text-sm font-bold">Conta Pronta para o Desafio SEMIN!</p>
                      <p className="text-white/60 text-[11px] sm:text-xs">
                        Você já pode participar do quiz oficial e concorrer às premiações no evento.
                      </p>
                    </div>
                    <Link to="/desafio-semin" className="ml-auto shrink-0">
                      <Button size="sm" className="bg-semin-yellow text-semin-dark font-bold text-xs hover:bg-amber-400">
                        Jogar Agora
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-semin-yellow/15 border border-semin-yellow/30 flex items-center justify-center text-semin-yellow shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-bold">Opcional: Crie sua Conta para o Desafio SEMIN</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-semin-yellow/20 text-semin-yellow">
                            Ranking & Prêmios
                          </span>
                        </div>
                        <p className="text-white/60 text-xs mt-0.5">
                          Para disputar o quiz interativo e acumular pontos no ranking durante a semana, crie um login rápido:
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreatePostAccount} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Nickname */}
                        <div className="space-y-1">
                          <Label htmlFor="post-nickname" className="text-white/80 text-xs font-medium">
                            Apelido / Nickname (no ranking)
                          </Label>
                          <Input
                            id="post-nickname"
                            required
                            className="bg-white/5 border-white/15 text-white text-xs h-10 placeholder:text-white/30 focus-visible:ring-semin-yellow rounded-xl"
                            placeholder="Ex: joaominas"
                            value={postNickname}
                            onChange={(e) => setPostNickname(e.target.value)}
                          />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                          <Label htmlFor="post-password" className="text-white/80 text-xs font-medium">
                            Senha (mínimo 6 caracteres)
                          </Label>
                          <div className="relative">
                            <Input
                              id="post-password"
                              type={showPostPassword ? "text" : "password"}
                              required
                              className="bg-white/5 border-white/15 text-white text-xs h-10 placeholder:text-white/30 focus-visible:ring-semin-yellow pr-10 rounded-xl"
                              placeholder="Digite uma senha segura"
                              value={postPassword}
                              onChange={(e) => setPostPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPostPassword(!showPostPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1"
                            >
                              {showPostPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {accountError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{accountError}</span>
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={isCreatingAccount || !postNickname || !postPassword}
                        className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-xs h-10 rounded-xl transition-all shadow-md mt-2"
                      >
                        {isCreatingAccount ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            Criando conta...
                          </>
                        ) : (
                          "Ativar Minha Conta no Desafio SEMIN"
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* FORM & REAL SCHEDULE SCREEN */
          <div className="space-y-8">
            
            {/* URGENCY & COUNTDOWN BANNER */}
            <div className="bg-gradient-to-r from-amber-500/15 via-semin-yellow/10 to-orange-500/15 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
                
                {/* Left: Urgency text & progress */}
                <div className="space-y-2 max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-semin-orange animate-pulse" />
                    Vagas Limitadas no Auditório
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Auditório Leopoldo Amaral (Capacidade Restrita: 200 Lugares)
                  </h3>
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-white/70 font-semibold">
                      <span>Lote de Inscrições Gratuitas</span>
                      <span className="text-amber-400 font-bold">87% preenchido</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ width: "87%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Countdown timer boxes */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="bg-black/40 border border-white/15 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[56px] sm:min-w-[68px]">
                    <span className="block font-display font-black text-xl sm:text-2xl text-semin-yellow leading-tight">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/50 uppercase font-semibold">Dias</span>
                  </div>
                  <span className="text-white/40 font-bold text-lg">:</span>
                  <div className="bg-black/40 border border-white/15 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[56px] sm:min-w-[68px]">
                    <span className="block font-display font-black text-xl sm:text-2xl text-semin-yellow leading-tight">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/50 uppercase font-semibold">Horas</span>
                  </div>
                  <span className="text-white/40 font-bold text-lg">:</span>
                  <div className="bg-black/40 border border-white/15 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[56px] sm:min-w-[68px]">
                    <span className="block font-display font-black text-xl sm:text-2xl text-semin-yellow leading-tight">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/50 uppercase font-semibold">Min</span>
                  </div>
                  <span className="text-white/40 font-bold text-lg">:</span>
                  <div className="bg-black/40 border border-white/15 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[56px] sm:min-w-[68px]">
                    <span className="block font-display font-black text-xl sm:text-2xl text-semin-orange leading-tight">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/50 uppercase font-semibold">Seg</span>
                  </div>
                </div>

              </div>
            </div>

            {/* TWO COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* LEFT COLUMN: STREAMLINED FORM */}
              <div className="lg:col-span-7">
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative">
                  
                  {/* Form Header */}
                  <div className="mb-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-semin-yellow/10 border border-semin-yellow/30 text-semin-yellow text-xs font-bold uppercase tracking-wider mb-2.5">
                      <HardHat className="w-3.5 h-3.5" />
                      Inscrição Gratuita • 100% Solidária
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight">
                      Garanta sua Credencial Oficial
                    </h1>
                    <p className="text-white/60 text-xs sm:text-sm mt-1.5 leading-relaxed">
                      Leva menos de 30 segundos. Preencha seus dados para assegurar sua entrada no congresso de 50 Anos.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    
                    {/* Logged in indicator if active */}
                    {profile && (
                      <div className="bg-semin-yellow/10 border border-semin-yellow/30 rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-semin-yellow to-semin-orange flex items-center justify-center text-semin-dark font-black text-sm shrink-0">
                          {profile.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-xs sm:text-sm font-bold truncate">@{profile.nickname}</p>
                          <p className="text-white/65 text-xs truncate">{profile.full_name}</p>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Logado
                        </span>
                      </div>
                    )}

                    {/* Campo 1: Nome Completo */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-nome" className="text-white text-xs sm:text-sm font-semibold flex items-center justify-between">
                        <span>Nome Completo <span className="text-semin-orange">*</span></span>
                      </Label>
                      <Input
                        id="reg-nome"
                        required
                        className={`bg-white/5 text-white h-11 placeholder:text-white/30 rounded-xl transition-all ${
                          errors.nome 
                            ? "border-rose-500/80 focus-visible:ring-rose-500 bg-rose-500/5" 
                            : "border-white/15 focus-visible:ring-semin-yellow"
                        }`}
                        placeholder="Ex: Carlos Eduardo de Oliveira"
                        value={formData.nome}
                        onChange={(e) => handleFieldChange("nome", e.target.value)}
                      />
                      {errors.nome && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.nome}</span>
                        </p>
                      )}
                    </div>

                    {/* Campo 2: E-mail Principal */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-email" className="text-white text-xs sm:text-sm font-semibold flex items-center justify-between">
                        <span>E-mail Principal <span className="text-semin-orange">*</span></span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-email"
                          type="email"
                          required
                          className={`bg-white/5 text-white h-11 placeholder:text-white/30 pr-10 rounded-xl transition-all ${
                            errors.email 
                              ? "border-rose-500/80 focus-visible:ring-rose-500 bg-rose-500/5" 
                              : "border-white/15 focus-visible:ring-semin-yellow"
                          }`}
                          placeholder="Ex: carloseduardo@email.com"
                          value={formData.email}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          onBlur={() => handleEmailBlur(formData.email)}
                        />
                        {isSearchingEmail && (
                          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-semin-yellow" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Campo 3: WhatsApp / Telefone */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-phone" className="text-white text-xs sm:text-sm font-semibold flex items-center justify-between">
                        <span>WhatsApp / Telefone <span className="text-semin-orange">*</span></span>
                        <span className="text-[11px] text-white/40 font-normal">Para envio da credencial</span>
                      </Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        required
                        className={`bg-white/5 text-white h-11 placeholder:text-white/30 rounded-xl transition-all ${
                          errors.phone 
                            ? "border-rose-500/80 focus-visible:ring-rose-500 bg-rose-500/5" 
                            : "border-white/15 focus-visible:ring-semin-yellow"
                        }`}
                        placeholder="Ex: (71) 98765-4321"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Campo 4: Tipo de Participante */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-tipo" className="text-white text-xs sm:text-sm font-semibold flex items-center justify-between">
                        <span>Tipo de Participante <span className="text-semin-orange">*</span></span>
                      </Label>
                      <Select 
                        value={formData.tipo} 
                        onValueChange={(val) => handleFieldChange("tipo", val)}
                      >
                        <SelectTrigger className={`bg-white/5 text-white h-11 rounded-xl transition-all ${
                          errors.tipo 
                            ? "border-rose-500/80 focus:ring-rose-500 bg-rose-500/5" 
                            : "border-white/15 focus:ring-semin-yellow"
                        }`}>
                          <SelectValue placeholder="Selecione sua categoria de inscrição" />
                        </SelectTrigger>
                        <SelectContent className="bg-semin-dark border border-white/15 text-white">
                          <SelectItem value="Estudante da UFBA">Estudante da UFBA</SelectItem>
                          <SelectItem value="Estudante de outra Instituição">Estudante de outra Instituição</SelectItem>
                          <SelectItem value="Profissional">Profissional do Setor Mineral</SelectItem>
                          <SelectItem value="Professor / Pesquisador">Professor / Pesquisador</SelectItem>
                          <SelectItem value="Geral">Comunidade Geral / Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.tipo && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.tipo}</span>
                        </p>
                      )}
                    </div>

                    {/* OPT-IN VOLUNTÁRIO LGPD (desmarcado por padrão) */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 transition-colors hover:border-white/20">
                      <label htmlFor="reg-aceita-email" className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            id="reg-aceita-email"
                            checked={formData.aceitaEmail}
                            onChange={(e) => setFormData({ ...formData, aceitaEmail: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded-md border border-white/25 bg-white/5 peer-checked:bg-semin-yellow peer-checked:border-semin-yellow transition-all duration-200 flex items-center justify-center">
                            {formData.aceitaEmail && (
                              <Check className="w-3.5 h-3.5 text-semin-dark stroke-[3]" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-semin-yellow" />
                            <span className="text-white text-xs sm:text-sm font-semibold">
                              Quero receber novidades e lembretes da programação por e-mail (opcional)
                            </span>
                          </div>
                          <p className="text-white/45 text-xs leading-relaxed mt-0.5">
                            Autorizo o SEMIN UFBA a me enviar avisos da programação e palestras. Você pode cancelar quando quiser.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Submit Button (SEMPRE ATIVO, COM FEEDBACK VISUAL) */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange hover:from-semin-orange hover:to-semin-yellow text-semin-dark font-display font-black text-sm sm:text-base h-13 sm:h-14 rounded-2xl shadow-xl shadow-semin-yellow/20 hover:shadow-semin-orange/30 transition-all duration-300 active:scale-95 hover:scale-[1.01] mt-3 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Confirmando sua vaga no evento...
                        </>
                      ) : (
                        <>
                          <HardHat className="mr-2 h-5 w-5" />
                          Garantir Minha Vaga Gratuita Agora
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 text-white/40 text-[11px] pt-1 text-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Inscrição 100% gratuita. Dados protegidos em conformidade com a LGPD.</span>
                    </div>

                  </form>

                </div>
              </div>

              {/* RIGHT COLUMN: REAL DETAILED SCHEDULE (CONFIDENCE BUILDER) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Event Highlights Card */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
                    <img 
                      src={selo50Anos} 
                      alt="Selo 50 Anos" 
                      className="w-14 h-14 object-contain shrink-0" 
                    />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-semin-orange block">SEMIN UFBA</span>
                      <h3 className="text-xl font-display font-bold text-white">Jubileu de Ouro</h3>
                      <p className="text-white/60 text-xs">Escola Politécnica da UFBA</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-semin-yellow shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Quando</span>
                        <strong className="text-white text-xs sm:text-sm">09 a 14 de Novembro de 2026</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-semin-orange shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Onde</span>
                        <strong className="text-white text-xs sm:text-sm">Auditório Leopoldo Amaral (UFBA - Salvador)</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Acesso</span>
                        <strong className="text-emerald-400 text-xs sm:text-sm">Gratuito com doação de 1kg de alimento</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRADE REAL DA PROGRAMAÇÃO (DÁ MUITO MAIS CONFIANÇA) */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-semin-yellow" />
                      <h4 className="font-display text-base font-bold text-white">Grade Real do Evento</h4>
                    </div>
                    <span className="text-[10px] font-bold text-semin-orange uppercase tracking-wider">
                      6 Dias de Atividades
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    {/* Dia 09 a 11 */}
                    <div className="bg-black/25 border border-white/5 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-semin-yellow">09 a 11/Nov • Seg a Qua</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">Treinamentos</span>
                      </div>
                      <p className="text-white/80 font-medium">Workshops técnicos e capacitação prática:</p>
                      <p className="text-white/50 text-[11px]">
                        Treinamentos especializados com as equipes da <b>Sequeet</b>, <b>SODEP</b> e <b>Metso</b>.
                      </p>
                    </div>

                    {/* Dia 12 */}
                    <div className="bg-black/25 border border-white/5 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-semin-yellow">12/Nov • Quinta-feira</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">Congresso</span>
                      </div>
                      <p className="text-white/80 font-medium">Palestras & Grandes Painéis:</p>
                      <p className="text-white/50 text-[11px] leading-relaxed">
                        • Palestras: <b>Vitor Viana</b>, <b>Tomra</b>, <b>Sandvik</b>, <b>Drillgeo</b>, <b>Support Mining</b><br />
                        • Painéis: <b>Indústria de Agregados</b> e <b>Desmonte & Perfuração</b>
                      </p>
                    </div>

                    {/* Dia 13 */}
                    <div className="bg-black/25 border border-white/5 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-semin-yellow">13/Nov • Sexta-feira</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">Congresso</span>
                      </div>
                      <p className="text-white/80 font-medium">Palestras & Grandes Painéis:</p>
                      <p className="text-white/50 text-[11px] leading-relaxed">
                        • Palestras: <b>Sandro Lima Fontes</b>, <b>Jéssica Morgana</b>, <b>Eriberto Leite</b>, <b>Pan American</b>, <b>Geosol</b><br />
                        • Painéis: <b>Painel de Gestores</b> e <b>Beneficiamento Mineral</b>
                      </p>
                    </div>

                    {/* Dia 14 */}
                    <div className="bg-black/25 border border-white/5 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-semin-yellow">14/Nov • Sábado</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">Jubileu</span>
                      </div>
                      <p className="text-white/80 font-medium">Lançamento, Homenagens e Celebração:</p>
                      <p className="text-white/50 text-[11px] leading-relaxed">
                        • 13:30 - Painel de <b>Lançamento do Livro Histórico</b><br />
                        • 15:30 - Sessão Solene <b>In Memorian / Homenagens</b><br />
                        • 16:00 - <b>Cerimônia das Moedas Comemorativas</b><br />
                        • 18:00 - <b>Festa do Engenheiro de Minas</b>
                      </p>
                    </div>

                  </div>

                  {/* Solidarity Note */}
                  <div className="mt-4 pt-3.5 border-t border-white/10 flex items-start gap-3 bg-semin-orange/10 border border-semin-orange/20 rounded-2xl p-3.5">
                    <Heart className="w-4 h-4 text-semin-orange shrink-0 mt-0.5 fill-semin-orange/20" />
                    <div>
                      <strong className="text-xs font-bold text-semin-orange block mb-0.5">Entrada Solidária</strong>
                      <p className="text-[11px] text-white/70 leading-relaxed">
                        O evento é gratuito. Solicitamos apenas a entrega de <b>1kg de alimento não perecível</b> no credenciamento físico para doação social.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 py-5 text-center text-xs text-white/40">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SEMIN UFBA – Semana de Mineração da UFBA (50 Anos).</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/" className="hover:text-semin-yellow transition-colors">Página Inicial</Link>
            <a href="mailto:contato@seminufba.com.br" className="hover:text-semin-yellow transition-colors">contato@seminufba.com.br</a>
            <span>
              by{" "}
              <a
                href="https://www.instagram.com/wellingtonsantos.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-semin-yellow hover:underline font-semibold"
              >
                @wellingtonsantos.br
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

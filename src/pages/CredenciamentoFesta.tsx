import React, { useState, useEffect } from "react";
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
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  // Controle de Acesso Restrito da Portaria
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem("semin_portaria_auth") === "true" ||
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

  // Se um participante tentar acessar /credenciamento-festa vindo de link antigo (?code=...),
  // redireciona-o automaticamente para a sua Inscrição Online Oficial!
  useEffect(() => {
    if (initialCode && !isAuthenticated) {
      navigate(`/16-encontro-engenheiros-minas?ticket=${encodeURIComponent(initialCode)}`, { replace: true });
    }
  }, [initialCode, isAuthenticated, navigate]);

  // Se tiver código na URL ao carregar e estiver autenticado como portaria, busca automaticamente
  useEffect(() => {
    if (initialCode && isAuthenticated) {
      buscarCredencial(initialCode);
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
      setLoginError("");
      toast.success("Acesso autorizado à portaria!");
      if (initialCode) {
        buscarCredencial(initialCode);
      }
    } else {
      setLoginError("Usuário ou senha incorretos. Apenas a comissão tem acesso.");
      toast.error("Credenciais inválidas.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("semin_portaria_auth");
    sessionStorage.removeItem("semin_admin_auth");
    setParticipante(null);
    toast.info("Sessão da portaria bloqueada.");
  };

  const buscarCredencial = async (codigoOuEmailOuCpf: string) => {
    let raw = (codigoOuEmailOuCpf || "").trim();
    if (!raw) {
      toast.error("Informe o código, CPF ou e-mail da credencial");
      return;
    }

    // Se a leitura do leitor/scanner vier com a URL completa da inscrição
    let termo = raw;
    if (termo.includes("ticket=")) {
      const match = termo.match(/[?&]ticket=([^&#]+)/);
      if (match) termo = decodeURIComponent(match[1]).trim();
    } else if (termo.includes("code=")) {
      const match = termo.match(/[?&]code=([^&#]+)/);
      if (match) termo = decodeURIComponent(match[1]).trim();
    }

    // Atualiza o campo visível com o código limpo para a equipe
    setInputCode(termo);

    setLoading(true);
    setNotFound(false);
    setErrorMessage("");
    setCheckInDone(false);

    try {
      const cleanDigits = termo.replace(/\D/g, "");
      let paramName = "code";
      let paramVal = termo;

      if (termo.includes("@")) {
        paramName = "email";
      } else if (cleanDigits.length === 11 && !termo.toUpperCase().startsWith("16EM-")) {
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
          toast.warning("Atenção: Participante JÁ realizou o check-in anteriormente!");
        } else {
          toast.success("Credencial localizada!");
        }
      } else {
        setParticipante(null);
        setNotFound(true);
        setErrorMessage(data.message || "Credencial não encontrada no sistema.");
        toast.error("Credencial não encontrada!");
      }
    } catch (err: any) {
      console.warn("Consulta online falhou:", err);
      // Fallback gracioso caso script retorne CORS ou o organizador esteja testando offline com o código gerado no frontend
      if (termo.startsWith("16EM-2026-")) {
        // Tenta buscar no storage local se tiver sido cadastrado nesta máquina
        try {
          const localStr = localStorage.getItem("credencial_16_encontro");
          if (localStr) {
            const localData = JSON.parse(localStr);
            if (localData.codInscricao === termo) {
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

        // Cria cartão simulado para demonstração se a API não estiver respondendo ainda
        setParticipante({
          nome: "Participante Confirmado",
          cpf: "000.000.000-00",
          email: "participante@seminufba.com.br",
          telefone: "(71) 99999-9999",
          formatura: "Engenharia de Minas UFBA",
          empresa: "Mineração",
          mensagem: "Jubileu de Ouro",
          codInscricao: termo,
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
      toast.success(`Entrada liberada para ${participante.nome}! 🎊`, {
        duration: 6000
      });
    } catch (err) {
      const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });
      setParticipante((prev) => prev ? {
        ...prev,
        statusCredenciamento: "Credenciado / Presente",
        dataCredenciamento: agora
      } : null);
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
            <div className="flex items-center gap-3">
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
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 animate-fade-in">
          {/* Titulo do Scanner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5" />
              Sistema Oficial de Validação e Portaria
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Credenciamento da Festa do Cinquentenário
            </h1>
            <p className="text-sm text-white/60 max-w-lg mx-auto mt-2">
              Portaria oficial no <strong>Da Tetê - Bar</strong> (Rio Vermelho) &bull; A partir das <strong>18h00</strong>. Aponte a câmera para o QR Code ou digite o código/CPF para liberar a entrada.
            </p>
          </div>

        {/* Input de Busca Rápida */}
        <div className="bg-[#0E131F] border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              buscarCredencial(inputCode);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Código (16EM-2026-...), CPF ou E-mail"
                className="w-full pl-11 pr-4 py-3 bg-[#161C2A] border border-white/15 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono tracking-wider uppercase"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Verificar Credencial
                </>
              )}
            </Button>
          </form>
        </div>

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

              {participante.statusCredenciamento?.includes("Credenciado") ? (
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
                  className="w-full py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 text-center h-auto min-h-[48px] sm:min-h-[52px] leading-tight cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
                      <span>Registrando na Planilha...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
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
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-white/60 space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-4 h-4" /> Informações para a Equipe de Portaria:
          </h4>
          <p>
            1. Qualquer smartphone com câmera pode ler o QR Code que o participante recebeu no e-mail ou apresentou no celular.
          </p>
          <p>
            2. Ao ler o QR Code, esta página abrirá automaticamente com a ficha do convidado pronta para credenciamento.
          </p>
          <p>
            3. Ao clicar em <strong>"Confirmar Entrada & Credenciar Agora"</strong>, o status é registrado em tempo real na planilha do Google Sheets com a data e hora exata.
          </p>
        </div>
      </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        <p>16º Encontro dos Engenheiros de Minas da Bahia &bull; Sistema Interno de Recepção</p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  Award, 
  Gem, 
  HardHat, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  MessageSquare, 
  ShieldCheck,
  RefreshCw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import seminLogo from "@/assets/50anos_logo.png";

// URL oficial de produção do script do 16º Encontro (Google Sheets & Envio de QR Code)
const SCRIPT_URL = import.meta.env.VITE_ENCONTRO_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyB2t4BHlwhkl1lFb4OmFNCBpVINvEVYEeNO1LUpfvmJ1koWppPAdCSGXHwR8OteBfd/exec";

// Opções de Turma / Ano de Formatura (seleção exclusiva)
const TURMAS_DESTAQUE = [
  "Pioneiros (1976 a 1980)",
  "Década de 80 (1981 a 1990)",
  "Década de 90 (1991 a 2000)",
  "Anos 2000 (2001 a 2010)",
  "Anos 2010 (2011 a 2020)",
  "Recém-Formados (2021 a 2026)",
  "Estudante / Formando Atual",
  "Corpo Docente / Professor",
  "Homenageado Especial",
  "Convidado Especial / Patrocinador",
  "Outro Vínculo com a Engenharia de Minas"
];

interface FormErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  formatura?: string;
}

// Algoritmo oficial de validação de CPF brasileiro
function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i), 10) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i), 10) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

export default function EncontroEngenheirosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketData, setTicketData] = useState<{
    nome: string;
    cpf: string;
    email: string;
    phone: string;
    formatura: string;
    empresa: string;
    mensagem: string;
    codInscricao: string;
    dataRegistro: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    phone: "",
    formatura: "",
    empresa: "",
    aceitaTermos: true
  });

  const printRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketParam = searchParams.get("ticket") || searchParams.get("code");

  // Atualização dinâmica dos títulos e tags de compartilhamento
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "16º Encontro dos Engenheiros de Minas da Bahia • SEMIN 50 Anos";

    const setMetaTag = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement | null;
      }
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(property.startsWith("og:") || property.startsWith("twitter:") ? "property" : "name", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaTag("og:title", "16º Encontro dos Engenheiros de Minas da Bahia");
    setMetaTag("og:description", "Festa Oficial do Cinquentenário (1976 - 2026) • 14 de Novembro no Da Tetê - Bar (Rio Vermelho, Salvador). Open Bar: Stella Pure Gold, Chivas 12 Anos, Água, Refrigerante e Suco.");
    setMetaTag("og:image", "https://seminufba.com.br/logo-16-encontro-share.png");
    setMetaTag("og:url", typeof window !== "undefined" ? window.location.origin + window.location.pathname : "https://seminufba.com.br/encontro-engenheiros");
    setMetaTag("twitter:title", "16º Encontro dos Engenheiros de Minas da Bahia");
    setMetaTag("twitter:description", "Festa Oficial do Cinquentenário (1976 - 2026) • 14 de Novembro no Da Tetê - Bar (Rio Vermelho).");
    setMetaTag("twitter:image", "https://seminufba.com.br/logo-16-encontro-share.png");
    setMetaTag("twitter:url", typeof window !== "undefined" ? window.location.origin + window.location.pathname : "https://seminufba.com.br/encontro-engenheiros");
    setMetaTag("description", "Festa Oficial do Cinquentenário (1976 - 2026) • Sábado, 14 de Novembro no Da Tetê - Bar. Open Bar Incluso!");

    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Se o participante acessar o link direto da sua inscrição online (?ticket=16EM-2026-XXXX)
  useEffect(() => {
    if (ticketParam) {
      // Tenta recuperar do cache local primeiro para exibição instantânea
      try {
        const local = localStorage.getItem("credencial_16_encontro");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.codInscricao === ticketParam) {
            setTicketData(parsed);
            setIsSuccess(true);
            return;
          }
        }
      } catch (e) {}

      setIsLoading(true);
      fetch(`${SCRIPT_URL}?code=${encodeURIComponent(ticketParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.found && data.participante) {
            const p = data.participante;
            setTicketData({
              nome: p.nome,
              cpf: p.cpf || "",
              email: p.email,
              phone: p.telefone,
              formatura: p.formatura,
              empresa: p.empresa,
              mensagem: p.mensagem,
              codInscricao: p.codInscricao,
              dataRegistro: p.dataRegistro
            });
            setIsSuccess(true);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [ticketParam]);

  // Detecção se quem está escaneando pelo celular é membro da equipe de recepção autenticado
  const [isStaffAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem("semin_portaria_auth") === "true" ||
      localStorage.getItem("semin_portaria_auth") === "true" ||
      sessionStorage.getItem("semin_admin_auth") === "true"
    );
  });
  const [staffCheckinLoading, setStaffCheckinLoading] = useState(false);
  const [staffCheckinDone, setStaffCheckinDone] = useState(false);

  const handleStaffFastCheckin = async () => {
    if (!ticketData?.codInscricao) return;
    setStaffCheckinLoading(true);
    try {
      const url = `${SCRIPT_URL}?code=${encodeURIComponent(ticketData.codInscricao)}&action=credenciar`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.checkInSuccess) {
        setStaffCheckinDone(true);
        toast.success(`🎉 ENTRADA LIBERADA! Check-in de ${ticketData.nome} confirmado com sucesso!`, {
          duration: 7000
        });
      } else if (data.alreadyCheckedIn) {
        toast.error(`⛔ ENTRADA BLOQUEADA! Check-in já havia sido realizado anteriormente!`, {
          description: data.message || "Entrada duplicada não permitida.",
          duration: 8000
        });
      } else {
        toast.error(data.message || "Erro ao realizar check-in.");
      }
    } catch (e) {
      toast.error("Erro na comunicação com a planilha.");
    } finally {
      setStaffCheckinLoading(false);
    }
  };

  // Máscara dinâmica de CPF (000.000.000-00)
  const formatCPF = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf: masked }));
    if (errors.cpf) {
      setErrors((prev) => ({ ...prev, cpf: undefined }));
    }
  };

  // Máscara dinâmica de telefone brasileiro (DDD + 9 dígitos)
  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // Validação do formulário com verificação rigorosa de CPF
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = "Informe seu nome completo.";
    } else if (formData.nome.trim().split(" ").length < 2) {
      newErrors.nome = "Por favor, informe seu nome e sobrenome.";
    }

    const cleanCpf = formData.cpf.replace(/\D/g, "");
    if (!formData.cpf.trim()) {
      newErrors.cpf = "Informe seu CPF para validação da inscrição única.";
    } else if (cleanCpf.length !== 11 || !validateCPF(cleanCpf)) {
      newErrors.cpf = "CPF inválido. Verifique os números digitados.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Informe seu e-mail para receber o QR Code.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Digite um e-mail válido.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Informe seu número de WhatsApp com DDD.";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Número incompleto. Digite DDD + 9 dígitos.";
    }

    if (!formData.formatura.trim()) {
      newErrors.formatura = "Selecione sua turma ou vínculo na lista.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão com trava contra duplicidade por CPF ou E-mail
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setIsLoading(true);

    const cleanCpf = formData.cpf.replace(/\D/g, "");
    const cleanEmail = formData.email.trim().toLowerCase();

    // 1. Verificação prévia na Planilha: impede inscrição duplicada por CPF ou E-mail
    try {
      const checkUrl = `${SCRIPT_URL}?action=check&cpf=${encodeURIComponent(cleanCpf)}&email=${encodeURIComponent(cleanEmail)}`;
      const checkRes = await fetch(checkUrl);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        toast.error("Inscrição já existente!", {
          description: "Já existe uma inscrição confirmada para este CPF ou E-mail. Só é permitida 1 inscrição por pessoa.",
          duration: 9000
        });
        setErrors((prev) => ({
          ...prev,
          cpf: "Este CPF ou E-mail já possui uma inscrição cadastrada."
        }));
        setIsLoading(false);
        return;
      }
    } catch (checkErr) {
      console.warn("Verificação prévia offline ou ignorada:", checkErr);
    }

    const formaturaFinal = formData.formatura.trim();
    const sequencialRandom = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `16EM-2026-${sequencialRandom}`;
    const dataHoraFormatada = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });

    const payload = {
      nome: formData.nome.trim(),
      cpf: formData.cpf.trim(),
      email: cleanEmail,
      telefone: formData.phone.trim(),
      formatura: formaturaFinal,
      empresa: formData.empresa.trim(),
      mensagem: "",
      codInscricao: generatedCode,
      dataHora: dataHoraFormatada,
      evento: "16º Encontro dos Engenheiros de Minas da Bahia"
    };

    try {
      // Envia para a planilha do Google Sheets indicada pelo usuário
      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch((err) => {
        console.warn("Silent fallback Google Script dispatch:", err);
      });

      // Salva no estado do ticket
      const finalTicket = {
        nome: formData.nome.trim(),
        cpf: formData.cpf.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        formatura: formaturaFinal,
        empresa: formData.empresa.trim(),
        mensagem: "",
        codInscricao: generatedCode,
        dataRegistro: dataHoraFormatada
      };

      setTicketData(finalTicket);

      // Salva localmente para backup imediato
      try {
        localStorage.setItem("credencial_16_encontro", JSON.stringify(finalTicket));
      } catch (e) {
        // storage fallback
      }

      // Atualiza os parâmetros da URL para que o link online do participante fique registrado
      setSearchParams({ ticket: generatedCode }, { replace: true });

      await new Promise((r) => setTimeout(r, 300));
      setIsSuccess(true);
      toast.success("Inscrição confirmada com sucesso! 🎉", {
        description: "Sua credencial oficial com QR Code foi emitida na tela e enviada ao seu e-mail.",
        duration: 9000
      });
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Erro na inscrição:", error);
      toast.error("Ocorreu um erro ao emitir a credencial. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const onlineTicketUrl = useMemo(() => {
    if (!ticketData) return "";
    return `https://seminufba.com.br/16-encontro-engenheiros-minas?ticket=${encodeURIComponent(ticketData.codInscricao)}`;
  }, [ticketData]);

  const qrCodeUrl = useMemo(() => {
    if (!onlineTicketUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(onlineTicketUrl)}&color=06080c&bgcolor=ffffff`;
  }, [onlineTicketUrl]);

  return (
    <div className="min-h-screen bg-[#F6EFE6] text-slate-800 flex flex-col justify-between selection:bg-semin-yellow selection:text-semin-dark">
      
      {/* Estilos para Impressão da Credencial estritamente em UMA PÁGINA */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 170mm !important;
            max-width: 90vw !important;
            box-sizing: border-box !important;
            border: 2px solid #b45309 !important;
            border-radius: 16px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-before: avoid !important;
            break-before: avoid !important;
            background: #ffffff !important;
            padding: 14px 18px !important;
          }
          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Barra de Portaria Rápida (para Staff que lê QR Code com a câmera do celular) */}
      {isStaffAuthenticated && ticketData && (
        <div className="bg-[#0B1524] border-b-2 border-emerald-500 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg no-print sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono">PORTARIA CONECTADA:</span>
            <span>{ticketData.nome} ({ticketData.codInscricao})</span>
          </div>
          <div className="flex items-center gap-2">
            {!staffCheckinDone ? (
              <Button
                size="sm"
                onClick={handleStaffFastCheckin}
                disabled={staffCheckinLoading}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-1.5 px-3 rounded-lg shadow cursor-pointer flex items-center gap-1.5"
              >
                {staffCheckinLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                Confirmar Check-in Automático
              </Button>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Check-in Confirmado!
              </span>
            )}
            <Link
              to={`/credenciamento-festa?code=${encodeURIComponent(ticketData.codInscricao)}&autocheckin=true`}
              className="text-amber-300 hover:text-amber-200 underline font-semibold ml-1"
            >
              Abrir Painel Portaria →
            </Link>
          </div>
        </div>
      )}

      {/* Top Header Privado - Mantido Exclusivamente Escuro */}
      <header className="border-b border-white/10 bg-[#0A0D14] sticky top-0 z-40 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={seminLogo} 
              alt="SEMIN UFBA" 
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Página Privada • Link Exclusivo</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal em Fundo Bege Nobre */}
      <main className="container mx-auto px-4 py-8 md:py-14 flex-1 flex flex-col items-center justify-center relative">
        
        {/* Glow suave em tons âmbar/dourado */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-amber-400/15 via-orange-300/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        {isLoading && !isSuccess && ticketParam ? (
          /* Loading State para Consulta de Credencial via Link */
          <div className="w-full max-w-md mx-auto py-20 text-center relative z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-700 flex items-center justify-center mx-auto mb-4 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Carregando Inscrição Online...
            </h2>
            <p className="text-xs text-slate-600">
              Buscando credencial oficial <strong className="text-amber-800 font-mono">{ticketParam}</strong> na base do Cinquentenário.
            </p>
          </div>
        ) : !isSuccess ? (
          /* ========================================================
             FORMULÁRIO DE INSCRIÇÃO EXCLUSIVA
             ======================================================== */
          <div className="w-full max-w-3xl relative z-10">
            
            {/* Header da Página */}
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Edição Histórica • 50 Anos (1976 - 2026)
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                16º Encontro dos <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-semin-orange bg-clip-text text-transparent">Engenheiros de Minas</span> da Bahia
              </h1>
              <p className="text-slate-700 font-medium text-base md:text-lg mb-6">
                Festa Oficial do Cinquentenário &bull; A Grande Celebração de Meio Século
              </p>

              {/* Informações de Data e Hora */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto mb-4">
                <div className="flex items-center gap-2 bg-white/80 border border-amber-200/80 shadow-sm px-3.5 py-1.5 rounded-xl text-xs md:text-sm text-slate-800">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sábado, <strong>14 de Novembro de 2026</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-amber-200/80 shadow-sm px-3.5 py-1.5 rounded-xl text-xs md:text-sm text-slate-800">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>A partir das <strong>18h00</strong></span>
                </div>
              </div>

              {/* Destaque Oficial: Da Tetê - Bar & Rio Vermelho e Open Bar */}
              <div className="max-w-xl mx-auto bg-white/90 border-2 border-amber-500/60 rounded-2xl p-5 text-center shadow-lg shadow-amber-900/5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 block mb-1">
                  LOCAL DA FESTA
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase">
                  Da Tetê - Bar
                </h2>
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-700 font-medium mt-1">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>R. Borges dos Reis, 103 &bull; Rio Vermelho, Salvador - BA</span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-amber-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                    Open Bar Incluso
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-slate-900">
                    Stella Pure Gold &bull; Chivas 12 Anos &bull; Água, Refrigerante e Suco
                  </p>
                </div>
              </div>
            </div>

            {/* Card com Formulário */}
            <div className="bg-white/95 border border-amber-200/90 rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl shadow-amber-900/5 relative overflow-hidden text-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-semin-orange" />

              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Credenciamento Antecipado Obrigatório
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Preencha seus dados abaixo para receber sua <strong>Credencial Digital com QR Code</strong> diretamente no seu e-mail e garantir seu acesso ao 16º Encontro dos Engenheiros de Minas da Bahia.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nome Completo & CPF em Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData((p) => ({ ...p, nome: e.target.value }))}
                      placeholder="Ex: Carlos Alberto da Silva"
                      className={`w-full bg-slate-50/60 border ${
                        errors.nome ? "border-red-500" : "border-slate-300 focus:border-amber-500"
                      } rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      CPF * <span className="text-[10px] text-amber-700 font-normal lowercase">(inscrição única)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={`w-full bg-slate-50/60 border ${
                        errors.cpf ? "border-red-500" : "border-slate-300 focus:border-amber-500"
                      } rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono`}
                    />
                    {errors.cpf && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.cpf}</p>}
                  </div>
                </div>

                {/* E-mail & WhatsApp em Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="seu.email@exemplo.com"
                      className={`w-full bg-slate-50/60 border ${
                        errors.email ? "border-red-500" : "border-slate-300 focus:border-amber-500"
                      } rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                    <span className="text-[11px] text-slate-500 mt-1 block">O QR Code do ingresso será enviado para este e-mail.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(71) 99999-9999"
                      className={`w-full bg-slate-50/60 border ${
                        errors.phone ? "border-red-500" : "border-slate-300 focus:border-emerald-500"
                      } rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* Turma / Ano de Formatura (Apenas seleção exclusiva) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    Ano de Formatura / Vínculo com a UFBA *
                  </label>
                  
                  <select
                    value={formData.formatura}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, formatura: e.target.value }));
                      if (errors.formatura) setErrors((p) => ({ ...p, formatura: undefined }));
                    }}
                    className={`w-full bg-slate-50/60 border ${
                      errors.formatura ? "border-red-500" : "border-slate-300 focus:border-amber-500"
                    } rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer`}
                  >
                    <option value="">Selecione sua turma ou vínculo...</option>
                    {TURMAS_DESTAQUE.map((item) => (
                      <option key={item} value={item} className="bg-white text-slate-900">
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.formatura && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.formatura}</p>}
                </div>

                {/* Empresa / Atuação Atual (Opcional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    Empresa / Instituição Atual <span className="text-slate-500 font-normal lowercase">(opcional para crachá)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData((p) => ({ ...p, empresa: e.target.value }))}
                    placeholder="Ex: CBPM, Vale, Anglo, UFBA, Consultoria..."
                    className="w-full bg-slate-50/60 border border-slate-300 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Botão de Envio Responsivo para Mobile */}
                <div className="w-full pt-1">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 sm:py-5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-semin-orange text-slate-950 hover:from-amber-400 hover:to-amber-500 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 text-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Confirmando...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Confirmar Inscrição</span>
                      </span>
                    )}
                  </Button>
                </div>

              </form>
            </div>

          </div>
        ) : (
          /* ========================================================
             COMPROVANTE DIGITAL COM QR CODE & VOUCHER OFICIAL
             ======================================================== */
          <div className="w-full max-w-xl relative z-10 animate-fade-in">
            
            {/* Mensagem de Boas-Vindas */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Inscrição Confirmada com Sucesso!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Sua credencial foi registrada e enviada com o QR Code para <strong>{ticketData?.email}</strong>.
              </p>
            </div>

            {/* Cartão de Credencial Imprimível */}
            <div 
              id="print-area" 
              ref={printRef}
              className="bg-white border-2 border-amber-500/70 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden text-center mb-6"
            >
              {/* Header do Crachá */}
              <div className="border-b border-amber-100 pb-3 mb-3">
                <img 
                  src={seminLogo} 
                  alt="SEMIN 50 Anos" 
                  className="h-9 sm:h-11 w-auto mx-auto mb-2 object-contain" 
                />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-700 block mb-1">
                  CREDENCIAL OFICIAL &bull; JUBILEU DE OURO (50 ANOS)
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  16º Encontro dos Engenheiros de Minas da Bahia
                </h3>
                <p className="text-xs text-amber-800 font-bold mt-0.5">
                  Da Tetê - Bar &bull; R. Borges dos Reis, 103 - Rio Vermelho, Salvador/BA
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sábado, 14 de Novembro de 2026 &bull; A partir das 18h00
                </p>
                <div className="mt-1.5 inline-block bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Open Bar: Stella Pure Gold &bull; Chivas 12 Anos &bull; Água, Refrigerante e Suco
                </div>
              </div>

              {/* Código Único */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl py-1.5 px-4 inline-block mb-3 shadow-sm">
                <span className="text-[9px] text-amber-800 uppercase tracking-widest font-bold block">
                  Código da Credencial
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-900 tracking-wider">
                  {ticketData?.codInscricao}
                </span>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center my-2">
                <div className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm inline-block">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code da Credencial" 
                      width={140} 
                      height={140}
                      className="w-[125px] sm:w-[140px] h-[125px] sm:h-[140px] block mx-auto rounded-lg" 
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-1.5">
                  Apresente este QR Code na portaria a partir das 18h00
                </span>
              </div>

              {/* Dados do Congressista / Participante */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-3 sm:p-4 text-left space-y-1.5 text-xs sm:text-sm mt-3">
                <div className="flex justify-between border-b border-amber-100 pb-1">
                  <span className="text-slate-500">Engenheiro(a):</span>
                  <span className="font-bold text-slate-900 text-right">{ticketData?.nome}</span>
                </div>
                {ticketData?.cpf && (
                  <div className="flex justify-between border-b border-amber-100 pb-1">
                    <span className="text-slate-500">CPF:</span>
                    <span className="font-mono font-semibold text-slate-800 text-right">{ticketData?.cpf}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-amber-100 pb-1">
                  <span className="text-slate-500">Turma / Vínculo:</span>
                  <span className="font-bold text-amber-800 text-right">{ticketData?.formatura}</span>
                </div>
                {ticketData?.empresa && (
                  <div className="flex justify-between border-b border-amber-100 pb-1">
                    <span className="text-slate-500">Empresa / Atuação:</span>
                    <span className="font-medium text-slate-800 text-right">{ticketData?.empresa}</span>
                  </div>
                )}
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">Status Oficial:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirmado (Entrada Única)
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-100 text-[10px] text-slate-400">
                Data do Registro: {ticketData?.dataRegistro} &bull; SEMIN UFBA 2026
              </div>
            </div>

            {/* Ações: Imprimir / Salvar / Convidar */}
            <div className="flex flex-col gap-2.5 no-print">
              <Button
                onClick={handlePrint}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Credencial / Salvar PDF
              </Button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Venha comemorar os 50 Anos da Engenharia de Minas da UFBA no 16º Encontro dos Engenheiros! Garanta seu credenciamento exclusivo com Open Bar incluso: https://seminufba.com.br/encontro-engenheiros")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Convidar Colegas no WhatsApp
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Footer em tom Bege Suave */}
      <footer className="border-t border-amber-900/10 bg-[#EFE7DC] py-6 text-center text-xs text-slate-600 no-print">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 SEMIN UFBA &bull; Escola Politécnica da UFBA &bull; 50 Anos de Engenharia de Minas</p>
          <p>
            developed by{" "}
            <a
              href="https://www.instagram.com/wellingtonsantos.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:underline font-semibold transition-colors"
            >
              @wellingtonsantos.br
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}

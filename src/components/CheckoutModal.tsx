import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Heart, CreditCard, QrCode, ShieldCheck, 
  ArrowRight, Loader2, CheckCircle2, Copy, ExternalLink, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

// URL do seu Script do Google Sheets para controle de doações e contribuições do Jubileu
const DONATION_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0T_fZYdL5JPn2buE7y6Lyu8MF0tRlRilhzTW-uFxO-lyUKFk9T8SKCrirwRZDaBuT/exec";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment Method, 3: Processing/Result
  const [loading, setLoading] = useState(false);
  const [billingType, setBillingType] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");
  const [pixData, setPixData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    value: ""
  });

  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setBillingType("PIX");
        setPixData(null);
        setErrorMessage(null);
        setFormData({ name: "", email: "", cpf: "", phone: "", value: "" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatBRL = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    
    // Shift digits to cents
    const cents = parseInt(cleanValue, 10);
    const floatValue = cents / 100;
    
    // Format to BRL currency string
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(floatValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage(null);
    if (name === "value") {
      setFormData(prev => ({ ...prev, [name]: formatBRL(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isSubmitting = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (step === 1) {
      setStep(2);
      return;
    }

    if (isSubmitting.current) return; // Prevent double-clicks bypassing state

    // Convert BRL formatted string (e.g. "R$ 1.500,34") to clean float
    const rawValue = formData.value.replace(/[^\d]/g, "");
    const parsedValue = rawValue ? parseFloat(rawValue) / 100 : 0;

    if (parsedValue < 5) {
      setErrorMessage("O valor mínimo para contribuição é de R$ 5,00.");
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    try {
      // Timeout de 25s para não travar a interface caso a Edge Function não responda
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      let data: any;
      let error: any;

      try {
        const result = await supabase.functions.invoke("asaas-checkout", {
          body: {
            ...formData,
            value: parsedValue,
            billingType
          }
        });
        data = result.data;
        error = result.error;
      } catch (invokeError: any) {
        clearTimeout(timeoutId);
        // Se o fetch interno falhou (rede, CORS, etc.)
        if (invokeError?.name === "AbortError") {
          throw new Error("O servidor demorou demais para responder. Tente novamente em alguns instantes.");
        }
        console.error("Invoke error:", invokeError);
        throw new Error("Não foi possível conectar ao servidor de pagamentos. Verifique sua internet e tente novamente.");
      }
      clearTimeout(timeoutId);

      if (error) {
        console.error("Supabase edge function error:", error);
        const errMsg = typeof error === "string" ? error : (error?.message || error?.msg || "");
        // Tenta extrair mensagem do corpo da resposta se for FunctionsHttpError
        let detailedMessage = errMsg;
        if (error?.context?.body) {
          try {
            const body = typeof error.context.body === "string" ? JSON.parse(error.context.body) : error.context.body;
            detailedMessage = body?.error || detailedMessage;
          } catch (_) { /* ignora */ }
        }

        if (detailedMessage.includes("ASAAS_API_KEY não configurada")) {
          throw new Error("Serviço de pagamento em manutenção. Por favor, tente novamente mais tarde ou entre em contato conosco.");
        }
        if (detailedMessage.includes("Failed to fetch") || detailedMessage.includes("NetworkError") || detailedMessage.includes("FetchError")) {
          throw new Error("Erro de conexão com o servidor de pagamentos. Verifique sua internet e tente novamente.");
        }
        if (detailedMessage.includes("non-2xx")) {
          // Edge function returned error status — try to parse body
          throw new Error("O serviço de pagamento retornou um erro. Tente novamente ou entre em contato.");
        }
        throw new Error(detailedMessage || "Erro ao processar sua contribuição. Por favor, tente novamente.");
      }

      if (data?.error) {
        console.error("Asaas API error:", data.error);
        throw new Error(data.error);
      }

      if (data && data.success) {
        // Armazena os dados do PIX ou apenas a URL da fatura para outros métodos
        setPixData(billingType === "PIX" ? data.pixData : { invoiceUrl: data.invoiceUrl });
        setStep(3);

        // Envia os dados para a planilha do Google Sheets de doadores
        if (DONATION_SCRIPT_URL) {
          try {
            const urlParams = new URLSearchParams();
            urlParams.append("id_cobranca", data.paymentId || "");
            urlParams.append("nome", formData.name);
            urlParams.append("email", formData.email);
            urlParams.append("cpf", formData.cpf);
            urlParams.append("tel", formData.phone);
            urlParams.append("valor", parsedValue.toFixed(2));
            urlParams.append("metodo_de_pagamento", billingType);
            urlParams.append("status", "Pendente");
            urlParams.append("data_hora", new Date().toLocaleString("pt-BR"));

            const sheetController = new AbortController();
            const sheetTimeout = setTimeout(() => sheetController.abort(), 5000);

            await fetch(DONATION_SCRIPT_URL, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: urlParams,
              signal: sheetController.signal,
            });
            clearTimeout(sheetTimeout);
          } catch (sheetError: any) {
            console.warn("Erro ao registrar doador no Google Sheets (não crítico):", sheetError?.message || "Timeout ou erro de rede");
          }
        }
      } else {
        throw new Error(data?.error || "Resposta inesperada do servidor de pagamentos.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const msg = error?.message || "Erro ao conectar com o servidor. Tente novamente.";
      setErrorMessage(msg);
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };

  const copyPix = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      alert("Código PIX copiado!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />


        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white border border-black/[0.08] rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-black/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-semin-orange/10 rounded-full flex items-center justify-center border border-semin-orange/20">
                <Heart className="h-5 w-5 text-semin-orange" fill="currentColor" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-semin-blue">Contribuição Jubileu</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors group">
              <X className="h-6 w-6 text-black/30 group-hover:text-black/60 transition-colors" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Nome Completo</label>
                      <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Seu nome"
                        className="bg-black/[0.025] border-black/[0.08] text-semin-dark h-12 rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-black/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">E-mail</label>
                      <Input 
                        name="email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="seu@email.com"
                        className="bg-black/[0.025] border-black/[0.08] text-semin-dark h-12 rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-black/30"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">CPF ou CNPJ</label>
                      <Input 
                        name="cpf" 
                        value={formData.cpf} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="000.000.000-00"
                        className="bg-black/[0.025] border-black/[0.08] text-semin-dark h-12 rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-black/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">WhatsApp / Telefone</label>
                      <Input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="(00) 00000-0000"
                        className="bg-black/[0.025] border-black/[0.08] text-semin-dark h-12 rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-black/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Valor da Doação</label>
                    <Input 
                      name="value" 
                      type="text"
                      inputMode="decimal"
                      value={formData.value} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="R$ 0,00"
                      className="bg-black/[0.025] border-black/[0.08] text-semin-orange h-14 rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 text-2xl font-black text-center"
                    />
                    <p className="text-[11px] text-semin-blue/50 text-center font-bold mt-1">Contribuição mínima recomendada: R$ 5,00</p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 leading-relaxed font-body font-medium">{errorMessage}</p>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-semin-orange to-amber-500 text-white font-black text-lg group shadow-lg shadow-semin-orange/25 hover:shadow-xl hover:shadow-semin-orange/35 hover:scale-[1.01] transition-all duration-300"
                >
                  Continuar para Doação
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBillingType("PIX")}
                    className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${
                      billingType === "PIX" 
                      ? "bg-semin-orange/5 border-semin-orange shadow-[0_0_20px_rgba(224,115,19,0.1)] text-semin-orange" 
                      : "bg-black/[0.02] border-black/10 text-black/40 hover:border-black/20 hover:text-black/60"
                    }`}
                  >
                    <QrCode className={`h-10 w-10 ${billingType === "PIX" ? "text-semin-orange" : "text-black/30"}`} />
                    <span className="font-bold uppercase tracking-widest text-xs">PIX (Instantâneo)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingType("CREDIT_CARD")}
                    className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${
                      billingType === "CREDIT_CARD" 
                      ? "bg-semin-orange/5 border-semin-orange shadow-[0_0_20px_rgba(224,115,19,0.1)] text-semin-orange" 
                      : "bg-black/[0.02] border-black/10 text-black/40 hover:border-black/20 hover:text-black/60"
                    }`}
                  >
                    <CreditCard className={`h-10 w-10 ${billingType === "CREDIT_CARD" ? "text-semin-orange" : "text-black/30"}`} />
                    <span className="font-bold uppercase tracking-widest text-xs">Cartão de Crédito</span>
                  </button>
                </div>

                {billingType === "CREDIT_CARD" && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-inner">
                    <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed font-body">
                      Para cartão de crédito, você será redirecionado com total segurança para o checkout autenticado da nossa plataforma de pagamentos (Asaas).
                    </p>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 leading-relaxed font-body font-medium">{errorMessage}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => { setStep(1); setErrorMessage(null); }}
                    className="flex-1 h-14 rounded-2xl bg-white border-black/15 text-black/60 hover:bg-black/5 hover:text-black/80 transition-all duration-300"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-semin-orange to-amber-500 text-white font-black text-lg shadow-lg shadow-semin-orange/20"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Finalizar Doação"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-8 py-4"
              >
                {billingType === "PIX" && pixData ? (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h4 className="text-2xl font-black text-semin-blue">QR Code Gerado!</h4>
                    <p className="text-black/60 text-sm max-w-xs mx-auto">
                      Escaneie o código abaixo no seu app de banco para finalizar a contribuição de <span className="text-semin-orange font-bold">{formData.value}</span>.
                    </p>
                    
                    <div className="bg-semin-cream p-4 rounded-3xl w-48 h-48 mx-auto shadow-inner border border-black/[0.05]">
                      <img src={`data:image/png;base64,${pixData.encodedImage}`} alt="PIX QR Code" className="w-full h-full" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button type="button" onClick={copyPix} className="w-full h-12 rounded-xl bg-semin-dark hover:bg-black text-white font-bold gap-2 border-0 shadow-lg shadow-black/10">
                        <Copy className="h-4 w-4 text-white" />
                        Copiar Código PIX
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-semin-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-semin-orange/20">
                      <CheckCircle2 className="h-10 w-10 text-semin-orange" />
                    </div>
                    <h4 className="text-2xl font-black text-semin-blue">Quase Lá!</h4>
                    <p className="text-black/60 text-sm">
                      Para finalizar sua doação, abra a fatura segura do Asaas no botão abaixo.
                    </p>
                    <Button 
                      type="button"
                      onClick={() => window.open(pixData?.invoiceUrl || "https://asaas.com", "_blank")}
                      className="w-full h-14 rounded-2xl bg-semin-orange hover:bg-semin-orange/95 text-white font-black shadow-lg shadow-semin-orange/20"
                    >
                      Abrir Checkout Seguro
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                <button 
                  type="button"
                  onClick={onClose}
                  className="text-black/35 hover:text-black/60 text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  Fechar Janela
                </button>
              </motion.div>
            )}
          </form>

          {/* Footer Security */}
          <div className="p-6 bg-black/[0.015] border-t border-black/[0.05] flex items-center justify-center gap-3">
            <ShieldCheck className="h-4 w-4 text-black/20" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/35 font-bold">Ambiente Criptografado e Seguro via ASAAS</span>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Heart, CreditCard, QrCode, ShieldCheck, 
  ArrowRight, Loader2, CheckCircle2, Copy, ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment Method, 3: Processing/Result
  const [loading, setLoading] = useState(false);
  const [billingType, setBillingType] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");
  const [pixData, setPixData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    value: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("asaas-checkout", {
        body: {
          ...formData,
          value: parseFloat(formData.value),
          billingType
        }
      });

      if (error) {
        console.error("Supabase edge function error:", error);
        throw new Error("Erro ao se conectar com o serviço de doação.");
      }

      if (data && data.success) {
        // Armazena os dados do PIX ou apenas a URL da fatura para outros métodos
        setPixData(billingType === "PIX" ? data.pixData : { invoiceUrl: data.invoiceUrl });
        setStep(3);
      } else {
        alert(data.error || "Erro ao processar doação");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
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
          className="relative w-full max-w-xl bg-[#0a0d12] border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-semin-yellow/10 rounded-full flex items-center justify-center border border-semin-yellow/20">
                <Heart className="h-5 w-5 text-semin-yellow" fill="currentColor" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">Contribuição Jubileu</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="h-6 w-6 text-white/40" />
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
                      <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Nome Completo</label>
                      <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Seu nome"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-semin-yellow/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">E-mail</label>
                      <Input 
                        name="email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="seu@email.com"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-semin-yellow/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">CPF ou CNPJ</label>
                      <Input 
                        name="cpf" 
                        value={formData.cpf} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="000.000.000-00 ou CNPJ"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-semin-yellow/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">WhatsApp / Telefone</label>
                      <Input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="(00) 00000-0000"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-semin-yellow/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Valor da Doação (R$)</label>
                    <Input 
                      name="value" 
                      type="number"
                      step="0.01"
                      value={formData.value} 
                      onChange={handleInputChange} 
                      required 
                      className="bg-white/5 border-white/10 text-semin-yellow h-14 rounded-xl focus:border-semin-yellow/50 text-2xl font-black text-center"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-black text-lg group"
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
                      ? "bg-semin-yellow/10 border-semin-yellow shadow-[0_0_20px_rgba(210,155,33,0.2)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <QrCode className={`h-10 w-10 ${billingType === "PIX" ? "text-semin-yellow" : ""}`} />
                    <span className="font-bold uppercase tracking-widest text-xs">PIX (Instantâneo)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingType("CREDIT_CARD")}
                    className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${
                      billingType === "CREDIT_CARD" 
                      ? "bg-semin-yellow/10 border-semin-yellow shadow-[0_0_20px_rgba(210,155,33,0.2)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className={`h-10 w-10 ${billingType === "CREDIT_CARD" ? "text-semin-yellow" : ""}`} />
                    <span className="font-bold uppercase tracking-widest text-xs">Cartão de Crédito</span>
                  </button>
                </div>

                {billingType === "CREDIT_CARD" && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-200/70 leading-relaxed">
                      Implementando checkout transparente direto no Asaas. Para cartão de crédito, você será redirecionado para o ambiente seguro do Asaas para finalizar.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 rounded-2xl bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-black text-lg"
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
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <CheckCircle2 className="h-10 w-10 text-green-400" />
                    </div>
                    <h4 className="text-2xl font-black text-white">QR Code Gerado!</h4>
                    <p className="text-white/60 text-sm max-w-xs mx-auto">
                      Escaneie o código abaixo no seu app de banco para finalizar a contribuição de <span className="text-semin-yellow font-bold">R$ {formData.value}</span>.
                    </p>
                    
                    <div className="bg-white p-4 rounded-3xl w-48 h-48 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <img src={`data:image/png;base64,${pixData.encodedImage}`} alt="PIX QR Code" className="w-full h-full" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button onClick={copyPix} variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white gap-2">
                        <Copy className="h-4 w-4" />
                        Copiar Código PIX
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-semin-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-semin-yellow/20">
                      <CheckCircle2 className="h-10 w-10 text-semin-yellow" />
                    </div>
                    <h4 className="text-2xl font-black text-white">Quase Lá!</h4>
                    <p className="text-white/60 text-sm">
                      Para finalizar sua doação, abra a fatura segura do Asaas no botão abaixo.
                    </p>
                    <Button 
                      onClick={() => window.open(pixData?.invoiceUrl || "https://asaas.com", "_blank")}
                      className="w-full h-14 rounded-2xl bg-semin-yellow text-semin-dark font-black"
                    >
                      Abrir Checkout Seguro
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                <button 
                  onClick={onClose}
                  className="text-white/30 hover:text-white/60 text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  Fechar Janela
                </button>
              </motion.div>
            )}
          </form>

          {/* Footer Security */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-3">
            <ShieldCheck className="h-4 w-4 text-white/20" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Ambiente Criptografado e Seguro via ASAAS</span>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;

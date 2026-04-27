import { useState, useEffect } from "react";
import { X, MessageCircle, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: Substitua este link pelo link real do grupo do WhatsApp do SEMIN UFBA
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/GiV7WJficGV51jbmO0Wfm5";

interface WhatsAppPopupProps {
  /** Quando true, exibe o popup imediatamente (usado após inscrição bem-sucedida) */
  forceShow?: boolean;
  onClose?: () => void;
}

export function WhatsAppPopup({ forceShow = false, onClose }: WhatsAppPopupProps) {
  const [visible, setVisible] = useState(forceShow);

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      return;
    }
    
    // Auto-show after 30 seconds apenas se nunca foi fechado antes
    const hasClosedPopup = localStorage.getItem("semin_whatsapp_popup_closed");
    if (!hasClosedPopup) {
      const timer = setTimeout(() => setVisible(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleClose = () => {
    localStorage.setItem("semin_whatsapp_popup_closed", "true");
    setVisible(false);
    onClose?.();
  };

  const handleJoin = () => {
    window.open(WHATSAPP_GROUP_LINK, "_blank", "noopener,noreferrer");
    handleClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Green accent top bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366]" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10 z-10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 pt-8 text-center">
          {/* WhatsApp icon */}
          <div className="w-20 h-20 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(37,211,102,0.2)]">
            <MessageCircle className="h-10 w-10 text-[#25D366]" strokeWidth={1.5} />
          </div>

          <h3 className="font-display text-2xl font-bold text-white mb-2">
            Entre na Comunidade!
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-5 px-2">
            Fique por dentro de tudo sobre o <span className="text-semin-yellow font-semibold">SEMIN UFBA</span> — palestrantes, programação e novidades em primeira mão no nosso grupo do WhatsApp.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-5 py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <Users className="h-4 w-4 text-[#25D366]" />
            <span className="text-white/60 text-xs">Comunidade oficial do SEMIN UFBA</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              onClick={handleJoin}
              className="w-full bg-[#25D366] hover:bg-[#1fba58] text-white font-bold h-12 text-base rounded-xl shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 group"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Entrar no Grupo
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <button
              onClick={handleClose}
              className="text-white/30 text-xs hover:text-white/50 transition-colors py-1"
            >
              Agora não, obrigado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { X, Mail, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if user hasn't dismissed or subscribed before
    const dismissed = localStorage.getItem("semin_newsletter_dismissed");
    if (dismissed) return;

    // Show after 8 seconds
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("semin_newsletter_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: "Newsletter", email, tipo: "Newsletter" }),
      });
      setSubmitted(true);
      localStorage.setItem("semin_newsletter_dismissed", "true");
      setTimeout(() => setVisible(false), 3000);
    } catch {
      // silent fail — no-cors
      setSubmitted(true);
      setTimeout(() => setVisible(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative bg-gradient-to-br from-semin-dark via-semin-blue to-semin-dark border border-semin-yellow/25 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-semin-yellow to-transparent" />

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 pt-6">
          {submitted ? (
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-white font-bold text-base">Perfeito! Você está na lista. 🎉</p>
              <p className="text-white/50 text-sm mt-1">Fique de olho no seu e-mail!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-semin-yellow/15 border border-semin-yellow/25 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-semin-yellow" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Fique por dentro do SEMIN UFBA!</p>
                  <p className="text-white/45 text-xs mt-0.5">Novidades, palestrantes e avisos no seu e-mail</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow h-10 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-bold h-10 text-sm hover:from-semin-orange hover:to-semin-yellow transition-all duration-300"
                >
                  {loading ? "Enviando..." : "Receber Novidades"}
                </Button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-white/30 text-xs hover:text-white/50 transition-colors text-center"
                >
                  Não, obrigado
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { HardHat, Loader2, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { WhatsAppPopup } from "./WhatsAppPopup";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec";

export function RegistrationModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: "",
    aceitaEmail: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
          aceitaEmail: formData.aceitaEmail ? "Sim" : "Não",
        }),
      });

      setIsSuccess(true);
      toast.success("Inscrição confirmada!", {
        description: "Seus dados foram enviados com sucesso.",
      });

      // After 3s, close modal and show WhatsApp popup
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFormData({ nome: "", email: "", tipo: "", aceitaEmail: true });
        setShowWhatsApp(true);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ops, ocorreu um erro!", {
        description: "Não foi possível enviar sua inscrição. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-semin-dark border-semin-yellow/20 text-white max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full rounded-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-display text-semin-yellow">
              <HardHat className="h-6 w-6" />
              Vagas Limitadas
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Sua entrada é validada mediante a doação de 1kg de alimento no dia do evento. Preencha seus dados abaixo para garantir sua vaga.
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Inscrição Confirmada!</h3>
              <p className="text-white/70">Verifique seu e-mail em breve. 🎉</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="reg-nome" className="text-white">Nome Completo</Label>
                <Input
                  id="reg-nome"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                  placeholder="Ex: João da Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-white">E-mail</Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                  placeholder="Ex: joao@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="reg-tipo" className="text-white">Tipo de Participante</Label>
                <Select required value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-semin-yellow">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent className="bg-semin-blue border-white/10 text-white">
                    <SelectItem value="Estudante da UFBA">Estudante da UFBA</SelectItem>
                    <SelectItem value="Estudante de outra Instituição">Estudante de outra Instituição</SelectItem>
                    <SelectItem value="Profissional">Profissional do Setor</SelectItem>
                    <SelectItem value="Professor / Pesquisador">Professor / Pesquisador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ── Email consent ── */}
              <div className="rounded-xl bg-white/[0.04] border border-semin-yellow/15 p-4">
                <label
                  htmlFor="reg-aceita-email"
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      id="reg-aceita-email"
                      checked={formData.aceitaEmail}
                      onChange={(e) => setFormData({ ...formData, aceitaEmail: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-semin-yellow peer-checked:border-semin-yellow transition-all duration-200 flex items-center justify-center">
                      {formData.aceitaEmail && (
                        <svg className="w-3 h-3 text-semin-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail className="h-3.5 w-3.5 text-semin-yellow" />
                      <span className="text-white text-sm font-semibold">Receber novidades por e-mail</span>
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">
                      Autorizo o SEMIN UFBA a me enviar informações sobre o evento, palestrantes e atualizações da programação pelo e-mail informado acima.
                    </p>
                  </div>
                </label>
              </div>

              {/* ── WhatsApp teaser ── */}
              <div className="rounded-xl bg-[#25D366]/8 border border-[#25D366]/20 p-3.5 flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
                <p className="text-white/60 text-xs leading-relaxed">
                  Após a inscrição, você receberá um convite para entrar na <b className="text-white/80">comunidade do WhatsApp</b> do SEMIN UFBA.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.tipo}
                className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange hover:from-semin-orange hover:to-semin-yellow text-semin-dark font-bold mt-2 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar Inscrição"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* WhatsApp popup fires after successful registration */}
      {showWhatsApp && (
        <WhatsAppPopup forceShow onClose={() => setShowWhatsApp(false)} />
      )}
    </>
  );
}

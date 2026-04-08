import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gem, Loader2, CheckCircle2 } from "lucide-react";

// URL passed by the user
const SPONSOR_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNj9SGV12uoVsDl_hA7N3EaSdlbNE2IdN7WuzNBXVHNibbFa9Pr_W7qDxW177gH-YBgA/exec";

export function SponsorModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    empresa: "",
    nome: "",
    email: "",
    telefone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const urlParams = new URLSearchParams();
      urlParams.append("empresa", formData.empresa);
      urlParams.append("nome", formData.nome);
      urlParams.append("email", formData.email);
      urlParams.append("telefone", formData.telefone);

      await fetch(SPONSOR_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlParams,
      });

      setIsSuccess(true);
      toast.success("Solicitação recebida!", {
        description: "Enviamos um e-mail automaticamente com as opções de patrocínio.",
      });
      
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFormData({ empresa: "", nome: "", email: "", telefone: "" });
      }, 4000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ops, ocorreu um erro!", {
        description: "Não foi possível enviar sua solicitação. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-semin-dark border-semin-yellow/20 text-white max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full rounded-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display text-semin-yellow">
            <Gem className="h-6 w-6" />
            Seja um Patrocinador
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Associe sua marca ao maior evento de mineração da UFBA. Preencha os dados abaixo e enviaremos o material instantaneamente para o seu e-mail.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Verifique sua caixa de entrada!</h3>
            <p className="text-white/70">Acabamos de te enviar o material com as Cotas de Patrocínio e nossa história.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="empresa" className="text-white">Nome da Empresa</Label>
              <Input
                id="empresa"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: Mineração XYZ"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-white">Seu Nome</Label>
              <Input
                id="nome"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: Maria Souza"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: maria@mineracaoxyz.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="telefone" className="text-white">WhatsApp / Telefone</Label>
              <Input
                id="telefone"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: (71) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange hover:from-semin-orange hover:to-semin-yellow text-semin-dark font-bold mt-4 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                "Quero Patrocinar"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { HardHat, Loader2, CheckCircle2, Mail, MessageCircle, UserCheck, Eye, EyeOff } from "lucide-react";
import { WhatsAppPopup } from "./WhatsAppPopup";
import { useAuth } from "@/contexts/AuthContext";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec";

export function RegistrationModal({ children }: { children: React.ReactNode }) {
  const { session, profile, register: registerUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);

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

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: "",
    aceitaEmail: true,
  });

  // Mandatory account creation fields for non-logged-in users
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Sync logged-in user details when the modal opens or auth state changes
  useEffect(() => {
    if (open) {
      if (profile) {
        setFormData({
          nome: profile.full_name || profile.nickname || "",
          email: profile.email || session?.user?.email || "",
          tipo: "",
          aceitaEmail: true,
        });
      } else {
        setFormData({
          nome: "",
          email: "",
          tipo: "",
          aceitaEmail: true,
        });
        setNickname("");
        setPassword("");
        setPhone("");
      }
    }
  }, [open, profile, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. If not logged in, we MUST create the user account in Supabase
      if (!profile) {
        const cleanNick = nickname.trim().toLowerCase();
        if (!formData.nome.trim() || !formData.email.trim()) {
          toast.error("Por favor, preencha o Nome Completo e E-mail.");
          setIsLoading(false);
          return;
        }
        if (!cleanNick || cleanNick.length < 3 || cleanNick.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(cleanNick)) {
          toast.error("Erro no cadastro de usuário", {
            description: "Nickname deve ter 3-20 caracteres (letras, números, _ ou -).",
          });
          setIsLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          toast.error("Erro no cadastro de usuário", {
            description: "A senha de acesso deve ter pelo menos 6 caracteres.",
          });
          setIsLoading(false);
          return;
        }
        if (!phone.trim() || phone.length < 8) {
          toast.error("Erro no cadastro de usuário", {
            description: "Insira um número de telefone / WhatsApp válido.",
          });
          setIsLoading(false);
          return;
        }

        // Attempt user sign up and profile generation
        const errorMsg = await registerUser({
          full_name: formData.nome.trim(),
          email: formData.email.toLowerCase().trim(),
          password: password,
          nickname: cleanNick,
          phone: phone.trim(),
          consent_lgpd: true,
        });

        if (errorMsg) {
          toast.error("Não foi possível criar sua conta", {
            description: errorMsg,
          });
          setIsLoading(false);
          return;
        }

        toast.success("Conta de usuário criada com sucesso! 🛡️");
      }

      // 2. Submit event registration to Google Sheets Script URL
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
        }),
      });

      setIsSuccess(true);
      toast.success("Inscrição confirmada!", {
        description: "Sua vaga no evento de 50 Anos está reservada com sucesso.",
      });

      // Close modal and pop up community invitation after a delay
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFormData({ nome: "", email: "", tipo: "", aceitaEmail: true });
        setNickname("");
        setPassword("");
        setPhone("");
        setShowWhatsApp(true);
      }, 3000);
    } catch (error) {
      console.error("Error submitting event registration:", error);
      toast.error("Erro ao processar inscrição", {
        description: "Ocorreu um problema ao enviar seus dados. Tente novamente mais tarde.",
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
        <DialogContent className="sm:max-w-md bg-semin-dark border-semin-yellow/20 text-white max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full rounded-2xl mx-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-display text-semin-yellow">
              <HardHat className="h-6 w-6" />
              Vagas Limitadas
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Sua entrada é validada mediante a doação de 1kg de alimento no dia do evento. Garanta sua vaga agora.
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Inscrição Confirmada!</h3>
              <p className="text-white/70">Sua vaga está garantida. Nos vemos no evento! 🎉</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {/* Logged in indicator */}
              {profile ? (
                <div className="bg-semin-yellow/10 border border-semin-yellow/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-full bg-semin-yellow/20 flex items-center justify-center text-semin-yellow font-black text-sm shadow-inner shrink-0">
                    {profile.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">@{profile.nickname}</p>
                    <p className="text-white/60 text-xs truncate">{profile.full_name}</p>
                    <p className="text-white/40 text-[10px] truncate">{formData.email}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1 shrink-0">
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Logado
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="reg-nome" className="text-white font-medium">Nome Completo</Label>
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
                    <Label htmlFor="reg-email" className="text-white font-medium">E-mail</Label>
                    <div className="relative">
                      <Input
                        id="reg-email"
                        type="email"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow pr-10"
                        placeholder="Ex: joao@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleEmailBlur(formData.email)}
                      />
                      {isSearchingEmail && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-semin-yellow" />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="reg-tipo" className="text-white font-medium">Tipo de Participante</Label>
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

              {/* Mandatory Registration User Account Signup if NOT logged in */}
              {!profile && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                  <div>
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-semin-yellow" /> Cadastro de Conta Obrigatório
                    </span>
                    <p className="text-white/40 text-xs leading-relaxed mt-1">
                      Para confirmar sua inscrição, crie sua conta de acesso. Você poderá utilizá-la para jogar o Desafio Semin e interagir na comunidade!
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    {/* Nickname */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-nickname" className="text-white/80 text-xs font-medium">Nome de Usuário / Apelido</Label>
                      <Input
                        id="reg-nickname"
                        required
                        className="bg-white/5 border-white/10 text-white text-xs h-9 placeholder:text-white/30 focus-visible:ring-semin-yellow"
                        placeholder="Ex: joaominas (para o ranking)"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>

                    {/* Senha */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-pass" className="text-white/80 text-xs font-medium">Senha de Acesso</Label>
                      <div className="relative">
                        <Input
                          id="reg-pass"
                          type={showPassword ? "text" : "password"}
                          required
                          className="bg-white/5 border-white/10 text-white text-xs h-9 placeholder:text-white/30 focus-visible:ring-semin-yellow pr-10"
                          placeholder="Escolha uma senha (mín. 6 caracteres)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-phone" className="text-white/80 text-xs font-medium">WhatsApp / Telefone</Label>
                      <Input
                        id="reg-phone"
                        required
                        className="bg-white/5 border-white/10 text-white text-xs h-9 placeholder:text-white/30 focus-visible:ring-semin-yellow"
                        placeholder="Ex: (71) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email consent */}
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

              {/* WhatsApp teaser */}
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

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, User, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  children: React.ReactNode;
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginModal({ children, defaultTab = "login", onSuccess, open: controlledOpen, onOpenChange }: LoginModalProps) {
  const { login, register } = useAuth();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen;
  const [tab, setTab] = useState<"login" | "register" | "forgot">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZSoH6DStsVd3mohww3xFPH0sHrhyPKyizCLC5fkvO-J4n-_XFkkmo_qTlf2vquQRq/exec";

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
          setRegisterName(foundName);
          toast.success("Inscrição anterior localizada!", {
            description: `Seja bem-vindo de volta, ${foundName}! Importamos seu nome completo. 🎉`,
          });
        }
      }
    } catch (e) {
      console.log("Silent fallback: Google Sheets query not supported or CORS blocked.", e);
    } finally {
      setIsSearchingEmail(false);
    }
  };

  const showError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    setLoading(true);
    clearMessages();
    try {
      const fd = new FormData(e.currentTarget);
      const email = (fd.get("email") as string || "").trim();
      const password = fd.get("password") as string || "";
      
      if (!email || !password) {
        showError("Preencha e-mail e senha.");
        return;
      }

      const err = await login(email, password);
      if (err) {
        showError(err);
      } else {
        setOpen(false);
        onSuccess?.();
      }
    } catch (err: any) {
      showError(err?.message || "Erro inesperado ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    setLoading(true);
    clearMessages();
    try {
      const fd = new FormData(e.currentTarget);
      const err = await register({
        full_name: fd.get("full_name") as string,
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        nickname: fd.get("nickname") as string,
        phone: fd.get("phone") as string,
        consent_lgpd: !!fd.get("consent_lgpd"),
      });
      if (err) {
        if (err === "CONFIRM_EMAIL") {
          setSuccessMessage("Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail. Por favor, confirme seu e-mail para ativar sua conta e fazer o login.");
          setTab("login");
        } else {
          showError(err);
        }
      } else {
        setOpen(false);
        onSuccess?.();
      }
    } catch (err: any) {
      showError(err?.message || "Erro inesperado ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    setLoading(true);
    clearMessages();
    try {
      const fd = new FormData(e.currentTarget);
      const email = (fd.get("email") as string).toLowerCase().trim();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/quiz",
      });
      if (err) {
        showError(err.message);
      } else {
        setSuccessMessage("Se o e-mail estiver cadastrado, um link de recuperação foi enviado.");
        setTab("login");
      }
    } catch (err: any) {
      showError(err?.message || "Erro ao solicitar recuperação.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(o: boolean) {
    setOpen(o);
    if (!o) {
      clearMessages();
      setLoading(false);
    }
  }

  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500 h-11 rounded-lg text-sm";
  const labelClass = "text-[11px] text-white/50 uppercase tracking-wider font-semibold mb-1 block";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md bg-[#0d1117] border border-white/10 p-0 overflow-hidden rounded-2xl shadow-2xl z-[150] [&>button]:!bg-white/10 [&>button]:!text-white [&>button]:hover:!bg-white/20 [&>button]:!rounded-full">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {tab === "login" ? "Entrar" : tab === "register" ? "Criar Conta" : "Recuperar Senha"}
            </h2>
          </div>
          <p className="text-xs text-white/40 mb-4">
            {tab === "login" 
              ? "Acesse sua conta para jogar o Desafio, comentar e compartilhar." 
              : tab === "register"
              ? "Cadastre-se para participar do ranking mensal e interagir com a comunidade."
              : "Enviaremos um link de recuperação para seu e-mail."}
          </p>

          {/* Tabs */}
          {tab !== "forgot" && (
            <div className="flex gap-1 mb-4 bg-white/5 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => { setTab("login"); clearMessages(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tab === "login" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"}`}
              >
                ENTRAR
              </button>
              <button
                type="button"
                onClick={() => { setTab("register"); clearMessages(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tab === "register" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"}`}
              >
                CRIAR CONTA
              </button>
            </div>
          )}
        </div>

        {/* Success */}
        {successMessage && (
          <div className="mx-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 text-center font-semibold leading-relaxed">
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="p-6 pt-2 space-y-4">
            <div>
              <label className={labelClass}>E-mail</label>
              <Input name="email" type="email" required placeholder="seu@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="••••••" className={`${inputClass} pr-10`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
            </Button>
            <button type="button" onClick={() => setTab("forgot")} className="w-full text-center text-xs text-white/30 hover:text-amber-400 transition-colors">
              Esqueci minha senha
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="p-6 pt-2 space-y-3">
            <div>
              <label className={labelClass}>Nome Completo</label>
              <Input
                name="full_name"
                required
                minLength={3}
                placeholder="João da Silva"
                className={inputClass}
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Nickname (público)</label>
              <Input name="nickname" required minLength={3} maxLength={20} pattern="[a-zA-Z0-9_\-]+" placeholder="meu_nick" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className={inputClass}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  onBlur={() => handleEmailBlur(registerEmail)}
                />
                {isSearchingEmail && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-amber-500" />
                )}
              </div>
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <Input name="phone" type="tel" required minLength={8} placeholder="(71) 99999-9999" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="Mínimo 6 caracteres" className={`${inputClass} pr-10`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* LGPD Consent */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/40 leading-relaxed">
                  <strong className="text-white/60">Privacidade & LGPD:</strong> Seus dados (e-mail, telefone, nickname) serão usados exclusivamente para a plataforma SEMIN UFBA. Você pode solicitar a exclusão completa a qualquer momento (Lei 13.709/2018).
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="consent_lgpd" value="true" className="accent-amber-500 w-4 h-4" required />
                <span className="text-[11px] text-white/60">Li e concordo com os termos de uso e privacidade</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Conta"}
            </Button>
          </form>
        )}

        {/* Forgot Password Form */}
        {tab === "forgot" && (
          <form onSubmit={handleForgot} className="p-6 pt-2 space-y-4">
            <div>
              <label className={labelClass}>E-mail cadastrado</label>
              <Input name="email" type="email" required placeholder="seu@email.com" className={inputClass} />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Link de Recuperação"}
            </Button>
            <button type="button" onClick={() => setTab("login")} className="w-full text-center text-xs text-white/30 hover:text-amber-400 transition-colors">
              ← Voltar ao login
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

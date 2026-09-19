import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";

interface ResetPasswordModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResetPasswordModal({ children, open: controlledOpen, onOpenChange }: ResetPasswordModalProps) {
  const { isPasswordRecovery, setIsPasswordRecovery, updatePassword } = useAuth();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // If controlled externally or triggered by password recovery state
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : (isPasswordRecovery || uncontrolledOpen);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
      if (!newOpen) {
        setIsPasswordRecovery(false);
      }
    }
    if (!newOpen) {
      resetForm();
    }
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setLoading(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const err = await updatePassword(password);
      if (err) {
        setError(err);
      } else {
        toast.success("Senha alterada com sucesso!", {
          description: "Sua nova senha já está salva e ativa. Você continuará conectado.",
        });
        handleOpenChange(false);
      }
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro ao atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500 h-11 rounded-lg text-sm";
  const labelClass = "text-xs font-semibold text-white/70 uppercase tracking-wider block mb-1.5";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="bg-[#0e131b] border-amber-500/20 text-white max-w-md w-[92vw] sm:w-full p-0 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 pb-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                Redefinir Senha
              </DialogTitle>
              <DialogDescription className="text-xs text-white/50">
                Digite sua nova senha de acesso abaixo.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label className={labelClass}>Nova Senha</label>
            <div className="relative">
              <Input
                name="new_password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirmar Nova Senha</label>
            <div className="relative">
              <Input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-white/40 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500/70" />
            <span>Sua senha deve conter pelo menos 6 caracteres.</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Atualizando senha...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Salvar Nova Senha
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
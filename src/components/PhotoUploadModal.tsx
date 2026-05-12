import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Camera, Loader2, CheckCircle2, UploadCloud, FileImage, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "./LoginModal";

export function PhotoUploadModal({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const { profile, session } = useAuth();

  // Se o usuário não estiver autenticado, envolver o trigger no modal de Login
  if (!session) {
    return (
      <LoginModal defaultTab="login">
        <div onClick={() => toast.info("Por favor, faça login ou crie uma conta para enviar sua foto histórica! 📸")}>
          {children}
        </div>
      </LoginModal>
    );
  }

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    anoTurma: "",
    descricao: "",
    fileName: "",
    fileBase64: "",
    mimeType: "",
    lgpdConsent: false,
  });

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (open) {
      if (profile) {
        setFormData(prev => ({
          ...prev,
          nome: profile.full_name || profile.nickname || "",
          email: profile.email || "",
          telefone: profile.phone || "",
          lgpdConsent: profile.consent_lgpd || false
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          nome: "",
          email: "",
          telefone: "",
          lgpdConsent: false
        }));
      }
    }
  }, [open, profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande", { description: "O tamanho máximo permitido é 10MB." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar mantendo proporção (Max 1080px)
        const MAX_SIZE = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Converter para WEBP com qualidade 80%
          const webpBase64 = canvas.toDataURL("image/webp", 0.8);
          
          setFormData({
            ...formData,
            fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
            fileBase64: webpBase64,
            mimeType: "image/webp",
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileBase64) {
      toast.error("Nenhuma foto selecionada", { description: "Por favor, selecione uma foto para enviar." });
      return;
    }

    setIsLoading(true);

    try {
      // Usando Supabase para armazenar a foto como pendente vinculada à conta do usuário
      const { error } = await supabase.from('gallery_photos').insert([
        {
          author_name: formData.nome,
          author_email: formData.email,
          author_phone: formData.telefone,
          year_cohort: formData.anoTurma,
          description: formData.descricao,
          image_base64: formData.fileBase64,
          status: 'pending',
          user_id: session?.user?.id || null
        }
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Foto enviada com sucesso!", {
        description: "Obrigado por contribuir com a Galeria do Tempo.",
      });

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFormData({ nome: "", email: "", telefone: "", anoTurma: "", descricao: "", fileName: "", fileBase64: "", mimeType: "", lgpdConsent: false });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);
    } catch (error) {
      console.error("Error submitting photo:", error);
      toast.error("Ops, ocorreu um erro!", {
        description: "Não foi possível enviar sua foto. Tente novamente mais tarde.",
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
            <Camera className="h-6 w-6" />
            Enviar Foto Histórica
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Envie sua foto diretamente para aprovação da nossa curadoria.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Foto Recebida!</h3>
            <p className="text-white/70">Obrigado por ajudar a construir nossa história. 📸</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">

            {/* 1. Informações da Conta Reutilizadas */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                <ShieldCheck className="w-3 h-3" /> Autenticado
              </div>
              <Label className="text-xs text-white/50 uppercase tracking-wider font-semibold">1. Identificação do Autor</Label>
              <div className="space-y-2 pt-1">
                <div className="text-sm font-bold text-semin-yellow">{profile?.full_name || profile?.nickname}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="truncate"><strong>Email:</strong> {profile?.email}</div>
                  <div><strong>WhatsApp:</strong> {profile?.phone || "Não cadastrado"}</div>
                </div>
              </div>
            </div>

            {/* 2. Informações adicionais da foto */}
            <div className="space-y-3">
              <Label className="text-xs text-white/50 uppercase tracking-wider font-semibold">2. Detalhes da Foto</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="photo-turma" className="text-xs text-white/80">Ano / Turma</Label>
                  <Input
                    id="photo-turma"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow h-10 rounded-lg text-xs"
                    placeholder="Ex: 1998 / Turma de 2010"
                    value={formData.anoTurma}
                    onChange={(e) => setFormData({ ...formData, anoTurma: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="photo-desc" className="text-xs text-white/80">Legenda / Descrição</Label>
                  <Input
                    id="photo-desc"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow h-10 rounded-lg text-xs"
                    placeholder="Ex: Aula prática no laboratório"
                    maxLength={50}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3. Consentimento da LGPD */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="lgpd-consent" 
                  className="mt-0.5 border-white/30 data-[state=checked]:bg-semin-yellow data-[state=checked]:border-semin-yellow" 
                  checked={formData.lgpdConsent}
                  onCheckedChange={(checked) => setFormData({ ...formData, lgpdConsent: checked as boolean })}
                />
                <div className="space-y-1 leading-none flex-1">
                  <Label htmlFor="lgpd-consent" className="text-xs text-white/80 cursor-pointer flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-500/90" />
                    3. Aceite de Consentimento LGPD
                  </Label>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-1.5">
                    Concordo em ceder o uso não remunerado da minha imagem para a Galeria do Tempo, conforme nossa política de LGPD (Lei 13.709/2018). Tenho ciência do meu direito de solicitar a remoção a qualquer instante.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Upload do Arquivo (Liberado após aceitar a LGPD) */}
            <div className={`space-y-2 transition-all duration-300 ${!formData.lgpdConsent ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <Label htmlFor="photo-upload" className="text-xs text-white/50 uppercase tracking-wider font-semibold block">
                4. Anexar Foto do Acervo (Máx 5MB)
              </Label>
              <div className="relative">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-semin-yellow/40 text-white flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all"
                >
                  {formData.fileName ? (
                    <>
                      <FileImage className="h-5 w-5 text-semin-yellow animate-bounce" />
                      <span className="text-xs truncate max-w-[260px] text-white/90 font-mono">{formData.fileName}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-white/30" />
                      <span className="text-xs text-white/40">Clique aqui para selecionar a foto</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 5. Enviar arquivo */}
            <Button
              type="submit"
              disabled={isLoading || !formData.lgpdConsent || !formData.fileBase64}
              className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-extrabold hover:brightness-110 h-11 text-sm mt-3 disabled:opacity-30 disabled:grayscale transition-all duration-300 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando para o acervo...
                </>
              ) : (
                "Enviar Foto para Aprovação"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

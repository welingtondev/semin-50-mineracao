import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Camera, Loader2, CheckCircle2, UploadCloud, FileImage, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PhotoUploadModal({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
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
            fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp", // Muda extensão visualmente
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
      // Usando Supabase para armazenar a foto como pendente
      const { error } = await supabase.from('gallery_photos').insert([
        {
          author_name: formData.nome,
          author_email: formData.email,
          author_phone: formData.telefone,
          year_cohort: formData.anoTurma,
          description: formData.descricao,
          image_base64: formData.fileBase64,
          status: 'pending'
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
            Envie sua foto diretamente para o nosso acervo no Google Drive.
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

            {/* Foto Input */}
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="text-white">Selecionar Foto (Máx 5MB)</Label>
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
                  className="w-full h-24 border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-semin-yellow/50 text-white flex flex-col items-center justify-center gap-2"
                >
                  {formData.fileName ? (
                    <>
                      <FileImage className="h-6 w-6 text-semin-yellow" />
                      <span className="text-sm truncate max-w-[200px] text-white/80">{formData.fileName}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-6 w-6 text-white/50" />
                      <span className="text-sm text-white/50">Clique para anexar arquivo</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="photo-nome" className="text-white">Seu Nome</Label>
              <Input
                id="photo-nome"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            {/* Email & Telefone (Visível apenas para usuários normais) */}
            {!isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-email" className="text-white">Email</Label>
                  <Input
                    id="photo-email"
                    type="email"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo-tel" className="text-white">Celular (WhatsApp)</Label>
                  <Input
                    id="photo-tel"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                    placeholder="(XX) 9XXXX-XXXX"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Ano/Turma */}
            <div className="space-y-2">
              <Label htmlFor="photo-turma" className="text-white">Ano da Foto ou Turma (Opcional)</Label>
              <Input
                id="photo-turma"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: 1998 / Turma de 2010"
                value={formData.anoTurma}
                onChange={(e) => setFormData({ ...formData, anoTurma: e.target.value })}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="photo-desc" className="text-white">Descrição da Foto (Opcional, Máx 50 letras)</Label>
              <Input
                id="photo-desc"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-semin-yellow"
                placeholder="Ex: Formatura no laboratório"
                maxLength={50}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="bg-black/20 border border-white/5 rounded-lg p-3 mt-4 text-left flex items-start space-x-3">
              <Checkbox 
                id="lgpd-consent" 
                className="mt-0.5 border-white/30 data-[state=checked]:bg-semin-yellow data-[state=checked]:border-semin-yellow" 
                checked={formData.lgpdConsent}
                onCheckedChange={(checked) => setFormData({ ...formData, lgpdConsent: checked as boolean })}
              />
              <div className="space-y-1 leading-none flex-1">
                <Label htmlFor="lgpd-consent" className="text-xs text-white/80 cursor-pointer flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
                  Termo de Consentimento
                </Label>
                <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                  Concordo em ceder o uso não remunerado da minha imagem para a Galeria do Tempo, conforme nossa política de LGPD (Lei 13.709/2018). Tenho ciência do meu direito de solicitar a remoção a qualquer instante.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.lgpdConsent}
              className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-bold hover:brightness-110 h-12 text-base mt-2 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando para o Drive...
                </>
              ) : (
                "Enviar Arquivo"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

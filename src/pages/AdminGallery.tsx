import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  Image as ImageIcon, 
  Lock, 
  UploadCloud, 
  Maximize2, 
  LogOut,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  CheckCheck
} from "lucide-react";
import { PhotoUploadModal } from "@/components/PhotoUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

type PendingPhoto = {
  id: string;
  author_name: string;
  author_email?: string;
  author_phone?: string;
  year_cohort: string;
  description?: string;
  image_base64: string;
  status: string;
  created_at: string;
};

export default function AdminGallery() {
  const { session, logout } = useAuth();
  const isUserAdmin = session?.user?.email === "contato@seminufba.com.br";
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(
    sessionStorage.getItem("semin_admin_auth") === "true"
  );
  
  const isAuthenticated = isAuthenticatedState || isUserAdmin;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [adminComments, setAdminComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gallery" | "fundraising" | "comments" | "backup">("gallery");

  // Backup State
  const [backupUrl, setBackupUrl] = useState(
    localStorage.getItem("semin_backup_url") || 
    "https://script.google.com/macros/library/d/1QBB62qw948GomPX2CIeRUMfzBw3QTT9_sRsw1GYiVodcuGFoiynxvKWp/3"
  );
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem("semin_auto_backup_enabled") !== "false"
  );
  const [backedUpIds, setBackedUpIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("semin_backed_up_ids") || "[]");
    } catch {
      return [];
    }
  });
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [copiedScript, setCopiedScript] = useState(false);

  // Fundraising State
  const [fundDonations, setFundDonations] = useState(0);
  const [fundSponsorships, setFundSponsorships] = useState(0);
  const [fundId, setFundId] = useState<string | null>(null);
  const [savingFund, setSavingFund] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "seminadmin" && password === "seminufba2026@") {
      setIsAuthenticatedState(true);
      sessionStorage.setItem("semin_admin_auth", "true");
      toast.success("Login efetuado com sucesso!");
    } else {
      toast.error("Usuário ou senha incorretos.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch photos (excluding system rows)
    const { data: photosData, error: photosError } = await supabase
      .from("gallery_photos")
      .select("*")
      .neq("author_name", "SYSTEM_FUNDRAISING")
      .order("created_at", { ascending: false });

    if (photosError) {
      toast.error("Erro ao buscar fotos");
    } else {
      setPhotos(photosData || []);
    }

    // Fetch comments
    const { data: commentsData, error: commentsError } = await supabase
      .from("gallery_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!commentsError) {
      setAdminComments(commentsData || []);
    }

    // Fetch fundraising settings
    const { data: fundData } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("author_name", "SYSTEM_FUNDRAISING")
      .limit(1);

    if (fundData && fundData.length > 0) {
      setFundId(fundData[0].id);
      try {
        const parsed = JSON.parse(fundData[0].description || "{}");
        setFundDonations(parsed.donations || 0);
        setFundSponsorships(parsed.sponsorships || 0);
      } catch (e) {
        console.error("Erro ao parsear config de arrecadação");
      }
    }
    
    setLoading(false);
  };

  const handleSaveFundraising = async () => {
    setSavingFund(true);
    const payload = JSON.stringify({
      donations: fundDonations,
      sponsorships: fundSponsorships
    });

    if (fundId) {
      const { error } = await supabase
        .from("gallery_photos")
        .update({ description: payload })
        .eq("id", fundId);
      if (error) toast.error("Erro ao atualizar arrecadação");
      else toast.success("Valores de arrecadação atualizados!");
    } else {
      const { data, error } = await supabase
        .from("gallery_photos")
        .insert({
          author_name: "SYSTEM_FUNDRAISING",
          year_cohort: "SYSTEM",
          status: "system",
          image_base64: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
          description: payload
        })
        .select();
      if (error) {
        toast.error("Erro ao criar registro de arrecadação");
      } else if (data && data.length > 0) {
        setFundId(data[0].id);
        toast.success("Valores de arrecadação criados!");
      }
    }
    setSavingFund(false);
  };

  const handleBackupToDrive = async (isAuto = false, forceAll = false) => {
    if (!backupUrl) {
      if (!isAuto) toast.error("Insira a URL do Google Apps Script para o backup.");
      return;
    }
    localStorage.setItem("semin_backup_url", backupUrl);
    
    const currentBackedUpIds: string[] = forceAll 
      ? [] 
      : JSON.parse(localStorage.getItem("semin_backed_up_ids") || "[]");
      
    const photosToBackup = forceAll 
      ? photos 
      : photos.filter(p => !currentBackedUpIds.includes(p.id));

    if (photosToBackup.length === 0) {
      if (!isAuto) toast.info("Todas as fotos já estão no Google Drive.");
      return;
    }

    if (!isAuto) setIsBackingUp(true);
    setBackupProgress(0);

    let successCount = 0;
    let errorCount = 0;
    const newlyBackedUp: string[] = [];

    for (let i = 0; i < photosToBackup.length; i++) {
      const photo = photosToBackup[i];
      try {
        const payload = new URLSearchParams();
        payload.append("id", photo.id);
        payload.append("author_name", photo.author_name);
        payload.append("year_cohort", photo.year_cohort || "");
        payload.append("status", photo.status);
        payload.append("image_base64", photo.image_base64);

        await fetch(backupUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload
        });
        successCount++;
        newlyBackedUp.push(photo.id);
      } catch (e) {
        console.error("Erro ao fazer backup da foto " + photo.id, e);
        errorCount++;
      }
      setBackupProgress(Math.round(((i + 1) / photosToBackup.length) * 100));
    }

    const updatedBackedUp = forceAll 
      ? newlyBackedUp 
      : Array.from(new Set([...currentBackedUpIds, ...newlyBackedUp]));
      
    localStorage.setItem("semin_backed_up_ids", JSON.stringify(updatedBackedUp));
    setBackedUpIds(updatedBackedUp);

    if (!isAuto) setIsBackingUp(false);
    
    if (!isAuto) {
      if (errorCount === 0) {
        toast.success(`Backup concluído com sucesso! ${successCount} fotos sincronizadas.`);
      } else {
        toast.warning(`Backup finalizado com ${errorCount} erros e ${successCount} sucessos.`);
      }
    } else if (successCount > 0) {
      toast.success(`Backup automático: ${successCount} nova(s) foto(s) enviada(s) ao Google Drive.`);
    }
  };

  // Disparo automático do backup ao carregar as fotos
  useEffect(() => {
    if (isAuthenticated && autoBackupEnabled && backupUrl && photos.length > 0 && !loading && !isBackingUp) {
      const timer = setTimeout(() => {
        const pending = photos.filter(p => !backedUpIds.includes(p.id));
        if (pending.length > 0) {
          handleBackupToDrive(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, autoBackupEnabled, backupUrl, photos.length, loading]);

  // Intervalo periódico de sincronização automática
  useEffect(() => {
    if (isAuthenticated && autoBackupEnabled && backupUrl && photos.length > 0) {
      const interval = setInterval(() => {
        handleBackupToDrive(true);
      }, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, autoBackupEnabled, backupUrl, photos.length]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Auto-logout timer (15 minutos de inatividade)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          setIsAuthenticated(false);
          sessionStorage.removeItem("semin_admin_auth");
          toast.info("Sessão expirada por inatividade. Faça login novamente.");
        }, 15 * 60 * 1000); // 15 minutos
      }
    };

    if (isAuthenticated) {
      resetTimer();
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setIsAuthenticatedState(false);
    sessionStorage.removeItem("semin_admin_auth");
    if (isUserAdmin) {
      await logout();
    }
    toast.success("Você saiu do painel.");
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("gallery_photos")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error(`Erro ao ${newStatus === "approved" ? "aprovar" : "rejeitar"} foto`);
    } else {
      toast.success(`Foto ${newStatus === "approved" ? "aprovada" : "rejeitada"}!`);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta foto permanentemente?")) return;

    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao deletar foto");
    } else {
      toast.success("Foto deletada do banco de dados.");
      fetchData();
    }
  };

  const handleUpdateCommentStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("gallery_comments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error(`Erro ao ${newStatus === "approved" ? "aprovar" : "rejeitar"} comentário`);
    } else {
      toast.success(`Comentário ${newStatus === "approved" ? "aprovado" : "rejeitado"} com sucesso!`);
      fetchData();
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este comentário permanentemente?")) return;

    const { error } = await supabase
      .from("gallery_comments")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao deletar comentário");
    } else {
      toast.success("Comentário deletado do banco de dados.");
      fetchData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-semin-dark flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-semin-yellow mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold text-white">Acesso Restrito</h1>
            <p className="text-white/50 text-sm mt-2">Área de moderação exclusiva do SEMIN UFBA.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-user" className="text-white/80">Usuário</Label>
              <Input
                id="admin-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-white focus-visible:ring-semin-yellow"
                placeholder="Digite o usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="text-white/80">Senha</Label>
              <Input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-white focus-visible:ring-semin-yellow"
                placeholder="Digite a senha"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-semin-yellow text-semin-dark font-bold hover:bg-semin-yellow/90">
            Entrar no Painel
          </Button>

          <Link to="/" className="block text-center text-white/50 hover:text-semin-yellow text-sm font-medium transition-colors pt-2">
            ← Voltar para o site principal
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-semin-dark text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-semin-yellow flex items-center gap-3">
              <ShieldCheck className="h-8 w-8" />
              Painel de Moderação
            </h1>
            <p className="text-white/60 mt-2">
              Gerencie a Galeria do Tempo e as configurações do Termômetro de Arrecadação.
            </p>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <Link to="/">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-semibold transition-all">
                ← Voltar ao Site
              </Button>
            </Link>
            <Button onClick={fetchData} className="bg-semin-yellow text-semin-dark hover:bg-amber-400 font-bold">
              Atualizar Dados
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              activeTab === "gallery" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Galeria de Fotos
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              activeTab === "comments" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Moderar Comentários
          </button>
          <button
            onClick={() => setActiveTab("fundraising")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              activeTab === "fundraising" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Termômetro de Arrecadação
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "backup" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Backup Drive
          </button>
        </div>

        {activeTab === "fundraising" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl">
            <h2 className="text-2xl font-display font-bold text-semin-yellow mb-6">Configurar Valores de Arrecadação</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="donations" className="text-white/80 font-bold">Total Doações da Comunidade (R$)</Label>
                <Input
                  id="donations"
                  type="number"
                  value={fundDonations}
                  onChange={(e) => setFundDonations(Number(e.target.value))}
                  className="bg-black/20 border-white/10 text-white text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sponsorships" className="text-white/80 font-bold">Total Patrocínios Corporativos (R$)</Label>
                <Input
                  id="sponsorships"
                  type="number"
                  value={fundSponsorships}
                  onChange={(e) => setFundSponsorships(Number(e.target.value))}
                  className="bg-black/20 border-white/10 text-white text-lg"
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSaveFundraising} 
                  disabled={savingFund}
                  className="bg-semin-yellow text-semin-dark font-bold hover:bg-amber-400 w-full md:w-auto"
                >
                  {savingFund ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvar Valores
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-semin-yellow mb-1 flex items-center gap-2">
                    <UploadCloud className="w-6 h-6" /> Backup no Google Drive
                  </h2>
                  <p className="text-white/60 text-sm">
                    Envie todas as fotos do banco de dados para uma pasta no Google Drive automaticamente usando o Google Apps Script.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Sincronização Automática</span>
                    <span className="text-[10px] text-white/50">
                      {autoBackupEnabled ? "Ativa (envia novas fotos automaticamente)" : "Pausada"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !autoBackupEnabled;
                      setAutoBackupEnabled(nextState);
                      localStorage.setItem("semin_auto_backup_enabled", String(nextState));
                      toast.info(nextState ? "Sincronização automática ATIVADA!" : "Sincronização automática PAUSADA.");
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      autoBackupEnabled ? "bg-semin-yellow" : "bg-white/20"
                    }`}
                  >
                    <div
                      className={`bg-semin-dark w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        autoBackupEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Total no Banco</p>
                  <p className="text-2xl font-bold text-white mt-1">{photos.length} fotos</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Sincronizadas no Drive</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    {photos.filter(p => backedUpIds.includes(p.id)).length} fotos
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Pendentes de Envio</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {photos.filter(p => !backedUpIds.includes(p.id)).length} fotos
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="backupUrl" className="text-white/80 font-bold flex items-center justify-between">
                    <span>URL do Webhook (Google Apps Script)</span>
                    <span className="text-xs text-semin-yellow font-normal">Padrão configurado</span>
                  </Label>
                  <Input
                    id="backupUrl"
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={backupUrl}
                    onChange={(e) => {
                      setBackupUrl(e.target.value);
                      localStorage.setItem("semin_backup_url", e.target.value);
                    }}
                    className="bg-black/20 border-white/10 text-white text-sm"
                  />
                  <p className="text-[11px] text-white/40">
                    Webhook ativo para recebimento dos arquivos e armazenamento seguro no Google Drive.
                  </p>
                </div>

                {isBackingUp && (
                  <div className="space-y-2 bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="flex justify-between text-xs text-white/80 font-semibold">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-semin-yellow" />
                        Sincronizando fotos com o Google Drive...
                      </span>
                      <span className="text-semin-yellow font-mono">{backupProgress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-semin-yellow transition-all duration-300"
                        style={{ width: `${backupProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    onClick={() => handleBackupToDrive(false, false)} 
                    disabled={isBackingUp || !backupUrl || photos.length === 0}
                    className="bg-semin-yellow text-semin-dark font-bold hover:bg-amber-400 flex-1 h-11"
                  >
                    {isBackingUp ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sincronizando com o Drive...</>
                    ) : (
                      <><UploadCloud className="w-4 h-4 mr-2" /> Iniciar Backup das Fotos ({photos.length})</>
                    )}
                  </Button>

                  <Button 
                    onClick={() => {
                      if (confirm("Deseja reenviar TODAS as fotos cadastradas para o Google Drive?")) {
                        handleBackupToDrive(false, true);
                      }
                    }} 
                    disabled={isBackingUp || !backupUrl || photos.length === 0}
                    variant="outline"
                    className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white h-11 font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Forçar Reenvio Completo
                  </Button>
                </div>
              </div>
            </div>

            {/* Google Apps Script Reference Guide */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-semin-yellow" /> Código do Google Apps Script (Webhook)
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const scriptCode = `function doPost(e) {
  try {
    var folderName = "SEMIN_50_ANOS_FOTOS";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    var params = e.parameter;
    var base64Data = params.image_base64;
    var author = params.author_name || "Autor";
    var year = params.year_cohort || "Ano";
    var id = params.id || Utilities.getUuid();
    
    var contentType = "image/jpeg";
    var cleanBase64 = base64Data;
    if (base64Data.indexOf("data:") === 0) {
      var parts = base64Data.split(",");
      contentType = parts[0].split(":")[1].split(";")[0];
      cleanBase64 = parts[1];
    }
    
    var decoded = Utilities.base64Decode(cleanBase64);
    var blob = Utilities.newBlob(decoded, contentType, author + "_" + year + "_" + id.substring(0, 8) + ".jpg");
    var file = folder.createFile(blob);
    file.setDescription("Autor: " + author + " | Turma: " + year + " | ID: " + id);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", fileId: file.getId(), url: file.getUrl() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
                    navigator.clipboard.writeText(scriptCode);
                    setCopiedScript(true);
                    toast.success("Código copiado para a área de transferência!");
                    setTimeout(() => setCopiedScript(false), 3000);
                  }}
                  className="text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedScript ? "Copiado!" : "Copiar Script"}
                </Button>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Caso crie uma nova implantação no Google Apps Script, publique como <strong>Aplicativo da Web</strong> com acesso configurado para <em>"Qualquer pessoa"</em> (Anyone).
              </p>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <>
            <div className="flex justify-end mb-6">
              <PhotoUploadModal isAdmin={true}>
                <Button className="bg-semin-yellow text-semin-dark hover:bg-amber-400 font-bold flex">
                  <UploadCloud className="w-4 h-4 mr-2" /> Submeter Nova Foto
                </Button>
              </PhotoUploadModal>
            </div>
            {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-semin-yellow" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Nenhuma foto no banco de dados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] bg-black/50 group">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full h-full relative cursor-pointer">
                        <img
                          src={photo.image_base64}
                          alt="Submission"
                          className="w-full h-full object-contain transition-opacity group-hover:opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 p-3 rounded-full text-white">
                            <Maximize2 className="w-6 h-6" />
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[95vw] h-[85vh] bg-[#0a0c12]/95 border border-white/10 p-4 md:p-6 flex flex-col justify-center items-center shadow-2xl backdrop-blur-xl rounded-2xl z-[100] [&>button]:!bg-semin-yellow [&>button]:!text-semin-dark [&>button]:!opacity-100 [&>button]:hover:!bg-amber-400 [&>button]:hover:!scale-110 [&>button]:!transition-all [&>button]:!w-12 [&>button]:!h-12 [&>button]:!right-4 [&>button]:!top-4 [&>button]:!rounded-full [&>button]:!shadow-xl [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center [&>button>svg]:!w-6 [&>button>svg]:!h-6">
                      <div className="w-full h-full relative flex items-center justify-center bg-black/60 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-inner">
                        <img
                          src={photo.image_base64}
                          alt="Zoomed"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    photo.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    photo.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}>
                    {photo.status === 'approved' ? 'Aprovada' : photo.status === 'rejected' ? 'Rejeitada' : 'Pendente'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white/90 truncate">{photo.author_name}</h3>
                    <p className="text-sm text-white/50 mb-1">Turma/Ano: {photo.year_cohort || 'N/A'}</p>
                    
                    {(photo.author_email || photo.author_phone) && (
                      <div className="mb-2 space-y-0.5">
                        {photo.author_email && <p className="text-xs text-white/40">📧 {photo.author_email}</p>}
                        {photo.author_phone && <p className="text-xs text-white/40">📞 {photo.author_phone}</p>}
                      </div>
                    )}

                    {photo.description && (
                      <p className="text-sm text-white/70 italic mb-2 truncate">"{photo.description}"</p>
                    )}
                    <p className="text-[10px] text-white/30">
                      Enviada em: {new Date(photo.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                    {photo.status !== 'approved' && (
                      <Button
                        onClick={() => handleUpdateStatus(photo.id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                      </Button>
                    )}
                    {photo.status !== 'rejected' && (
                      <Button
                        onClick={() => handleUpdateStatus(photo.id, "rejected")}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Rejeitar
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(photo.id)}
                      variant="ghost"
                      className="col-span-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 mt-2"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Apagar Definitivamente
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {/* Moderate Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-semin-yellow mb-2">Moderação de Comentários</h2>
            <p className="text-sm text-white/50 mb-6">Aprove ou rejeite comentários enviados pela comunidade na Galeria do Tempo.</p>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-semin-yellow" />
              </div>
            ) : adminComments.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Nenhum comentário submetido até o momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminComments.map((comment) => {
                  const relatedPhoto = photos.find(p => p.id === comment.photo_id);
                  return (
                    <div key={comment.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                      <div className="flex gap-4 items-start flex-1">
                        {/* Thumbnail of the commented image */}
                        {relatedPhoto?.image_base64 && (
                          <div className="w-20 h-20 bg-black/50 rounded-xl overflow-hidden shrink-0 border border-white/10">
                            <img src={relatedPhoto.image_base64} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <strong className="text-white text-base">{comment.author_name}</strong>
                            <span className="text-xs text-white/40">
                              {new Date(comment.created_at).toLocaleString("pt-BR")}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              comment.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                              comment.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                            }`}>
                              {comment.status === 'approved' ? 'Aprovado' : comment.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                            </span>
                          </div>
                          {relatedPhoto && (
                            <p className="text-xs text-semin-yellow">
                              Na foto: "{relatedPhoto.caption}"
                            </p>
                          )}
                          <p className="text-white/80 text-sm italic font-body pt-2 leading-relaxed">
                            "{comment.comment_text}"
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 shrink-0 flex-wrap pt-4 md:pt-0">
                        {comment.status !== 'approved' && (
                          <Button
                            onClick={() => handleUpdateCommentStatus(comment.id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs py-1.5 h-8 px-3 rounded-lg"
                          >
                            Aprovar
                          </Button>
                        )}
                        {comment.status !== 'rejected' && (
                          <Button
                            onClick={() => handleUpdateCommentStatus(comment.id, "rejected")}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs py-1.5 h-8 px-3 rounded-lg"
                          >
                            Rejeitar
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteComment(comment.id)}
                          variant="ghost"
                          className="text-white/40 hover:text-red-400 hover:bg-red-500/10 text-xs py-1.5 h-8 px-3 rounded-lg"
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

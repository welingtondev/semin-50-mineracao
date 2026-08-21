import React, { useState } from "react";
import { Play, Sparkles, Diamond, Crown, Clapperboard, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { SponsorModal } from "./SponsorModal";
import { toast } from "sonner";
import documentaryPoster from "@/assets/documentary-poster.webp";

// URL ativa da planilha Google Sheets fornecida pelo usuário
const SUGGESTION_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxutodaEtABT1eOEVKffTlGZhqGAA9wr_zV-Rbk-azPLqyIl4MtAXKtjFp1Kx-X1x2LVw/exec";

const DocumentarySection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: "historia",
    sugestao: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      // Envia os dados estruturados exatamente de acordo com o Script do Google Sheets
      const urlParams = new URLSearchParams();
      urlParams.append("nome", formData.nome);
      urlParams.append("email", formData.email);
      urlParams.append("tipo", formData.tipo);
      urlParams.append("sugestao", formData.sugestao);
      urlParams.append("data_hora", new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      await fetch(SUGGESTION_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlParams,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      toast.success("Sugestão enviada com sucesso!");
    } catch (error: any) {
      console.warn("Erro ao registrar no Google Sheets, gravando em fallback local:", error?.message || error);

      // Fallback: Salva no localStorage para resiliência no cliente
      try {
        const localDataStr = localStorage.getItem("local_documentary_suggestions") || "[]";
        const localData = JSON.parse(localDataStr);
        localData.push({
          ...formData,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("local_documentary_suggestions", JSON.stringify(localData));
      } catch (err) {
        console.error("Falha ao salvar no localStorage:", err);
      }

      toast.success("Sugestão salva com sucesso!");
    } finally {
      // Limpa apenas a caixa de texto da sugestão mantendo os dados de contato do usuário
      setFormData((prev) => ({ ...prev, sugestao: "" }));
      setFormSubmitting(false);
    }
  };

  return (
    <section id="documentario" className="py-20 md:py-32 bg-semin-cream relative overflow-hidden">
      {/* Cinematic Lighting - Warm gold aura for light theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-semin-yellow/20 blur-[120px] rounded-full pointer-events-none opacity-60" />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          
          {/* Film Poster Style Image */}
          <div className={`w-full lg:w-1/2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow/30 to-semin-orange/30 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-700" />
              
              <div className="relative bg-semin-dark rounded-[2rem] overflow-hidden border border-black/10 shadow-2xl aspect-[3/4] md:aspect-video lg:aspect-[3/4]">
                <img 
                  src={documentaryPoster} 
                  alt="Documentário 50 Anos" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-semin-dark via-transparent to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-semin-yellow/20 backdrop-blur-md border border-semin-yellow/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                    <Play className="h-8 w-8 text-semin-yellow fill-semin-yellow/20" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-semin-yellow text-semin-dark font-black text-[10px] uppercase tracking-tighter mb-3">
                    Estreia em Novembro
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">50 Anos de História</h4>
                  <p className="text-white/60 text-sm">Uma jornada épica desde a fundação até o futuro da mineração.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className={`w-full lg:w-1/2 text-left transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-yellow/40 bg-semin-yellow/20 mb-8 shadow-sm">
              <Clapperboard className="h-4 w-4 text-semin-orange" />
              <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-black text-semin-orange">
                Documentário 50 Anos
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-semin-blue mb-8 tracking-tight leading-tight">
              O Legado em <br />
              <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold">Alta Definição</span>
            </h2>

            <div className="space-y-6 text-base md:text-lg text-semin-blue/80 leading-relaxed mb-12 font-medium">
              <p>
                Estamos imortalizando a história da Engenharia de Minas na UFBA através de uma obra audiovisual sem precedentes. Este documentário é o resgate das vozes e visões de um curso que transformou a Bahia em um expoente mineral.
              </p>
              <p>
                Através de depoimentos de fundadores, imagens inéditas de arquivo e a análise da influência do curso nas grandes operações do estado, vamos eternizar a jornada épica que conectou a academia ao coração da indústria mineral baiana.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <SponsorModal>
                <Button size="lg" className="h-16 px-8 rounded-2xl bg-semin-yellow text-semin-dark font-black text-lg hover:bg-semin-blue hover:text-white transition-all shadow-[0_10px_30px_rgba(210,155,33,0.25)] group hover:scale-[1.02] active:scale-[0.98]">
                  Seja um Mecenas
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </SponsorModal>
              
              <div className="flex items-center gap-4 px-6 border border-black/5 rounded-2xl bg-white shadow-sm">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-semin-yellow/20 flex items-center justify-center"><Diamond className="h-4 w-4 text-semin-orange" /></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-semin-orange/20 flex items-center justify-center"><Crown className="h-4 w-4 text-semin-orange" /></div>
                </div>
                <span className="text-xs font-bold text-semin-blue/50 uppercase tracking-widest">Apoio exclusivo Cota Diamante</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Form Section */}
        <div className={`mt-20 md:mt-32 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.03)] border border-black/[0.03] overflow-hidden group">
            {/* Ambient gold glow inside card */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-semin-yellow/10 rounded-full blur-[60px] pointer-events-none transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-semin-yellow/20 text-semin-orange font-bold text-[10px] md:text-xs uppercase tracking-wider mb-3">
                Participe do Legado
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-semin-blue mb-3">
                Deixe sua marca no Documentário e na Programação
              </h3>
              <p className="text-semin-blue/60 text-sm max-w-xl mx-auto font-medium">
                Indique histórias marcantes, personagens inesquecíveis, documentos históricos ou temas técnicos que você acredita que não podem faltar nas comemorações dos 50 anos.
              </p>
            </div>

            <form onSubmit={handleSuggestionSubmit} className="space-y-6 relative z-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Seu Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    placeholder="Como quer ser chamado?"
                    className="w-full px-4 h-12 bg-semin-cream/40 border border-black/[0.08] text-semin-blue rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-semin-blue/30 font-medium outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Seu E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="exemplo@email.com"
                    className="w-full px-4 h-12 bg-semin-cream/40 border border-black/[0.08] text-semin-blue rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-semin-blue/30 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Tipo de Sugestão</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 h-12 bg-semin-cream/40 border border-black/[0.08] text-semin-blue rounded-xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all font-medium outline-none cursor-pointer"
                >
                  <option value="historia">📚 História ou Causo do Curso</option>
                  <option value="personagem">👨‍🏫 Professor ou Personagem Marcante</option>
                  <option value="marco">🏗️ Marco ou Acontecimento Histórico</option>
                  <option value="outro">💡 Outra Ideia ou Sugestão Técnica</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-semin-blue/60 ml-1">Sua Sugestão / Depoimento</label>
                <textarea
                  name="sugestao"
                  value={formData.sugestao}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Conte um caso marcante, sugira uma pessoa chave para depor no documentário, ou um tema técnico indispensável para a programação..."
                  className="w-full p-4 bg-semin-cream/40 border border-black/[0.08] text-semin-blue rounded-2xl focus:border-semin-orange/50 focus:bg-white focus:ring-4 focus:ring-semin-orange/10 transition-all placeholder:text-semin-blue/30 font-medium resize-none outline-none min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={formSubmitting}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-semin-orange to-semin-yellow text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border-0"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando Sugestão...
                  </>
                ) : (
                  <>
                    Enviar Sugestão
                    <Sparkles className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DocumentarySection;

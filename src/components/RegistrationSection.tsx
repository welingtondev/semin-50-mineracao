import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, CheckCircle2, GraduationCap, Award, Building, Sparkles } from "lucide-react";
import { RegistrationModal } from "./RegistrationModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const personas = [
  {
    title: "Estudantes",
    icon: GraduationCap,
    description: "Conecte-se ao mercado de trabalho, emita seu certificado de participação e impulsione sua carreira na engenharia de minas."
  },
  {
    title: "Alumni & Profissionais",
    icon: Award,
    description: "Reencontre colegas, expanda seu networking e celebre o legado de 50 anos do curso que formou sua trajetória."
  },
  {
    title: "Empresas & Parceiros",
    icon: Building,
    description: "Posicione sua marca, identifique novos talentos e interaja diretamente com o futuro do setor mineral."
  }
];

const RegistrationSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="inscricoes" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />
      <div className="absolute top-0 right-0 w-48 md:w-[500px] h-48 md:h-[500px] bg-semin-yellow/15 rounded-full blur-[30px] md:blur-[140px] opacity-70" />
      <div className="absolute bottom-0 left-0 w-40 md:w-96 h-40 md:h-96 bg-semin-orange/10 rounded-full blur-[25px] md:blur-[120px] opacity-70" />

      <div ref={ref} className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 border border-semin-orange/20 rounded-full bg-semin-orange/5 shadow-sm">
            <Sparkles className="h-4 w-4 text-semin-orange" />
            <span className="font-body text-xs text-semin-orange font-bold uppercase tracking-widest">Jubileu de Ouro • Acesso Gratuito</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 text-semin-blue tracking-tight leading-tight">
            Faça Parte Deste <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold">Marco Histórico</span>
          </h2>
          
          <p className="font-body text-base md:text-xl text-semin-blue/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Junte-se a nós para celebrar as cinco décadas de história, excelência e inovação da Engenharia de Minas da UFBA. Um encontro imperdível para conectar gerações e debater o futuro da mineração.
          </p>
        </div>

        {/* Central Registration Card */}
        <div className={`relative bg-white rounded-3xl p-8 md:p-12 border border-semin-yellow/30 shadow-2xl shadow-semin-orange/10 mb-16 max-w-3xl mx-auto transition-all duration-700 delay-100 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-semin-orange to-amber-500 text-semin-dark text-sm font-black px-6 py-2 rounded-full uppercase tracking-wider shadow-md">
            Credencial Ouro
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-display font-bold text-semin-blue mb-4 mt-4">Sua Experiência Completa na SEMIN</h3>
            <p className="text-semin-blue/70">Uma vivência integrada de 5 dias pensada para estudantes, ex-alunos e profissionais do setor. Garanta sua credencial oficial com acesso a todos os benefícios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 border-y border-black/5 py-8">
            {[
              "Acesso integral aos 5 dias de programação",
              "Certificado digital de participação oficial",
              "Kit e material exclusivo do congresso",
              "Entrada em todas as palestras e painéis",
              "Oportunidade de inscrição em minicursos",
              "Networking de alto nível com líderes do setor"
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-semin-blue/80 font-semibold">{feat}</span>
              </div>
            ))}
          </div>

          <RegistrationModal>
            <Button
              size="lg"
              className="w-full font-bold py-8 text-lg rounded-2xl bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:shadow-xl hover:shadow-semin-orange/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <HardHat className="w-6 h-6 mr-3" />
              Garantir Minha Credencial Ouro
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </RegistrationModal>
        </div>

        {/* Why Participate Section */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="text-center text-2xl font-bold text-semin-blue mb-8">O evento perfeito para você</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <div key={persona.title} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-semin-orange/10 rounded-xl flex items-center justify-center mb-4 text-semin-orange">
                  <persona.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-display font-bold text-semin-blue mb-2">{persona.title}</h4>
                <p className="text-sm text-semin-blue/70 leading-relaxed">{persona.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RegistrationSection;

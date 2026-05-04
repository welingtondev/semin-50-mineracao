import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ChallengeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { num: "01", title: "Cadastre-se", desc: "Crie sua conta e junte-se à comunidade usando seu email e nickname.", icon: "👤" },
    { num: "02", title: "Responda", desc: "Perguntas de conhecimentos gerais, técnica mineral e causos históricos da Escola.", icon: "⛏️" },
    { num: "03", title: "Acumule Pontos", desc: "Sua agilidade e precisão rendem pontos. Sequências de acertos elevam o bônus.", icon: "🔥" },
    { num: "04", title: "Domine o Placar", desc: "Destaque-se no ranking do evento e concorra a brindes exclusivos da nossa comemoração.", icon: "🏆" },
  ];

  return (
    <section ref={ref} id="desafio" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0c12 0%, #161b22 50%, #0a0c12 100%)" }}>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(210,155,33,0.15), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{ background: "rgba(210,155,33,0.1)", border: "1px solid rgba(210,155,33,0.2)", color: "#d29b21" }}>
            Novo
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 text-white tracking-tight leading-tight">
            DESAFIO <span className="text-semin-yellow">SEMIN UFBA</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Um quiz interativo em homenagem ao Jubileu de Ouro. Teste seus conhecimentos técnicos e descubra fatos marcantes da história da Engenharia de Minas da UFBA enquanto disputa o topo do ranking.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className="relative rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                   style={{ color: "#d29b21" }}>
                Passo {step.num}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center">
            <h4 className="text-4xl font-black text-transparent bg-clip-text mb-2"
                 style={{ backgroundImage: "linear-gradient(135deg, #d29b21, #b3821a)" }}>
              20
            </h4>
            <p className="text-white/30 text-sm font-medium">
              Perguntas por partida
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black text-transparent bg-clip-text mb-2"
                 style={{ backgroundImage: "linear-gradient(135deg, #d29b21, #b3821a)" }}>
              50 Anos
            </h4>
            <p className="text-white/30 text-sm font-medium">
              De história em jogo
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black text-transparent bg-clip-text mb-2"
                 style={{ backgroundImage: "linear-gradient(135deg, #d29b21, #b3821a)" }}>
              Ranking
            </h4>
            <p className="text-white/30 text-sm font-medium">
              Vencedores premiados
            </p>
          </div>
        </div>


        {/* CTA */}
        <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link to="/quiz">
            <button className="px-10 py-4 rounded-xl text-lg font-bold shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #d29b21, #b3821a)",
                color: "#ffffff",
                boxShadow: "0 0 40px rgba(210,155,33,0.2)",
              }}>
              Jogar Agora →
            </button>
          </Link>
          <p className="text-white/20 text-xs mt-4">
            Gratuito · Sem download · Direto no navegador
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChallengeSection;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThankYouPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-semin-dark flex items-center justify-center relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-semin-yellow/30 to-transparent" />
      <div className="absolute top-[20%] right-[10%] w-64 md:w-[500px] h-64 md:h-[500px] bg-semin-yellow/5 rounded-full blur-[60px] md:blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-48 md:w-[400px] h-48 md:h-[400px] bg-semin-orange/5 rounded-full blur-[40px] md:blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[400px] md:h-[700px] border border-semin-yellow/[0.03] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-700">
        {/* Glassmorphism card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16 shadow-2xl">
          {/* Success icon with glow */}
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(210,155,33,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-semin-yellow" />
            <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold bg-gradient-to-r from-semin-yellow to-semin-orange bg-clip-text text-transparent">
              Jubileu de Ouro • 50 Anos
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">
            Muito Obrigado pelo seu{" "}
            <span className="bg-gradient-to-r from-semin-yellow via-amber-300 to-semin-orange bg-clip-text text-transparent">
              apoio
            </span>{" "}
            à nossa história!
          </h1>

          <p className="font-body text-base md:text-lg text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
            Sua contribuição é fundamental para tornar a celebração dos 50 anos da Engenharia de Minas da UFBA um evento memorável. Juntos, construímos o futuro.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/30 mb-10">
            <Heart className="h-4 w-4 text-red-400/60" fill="currentColor" />
            <span className="text-sm font-body">De toda a comunidade SEMIN UFBA</span>
            <Heart className="h-4 w-4 text-red-400/60" fill="currentColor" />
          </div>

          {/* CTA back to home */}
          <Link to="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-display font-bold text-base md:text-lg px-8 py-7 rounded-xl shadow-2xl shadow-semin-yellow/20 transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-semin-yellow/40 group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Site
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;

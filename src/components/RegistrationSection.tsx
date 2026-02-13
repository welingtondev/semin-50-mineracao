import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, Mountain, Pickaxe } from "lucide-react";
import { motion } from "framer-motion";

const RegistrationSection = () => {
  return (
    <section id="inscricoes" className="py-24 md:py-32 bg-semin-blue relative overflow-hidden">
      {/* Mining-themed animated bg */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-semin-yellow/8 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-semin-orange/6 rounded-full blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--semin-blue))_70%)]" />
      
      {/* Mining silhouette decoration */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.04]">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path d="M0,120 L200,80 L350,130 L500,60 L650,110 L800,50 L950,100 L1100,70 L1250,120 L1440,80 L1440,200 L0,200Z" fill="hsl(40 73% 48%)" />
        </svg>
      </div>

      {/* Floating mining icons */}
      <motion.div
        className="absolute top-20 left-[15%] text-semin-yellow/10"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Pickaxe className="h-12 w-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-[15%] text-semin-yellow/10"
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <Mountain className="h-16 w-16" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-semin-yellow/20 rounded-full bg-semin-yellow/5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <HardHat className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs text-semin-yellow font-medium uppercase tracking-wider">Vagas limitadas</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Inscreva-se no SEMIN
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-4 w-4 text-semin-yellow/60" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-lg text-white/60 mb-4 leading-relaxed">
            Participe do principal evento de mineração da UFBA e celebre conosco os 50 anos da
            Engenharia de Minas. Garanta sua vaga!
          </p>
          <p className="font-body text-sm text-semin-yellow/60 mb-12">
            Inscrições abertas para estudantes, profissionais e professores
          </p>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-xl px-14 py-8 shadow-2xl shadow-semin-yellow/30 group transition-all duration-300 hover:scale-105 hover:shadow-semin-yellow/50"
            >
              <HardHat className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
              Inscreva-se Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationSection;

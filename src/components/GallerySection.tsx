import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, Mountain, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import mineTunnelBg from "@/assets/mine_tunnel_bg.png";

type PhotoItem = {
  id: number;
  caption: string;
};

const photos: PhotoItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  caption: `Espaço reservado #${i + 1}`,
}));

// — Tunnel Breakthrough Intro —
const TunnelDetonationIntro = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Wait for the dust storm before letting the gallery appear
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1.5 }}
    >
      {/* Heavy dust / darkness filling the tunnel initially */}
      <div className="absolute inset-0 bg-[#06070a]" />

      {/* A distant detonation flash deep inside the tunnel */}
      <motion.div
        className="absolute rounded-full mix-blend-screen w-[200px] h-[200px]"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, #ff8c00 40%, transparent 70%)",
          filter: "blur(10px)",
          willChange: "transform, opacity",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4, 10], opacity: [0, 0.8, 0.1] }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeIn", times: [0, 0.2, 1] }}
      />
      
      {/* Shockwave running out of the tunnel towards us */}
      <motion.div
        className="absolute rounded-full border-amber-500/30 border-[10px] w-[100px] h-[100px]"
        style={{ willChange: "transform, opacity" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 35], opacity: [0, 1, 0] }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeIn" }}
      />
      
      {/* Thick dust cloud that envelops us as we push through */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(40, 26, 16, 0.95) 0%, rgba(10, 5, 2, 1) 100%)",
          willChange: "transform, opacity",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
        transition={{ duration: 1.6, delay: 0.4, times: [0, 0.4, 1], ease: "easeInOut" }}
      />
    </motion.div>
  );
};

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.05);

  useEffect(() => {
    if (isVisible && !introStarted) setIntroStarted(true);
  }, [isVisible, introStarted]);

  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % photos.length); };
  const goPrev = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length); };

  return (
    <section id="galeria" className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#0a0c12" }}>
      {/* Background — mine tunnel */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={mineTunnelBg}
          alt=""
          className="w-full h-full object-cover origin-center"
          style={{ opacity: 0.15, filter: "saturate(0.25) brightness(0.5)", willChange: "transform" }}
          initial={{ scale: 1 }}
          animate={introStarted ? { scale: 1.3 } : { scale: 1 }}
          transition={{ duration: 4.5, ease: "backOut" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(10,12,18,1) 0%, rgba(10,12,18,0.6) 50%, rgba(10,12,18,1) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,12,18,0.9) 90%)"
        }} />
        <div className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          style={{ background: "radial-gradient(ellipse at center, rgba(180,130,40,0.08) 0%, transparent 60%)" }} />
      </div>

      {/* Intro cinematic */}
      <AnimatePresence>
        {introStarted && !introPlayed && (
          <TunnelDetonationIntro onComplete={() => setIntroPlayed(true)} />
        )}
      </AnimatePresence>

      <div ref={ref} className="container mx-auto px-4 relative z-10 pt-4">
        <motion.div 
          className="text-center mb-8 md:mb-14"
          style={{ willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={introPlayed ? { 
            opacity: 1, 
            scale: 1, 
            y: 0
          } : {}}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-amber-400/80 font-semibold mb-3 md:mb-4">
            <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Galeria do Tempo
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4" style={{ textShadow: "0 4px 20px rgba(210,155,33,0.15)" }}>
            Memórias que iluminam
          </h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-400/40 rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400/40" />
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-400/40 rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-white/50 max-w-xl mx-auto mb-6">
            Registros de quem viveu a história da Engenharia de Minas da UFBA. <br className="hidden md:block" />
            Rostos, amizades e conquistas que atravessam décadas.
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-6xl mx-auto relative px-4 md:px-12 lg:px-0"
          style={{ willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={introPlayed ? { 
            opacity: 1, 
            scale: 1,
            y: 0
          } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {photos.map((item, i) => (
                <CarouselItem key={item.id} className="pl-3 md:pl-4 basis-[80%] sm:basis-[60%] md:basis-1/3 lg:basis-1/4">
                  <div
                    className="h-full relative aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-white/5 border-2 border-dashed border-white/10 bg-black/40 flex flex-col items-center justify-center transition-all duration-300 group"
                  >
                    <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                      <Camera className="h-8 w-8 mb-3 text-amber-400" />
                      <span className="font-body text-[10px] md:text-xs text-white uppercase tracking-wider font-semibold text-center px-4">Sua foto aqui</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
                      <p className="font-body text-xs md:text-sm font-medium text-white/90 drop-shadow-md border-b flex flex-wrap border-amber-400/30 pb-1 w-fit">{item.caption}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {photos.length > 2 && (
              <>
                <CarouselPrevious className="absolute -left-2 md:-left-6 lg:-left-12 bg-black/50 border-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-black top-1/2 -translate-y-1/2 shadow-lg z-20 h-10 w-10 md:h-12 md:w-12 transition-all duration-300" />
                <CarouselNext className="absolute -right-2 md:-right-6 lg:-right-12 bg-black/50 border-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-black top-1/2 -translate-y-1/2 shadow-lg z-20 h-10 w-10 md:h-12 md:w-12 transition-all duration-300" />
              </>
            )}
          </Carousel>
        </motion.div>

        <motion.div 
          className="text-center mt-10 md:mt-16 max-w-2xl mx-auto px-2"
          style={{ willChange: "transform, opacity" }}
          initial={{ opacity: 0, y: 40 }}
          animate={introPlayed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
        >
          <div className="bg-semin-yellow/[0.03] border border-semin-yellow/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/[0.05] to-amber-400/0 group-hover:translate-x-full transition-transform duration-1000" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-display">Preserve sua História</h3>
            <p className="text-sm md:text-base text-white/50 mb-6">
              Você tem um arquivo pessoal com fotos da sua turma ou de edições antigas da Semana? Ajude a construir a maior galeria digital da Engenharia de Minas.
            </p>
            <a
              href="mailto:semin@ufba.br?subject=Fotos%20Galeria%20do%20Tempo%20SEMIN%202026"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity" />
              📸 Enviar Minhas Fotos
            </a>
          </div>
        </motion.div>
      </div>

      {/* Lightbox is disabled while there are no photos */}
    </section>
  );
};

export default GallerySection;

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mountain, Heart, ShieldCheck, Maximize2, Loader2, MessageSquare } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Autoplay from "embla-carousel-autoplay";
import mineTunnelBg from "@/assets/mine_tunnel_bg.webp";
import { PhotoUploadModal } from "./PhotoUploadModal";
import { supabase } from "@/lib/supabase";

type PhotoItem = {
  id: number | string;
  caption: string;
  author?: string;
  year?: string;
  image_base64?: string;
  likes_count?: number;
};

// Fallback inicial enquanto carrega (sem autores fictícios)
const defaultPhotos: PhotoItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `placeholder-${i}`,
  caption: "Espaço Reservado",
  likes_count: 0
}));

// — A Ambientação: Frente de Lavra e Estopim de Luz —
const RockShatterIntro = ({ onComplete, isMobile }: { onComplete: () => void, isMobile: boolean }) => {
  const [isArming, setIsArming] = useState(false);
  const [isDetonated, setIsDetonated] = useState(false);
  const [mousePos, setMousePos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };
    
    // Pequeno delay para garantir que o layout renderizou
    setTimeout(updateRect, 100);
    
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  useEffect(() => {
    if (isArming && !isDetonated) {
      // O cordel detonante corre por 1.4s antes da explosão
      const timer = setTimeout(() => setIsDetonated(true), 1400);
      return () => clearTimeout(timer);
    }
  }, [isArming, isDetonated]);

  useEffect(() => {
    if (isDetonated) {
      // Tempo da transição fluida do vidro flutuando
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }
  }, [isDetonated, onComplete]);

  // Gera menos fragmentos no mobile para não travar
  const shards = Array.from({ length: isMobile ? 6 : 20 });

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden cursor-crosshair"
      onMouseMove={(e) => {
        if (!isDetonated && rectRef.current) {
          setMousePos({ x: e.clientX - rectRef.current.left, y: e.clientY - rectRef.current.top });
        }
      }}
      onClick={() => {
        if (!isArming && !isDetonated) setIsArming(true);
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDetonated ? 0 : 1 }}
      transition={{ duration: 1.5, delay: 2.0 }} // Fade out do fundo
    >
      {/* 1. Parede de Rocha com Efeito Lanterna */}
      <AnimatePresence>
        {!isDetonated && (
          <motion.div
            className="absolute inset-0 bg-[#030405]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            {/* Textura simulada e partículas iluminadas pela "lanterna" do mouse */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                backgroundImage: isMobile 
                  ? 'none' 
                  : 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.25%22/%3E%3C/svg%3E")',
                maskImage: isMobile ? 'none' : `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                WebkitMaskImage: isMobile ? 'none' : `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                background: isMobile ? 'radial-gradient(circle at center, #1a1d24 0%, #030405 100%)' : undefined
              }}
            />
            {/* Malha de Perfuração, Título e Fio Estopim */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
              
              {/* Título e Instruções - agora usando flex stack para não sobrepor */}
              <div className="flex flex-col items-center text-center max-w-4xl mb-12 sm:mb-16">
                <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter leading-none">
                  Memórias em{" "}
                  <span className="bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.55)] block md:inline-block">
                    Cadeia
                  </span>
                </h2>
                <p className="font-body text-white/70 font-medium text-sm md:text-base leading-relaxed mb-6">
                  Nossa galeria colaborativa está oculta na rocha do tempo. Detone e extraia esses registros preciosos da história da Engenharia de Minas.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-semin-yellow/10 border border-semin-yellow/30 text-semin-yellow text-sm font-semibold uppercase tracking-wider animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-semin-yellow"></div>
                  Clique para Detonar e Revelar
                </div>
              </div>

              {/* Wrapper do Grid e Cordel para manter alinhamento perfeito */}
              <div className="relative flex items-center justify-center">
                {/* Grid de Pontos */}
                <div className="grid grid-cols-4 gap-8 opacity-70 relative z-10">
                  {Array.from({length: 16}).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#ffaa00]"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>

                {/* Animação do Cordel Detonante ligando os pontos (Reação em Cadeia) */}
                {isArming && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible opacity-90">
                      <motion.path
                        d="M 10 10 L 50 10 L 50 50 L 90 50 L 90 90 L 130 90"
                        stroke="#ffaa00"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: "drop-shadow(0 0 8px #ffaa00)" }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.3, ease: "linear" }}
                      />
                      <motion.circle
                        r="6"
                        fill="#ffffff"
                        style={{ filter: "drop-shadow(0 0 15px #ffffff)" }}
                        animate={{
                          cx: [10, 50, 50, 90, 90, 130],
                          cy: [10, 10, 50, 50, 90, 90]
                        }}
                        transition={{ duration: 1.3, ease: "linear" }}
                      />
                    </svg>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. O Estopim de Luz e Derretimento (Transição) */}
      {isDetonated && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          {/* Luz dourada vazando das fendas (O Estopim de Luz) */}
          <motion.div
            className="absolute inset-0 mix-blend-color-dodge"
            style={{ background: 'radial-gradient(circle at center, rgba(255,180,0,0.6) 0%, transparent 60%)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 4] }}
            transition={{ duration: 2.5, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* 3. Estilhaços de Vidro (Flutuando suavemente para as bordas) */}
          {shards.map((_, i) => {
            const angle = (i / shards.length) * Math.PI * 2;
            const distance = 500 + Math.random() * 600; // Flutua suavemente para as bordas
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const rotate = (Math.random() - 0.5) * 90; // Rotação bem suave
            
            return (
              <motion.div
                key={i}
                className={`absolute w-32 h-32 sm:w-56 sm:h-56 border-[0.5px] border-white/20 shadow-[0_0_20px_rgba(255,200,0,0.1)] ${isMobile ? 'bg-white/10' : 'bg-white/5'}`}
                style={{
                  backdropFilter: isMobile ? "none" : "blur(8px)",
                  WebkitBackdropFilter: isMobile ? "none" : "blur(8px)",
                  clipPath: `polygon(${Math.random()*30}% ${Math.random()*30}%, ${70+Math.random()*30}% ${Math.random()*30}%, ${70+Math.random()*30}% ${70+Math.random()*30}%, ${Math.random()*30}% ${70+Math.random()*30}%)`,
                }}
                initial={{ x: 0, y: 0, scale: 0.5, rotate: 0, opacity: 0 }}
                animate={{ 
                  x: [0, x], 
                  y: [0, y], 
                  scale: [0.5, 1.2, 1.5], 
                  rotate: [0, rotate],
                  opacity: [0, 0.4, 0]
                }}
                transition={{ duration: 3.5, ease: [0.76, 0, 0.24, 1] }} // power4.inOut
              />
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

const GallerySection = () => {
  const [introStarted, setIntroStarted] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [photos, setPhotos] = useState<PhotoItem[]>(defaultPhotos);

  // Community Interactions States
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("semin_liked_photos");
    if (saved) {
      try {
        setLikedPhotos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchComments = async (photoId: string | number) => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("gallery_comments")
      .select("*")
      .eq("photo_id", photoId)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments(data);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    if (selectedPhoto) {
      fetchComments(selectedPhoto.id);
    } else {
      setComments([]);
    }
  }, [selectedPhoto]);

  useEffect(() => {
    // Busca fotos aprovadas no Supabase
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mappedPhotos = data.map(dbPhoto => ({
          id: dbPhoto.id,
          caption: dbPhoto.description || "Acervo Histórico",
          author: dbPhoto.author_name,
          year: dbPhoto.year_cohort,
          image_base64: dbPhoto.image_base64,
          likes_count: dbPhoto.likes_count || 0
        }));
        
        // Se houver menos que 4 fotos, preenchemos com os placeholders para não quebrar o carrossel
        if (mappedPhotos.length < 4) {
          setPhotos([...mappedPhotos, ...defaultPhotos.slice(mappedPhotos.length, 4)]);
        } else {
          setPhotos(mappedPhotos);
        }
      }
    };

    fetchPhotos();
  }, []);

  const handleLike = async (photo: PhotoItem) => {
    if (likedPhotos.includes(photo.id.toString())) {
      toast.error("Você já curtiu esta foto!");
      return;
    }

    const newLikes = (photo.likes_count || 0) + 1;
    const updatedLiked = [...likedPhotos, photo.id.toString()];
    setLikedPhotos(updatedLiked);
    localStorage.setItem("semin_liked_photos", JSON.stringify(updatedLiked));

    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: newLikes } : p));
    if (selectedPhoto && selectedPhoto.id === photo.id) {
      setSelectedPhoto({ ...selectedPhoto, likes_count: newLikes });
    }

    const { error } = await supabase
      .from("gallery_photos")
      .update({ likes_count: newLikes })
      .eq("id", photo.id);

    if (error) {
      toast.error("Erro ao registrar curtida.");
    } else {
      toast.success("Obrigado pela curtida! ❤️");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) return;
    if (!newCommentName.trim() || !newCommentText.trim()) {
      toast.error("Preencha seu nome e o comentário.");
      return;
    }

    setIsSubmittingComment(true);
    const { error } = await supabase
      .from("gallery_comments")
      .insert({
        photo_id: selectedPhoto.id,
        author_name: newCommentName.trim(),
        comment_text: newCommentText.trim(),
        status: "pending"
      });

    if (error) {
      toast.error("Erro ao enviar comentário.");
    } else {
      toast.success("Comentário enviado! Aguardando moderação. ✨");
      setNewCommentName("");
      setNewCommentText("");
    }
    setIsSubmittingComment(false);
  };

  useEffect(() => {
    if (isVisible && !introStarted) setIntroStarted(true);
  }, [isVisible, introStarted]);

  return (
    <section id="galeria" className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#0a0c12" }}>
      {/* Background — mine tunnel */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={mineTunnelBg}
          alt=""
          className="w-full h-full object-cover origin-center"
          style={{ opacity: 0.15, filter: "saturate(0.25) brightness(0.5)", transform: introStarted && !isMobile ? "scale(1.3)" : "scale(1)", transition: "transform 4.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          loading="lazy"
          width="1440"
          height="810"
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
          <RockShatterIntro onComplete={() => setIntroPlayed(true)} isMobile={isMobile} />
        )}
      </AnimatePresence>

      <div ref={ref} className="container mx-auto px-4 relative z-10 pt-4">
          <motion.div 
            className="text-center mb-8 md:mb-14"
            style={{ willChange: "transform, opacity, filter" }}
            initial={{ opacity: 0, scale: 0.9, y: 15, filter: isMobile ? "blur(4px)" : "blur(12px)" }}
            animate={introPlayed ? { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              filter: "blur(0px)"
            } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-amber-400/80 font-semibold mb-3 md:mb-4">
            <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Galeria do Tempo
          </span>
          <motion.h2 
            className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter leading-none"
          >
            <span className="text-white/95">Memórias em </span>
            <span className="bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.55)] block md:inline-block">Cadeia</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-400/40 rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400/40" />
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-400/40 rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-amber-400 font-medium max-w-xl mx-auto mb-2">
            Onde cada história é o estopim da próxima.
          </p>
          <p className="font-body text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-6 leading-relaxed">
            Registros vivos da Engenharia de Minas da UFBA: uma sequência de rostos e conquistas que geram ondas de impacto através das gerações.
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-6xl mx-auto relative px-4 md:px-12 lg:px-0"
          style={{ willChange: "transform, opacity, filter" }}
          initial={{ opacity: 0, scale: 0.85, y: 30, filter: isMobile ? "blur(4px)" : "blur(16px)" }}
          animate={introPlayed ? { 
            opacity: 1, 
            scale: 1,
            y: 0,
            filter: "blur(0px)"
          } : {}}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {photos.map((item, i) => (
                <CarouselItem key={item.id} className="pl-3 md:pl-4 basis-[80%] sm:basis-[60%] md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    className="h-full relative aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-white/20 border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center group"
                    initial={{ opacity: 0, filter: isMobile ? "blur(4px)" : "blur(20px)", scale: 0.8 }}
                    animate={introPlayed ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut", delay: introPlayed ? i * 0.2 : 0 }}
                  >
                    {/* Pulsar de Choque (Onda de Impacto) quando a foto aparece */}
                    {introPlayed && (
                      <motion.div
                        className="absolute inset-0 bg-amber-500/40 rounded-xl z-50 pointer-events-none mix-blend-screen"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 1.0, delay: i * 0.2, ease: "easeOut" }}
                      />
                    )}
                    
                    {/* Sombra de Vidro Pulsante Contínua */}
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                      animate={introPlayed && !isMobile ? {
                        boxShadow: ["0px 0px 10px rgba(255,180,0,0.05)", "0px 0px 30px rgba(255,180,0,0.3)", "0px 0px 10px rgba(255,180,0,0.05)"]
                      } : {
                        boxShadow: "0px 0px 15px rgba(255,180,0,0.15)"
                      }}
                      transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    />

                    {/* Likes Count Overlay Pill */}
                    {item.likes_count !== undefined && item.likes_count > 0 && (
                      <div className="absolute top-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md z-30">
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                        <span className="text-[10px] text-white font-bold">{item.likes_count}</span>
                      </div>
                    )}

                    {item.image_base64 ? (
                      <button 
                        onClick={() => setSelectedPhoto(item)}
                        className="absolute inset-0 w-full h-full cursor-pointer group/btn"
                      >
                        <img 
                          src={item.image_base64} 
                          alt="Foto Histórica" 
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover/btn:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/btn:opacity-100 bg-black/40 transition-opacity z-20 gap-2">
                          <div className="bg-semin-yellow text-semin-dark font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 text-xs tracking-wider uppercase transition-transform scale-90 group-hover/btn:scale-100 duration-300">
                            <MessageSquare className="w-4 h-4" />
                            Comentar / Curtir
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-300 relative z-10">
                        <Camera className="h-8 w-8 mb-3 text-amber-400" />
                        <span className="font-body text-[10px] md:text-xs text-white uppercase tracking-wider font-semibold text-center px-4">Sua foto aqui</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 z-10" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none z-20">
                      <p className="font-body text-xs md:text-sm font-medium text-white/90 drop-shadow-md border-b flex flex-wrap border-amber-400/30 pb-1 w-fit mb-2">{item.caption}</p>
                      
                      {/* Créditos (Acervo) */}
                      {(item.author || item.year) && (
                        <div className="flex flex-col gap-1 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                          {item.author && (
                            <p className="font-body text-[10px] md:text-[11px] text-white/80 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                                Acervo: <strong className="text-white">{item.author}</strong>
                              </span>
                              {/* Selo LGPD para cada foto */}
                              <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/50 border border-white/10" title="Uso de imagem autorizado (Lei 13.709/2018)">
                                LGPD ✓
                              </span>
                            </p>
                          )}
                          {item.year && (
                            <p className="font-body text-[9px] md:text-[10px] text-white/50 ml-3">
                              Ano/Turma: {item.year}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
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
            <p className="text-sm md:text-base text-white/50 mb-4">
              Você tem um arquivo pessoal com fotos da sua turma ou de edições antigas da Semana? Ajude a construir a maior galeria digital da Engenharia de Minas.
            </p>

            {/* Aviso LGPD */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6 max-w-xl mx-auto flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-amber-500/70 shrink-0 mt-0.5" />
              <p className="text-xs text-white/40 leading-relaxed font-body">
                <strong className="text-white/60">Privacidade & LGPD:</strong> Ao enviar suas fotos, você consente com o uso não remunerado das imagens na "Galeria do Tempo" do SEMIN UFBA. Em respeito à Lei Geral de Proteção de Dados (13.709/2018), você possui o direito de revogar este consentimento e solicitar a remoção do material a qualquer instante através do nosso e-mail.
              </p>
            </div>
            <PhotoUploadModal>
              <button
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity" />
                📸 Submeter Foto (Acervo)
              </button>
            </PhotoUploadModal>
          </div>
        </motion.div>
      </div>

      {/* Premium Controlled Dialog for Image Interactivity */}
      <Dialog open={selectedPhoto !== null} onOpenChange={(open) => { if (!open) setSelectedPhoto(null); }}>
        <DialogContent className="max-w-6xl w-[95vw] h-[92vh] md:h-[80vh] bg-[#0c0e17] border border-white/10 p-0 overflow-hidden shadow-2xl backdrop-blur-xl rounded-2xl z-[100] flex flex-col md:grid md:grid-cols-12 [&>button]:!bg-semin-yellow [&>button]:!text-semin-dark [&>button]:!opacity-100 [&>button]:hover:!bg-amber-400 [&>button]:hover:!scale-110 [&>button]:!transition-all [&>button]:!w-10 [&>button]:!h-10 [&>button]:!right-4 [&>button]:!top-4 [&>button]:!rounded-full [&>button]:!shadow-xl [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center">
          
          {/* Left Panel: The Photo (Zoomed) */}
          <div className="md:col-span-7 bg-black/40 relative flex items-center justify-center p-4 h-[35vh] md:h-full border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
            {selectedPhoto?.image_base64 && (
              <img
                src={selectedPhoto.image_base64}
                alt={selectedPhoto.caption || "Foto ampliada"}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md hidden sm:block">
              <span className="text-white/60 text-xs font-body font-medium">Memórias em Cadeia</span>
            </div>
          </div>

          {/* Right Panel: Information & Live Discussion */}
          <div className="md:col-span-5 flex flex-col h-[57vh] md:h-full justify-between bg-white/[0.01]">
            
            {/* Header Content & Comments List Scrollable */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              
              {/* Image Info */}
              <div>
                <h3 className="text-lg md:text-xl font-bold font-display text-white mb-2 leading-snug">{selectedPhoto?.caption}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto?.author && (
                    <span className="text-[10px] md:text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/70">
                      👤 Acervo: <strong className="text-white">{selectedPhoto.author}</strong>
                    </span>
                  )}
                  {selectedPhoto?.year && (
                    <span className="text-[10px] md:text-xs bg-semin-yellow/10 border border-semin-yellow/20 px-3 py-1 rounded-full text-semin-yellow">
                      📅 Turma: <strong className="text-white">{selectedPhoto.year}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Liking Button Card */}
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => selectedPhoto && handleLike(selectedPhoto)}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    likedPhotos.includes(selectedPhoto?.id?.toString() || "")
                      ? "bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-red-400 hover:scale-105"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedPhotos.includes(selectedPhoto?.id?.toString() || "") ? "fill-current scale-110" : ""}`} />
                </button>
                <div>
                  <p className="text-xs font-semibold text-white/60">Curtidas da Comunidade</p>
                  <p className="text-xl font-black text-semin-yellow mt-0.5">{selectedPhoto?.likes_count || 0}</p>
                </div>
              </div>

              {/* Dynamic Live Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-semin-yellow" />
                    Comentários Aprovados
                  </h4>
                  <span className="text-[10px] text-white/40 font-bold bg-white/5 px-2 py-0.5 rounded">
                    {comments.length}
                  </span>
                </div>

                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-semin-yellow" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-white/40 italic py-2">
                    Nenhum comentário aprovado ainda. Escreva o seu abaixo! ✨
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[22vh] md:max-h-[28vh] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1.5 transition-all hover:bg-white/[0.04]">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-semin-yellow/90">{comment.author_name}</span>
                          <span className="text-[9px] text-white/30">
                            {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-body">{comment.comment_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form Input Panel */}
            <form onSubmit={handleAddComment} className="p-5 border-t border-white/10 bg-[#080910] space-y-3 relative z-30">
              <div className="space-y-2.5">
                <Input
                  placeholder="Seu nome"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-9 text-white focus-visible:ring-semin-yellow rounded-lg"
                  required
                />
                <textarea
                  placeholder="Escreva sua mensagem ou recordação..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg text-xs p-3 h-16 text-white focus:outline-none focus:ring-1 focus:ring-semin-yellow focus:border-semin-yellow resize-none w-full"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmittingComment}
                className="w-full bg-semin-yellow hover:bg-amber-400 text-semin-dark font-bold text-xs py-2 h-9 rounded-lg transition-all duration-300 shadow-lg shadow-semin-yellow/10"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Enviar Comentário"
                )}
              </Button>
            </form>

          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;

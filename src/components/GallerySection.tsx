import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mountain, Heart, ShieldCheck, Maximize2, Loader2, MessageSquare, ChevronLeft, ChevronRight, Reply, SmilePlus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Autoplay from "embla-carousel-autoplay";
import mineTunnelBg from "@/assets/mine_tunnel_bg.webp";
import { PhotoUploadModal } from "./PhotoUploadModal";
import { LoginModal } from "./LoginModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type PhotoItem = {
  id: number | string;
  caption: string;
  author?: string;
  year?: string;
  image_base64?: string;
  likes_count?: number;
  comments_count?: number;
};

// Importa dinamicamente todas as 50 fotos históricas
const galleryModules = import.meta.glob('@/assets/gallery/gallery_*.webp', { eager: true, import: 'default' });

const historicalPhotos: PhotoItem[] = Object.entries(galleryModules).map(([path, module]) => {
  const match = path.match(/gallery_(\d+)\.webp/);
  const id = match ? match[1] : path;
  return {
    id: id,
    caption: `Acervo Histórico ${id}`,
    author: "SEMIN UFBA",
    year: "Edições Passadas",
    image_base64: module as string,
    likes_count: 0
  };
}).sort((a, b) => Number(a.id) - Number(b.id));

// Reservamos espaços vazios para convidar a comunidade a enviar fotos
const defaultPlaceholder: PhotoItem[] = Array.from({ length: 2 }).map((_, i) => ({
  id: `placeholder-${i}`,
  caption: "Espaço Reservado",
  author: "Sua Turma",
  year: "2026",
  image_base64: `data:image/svg+xml;utf8,<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%230c0e17"/><text x="50%" y="45%" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" opacity="0.1" text-anchor="middle">ESPAÇO RESERVADO</text><text x="50%" y="55%" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f59e0b" opacity="0.6" text-anchor="middle">Envie sua foto!</text></svg>`,
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
                <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter leading-none">
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
  const { profile, session } = useAuth();
  const [introStarted, setIntroStarted] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [photos, setPhotos] = useState<PhotoItem[]>(defaultPlaceholder);

  // Community Interactions States
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<string, string[]>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const REACTION_EMOJIS = ["❤️", "😂", "👏", "🔥", "⛏️"];
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Visitor ID for reactions (anonymous)
  const getVisitorId = () => {
    let id = localStorage.getItem("semin_visitor_id");
    if (!id) {
      id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      localStorage.setItem("semin_visitor_id", id);
    }
    return id;
  };

  useEffect(() => {
    const loadMyLikes = async () => {
      if (!session?.user?.id) {
        // Fallback para localStorage se não estiver logado
        const saved = localStorage.getItem("semin_liked_photos");
        if (saved) {
          try {
            setLikedPhotos(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
        return;
      }

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dtdfzpsaxowfxybebykp.supabase.co';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGZ6cHNheG93Znh5YmVieWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTU2MzQsImV4cCI6MjA5MTg3MTYzNH0.ZUu7Jv4Ist3Sjhx_cXHn8UMCOkcKqGnjwRbhmtjNe1g';
        
        const res = await fetch(`${supabaseUrl}/rest/v1/photo_likes?select=photo_id&user_id=eq.${session.user.id}`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${session.access_token || supabaseAnonKey}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const likedIds = data.map((item: any) => item.photo_id.toString());
          setLikedPhotos(likedIds);
        }
      } catch (err) {
        console.error("Erro ao carregar curtidas da conta:", err);
      }
    };

    loadMyLikes();
  }, [session]);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      let data = null;
      let error = null;

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dtdfzpsaxowfxybebykp.supabase.co';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGZ6cHNheG93Znh5YmVieWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTU2MzQsImV4cCI6MjA5MTg3MTYzNH0.ZUu7Jv4Ist3Sjhx_cXHn8UMCOkcKqGnjwRbhmtjNe1g';
        
        const url = `${supabaseUrl}/rest/v1/gallery_photos?select=*&status=eq.approved&order=created_at.desc`;
        const res = await fetch(url, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        data = await res.json();
      } catch (err) {
        console.warn("Gallery direct fetch failed, loading historical fallback.", err);
        error = err;
      }

      let commentCountsMap: Record<string, number> = {};
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dtdfzpsaxowfxybebykp.supabase.co';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGZ6cHNheG93Znh5YmVieWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTU2MzQsImV4cCI6MjA5MTg3MTYzNH0.ZUu7Jv4Ist3Sjhx_cXHn8UMCOkcKqGnjwRbhmtjNe1g';
        const commentsRes = await fetch(`${supabaseUrl}/rest/v1/gallery_comments?select=photo_id&status=eq.approved`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          commentsData.forEach((c: any) => {
            if (c.photo_id) {
              const pid = c.photo_id.toString();
              commentCountsMap[pid] = (commentCountsMap[pid] || 0) + 1;
            }
          });
        }
      } catch (err) {
        console.warn("Failed to fetch comment counts dynamically.", err);
      }

      let combinedPhotos: PhotoItem[] = [];

      if (!error && data && data.length > 0) {
        const formattedPhotos: PhotoItem[] = data.map((dbPhoto: any) => ({
          id: dbPhoto.id.toString(),
          caption: dbPhoto.description || "Acervo da Comunidade",
          author: dbPhoto.author_name,
          year: dbPhoto.year_cohort,
          image_base64: dbPhoto.image_base64,
          likes_count: dbPhoto.likes_count || 0,
          comments_count: commentCountsMap[dbPhoto.id.toString()] || 0
        }));
        
        combinedPhotos = formattedPhotos;
      }
      
      // Garante no mínimo 4 slots preenchidos para não quebrar o visual da Galeria
      if (combinedPhotos.length < 4) {
        const needed = 4 - combinedPhotos.length;
        const placeholders: PhotoItem[] = Array.from({ length: needed }).map((_, i) => ({
          id: `placeholder-${i}`,
          caption: "Espaço Reservado",
          author: "Sua Turma",
          year: "2026",
          image_base64: `data:image/svg+xml;utf8,<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%230c0e17"/><text x="50%" y="45%" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" opacity="0.1" text-anchor="middle">ESPAÇO RESERVADO</text><text x="50%" y="55%" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f59e0b" opacity="0.6" text-anchor="middle">Envie sua foto!</text></svg>`,
          likes_count: 0
        }));
        setPhotos([...combinedPhotos, ...placeholders]);
      } else {
        setPhotos(combinedPhotos);
      }
    };

    fetchPhotos();
  }, []);

  const fetchComments = async (photoId: string | number) => {
    if (photoId.toString().startsWith("placeholder-")) {
      setComments([]);
      setReactions({});
      return;
    }
    setLoadingComments(true);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dtdfzpsaxowfxybebykp.supabase.co';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGZ6cHNheG93Znh5YmVieWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTU2MzQsImV4cCI6MjA5MTg3MTYzNH0.ZUu7Jv4Ist3Sjhx_cXHn8UMCOkcKqGnjwRbhmtjNe1g';

      const url = `${supabaseUrl}/rest/v1/gallery_comments?select=*&photo_id=eq.${photoId}&status=eq.approved&order=created_at.asc`;
      const res = await fetch(url, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setComments(data || []);
      
      // Fetch reactions for all these comments using direct REST API fetch
      const commentIds = data.map((c: any) => c.id);
      if (commentIds.length > 0) {
        const reactionsUrl = `${supabaseUrl}/rest/v1/comment_reactions?select=*&comment_id=in.(${commentIds.join(',')})`;
        const reactionsRes = await fetch(reactionsUrl, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });

        if (reactionsRes.ok) {
          const reactionsData = await reactionsRes.json();
          const grouped: Record<string, Record<string, number>> = {};
          const mine: Record<string, string[]> = {};
          const visitorId = getVisitorId();
          const currentUserId = session?.user?.id;
          reactionsData.forEach((r: any) => {
            if (!grouped[r.comment_id]) grouped[r.comment_id] = {};
            grouped[r.comment_id][r.emoji] = (grouped[r.comment_id][r.emoji] || 0) + 1;
            const isMyReaction = (currentUserId && r.user_id === currentUserId) || (r.visitor_id === visitorId);
            if (isMyReaction) {
              if (!mine[r.comment_id]) mine[r.comment_id] = [];
              mine[r.comment_id].push(r.emoji);
            }
          });
          setReactions(grouped);
          setMyReactions(mine);
        }
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      fetchComments(selectedPhoto.id);
    } else {
      setComments([]);
    }
  }, [selectedPhoto]);



  const handleLike = async (photo: PhotoItem) => {
    if (photo.id.toString().startsWith("placeholder-")) {
      toast.info("Curtida simulada em foto de demonstração! 😊");
      const newLikes = (photo.likes_count || 0) + 1;
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: newLikes } : p));
      if (selectedPhoto && selectedPhoto.id === photo.id) {
        setSelectedPhoto({ ...selectedPhoto, likes_count: newLikes });
      }
      return;
    }

    if (!session?.user?.id) {
      toast.info("Por favor, faça login para curtir e apoiar as fotos da comunidade! ❤️");
      setShowLoginModal(true);
      return;
    }

    const isLiked = likedPhotos.includes(photo.id.toString());

    if (isLiked) {
      // Toggle off: remove like
      const { error } = await supabase
        .from("photo_likes")
        .delete()
        .eq("photo_id", photo.id)
        .eq("user_id", session.user.id);

      if (!error) {
        const newLikes = Math.max((photo.likes_count || 0) - 1, 0);
        setLikedPhotos(prev => prev.filter(id => id !== photo.id.toString()));
        setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: newLikes } : p));
        if (selectedPhoto && selectedPhoto.id === photo.id) {
          setSelectedPhoto({ ...selectedPhoto, likes_count: newLikes });
        }
        toast.success("Curtida removida.");
      } else {
        toast.error("Erro ao remover curtida.");
      }
    } else {
      // Toggle on: add like
      const { error } = await supabase
        .from("photo_likes")
        .insert({
          photo_id: photo.id,
          user_id: session.user.id
        });

      if (!error) {
        const newLikes = (photo.likes_count || 0) + 1;
        setLikedPhotos(prev => [...prev, photo.id.toString()]);
        setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: newLikes } : p));
        if (selectedPhoto && selectedPhoto.id === photo.id) {
          setSelectedPhoto({ ...selectedPhoto, likes_count: newLikes });
        }
        toast.success("Obrigado pelo seu apoio! ❤️");
      } else {
        toast.error("Erro ao registrar curtida.");
      }
    }
  };

  const handleCommentReact = async (commentId: string, emoji: string, myCommentReactions: string[]) => {
    const visitorId = getVisitorId();
    const currentUserId = session?.user?.id;
    const existingEmoji = myCommentReactions[0]; // Restrict to one reaction per comment

    if (existingEmoji === emoji) {
      // Toggle off: remove reaction
      const query = supabase
        .from("comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("emoji", emoji);

      if (currentUserId) {
        query.eq("user_id", currentUserId);
      } else {
        query.eq("visitor_id", visitorId);
      }

      const { error } = await query;

      if (!error) {
        setReactions(prev => {
          const commentIdReacts = { ...prev[commentId] };
          if (commentIdReacts[emoji] > 1) {
            commentIdReacts[emoji] -= 1;
          } else {
            delete commentIdReacts[emoji];
          }
          return { ...prev, [commentId]: commentIdReacts };
        });
        setMyReactions(prev => ({
          ...prev,
          [commentId]: []
        }));
        toast.success("Reação removida!");
      } else {
        toast.error("Erro ao remover reação.");
      }
    } else {
      // If there was another emoji, delete it first to substitute it
      if (existingEmoji) {
        const query = supabase
          .from("comment_reactions")
          .delete()
          .eq("comment_id", commentId)
          .eq("emoji", existingEmoji);

        if (currentUserId) {
          query.eq("user_id", currentUserId);
        } else {
          query.eq("visitor_id", visitorId);
        }

        const { error: deleteError } = await query;
        if (deleteError) {
          toast.error("Erro ao substituir reação.");
          return;
        }

        // Update local state reactions count for the removed emoji
        setReactions(prev => {
          const commentIdReacts = { ...prev[commentId] };
          if (commentIdReacts[existingEmoji] > 1) {
            commentIdReacts[existingEmoji] -= 1;
          } else {
            delete commentIdReacts[existingEmoji];
          }
          return { ...prev, [commentId]: commentIdReacts };
        });
      }

      // Toggle on: add reaction
      const payload: any = {
        comment_id: commentId,
        emoji,
        visitor_id: visitorId
      };
      if (currentUserId) {
        payload.user_id = currentUserId;
      }

      const { error } = await supabase.from("comment_reactions").insert(payload);

      if (!error) {
        setReactions(prev => ({
          ...prev,
          [commentId]: { ...prev[commentId], [emoji]: (prev[commentId]?.[emoji] || 0) + 1 }
        }));
        setMyReactions(prev => ({
          ...prev,
          [commentId]: [emoji]
        }));
        toast.success(existingEmoji ? "Reação substituída! 👍" : "Reação adicionada! 👍");
      } else {
        toast.error("Erro ao salvar reação.");
      }
    }
    setShowEmojiPicker(null);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % photos.length;
      setSelectedPhoto(photos[nextIndex]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
      setSelectedPhoto(photos[prevIndex]);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) return;

    if (selectedPhoto.id.toString().startsWith("placeholder-")) {
      toast.error("Não é possível comentar em fotos de demonstração. Por favor, envie uma foto real para interagir!");
      return;
    }

    // Use profile full_name or nickname when logged in, or manual name as fallback
    const authorName = profile ? (profile.full_name || profile.nickname) : newCommentName.trim();
    if (!authorName || !newCommentText.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsSubmittingComment(true);
    const { data, error } = await supabase
      .from("gallery_comments")
      .insert({
        photo_id: selectedPhoto.id,
        author_name: authorName,
        comment_text: newCommentText.trim(),
        parent_id: replyingTo?.id || null,
        status: "approved",
        user_id: session?.user?.id || null
      })
      .select();

    if (error) {
      toast.error("Erro ao enviar comentário.");
    } else {
      toast.success(replyingTo ? "Resposta publicada! 💬" : "Comentário publicado! ✨");
      if (data && data[0]) {
        setComments(prev => [...prev, data[0]]);
      } else {
        setComments(prev => [...prev, {
          id: Date.now().toString(),
          photo_id: selectedPhoto.id,
          author_name: authorName,
          comment_text: newCommentText.trim(),
          parent_id: replyingTo?.id || null,
          status: "approved",
          created_at: new Date().toISOString()
        }]);
      }
      setNewCommentName("");
      setNewCommentText("");
      setReplyingTo(null);
    }
    setIsSubmittingComment(false);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentText.trim()) {
      toast.error("O comentário não pode ficar vazio.");
      return;
    }

    const { error } = await supabase
      .from("gallery_comments")
      .update({ comment_text: editingCommentText.trim() })
      .eq("id", commentId);

    if (error) {
      toast.error("Erro ao atualizar comentário.");
    } else {
      toast.success("Comentário atualizado!");
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, comment_text: editingCommentText.trim() } : c))
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Tem certeza que deseja apagar este comentário permanentemente?")) return;

    const { error } = await supabase
      .from("gallery_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast.error("Erro ao apagar comentário.");
    } else {
      toast.success("Comentário apagado!");
      setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));
    }
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
            className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter leading-none"
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
            opts={{ align: "start", loop: photos.length > 3 }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {photos.map((item, i) => (
                <CarouselItem key={item.id} className="pl-3 md:pl-4 basis-[85%] sm:basis-[65%] md:basis-[38%] lg:basis-[30%]">
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

                    {/* Likes and Comments Count Overlay Pill */}
                    <div className="absolute top-3 left-3 bg-black/75 border border-white/10 px-2.5 py-1.5 rounded-full flex items-center gap-3 backdrop-blur-md z-30 shadow-lg">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                        <span className="text-[11px] text-white font-bold">{item.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-semin-yellow fill-current" />
                        <span className="text-[11px] text-white font-bold">{item.comments_count || 0}</span>
                      </div>
                    </div>

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
                            <p className="font-body text-[10px] md:text-[11px] text-white/80">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                                Acervo: <strong className="text-white">{item.author}</strong>
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


            {profile ? (
              <PhotoUploadModal>
                <button
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity" />
                  📸 Submeter Foto (Acervo)
                </button>
              </PhotoUploadModal>
            ) : (
              <LoginModal defaultTab="login">
                <button
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity" />
                  📸 Submeter Foto (Faça Login)
                </button>
              </LoginModal>
            )}
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
            
            {/* Left/Prev Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-semin-yellow text-white hover:text-semin-dark flex items-center justify-center border border-white/10 hover:border-semin-yellow transition-all duration-300 shadow-lg group/btn active:scale-95 z-20"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>

            {/* Right/Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-semin-yellow text-white hover:text-semin-dark flex items-center justify-center border border-white/10 hover:border-semin-yellow transition-all duration-300 shadow-lg group/btn active:scale-95 z-20"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md hidden sm:block">
              <span className="text-white/60 text-xs font-body font-medium">Memórias em Cadeia</span>
            </div>
          </div>

          {/* Right Panel: Information & Live Discussion */}
          <div className="md:col-span-5 flex flex-col h-[57vh] md:h-full justify-between bg-white/[0.01]">
            
            {/* Header Content & Comments List Scrollable */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col space-y-6 custom-scrollbar">
              
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
              <div className="space-y-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-semin-yellow" />
                    Comentários
                  </h4>
                  <span className="text-[10px] text-white/40 font-bold bg-white/5 px-2 py-0.5 rounded">
                    {comments.length}
                  </span>
                </div>

                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-semin-yellow" />
                  </div>
                ) : comments.filter(c => !c.parent_id).length === 0 ? (
                  <p className="text-xs text-white/40 italic py-2">
                    Nenhum comentário ainda. Escreva o seu abaixo! ✨
                  </p>
                ) : (
                  <div className="space-y-3 pr-2 pb-2">
                    {comments.filter(c => !c.parent_id).map((comment) => {
                      const commentReactions = reactions[comment.id] || {};
                      const myCommentReactions = myReactions[comment.id] || [];
                      const replies = comments.filter(c => c.parent_id === comment.id);

                      const handleReact = (emoji: string) => {
                        handleCommentReact(comment.id, emoji, myCommentReactions);
                      };

                      return (
                        <div key={comment.id} className="space-y-1">
                          {/* Main comment */}
                          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2 transition-all hover:bg-white/[0.04] group/comment">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-semin-yellow/90">{comment.author_name}</span>
                              <span className="text-[9px] text-white/30">
                                {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="flex flex-col gap-2 pt-1 w-full">
                                <input
                                  type="text"
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  className="bg-black/40 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-semin-yellow/50 focus:ring-1 focus:ring-semin-yellow/20 w-full"
                                  required
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setEditingCommentId(null)}
                                    className="text-[10px] bg-white/5 hover:bg-white/10 text-white/60 px-2.5 py-1 rounded-md transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateComment(comment.id)}
                                    className="text-[10px] bg-semin-yellow hover:bg-amber-400 text-semin-dark font-bold px-2.5 py-1 rounded-md transition-colors"
                                  >
                                    Salvar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-white/80 leading-relaxed font-body">{comment.comment_text}</p>
                            )}
                            
                            {/* Reactions display */}
                            {Object.keys(commentReactions).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {Object.entries(commentReactions).map(([emoji, count]) => (
                                  <span
                                    key={emoji}
                                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${myCommentReactions.includes(emoji) ? 'bg-semin-yellow/20 border-semin-yellow/40 text-semin-yellow' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                    onClick={() => handleReact(emoji)}
                                  >
                                    {emoji} {count}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 pt-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!profile) {
                                      toast.info("Faça login para interagir e reagir aos comentários! 😊");
                                      setShowLoginModal(true);
                                      return;
                                    }
                                    setShowEmojiPicker(showEmojiPicker === comment.id ? null : comment.id);
                                  }}
                                  className="flex items-center gap-1 text-[10px] text-white/40 hover:text-semin-yellow transition-colors"
                                >
                                  <SmilePlus className="w-3 h-3" /> Reagir
                                </button>
                                {showEmojiPicker === comment.id && (
                                  <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-[#12141f] border border-white/10 rounded-lg p-1.5 shadow-xl z-50">
                                    {REACTION_EMOJIS.map(emoji => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleReact(emoji)}
                                        className="text-base hover:scale-125 transition-transform p-1"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!profile) {
                                    toast.info("Faça login para responder aos comentários! 😊");
                                    setShowLoginModal(true);
                                    return;
                                  }
                                  setReplyingTo(comment);
                                  setShowEmojiPicker(null);
                                }}
                                className="flex items-center gap-1 text-[10px] text-white/40 hover:text-semin-yellow transition-colors"
                              >
                                <Reply className="w-3 h-3" /> Responder
                              </button>
                              {(comment.user_id && session?.user?.id === comment.user_id || session?.user?.email === "contato@seminufba.com.br") && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditingCommentText(comment.comment_text);
                                    }}
                                    className="text-[10px] text-white/40 hover:text-semin-yellow transition-colors ml-1"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-[10px] text-red-500/50 hover:text-red-400 transition-colors ml-1"
                                  >
                                    Excluir
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Replies (threaded) with expand/collapse */}
                          {replies.length > 0 && (
                            <div className="ml-4 space-y-2">
                              <button
                                type="button"
                                onClick={() => toggleReplies(comment.id)}
                                className="flex items-center gap-1 text-[9px] text-amber-400 hover:text-amber-300 font-bold bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md transition-all border border-white/5"
                              >
                                {expandedComments[comment.id] ? (
                                  <>Ocultar {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'} ▴</>
                                ) : (
                                  <>Ver {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'} ▾</>
                                )}
                              </button>
                              
                              {expandedComments[comment.id] && (
                                <div className="pl-3 border-l-2 border-semin-yellow/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                  {replies.map(reply => {
                                    const replyReactions = reactions[reply.id] || {};
                                    const myReplyReactions = myReactions[reply.id] || [];

                                    return (
                                      <div key={reply.id} className="bg-white/[0.015] border border-white/5 rounded-lg p-2.5 space-y-1 group/reply">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-bold text-amber-400/80">{reply.author_name}</span>
                                          <span className="text-[8px] text-white/25">
                                            {new Date(reply.created_at).toLocaleDateString("pt-BR")}
                                          </span>
                                        </div>
                                        {editingCommentId === reply.id ? (
                                          <div className="flex flex-col gap-2 pt-1 w-full">
                                            <input
                                              type="text"
                                              value={editingCommentText}
                                              onChange={(e) => setEditingCommentText(e.target.value)}
                                              className="bg-black/40 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-semin-yellow/50 focus:ring-1 focus:ring-semin-yellow/20 w-full"
                                              required
                                            />
                                            <div className="flex gap-2 justify-end">
                                              <button
                                                type="button"
                                                onClick={() => setEditingCommentId(null)}
                                                className="text-[10px] bg-white/5 hover:bg-white/10 text-white/60 px-2.5 py-0.5 rounded transition-colors"
                                              >
                                                Cancelar
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleUpdateComment(reply.id)}
                                                className="text-[10px] bg-semin-yellow hover:bg-amber-400 text-semin-dark font-bold px-2.5 py-0.5 rounded transition-colors"
                                              >
                                                Salvar
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="text-[11px] text-white/70 leading-relaxed font-body">{reply.comment_text}</p>
                                            
                                            {/* Reactions display */}
                                            {Object.keys(replyReactions).length > 0 && (
                                              <div className="flex flex-wrap gap-1.5 pt-1">
                                                {Object.entries(replyReactions).map(([emoji, count]) => (
                                                  <span
                                                    key={emoji}
                                                    className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border transition-all cursor-pointer ${myReplyReactions.includes(emoji) ? 'bg-semin-yellow/20 border-semin-yellow/40 text-semin-yellow' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                                    onClick={() => handleCommentReact(reply.id, emoji, myReplyReactions)}
                                                  >
                                                    {emoji} {count}
                                                  </span>
                                                ))}
                                              </div>
                                            )}

                                            <div className="flex items-center gap-2 pt-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                              {/* Reagir option for reply */}
                                              <div className="relative">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (!profile) {
                                                      toast.info("Faça login para interagir e reagir aos comentários! 😊");
                                                      setShowLoginModal(true);
                                                      return;
                                                    }
                                                    setShowEmojiPicker(showEmojiPicker === reply.id ? null : reply.id);
                                                  }}
                                                  className="flex items-center gap-1 text-[9px] text-white/40 hover:text-semin-yellow transition-colors"
                                                >
                                                  <SmilePlus className="w-2.5 h-2.5" /> Reagir
                                                </button>
                                                {showEmojiPicker === reply.id && (
                                                  <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-[#12141f] border border-white/10 rounded-lg p-1 shadow-xl z-50">
                                                    {REACTION_EMOJIS.map(emoji => (
                                                      <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => handleCommentReact(reply.id, emoji, myReplyReactions)}
                                                        className="text-sm hover:scale-125 transition-transform p-0.5"
                                                      >
                                                        {emoji}
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>

                                              {(reply.user_id && session?.user?.id === reply.user_id || session?.user?.email === "contato@seminufba.com.br") && (
                                                <>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setEditingCommentId(reply.id);
                                                      setEditingCommentText(reply.comment_text);
                                                    }}
                                                    className="text-[9px] text-white/40 hover:text-semin-yellow transition-colors"
                                                  >
                                                    Editar
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleDeleteComment(reply.id)}
                                                    className="text-[9px] text-red-500/50 hover:text-red-400 transition-colors"
                                                  >
                                                    Excluir
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form Input Panel */}
            <form onSubmit={handleAddComment} className="p-5 border-t border-white/10 bg-[#080910] space-y-3 relative z-30">
              {/* Reply indicator */}
              {replyingTo && (
                <div className="flex items-center justify-between bg-semin-yellow/10 border border-semin-yellow/20 px-3 py-2 rounded-lg">
                  <span className="text-[10px] text-semin-yellow flex items-center gap-1.5">
                    <Reply className="w-3 h-3" />
                    Respondendo a <strong>{replyingTo.author_name}</strong>
                  </span>
                  <button type="button" onClick={() => setReplyingTo(null)} className="text-white/40 hover:text-white text-xs">✕</button>
                </div>
              )}

              {/* If logged in, show premium ultra-compact single-line inline form */}
              {profile ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-semin-yellow/50 focus-within:ring-1 focus-within:ring-semin-yellow/20 transition-all w-full">
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0 shadow-inner">
                    {profile.nickname.charAt(0).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    placeholder={replyingTo ? `Resp. a @${replyingTo.author_name}...` : "Escreva sua mensagem..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="bg-transparent border-0 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-0 flex-1 min-w-0"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="bg-semin-yellow hover:bg-amber-400 text-semin-dark font-extrabold text-xs h-7 px-4 rounded-lg transition-all shadow-md shadow-semin-yellow/5"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : replyingTo ? "Responder" : "Enviar"}
                  </Button>
                </div>
              ) : (
                /* If NOT logged in, show login prompt */
                <div className="text-center space-y-3 py-2">
                  <p className="text-xs text-white/40">Faça login para comentar e interagir</p>
                  <Button 
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs h-9 px-6 rounded-lg"
                  >
                    Entrar / Criar Conta
                  </Button>
                </div>
              )}
            </form>

          </div>
        </DialogContent>
      </Dialog>

      {/* Global Programmatic Login Modal Overlay */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal}>
        <span className="hidden" />
      </LoginModal>
    </section>
  );
};

export default GallerySection;

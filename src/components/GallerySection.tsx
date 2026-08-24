import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mountain, Heart, Loader2, MessageSquare, ChevronLeft, ChevronRight, Reply, SmilePlus, Sparkles, Upload } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  is_placeholder?: boolean;
};

// Cards elegantes de convite para a comunidade enviar registros das turmas
const communityInvitePlaceholders: PhotoItem[] = [
  {
    id: "invite-1",
    caption: "Turmas Pioneiras (1976 - 1985)",
    author: "Acervo Histórico UFBA",
    year: "1976 - 1985",
    likes_count: 0,
    comments_count: 0,
    is_placeholder: true
  },
  {
    id: "invite-2",
    caption: "Geração da Consolidação (1986 - 2000)",
    author: "Engenharia de Minas",
    year: "1986 - 2000",
    likes_count: 0,
    comments_count: 0,
    is_placeholder: true
  },
  {
    id: "invite-3",
    caption: "Avanço Tecnológico (2001 - 2015)",
    author: "Comunidade Acadêmica",
    year: "2001 - 2015",
    likes_count: 0,
    comments_count: 0,
    is_placeholder: true
  },
  {
    id: "invite-4",
    caption: "Nova Geração & Jubileu (2016 - 2026)",
    author: "Turmas Atuais e Futuras",
    year: "2016 - 2026",
    likes_count: 0,
    comments_count: 0,
    is_placeholder: true
  }
];

// Transição de Abertura: Frente de Lavra, Estopim de Luz e Detonação
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
    
    setTimeout(updateRect, 50);
    
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  useEffect(() => {
    const autoArmTimer = setTimeout(() => {
      setIsArming(true);
    }, 350);
    return () => clearTimeout(autoArmTimer);
  }, []);

  useEffect(() => {
    if (isArming && !isDetonated) {
      const timer = setTimeout(() => setIsDetonated(true), 450);
      return () => clearTimeout(timer);
    }
  }, [isArming, isDetonated]);

  useEffect(() => {
    if (isDetonated) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [isDetonated, onComplete]);

  const shards = Array.from({ length: isMobile ? 4 : 10 });

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden cursor-pointer"
      onMouseMove={(e) => {
        if (!isDetonated && rectRef.current) {
          setMousePos({ x: e.clientX - rectRef.current.left, y: e.clientY - rectRef.current.top });
        }
      }}
      onClick={() => {
        if (!isArming && !isDetonated) setIsArming(true);
        else if (isArming && !isDetonated) setIsDetonated(true);
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDetonated ? 0 : 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* 1. Parede de Rocha com Efeito de Luz */}
      <AnimatePresence>
        {!isDetonated && (
          <motion.div
            className="absolute inset-0 bg-[#030405]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          >
            <div 
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                backgroundImage: isMobile 
                  ? 'none' 
                  : 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.25%22/%3E%3C/svg%3E")',
                maskImage: isMobile ? 'none' : `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                WebkitMaskImage: isMobile ? 'none' : `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                background: isMobile ? 'radial-gradient(circle at center, #1a1d24 0%, #030405 100%)' : undefined
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
              <div className="flex flex-col items-center text-center max-w-4xl mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Galeria 50 Anos
                </div>
                <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-white mb-3 tracking-tighter leading-none">
                  Memórias em{" "}
                  <span className="bg-gradient-to-r from-semin-orange via-amber-400 to-amber-500 bg-clip-text text-transparent font-extrabold block md:inline-block">
                    Cadeia
                  </span>
                </h2>
                <p className="font-body text-white/70 font-medium text-xs sm:text-sm md:text-base leading-relaxed mb-5 max-w-xl">
                  Extraindo os registros preciosos da história da Engenharia de Minas da UFBA...
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semin-yellow/10 border border-semin-yellow/30 text-semin-yellow text-xs font-bold uppercase tracking-wider animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-semin-yellow"></div>
                  Detonando e Revelando Acervo...
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="grid grid-cols-4 gap-6 opacity-70 relative z-10">
                  {Array.from({length: 16}).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#ffaa00]"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                      transition={{ duration: 0.8 + (i % 4) * 0.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>

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
                        style={{ filter: "drop-shadow(0 0 10px #ffaa00)" }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: "linear" }}
                      />
                      <motion.circle
                        r="6"
                        fill="#ffffff"
                        style={{ filter: "drop-shadow(0 0 18px #ffffff)" }}
                        animate={{
                          cx: [10, 50, 50, 90, 90, 130],
                          cy: [10, 10, 50, 50, 90, 90]
                        }}
                        transition={{ duration: 0.4, ease: "linear" }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. O Estopim de Luz e Fragmentos */}
      {isDetonated && (
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute inset-0 mix-blend-color-dodge"
            style={{ background: 'radial-gradient(circle at center, rgba(255,180,0,0.85) 0%, rgba(255,140,0,0.4) 40%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 2, 3.5] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {shards.map((_, i) => {
            const angle = (i / shards.length) * Math.PI * 2;
            const distance = 350 + Math.random() * 350;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const rotate = (Math.random() - 0.5) * 80;
            
            return (
              <motion.div
                key={i}
                className="absolute w-24 h-24 sm:w-36 sm:h-36 border-[0.5px] border-amber-300/40 bg-amber-400/20 shadow-[0_0_20px_rgba(255,180,0,0.25)]"
                style={{
                  clipPath: `polygon(${Math.random()*30}% ${Math.random()*30}%, ${70+Math.random()*30}% ${Math.random()*30}%, ${70+Math.random()*30}% ${70+Math.random()*30}%, ${Math.random()*30}% ${70+Math.random()*30}%)`,
                }}
                initial={{ x: 0, y: 0, scale: 0.5, rotate: 0, opacity: 0 }}
                animate={{ 
                  x: [0, x], 
                  y: [0, y], 
                  scale: [0.5, 1.2], 
                  rotate: [0, rotate],
                  opacity: [0, 0.7, 0]
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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
  const { ref, isVisible } = useScrollAnimation(0.15);

  const handleIntroComplete = () => {
    setIntroPlayed(true);
  };

  // Estado inicial: fotos da comunidade / convite de acervo
  const [photos, setPhotos] = useState<PhotoItem[]>(communityInvitePlaceholders);

  // Estados de Interação da Comunidade
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
  const REACTION_EMOJIS = ["👏", "⛏️", "🔥", "❤️", "💎"];
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUploadModalDirect, setShowUploadModalDirect] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

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

  // Busca fotos aprovadas enviadas exclusivamente pela comunidade para o Acervo dos 50 anos
  useEffect(() => {
    const fetchPhotos = async () => {
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

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const formattedCommunityPhotos: PhotoItem[] = data.map((dbPhoto: any) => ({
              id: dbPhoto.id.toString(),
              caption: dbPhoto.description || "Acervo da Comunidade",
              author: dbPhoto.author_name,
              year: dbPhoto.year_cohort,
              image_base64: dbPhoto.image_base64,
              likes_count: dbPhoto.likes_count || 0,
              comments_count: 0
            }));
            
            // Se houver fotos enviadas pela comunidade, exibe-as; se forem poucas, complementa com os convites
            if (formattedCommunityPhotos.length < 4) {
              setPhotos([...formattedCommunityPhotos, ...communityInvitePlaceholders.slice(formattedCommunityPhotos.length)]);
            } else {
              setPhotos(formattedCommunityPhotos);
            }
          }
        }
      } catch (err) {
        console.warn("Galeria da comunidade carregada.", err);
      }
    };

    fetchPhotos();
  }, []);

  const fetchComments = async (photoId: string | number) => {
    if (photoId.toString().startsWith("invite-")) {
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
    if (photo.is_placeholder || photo.id.toString().startsWith("invite-")) {
      toast.info("Este é um espaço reservado para fotos da comunidade! Envie a foto da sua turma ⛏️");
      return;
    }

    if (!session?.user?.id) {
      toast.info("Por favor, faça login para curtir e apoiar as fotos da comunidade! ⛏️");
      setShowLoginModal(true);
      return;
    }

    const isLiked = likedPhotos.includes(photo.id.toString());

    if (isLiked) {
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
        toast.success("Obrigado pelo seu apoio! ⛏️");
      } else {
        toast.error("Erro ao registrar curtida.");
      }
    }
  };

  const handleCommentReact = async (commentId: string, emoji: string, myCommentReactions: string[]) => {
    const visitorId = getVisitorId();
    const currentUserId = session?.user?.id;
    const existingEmoji = myCommentReactions[0];

    if (existingEmoji === emoji) {
      const deleteQueries = [
        supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("emoji", emoji).eq("visitor_id", visitorId)
      ];
      if (currentUserId) {
        deleteQueries.push(
          supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("emoji", emoji).eq("user_id", currentUserId)
        );
      }
      
      const results = await Promise.all(deleteQueries);
      const hasError = results.some(r => r.error);

      if (!hasError) {
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
      if (myCommentReactions.length > 0) {
        const deleteQueries = [
          supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("visitor_id", visitorId)
        ];
        if (currentUserId) {
          deleteQueries.push(
            supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("user_id", currentUserId)
          );
        }
        
        const results = await Promise.all(deleteQueries);
        const hasError = results.some(r => r.error);
        if (hasError) {
          toast.error("Erro ao substituir reação.");
          return;
        }

        setReactions(prev => {
          const commentIdReacts = { ...prev[commentId] };
          myCommentReactions.forEach(removedEmoji => {
            if (commentIdReacts[removedEmoji] > 1) {
              commentIdReacts[removedEmoji] -= 1;
            } else {
              delete commentIdReacts[removedEmoji];
            }
          });
          return { ...prev, [commentId]: commentIdReacts };
        });
      }

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
        toast.success(existingEmoji ? "Reação substituída! ✨" : "Reação adicionada! ✨");
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
    if (!newCommentText.trim()) return;
    if (!selectedPhoto) return;

    if (!profile) {
      toast.info("Faça login para publicar seu comentário!");
      setShowLoginModal(true);
      return;
    }

    setIsSubmittingComment(true);
    const authorName = profile.nickname || profile.full_name || "Membro da Comunidade";

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
      toast.success(replyingTo ? "Resposta publicada! 💬" : "Comentário publicado! 🚀");
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
    if (isVisible && !introStarted) {
      setIntroStarted(true);
    }
  }, [isVisible, introStarted]);

  return (
    <section id="galeria" className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#0a0c12" }}>
      {/* Background visual da galeria */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={mineTunnelBg}
          alt=""
          className="w-full h-full object-cover origin-center"
          style={{ opacity: 0.15, filter: "saturate(0.25) brightness(0.5)", transform: introStarted && !isMobile ? "scale(1.15)" : "scale(1)", transition: "transform 3.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          loading="lazy"
          decoding="async"
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

      {/* Intro de Detonação Cinematográfica */}
      <AnimatePresence>
        {introStarted && !introPlayed && (
          <RockShatterIntro onComplete={handleIntroComplete} isMobile={isMobile} />
        )}
      </AnimatePresence>

      <div ref={ref} className="container mx-auto px-4 relative z-10 pt-4">
        <motion.div 
          className="text-center mb-8 md:mb-14"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-amber-400/80 font-semibold mb-3 md:mb-4">
            <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Galeria dos 50 Anos
          </span>
          <motion.h2 
            className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter leading-none"
          >
            <span className="text-white/95">Memórias em </span>
            <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold block md:inline-block">Cadeia</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-400/40 rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400/40" />
            <div className="w-10 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-400/40 rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-amber-400 font-medium max-w-xl mx-auto mb-2">
            O mural histórico construído por todas as gerações da Mineração UFBA.
          </p>
          <p className="font-body text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-6 leading-relaxed">
            Acervo colaborativo comemorativo dos 50 Anos (1976 - 2026). Compartilhe as fotos da sua turma e marque sua presença na história.
          </p>
        </motion.div>

        {/* Carrossel de Fotos do Acervo Colaborativo */}
        <motion.div 
          className="w-full max-w-6xl mx-auto relative px-4 md:px-12 lg:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <Carousel
            opts={{ align: "start", loop: photos.length > 3 }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {photos.map((item, i) => (
                <CarouselItem key={item.id} className="pl-3 md:pl-4 basis-[85%] sm:basis-[65%] md:basis-[40%] lg:basis-[32%]">
                  <motion.div
                    className="h-full relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/15 border border-white/10 bg-[#0d0f17] flex flex-col items-center justify-center group shadow-2xl transition-all duration-300 hover:border-amber-400/40"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(i * 0.05, 0.4) }}
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl shadow-[0_0_20px_rgba(255,180,0,0.08)]" />

                    {/* Contadores para fotos reais */}
                    {!item.is_placeholder && (
                      <div className="absolute top-3 left-3 bg-black/80 border border-white/10 px-2.5 py-1.5 rounded-full flex items-center gap-3 z-30 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                          <span className="text-[11px] text-white font-bold">{item.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-semin-yellow fill-current" />
                          <span className="text-[11px] text-white font-bold">{item.comments_count || 0}</span>
                        </div>
                      </div>
                    )}

                    {item.image_base64 ? (
                      <button 
                        type="button"
                        onClick={() => setSelectedPhoto(item)}
                        className="absolute inset-0 w-full h-full cursor-pointer group/btn"
                        aria-label={`Ver foto ${item.caption}`}
                      >
                        <img 
                          src={item.image_base64} 
                          alt={item.caption} 
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover/btn:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/btn:opacity-100 bg-black/50 transition-opacity z-20 gap-2 backdrop-blur-[2px]">
                          <div className="bg-semin-yellow text-semin-dark font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 text-xs tracking-wider uppercase transition-transform scale-90 group-hover/btn:scale-100 duration-300">
                            <MessageSquare className="w-4 h-4" />
                            Comentar / Curtir
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-6 relative z-10 w-full h-full bg-gradient-to-b from-white/[0.04] to-amber-500/[0.04]">
                        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-400/20 transition-all duration-300 shadow-inner">
                          <Camera className="h-8 w-8 text-amber-400" />
                        </div>
                        <span className="font-display font-bold text-base text-white mb-1.5 px-2">
                          {item.caption}
                        </span>
                        <span className="text-xs text-amber-400/80 font-medium mb-4">
                          Espaço Reservado para sua Turma
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-semin-yellow/15 border border-semin-yellow/30 text-semin-yellow text-[11px] font-bold tracking-wider uppercase group-hover:bg-semin-yellow group-hover:text-semin-dark transition-all duration-300">
                          <Upload className="w-3 h-3" />
                          Enviar Foto
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 z-10 pointer-events-none" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none z-20">
                      <p className="font-body text-xs md:text-sm font-semibold text-white/95 drop-shadow-md border-b flex flex-wrap border-amber-400/40 pb-1 w-fit mb-2">
                        {item.caption}
                      </p>
                      
                      {(item.author || item.year) && (
                        <div className="flex flex-col gap-1 bg-black/60 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                          {item.author && (
                            <p className="font-body text-[10px] md:text-[11px] text-white/80">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                {item.is_placeholder ? "Acervo:" : "Enviado por:"} <strong className="text-white">{item.author}</strong>
                              </span>
                            </p>
                          )}
                          {item.year && (
                            <p className="font-body text-[9px] md:text-[10px] text-amber-400/90 ml-3 font-medium">
                              Turma / Período: {item.year}
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
                <CarouselPrevious className="absolute -left-2 md:-left-6 lg:-left-12 bg-black/60 border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black top-1/2 -translate-y-1/2 shadow-xl z-20 h-10 w-10 md:h-12 md:w-12 transition-all duration-300" />
                <CarouselNext className="absolute -right-2 md:-right-6 lg:-right-12 bg-black/60 border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black top-1/2 -translate-y-1/2 shadow-xl z-20 h-10 w-10 md:h-12 md:w-12 transition-all duration-300" />
              </>
            )}
          </Carousel>
        </motion.div>

        {/* Chamada para Contribuição com o Acervo dos 50 Anos */}
        <motion.div 
          className="text-center mt-10 md:mt-16 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="bg-semin-yellow/[0.03] border border-semin-yellow/15 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/[0.05] to-amber-400/0 group-hover:translate-x-full transition-transform duration-1000" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-display">Preserve a Memória da sua Turma</h3>
            <p className="text-sm md:text-base text-white/60 mb-5 leading-relaxed">
              Você tem fotos de aulas de campo, formaturas, laboratórios ou momentos marcantes da sua época no curso? Contribua com o Acervo dos 50 Anos da Mineração UFBA.
            </p>

            {profile ? (
              <PhotoUploadModal>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  Submeter Foto da sua Turma
                </button>
              </PhotoUploadModal>
            ) : (
              <LoginModal defaultTab="login">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow shadow-semin-yellow/30 hover:shadow-semin-yellow/50 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  Submeter Foto (Faça Login)
                </button>
              </LoginModal>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalhes da Foto e Comentários */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0a0c12] border-white/10 text-white max-h-[92vh] flex flex-col z-50">
          <div className="grid md:grid-cols-12 flex-1 min-h-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Foto Ampliada */}
            <div className="md:col-span-7 relative bg-black/80 flex items-center justify-center min-h-[300px] md:min-h-[480px] p-4 group">
              {selectedPhoto?.image_base64 && (
                <img
                  src={selectedPhoto.image_base64}
                  alt={selectedPhoto.caption}
                  className="max-h-[60vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              )}

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

              <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-full border border-white/5 hidden sm:block">
                <span className="text-white/60 text-xs font-body font-medium">Memórias em Cadeia</span>
              </div>
            </div>

            {/* Painel de Informações e Discussão */}
            <div className="md:col-span-5 flex flex-col h-[57vh] md:h-full min-h-0 justify-between bg-white/[0.01] overflow-hidden">
              
              <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col space-y-5 custom-scrollbar min-h-0">
                <div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-white mb-2 leading-snug">{selectedPhoto?.caption}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto?.author && (
                      <span className="text-[10px] md:text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/70">
                        📸 Enviado por: <strong className="text-white">{selectedPhoto.author}</strong>
                      </span>
                    )}
                    {selectedPhoto?.year && (
                      <span className="text-[10px] md:text-xs bg-semin-yellow/10 border border-semin-yellow/20 px-3 py-1 rounded-full text-semin-yellow">
                        📅 Turma: <strong className="text-white">{selectedPhoto.year}</strong>
                      </span>
                    )}
                  </div>
                </div>

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
                      Nenhum comentário ainda. Escreva o seu abaixo! 💬
                    </p>
                  ) : (
                    <div className="space-y-3 pr-2 pb-2">
                      {comments.filter(c => !c.parent_id).map((comment) => {
                        const commentReactions = reactions[comment.id] || {};
                        const myCommentReactions = myReactions[comment.id] || [];
                        const replies = comments.filter(c => c.parent_id === comment.id);

                        return (
                          <div key={comment.id} className="space-y-1">
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
                                <>
                                  <p className="text-xs text-white/80 leading-relaxed font-body">{comment.comment_text}</p>
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {Object.entries(commentReactions).map(([emoji, count]) => {
                                      const isMine = myCommentReactions.includes(emoji);
                                      return (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => handleCommentReact(comment.id, emoji, myCommentReactions)}
                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-all ${
                                            isMine
                                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                              : "bg-white/5 text-white/60 border border-white/5 hover:bg-white/10"
                                          }`}
                                        >
                                          <span>{emoji}</span>
                                          <span className="font-bold">{count}</span>
                                        </button>
                                      );
                                    })}
                                    
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!profile) {
                                            toast.info("Faça login para interagir e reagir aos comentários!");
                                            setShowLoginModal(true);
                                            return;
                                          }
                                          setShowEmojiPicker(showEmojiPicker === comment.id ? null : comment.id);
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                                      >
                                        <SmilePlus className="w-3 h-3" />
                                      </button>
                                      {showEmojiPicker === comment.id && (
                                        <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-[#12141f] border border-white/10 rounded-lg p-1 shadow-xl z-50">
                                          {REACTION_EMOJIS.map(emoji => (
                                            <button
                                              key={emoji}
                                              type="button"
                                              onClick={() => handleCommentReact(comment.id, emoji, myCommentReactions)}
                                              className="text-sm hover:scale-125 transition-transform p-0.5"
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
                                          toast.info("Faça login para responder!");
                                          setShowLoginModal(true);
                                          return;
                                        }
                                        setReplyingTo(comment);
                                      }}
                                      className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-semin-yellow transition-colors ml-1"
                                    >
                                      <Reply className="w-3 h-3" /> Responder
                                    </button>

                                    {replies.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => toggleReplies(comment.id)}
                                        className="text-[10px] text-semin-yellow/80 hover:text-semin-yellow transition-colors ml-auto font-medium"
                                      >
                                        {expandedComments[comment.id] ? "Ocultar respostas" : `Ver ${replies.length} resposta${replies.length > 1 ? 's' : ''}`}
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>

                            {expandedComments[comment.id] && replies.length > 0 && (
                              <div className="ml-6 space-y-2 border-l-2 border-semin-yellow/20 pl-3 pt-2">
                                {replies.map(reply => (
                                  <div key={reply.id} className="bg-white/[0.015] border border-white/5 rounded-lg p-2.5 space-y-1.5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-semin-yellow/80">{reply.author_name}</span>
                                      <span className="text-[8px] text-white/30">
                                        {new Date(reply.created_at).toLocaleDateString("pt-BR")}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-white/75 leading-relaxed font-body">{reply.comment_text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddComment} className="p-4 border-t border-white/10 bg-[#080910] space-y-3 relative z-30">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-semin-yellow/10 border border-semin-yellow/20 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-semin-yellow flex items-center gap-1.5">
                      <Reply className="w-3 h-3" />
                      Respondendo a <strong>{replyingTo.author_name}</strong>
                    </span>
                    <button type="button" onClick={() => setReplyingTo(null)} className="text-white/40 hover:text-white text-xs">✕</button>
                  </div>
                )}

                {profile ? (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-semin-yellow/50 focus-within:ring-1 focus-within:ring-semin-yellow/20 transition-all w-full">
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0 shadow-inner">
                      {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : "U"}
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
                      className="bg-semin-yellow hover:bg-amber-400 text-semin-dark font-extrabold text-xs h-7 px-3 rounded-lg transition-all shadow-md"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : replyingTo ? "Responder" : "Enviar"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2 py-1">
                    <p className="text-xs text-white/40">Faça login para comentar e interagir</p>
                    <Button 
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs h-8 px-5 rounded-lg"
                    >
                      Entrar / Criar Conta
                    </Button>
                  </div>
                )}
              </form>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal}>
        <span className="hidden" />
      </LoginModal>
    </section>
  );
};

export default GallerySection;

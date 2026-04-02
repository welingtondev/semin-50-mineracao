import { useState } from "react";
import { Camera, Play, X, ChevronLeft, ChevronRight, Image, Video, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type GalleryItem = {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail: string;
  caption: string;
};

const galleryItems: GalleryItem[] = [
  { id: 1, type: "image", src: "", thumbnail: "", caption: "Abertura da edição anterior do SEMIN" },
  { id: 2, type: "image", src: "", thumbnail: "", caption: "Palestra sobre lavra a céu aberto" },
  { id: 3, type: "image", src: "", thumbnail: "", caption: "Workshop de beneficiamento mineral" },
  { id: 4, type: "video", src: "", thumbnail: "", caption: "Vídeo institucional – SEMIN 2024" },
  { id: 5, type: "image", src: "", thumbnail: "", caption: "Mesa-redonda sobre sustentabilidade na mineração" },
  { id: 6, type: "image", src: "", thumbnail: "", caption: "Networking entre profissionais e estudantes" },
  { id: 7, type: "image", src: "", thumbnail: "", caption: "Visita técnica a laboratório de geologia" },
  { id: 8, type: "video", src: "", thumbnail: "", caption: "Highlights da edição passada" },
];

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const { ref, isVisible } = useScrollAnimation(0.05);

  const filtered = filter === "all" ? galleryItems : galleryItems.filter((g) => g.type === filter);

  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % filtered.length); };
  const goPrev = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length); };

  return (
    <section id="galeria" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, hsl(40 73% 48%) 50px, hsl(40 73% 48%) 51px)`
      }} />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-yellow font-semibold mb-3 md:mb-4">
            <Camera className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Edições anteriores
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">Galeria</h2>
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow/60" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-white/50 max-w-xl mx-auto mb-6 md:mb-8">
            Confira os melhores momentos das edições passadas do SEMIN.
          </p>

          <div className="flex justify-center gap-2 md:gap-3">
            {([["all", "Todos", Camera], ["image", "Fotos", Image], ["video", "Vídeos", Video]] as const).map(([key, label, Icon]) => (
              <Button
                key={key}
                size="sm"
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key)}
                className={`text-xs md:text-sm px-3 md:px-4 py-2 gap-1.5 ${
                  filter === key
                    ? "bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark font-semibold border-0"
                    : "border-white/20 text-white/60 hover:border-semin-yellow/50 hover:text-semin-yellow bg-transparent"
                }`}
              >
                <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 max-w-6xl mx-auto">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`group relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden cursor-pointer bg-semin-blue/30 border border-white/5 hover:border-semin-yellow/30 transition-all duration-300 active:scale-[0.97] ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${i * 50 + 200}ms` }}
              onClick={() => setSelectedIndex(i)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-semin-blue/80 to-semin-dark/90 flex flex-col items-center justify-center gap-2 md:gap-3 group-hover:from-semin-blue/60 group-hover:to-semin-dark/70 transition-all duration-300">
                {item.type === "video" ? (
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-semin-yellow/20 flex items-center justify-center group-hover:bg-semin-yellow/30 transition-colors">
                    <Play className="h-4 w-4 md:h-6 md:w-6 text-semin-yellow ml-0.5" />
                  </div>
                ) : (
                  <Camera className="h-6 w-6 md:h-8 md:w-8 text-white/20 group-hover:text-semin-yellow/40 transition-colors" />
                )}
                <span className="font-body text-[8px] md:text-[10px] text-white/30 uppercase tracking-wider">
                  {item.type === "video" ? "Vídeo" : "Foto"}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 md:p-4">
                <p className="font-body text-[10px] md:text-xs text-white/90 leading-snug">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 md:mt-8 font-body text-[10px] md:text-xs text-white/20">
          Substitua os placeholders pelas imagens e vídeos reais das edições anteriores
        </p>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors z-10 p-2" onClick={closeLightbox}>
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <button className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-semin-yellow transition-colors z-10 p-2" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
            <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
          </button>
          <button className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-semin-yellow transition-colors z-10 p-2" onClick={(e) => { e.stopPropagation(); goNext(); }}>
            <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
          </button>

          <div
            className="max-w-4xl w-full aspect-video rounded-xl md:rounded-2xl bg-semin-blue/30 border border-white/10 flex flex-col items-center justify-center gap-3 md:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {filtered[selectedIndex]?.type === "video" ? (
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-semin-yellow/20 flex items-center justify-center">
                  <Play className="h-7 w-7 md:h-10 md:w-10 text-semin-yellow ml-1" />
                </div>
                <p className="font-body text-white/40 text-xs md:text-sm">Vídeo placeholder</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <Camera className="h-10 w-10 md:h-16 md:w-16 text-white/15" />
                <p className="font-body text-white/40 text-xs md:text-sm">Imagem placeholder</p>
              </div>
            )}
            <p className="font-body text-white/60 text-xs md:text-sm mt-2 md:mt-4 px-6 md:px-8 text-center">
              {filtered[selectedIndex]?.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;

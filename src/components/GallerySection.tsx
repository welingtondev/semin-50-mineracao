import { useState } from "react";
import { Camera, Play, X, ChevronLeft, ChevronRight, Image, Video, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type GalleryItem = {
  id: number;
  src: string;
  thumbnail: string;
  caption: string;
};

const importedImages = import.meta.glob('../assets/gallery/*.webp', { eager: true });
const imageUrls = Object.values(importedImages).map((module: any) => module.default || module);

const galleryItems: GalleryItem[] = imageUrls.map((src, index) => ({
  id: index + 1,
  src: src as string,
  thumbnail: src as string,
  caption: `Momento SEMIN ${index + 1}`
}));

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation(0.05);

  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % galleryItems.length); };
  const goPrev = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length); };

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
          <p className="font-body text-sm md:text-base text-white/50 max-w-xl mx-auto mb-6 md:mb-10">
            Confira os melhores momentos das edições passadas do SEMIN.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative px-8 md:px-12 lg:px-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryItems.map((item, i) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div
                    className={`group h-full relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden cursor-pointer bg-semin-blue/30 border border-white/5 hover:border-semin-yellow/30 transition-all duration-300 active:scale-[0.97] ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    style={{ transitionDelay: `${(i % 4) * 50 + 100}ms` }}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <img src={item.thumbnail} alt={item.caption} width="400" height="300" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-semin-blue/70 to-semin-dark/80 flex flex-col items-center justify-center gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Camera className="h-6 w-6 md:h-8 md:w-8 text-white/80 group-hover:text-semin-yellow transition-colors drop-shadow-md" />
                      <span className="font-body text-[8px] md:text-[10px] text-white font-bold uppercase tracking-wider drop-shadow-md">
                        Ampliar
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="font-body text-[10px] md:text-sm font-medium text-white leading-tight drop-shadow-md">{item.caption}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {galleryItems.length > 2 && (
              <>
                <CarouselPrevious className="absolute -left-3 md:-left-6 lg:-left-12 bg-semin-dark border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark top-1/2 -translate-y-1/2 shadow-lg z-20 h-10 w-10 md:h-12 md:w-12 transition-all transition-colors duration-300" />
                <CarouselNext className="absolute -right-3 md:-right-6 lg:-right-12 bg-semin-dark border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark top-1/2 -translate-y-1/2 shadow-lg z-20 h-10 w-10 md:h-12 md:w-12 transition-all transition-colors duration-300" />
              </>
            )}
          </Carousel>
        </div>


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
            <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-xl md:rounded-2xl relative bg-black/40">
              <img src={galleryItems[selectedIndex]?.src} alt={galleryItems[selectedIndex]?.caption} width="800" height="600" className="w-full h-full object-contain" />
            </div>
            <p className="font-body text-white/60 text-xs md:text-sm mt-2 md:mt-4 px-6 md:px-8 text-center absolute bottom-[-40px]">
              {galleryItems[selectedIndex]?.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;

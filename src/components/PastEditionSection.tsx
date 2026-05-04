import { useState, useEffect } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type GalleryItem = {
  id: number;
  src: string;
  thumbnail: string;
  caption: string;
};

// Lazy loading — images are resolved on demand instead of being bundled eagerly
const importedImages = import.meta.glob('../assets/gallery/*.webp', { eager: false });
const imageKeys = Object.keys(importedImages);

// We resolve URLs by importing them — Vite replaces each with the final hashed asset URL
const resolveImageUrls = async (): Promise<string[]> => {
  const modules = await Promise.all(
    imageKeys.map(key => importedImages[key]() as Promise<{ default: string }>)
  );
  return modules.map(m => m.default);
};

const PastEditionSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Resolve gallery URLs once the section is near the viewport
  useEffect(() => {
    if (isVisible && galleryItems.length === 0) {
      resolveImageUrls().then(urls => {
        setGalleryItems(urls.map((src, index) => ({
          id: index + 1,
          src,
          thumbnail: src,
          caption: `Momento SEMIN UFBA 2025 - Registro ${index + 1}`
        })));
      });
    }
  }, [isVisible, galleryItems.length]);

  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % galleryItems.length); };
  const goPrev = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length); };

  return (
    <section id="ultima-edicao" className="py-16 md:py-28 bg-semin-blue/5 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, #d29b21 40px, #d29b21 41px)`
      }} />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 md:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Camera className="h-3.5 w-3.5" />
            Flashback
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-semin-blue">
            Última Edição <span className="text-semin-yellow">SEMIN UFBA</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-4 w-4 text-semin-yellow/60" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-base md:text-xl text-semin-blue/60 max-w-2xl mx-auto leading-relaxed font-medium">
            Reviva os momentos marcantes da nossa última edição. Registros que celebram a técnica, a união e a paixão pela mineração.
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative px-6 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-5">
              {galleryItems.map((item, i) => (
                <CarouselItem key={item.id} className="pl-3 md:pl-5 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div
                    className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-black/5 border border-black/5 hover:border-semin-orange/30 transition-all duration-500 hover:-translate-y-2 active:scale-95`}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <img 
                      src={item.thumbnail} 
                      alt={item.caption} 
                      width="400" 
                      height="300" 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-semin-dark/90 via-semin-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-semin-orange flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-body text-[10px] text-white font-bold uppercase tracking-widest">Ver Foto</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="font-body text-xs font-semibold text-white/90 leading-tight bg-semin-dark/40 backdrop-blur-sm p-2 rounded-lg inline-block">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex items-center justify-center gap-4 mt-10">
              <CarouselPrevious className="static translate-y-0 bg-white border-semin-orange/20 text-semin-orange hover:bg-semin-orange hover:text-white h-12 w-12 transition-all duration-300 shadow-md" />
              <CarouselNext className="static translate-y-0 bg-white border-semin-orange/20 text-semin-orange hover:bg-semin-orange hover:text-white h-12 w-12 transition-all duration-300 shadow-md" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-semin-dark/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10 p-2" onClick={closeLightbox}>
            <X className="h-8 w-8" />
          </button>
          
          <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-semin-orange transition-colors z-10 p-2" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
            <ChevronLeft className="h-10 w-10 md:h-16 md:w-16" />
          </button>
          
          <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-semin-orange transition-colors z-10 p-2" onClick={(e) => { e.stopPropagation(); goNext(); }}>
            <ChevronRight className="h-10 w-10 md:h-16 md:w-16" />
          </button>

          <div
            className="max-w-5xl w-full aspect-video rounded-3xl overflow-hidden bg-black/40 border border-white/10 relative flex items-center justify-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryItems[selectedIndex]?.src} 
              alt={galleryItems[selectedIndex]?.caption} 
              className="w-full h-full object-contain" 
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <p className="font-body text-white/90 text-xs md:text-sm font-medium whitespace-nowrap">
                {galleryItems[selectedIndex]?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PastEditionSection;

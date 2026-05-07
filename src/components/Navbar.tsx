import { useState, useEffect, lazy, Suspense } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import seminLogo from "@/assets/semin_logo.webp";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Lazy-load — only needed when user clicks "Inscreva-se"
const RegistrationModal = lazy(() => import("./RegistrationModal").then(m => ({ default: m.RegistrationModal })));

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "Jubileu 50 Anos", href: "#jubileu" },
//  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Programação", href: "#programacao" },
  { label: "Galeria", href: "#galeria" },
  { label: "O Legado", href: "#legado" },
//  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Apoie o Evento", href: "#apoie" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled down past threshold
      setScrolled(currentScrollY > 20);

      // Hide on scroll down, show on scroll up
      if (currentScrollY <= 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-[#0a0d12] border-b border-semin-yellow/15 shadow-lg py-2 md:border-b-0 md:shadow-none ${
        scrolled
          ? "md:bg-[#0a0d12]/90 md:backdrop-blur-md md:border-b md:shadow-lg md:py-3"
          : "md:bg-transparent md:py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2" aria-label="Página Inicial">
          <img src={seminLogo} alt="SEMIN UFBA" width="160" height="64" className="h-14 md:h-16 w-auto" fetchPriority="high" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/60 hover:text-semin-yellow font-body text-sm font-medium transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-semin-yellow after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <Link to="/quiz">
              <Button variant="outline" className="border-semin-yellow text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark font-semibold transition-all duration-300">
                Desafio Semin
              </Button>
            </Link>
            <Suspense fallback={null}>
              <RegistrationModal>
                <div className="cursor-pointer">
                  <Button className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold shadow-lg shadow-semin-yellow/20 transition-all duration-300 hover:shadow-semin-yellow/40">
                    Inscreva-se
                  </Button>
                </div>
              </RegistrationModal>
            </Suspense>
          </div>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="text-white p-3 hover:text-semin-yellow transition-colors -mr-2" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-semin-dark/98 backdrop-blur-xl border-semin-blue/20 w-[280px] p-0">
            <div className="flex flex-col h-full pt-16 pb-8 px-6">
              <div className="flex items-center gap-2 mb-10">
                <img src={seminLogo} alt="SEMIN UFBA" width="160" height="64" className="h-16 w-auto" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white/70 hover:text-semin-yellow hover:bg-white/5 font-body text-base font-medium transition-all py-3 px-4 rounded-lg active:bg-white/10 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/quiz" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full border-semin-yellow text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark font-semibold py-6 text-base">
                    Desafio Semin
                  </Button>
                </Link>
                <Suspense fallback={null}>
                  <RegistrationModal>
                    <div onClick={() => setOpen(false)} className="cursor-pointer">
                      <Button className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold py-6 text-base">
                        Inscreva-se
                      </Button>
                    </div>
                  </RegistrationModal>
                </Suspense>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

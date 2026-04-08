import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import seminLogo from "@/assets/semin_logo.webp";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { RegistrationModal } from "./RegistrationModal";

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "Jubileu 50 Anos", href: "#jubileu" },
  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Programação", href: "#programacao" },
  { label: "Galeria", href: "#galeria" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-semin-dark/95 backdrop-blur-xl shadow-2xl shadow-black/20 py-2 md:py-3"
          : "bg-transparent py-4 md:py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <img src={seminLogo} alt="SEMIN 2026" width="160" height="64" className="h-14 md:h-16 w-auto" />
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
          <RegistrationModal>
            <div className="cursor-pointer">
              <Button className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold shadow-lg shadow-semin-yellow/20 transition-all duration-300 hover:shadow-semin-yellow/40">
                Inscreva-se
              </Button>
            </div>
          </RegistrationModal>
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
                <img src={seminLogo} alt="SEMIN 2026" width="160" height="64" className="h-16 w-auto" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white/70 hover:text-semin-yellow hover:bg-white/5 font-body text-base font-medium transition-all py-3 px-4 rounded-lg active:bg-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </div>
              <RegistrationModal>
                <div onClick={() => setOpen(false)} className="mt-4 cursor-pointer">
                  <Button className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold py-6 text-base">
                    Inscreva-se
                  </Button>
                </div>
              </RegistrationModal>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;

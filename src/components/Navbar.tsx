import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "Programação", href: "#programacao" },
  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-semin-dark/95 backdrop-blur-xl shadow-2xl shadow-black/20 py-3"
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="font-display text-2xl font-bold text-white tracking-wider">
          <span className="bg-gradient-to-r from-white to-semin-cream bg-clip-text text-transparent">SEMIN</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/60 hover:text-semin-yellow font-body text-sm font-medium transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-semin-yellow after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a href="#inscricoes">
            <Button className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold shadow-lg shadow-semin-yellow/20 transition-all duration-300 hover:shadow-semin-yellow/40">
              Inscreva-se
            </Button>
          </a>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="text-white p-2 hover:text-semin-yellow transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-semin-dark/95 backdrop-blur-xl border-semin-blue/20 w-72">
            <div className="flex flex-col gap-6 mt-12">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-semin-yellow font-body text-lg font-medium transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <a href="#inscricoes" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-semibold">
                  Inscreva-se
                </Button>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;

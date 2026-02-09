import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-semin-dark/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="font-display text-xl font-bold text-white tracking-wide">
          SEMIN
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-semin-yellow font-body text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="#inscricoes">
            <Button className="bg-semin-yellow text-semin-dark hover:bg-semin-orange hover:text-white font-semibold">
              Inscreva-se
            </Button>
          </a>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="text-white p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-semin-dark border-semin-blue w-72">
            <div className="flex flex-col gap-6 mt-12">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-semin-yellow font-body text-lg font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a href="#inscricoes" onClick={() => setOpen(false)}>
                <Button className="w-full bg-semin-yellow text-semin-dark hover:bg-semin-orange hover:text-white font-semibold">
                  Inscreva-se
                </Button>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

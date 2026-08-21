import { useState, useEffect, lazy, Suspense } from "react";
import { Menu, User, LogOut, Trophy, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import seminLogo from "@/assets/logo-semin-2026-cabecalho.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "./LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Lazy-load — only needed when user clicks "Inscreva-se"
const RegistrationModal = lazy(() => import("./RegistrationModal").then(m => ({ default: m.RegistrationModal })));

const links = [
  { label: "Sobre", href: "/#sobre" },
  { label: "Jubileu 50 Anos", href: "/#jubileu" },
  { label: "Programação", href: "/#programacao" },
  { label: "Galeria", href: "/#galeria" },
  { label: "O Legado", href: "/#legado" },
  { label: "Patrocinadores", href: "/#parceiros" },
  { label: "Apoie o Evento", href: "/#apoie" },
];

const Navbar = () => {
  const { profile, session, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const getHref = (href: string) => {
    if (isHomePage) {
      return href.startsWith("/") ? href.substring(1) : href;
    }
    return href.startsWith("/") ? href : `/${href}`;
  };

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
      } ${
        (scrolled || open)
          ? "bg-[#0a0d12] md:bg-[#0a0d12]/90 md:backdrop-blur-md border-b border-semin-yellow/15 shadow-lg py-2 md:py-3"
          : "bg-transparent py-4 md:py-6"
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
              href={getHref(l.href)}
              className="text-white/60 hover:text-semin-yellow font-body text-sm font-medium transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-semin-yellow after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            {profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white/80 hover:text-semin-yellow hover:bg-white/5 font-semibold transition-all duration-300 gap-2 px-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-bold">
                      {profile.nickname.charAt(0).toUpperCase()}
                    </div>
                    @{profile.nickname}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0f172a] border border-white/10 text-white rounded-xl shadow-xl w-48 p-1">
                  <Link to="/desafio-semin">
                    <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Desafio Semin</span>
                    </DropdownMenuItem>
                  </Link>
                  {session?.user?.email === "contato@seminufba.com.br" && (
                    <Link to="/admin">
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>Painel Admin</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-lg cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginModal defaultTab="login">
                <Button variant="ghost" className="text-white/80 hover:text-semin-yellow hover:bg-white/5 font-semibold transition-all duration-300 gap-2 px-3">
                  <User className="w-4 h-4" />
                  Entrar
                </Button>
              </LoginModal>
            )}
            
            <Link to="/desafio-semin">
              <Button variant="outline" className="border-semin-yellow text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark font-semibold transition-all duration-300">
                Desafio Semin
              </Button>
            </Link>
            {session?.user?.email === "contato@seminufba.com.br" && (
              <Link to="/admin">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-semin-dark hover:from-amber-600 hover:to-amber-500 font-bold shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/40">
                  Painel Admin
                </Button>
              </Link>
            )}
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
                    href={getHref(l.href)}
                    onClick={() => setOpen(false)}
                    className="text-white/70 hover:text-semin-yellow hover:bg-white/5 font-body text-base font-medium transition-all py-3 px-4 rounded-lg active:bg-white/10 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-4">
                {profile ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Link to="/desafio-semin" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full bg-white/5 text-white/80 hover:text-semin-yellow font-semibold py-6 text-base gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-bold">
                          {profile.nickname.charAt(0).toUpperCase()}
                        </div>
                        Perfil: @{profile.nickname}
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }} 
                      className="w-full bg-rose-500/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 font-semibold py-6 text-base gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair da Conta
                    </Button>
                  </div>
                ) : (
                  <LoginModal defaultTab="login">
                    <Button variant="ghost" className="w-full bg-white/5 text-white/80 hover:text-semin-yellow font-semibold py-6 text-base gap-2">
                      <User className="w-5 h-5" />
                      Entrar / Cadastrar
                    </Button>
                  </LoginModal>
                )}

                <Link to="/desafio-semin" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full border-semin-yellow text-semin-yellow hover:bg-semin-yellow hover:text-semin-dark font-semibold py-6 text-base">
                    Desafio Semin
                  </Button>
                </Link>
                {session?.user?.email === "contato@seminufba.com.br" && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-semin-dark hover:from-amber-600 hover:to-amber-500 font-bold py-6 text-base">
                      Painel Admin
                    </Button>
                  </Link>
                )}
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

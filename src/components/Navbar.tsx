import { useState, useEffect, lazy, Suspense } from "react";
import { Menu, User, LogOut, Trophy, LayoutDashboard, KeyRound, Sparkles, Flame, ShieldCheck, HeartHandshake } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

// Lazy-load - only needed when user clicks "Inscreva-se"
const RegistrationModal = lazy(() => import("./RegistrationModal").then(m => ({ default: m.RegistrationModal })));

interface NavItem {
  label: string;
  targetId: string;
  isRoute?: boolean;
  to?: string;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { label: "Sobre", targetId: "sobre" },
  { label: "50 Anos", targetId: "jubileu" },
  { label: "Programação & Painéis", targetId: "programacao" },
  { label: "Galeria", targetId: "galeria" },
  { label: "Patrocínio", targetId: "", isRoute: true, to: "/patrocinio", highlight: true },
  { label: "Apoie", targetId: "apoie" },
];

const Navbar = () => {
  const { profile, session, logout, setIsPasswordRecovery } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY <= 60) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    if (!id) return;
    
    if (!isHomePage) {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.isRoute && item.to) {
      // Let standard route navigation happen or navigate
      setOpen(false);
      return;
    }

    e.preventDefault();
    scrollToSection(item.targetId);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        (scrolled || open)
          ? "bg-[#090c10]/95 backdrop-blur-md border-b border-amber-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5"
          : "bg-[#090c10]/80 backdrop-blur-md sm:bg-transparent sm:bg-gradient-to-b sm:from-[#090c10]/90 sm:via-[#090c10]/50 sm:to-transparent py-2.5 sm:py-3 md:py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 shrink-0 group"
          aria-label="SEMIN UFBA 2026 - Página Inicial"
        >
          <img 
            src={seminLogo} 
            alt="SEMIN UFBA 2026" 
            width="170" 
            height="55" 
            className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            fetchPriority="high" 
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-7">
          {navItems.map((item) => {
            if (item.isRoute && item.to) {
              return (
                <a
                  key={item.label}
                  href={item.to}
                  className={`font-body text-xs lg:text-sm font-semibold transition-all duration-200 py-1 relative ${
                    item.highlight 
                      ? "text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25" 
                      : "text-white/75 hover:text-amber-400 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                  }`}
                >
                  {item.highlight && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                  {item.label}
                </a>
              );
            }

            return (
              <a
                key={item.label}
                href={`#${item.targetId}`}
                onClick={(e) => handleLinkClick(e, item)}
                className="text-white/75 hover:text-amber-400 font-body text-xs lg:text-sm font-medium transition-all duration-200 py-1 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions Cluster */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0">
          
          {/* Desafio Semin Button */}
          <Link to="/desafio-semin">
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 hover:text-amber-300 font-bold text-xs gap-1.5 rounded-xl transition-all duration-300 px-3.5 h-9"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Desafio SEMIN</span>
            </Button>
          </Link>

          {/* User Profile / Login */}
          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/90 hover:text-amber-400 hover:bg-white/10 font-bold text-xs gap-2 px-3 h-9 rounded-xl border border-white/10"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px] font-black">
                    {profile.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span>@{profile.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0f172a] border border-white/15 text-white rounded-xl shadow-2xl w-52 p-1.5 z-50">
                <Link to="/desafio-semin">
                  <DropdownMenuItem className="flex items-center gap-2.5 hover:bg-white/10 p-2 rounded-lg cursor-pointer text-xs font-semibold">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Desafio Semin</span>
                  </DropdownMenuItem>
                </Link>
                {session?.user?.email === "contato@seminufba.com.br" && (
                  <Link to="/admin">
                    <DropdownMenuItem className="flex items-center gap-2.5 hover:bg-white/10 p-2 rounded-lg cursor-pointer text-xs font-semibold">
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <span>Painel Admin</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => logout()} 
                  className="flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-lg cursor-pointer text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginModal defaultTab="login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-amber-400 hover:bg-white/5 font-semibold text-xs gap-1.5 px-3 h-9 rounded-xl"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </Button>
            </LoginModal>
          )}

          {/* Inscreva-se CTA */}
          <Suspense fallback={null}>
            <RegistrationModal>
              <div className="cursor-pointer">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-extrabold text-xs shadow-md shadow-amber-500/20 px-4 h-9 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Inscreva-se
                </Button>
              </div>
            </RegistrationModal>
          </Suspense>
        </div>

        {/* Mobile Hamburger Toggle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <button 
              className="text-white p-2.5 hover:text-amber-400 transition-colors rounded-xl bg-white/5 border border-white/10" 
              aria-label="Abrir Menu Principal"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#090c10]/98 backdrop-blur-2xl border-amber-500/20 w-[300px] p-0 text-white flex flex-col justify-between">
            <div className="flex flex-col h-full pt-8 pb-6 px-6 overflow-y-auto">
              
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <img src={seminLogo} alt="SEMIN UFBA" width="140" height="48" className="h-10 w-auto" />
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  if (item.isRoute && item.to) {
                    return (
                      <a
                        key={item.label}
                        href={item.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between py-3 px-3.5 rounded-xl font-medium text-sm transition-all ${
                          item.highlight 
                            ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30" 
                            : "text-white/80 hover:text-amber-400 hover:bg-white/5"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.highlight && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </a>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={`#${item.targetId}`}
                      onClick={(e) => handleLinkClick(e, item)}
                      className="text-white/80 hover:text-amber-400 hover:bg-white/5 font-body text-sm font-medium transition-all py-3 px-3.5 rounded-xl active:bg-white/10"
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* Mobile Actions Bottom */}
              <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-white/10">
                {profile ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Link to="/desafio-semin" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full bg-white/5 text-white/90 hover:text-amber-400 font-bold py-5 text-sm gap-2 rounded-xl justify-start px-4">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-black">
                          {profile.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span>Perfil: @{profile.nickname}</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }} 
                      className="w-full bg-rose-500/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 font-semibold py-5 text-sm gap-2 rounded-xl justify-start px-4"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </Button>
                  </div>
                ) : (
                  <LoginModal defaultTab="login">
                    <Button variant="ghost" className="w-full bg-white/5 text-white/80 hover:text-amber-400 font-semibold py-5 text-sm gap-2 rounded-xl">
                      <User className="w-4 h-4" />
                      <span>Entrar / Cadastrar</span>
                    </Button>
                  </LoginModal>
                )}

                <Link to="/desafio-semin" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-semin-dark font-bold py-5 text-sm rounded-xl gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>Desafio Semin</span>
                  </Button>
                </Link>

                <Suspense fallback={null}>
                  <RegistrationModal>
                    <div onClick={() => setOpen(false)} className="cursor-pointer">
                      <Button className="w-full bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-black py-5 text-sm rounded-xl shadow-lg shadow-amber-500/20">
                        Inscreva-se no Evento
                      </Button>
                    </div>
                  </RegistrationModal>
                </Suspense>
              </div>

            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
};

export default Navbar;
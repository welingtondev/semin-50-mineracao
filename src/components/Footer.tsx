import { Mail, Instagram, Linkedin, ArrowUp, Mountain, Pickaxe } from "lucide-react";

const footerLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Jubileu 50 Anos", href: "#jubileu" },
//  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Programação", href: "#programacao" },
  { label: "Galeria", href: "#galeria" },
  { label: "O Legado", href: "#legado" },
//  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Footer = () => (
  <footer className="bg-semin-dark py-10 md:py-20 relative">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow" />

      <div className="absolute bottom-0 left-0 w-full opacity-[0.03] hidden md:block">
        <svg viewBox="0 0 1440 160" className="w-full" preserveAspectRatio="none">
          <path d="M0,100 L150,60 L300,110 L450,40 L600,90 L750,30 L900,80 L1050,50 L1200,100 L1350,60 L1440,80 L1440,160 L0,160Z" fill="hsl(40 73% 48%)" />
        </svg>
      </div>
    </div>

    <a
      href="#inicio"
      className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-semin-yellow rounded-full flex items-center justify-center shadow-lg shadow-semin-yellow/30 hover:bg-semin-orange transition-colors hover:scale-110 active:scale-95"
    >
      <ArrowUp className="h-5 w-5 text-semin-dark" />
    </a>

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-12">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Pickaxe className="h-5 w-5 md:h-6 md:w-6 text-semin-yellow/40" />
            <h3 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-semin-cream bg-clip-text text-transparent">
              SEMIN 2026
            </h3>
          </div>
          <p className="font-body text-xs md:text-sm text-white/40">Semana de Mineração da UFBA</p>
          <p className="font-body text-[10px] md:text-xs text-semin-yellow/60 mt-2 border-l-2 border-semin-yellow/30 pl-3 flex items-center gap-2">
            <Mountain className="h-3 w-3 shrink-0" />
            Edição Comemorativa – 50 anos
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs md:text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 md:mb-4">Links Rápidos</h4>
          <div className="flex flex-col gap-2 md:gap-3">
            {footerLinks.map((l) => (
              <a key={l.href} href={l.href} className="font-body text-xs md:text-sm text-white/40 hover:text-semin-yellow transition-all duration-300 hover:translate-x-1 py-0.5">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-body text-xs md:text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 md:mb-4">Contato</h4>
          <a href="mailto:contato@seminufba.com.br" className="font-body text-xs md:text-sm text-white/40 hover:text-semin-yellow transition-colors flex items-center gap-2 py-0.5">
            <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" /> contato@seminufba.com.br
          </a>
          <div className="flex gap-3 md:gap-4 mt-4 md:mt-5">
            <a href="https://www.instagram.com/semin.ufba/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-semin-yellow/10 hover:text-semin-yellow transition-all duration-300 active:scale-90">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com/in/daemin-diretório-acadêmico-de-engenharia-de-minas-9b167b403/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-semin-yellow/10 hover:text-semin-yellow transition-all duration-300 active:scale-90">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-5 md:pt-6 text-center">
        <p className="font-body text-[10px] md:text-xs text-white/20">© 2026 SEMIN – Semana de Mineração da UFBA. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

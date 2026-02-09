import { Mail, Instagram, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Programação", href: "#programacao" },
  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Footer = () => (
  <footer className="bg-semin-dark py-12 md:py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">SEMIN</h3>
          <p className="font-body text-sm text-white/50">
            Seminário de Mineração da UFBA
          </p>
          <p className="font-body text-xs text-semin-yellow/70 mt-1">
            Edição Comemorativa – 50 anos da Engenharia de Minas
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
            Links Rápidos
          </h4>
          <div className="flex flex-col gap-2">
            {footerLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm text-white/50 hover:text-semin-yellow transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
            Contato
          </h4>
          <a
            href="mailto:semin@ufba.br"
            className="font-body text-sm text-white/50 hover:text-semin-yellow transition-colors flex items-center gap-2"
          >
            <Mail className="h-4 w-4" /> semin@ufba.br
          </a>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-white/40 hover:text-semin-yellow transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-semin-yellow transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 text-center">
        <p className="font-body text-xs text-white/30">
          © 2025 SEMIN – Seminário de Mineração da UFBA. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

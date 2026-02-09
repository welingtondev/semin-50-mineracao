import { Mail, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
  { label: "Programação", href: "#programacao" },
  { label: "Palestrantes", href: "#palestrantes" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Inscrições", href: "#inscricoes" },
];

const Footer = () => (
  <footer className="bg-semin-dark py-14 md:py-20 relative">
    {/* Top gradient line */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow" />

    {/* Back to top */}
    <motion.a
      href="#hero"
      className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-semin-yellow rounded-full flex items-center justify-center shadow-lg shadow-semin-yellow/30 hover:bg-semin-orange transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowUp className="h-5 w-5 text-semin-dark" />
    </motion.a>

    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Brand */}
        <div>
          <h3 className="font-display text-3xl font-bold bg-gradient-to-r from-white to-semin-cream bg-clip-text text-transparent mb-2">
            SEMIN
          </h3>
          <p className="font-body text-sm text-white/40">
            Seminário de Mineração da UFBA
          </p>
          <p className="font-body text-xs text-semin-yellow/60 mt-2 border-l-2 border-semin-yellow/30 pl-3">
            Edição Comemorativa – 50 anos da Engenharia de Minas
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Links Rápidos
          </h4>
          <div className="flex flex-col gap-3">
            {footerLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm text-white/40 hover:text-semin-yellow transition-all duration-300 hover:translate-x-1"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Contato
          </h4>
          <a
            href="mailto:semin@ufba.br"
            className="font-body text-sm text-white/40 hover:text-semin-yellow transition-colors flex items-center gap-2"
          >
            <Mail className="h-4 w-4" /> semin@ufba.br
          </a>
          <div className="flex gap-4 mt-5">
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-semin-yellow/10 hover:text-semin-yellow transition-all duration-300">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-semin-yellow/10 hover:text-semin-yellow transition-all duration-300">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 text-center">
        <p className="font-body text-xs text-white/20">
          © 2025 SEMIN – Seminário de Mineração da UFBA. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

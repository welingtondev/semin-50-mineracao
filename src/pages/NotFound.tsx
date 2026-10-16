import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-muted py-8 px-4">
      <div />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90 font-medium">
          Voltar para a Página Inicial
        </a>
      </div>
      <footer className="text-center text-xs text-muted-foreground">
        developt by{" "}
        <a
          href="https://www.instagram.com/wellingtonsantos.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-semibold text-primary"
        >
          @wellingtonsantos.br
        </a>
      </footer>
    </div>
  );
};

export default NotFound;

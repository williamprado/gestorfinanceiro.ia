
import { useState, useEffect } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o WA Gestor Financeiro IA.", "_blank");
  };

  return (
    <>
      {/* Botão Voltar ao Topo - Lateral Esquerda */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed left-6 bottom-6 z-50 w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg transition-all duration-300 animate-fade-in"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Botão WhatsApp - Lateral Direita */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="relative">
          {/* Anel de pulso */}
          <div className="absolute inset-0 w-14 h-14 bg-green-400 rounded-full animate-ping opacity-75"></div>
          <Button
            onClick={openWhatsApp}
            className="relative w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
            size="icon"
          >
            <Phone className="w-10 h-10" />
          </Button>
        </div>
      </div>
    </>
  );
};

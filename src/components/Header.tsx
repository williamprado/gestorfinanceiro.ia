
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#25D366] rounded-lg p-2">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">WA Gestor Financeiro IA</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#recursos" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Recursos
            </a>
            <a href="#como-funciona" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Como Funciona
            </a>
            <a href="#precos" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Preços
            </a>
            <a href="#contato" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Contato
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">
                Fazer Login
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-[#25D366] hover:bg-[#128C7E]">
                Começar Grátis
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#recursos" className="text-gray-600 hover:text-[#25D366] transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-[#25D366] transition-colors">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-600 hover:text-[#25D366] transition-colors">
                Preços
              </a>
              <a href="#contato" className="text-gray-600 hover:text-[#25D366] transition-colors">
                Contato
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Fazer Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#25D366] hover:bg-[#128C7E] w-full">
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

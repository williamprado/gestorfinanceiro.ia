import { MessageCircle, Mail, Phone } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-[#25D366] rounded-lg p-2">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold">WA Gestor Financeiro IA</span>
          </div>
          <p className="text-gray-400 leading-relaxed">A plataforma completa para gerenciar suas finanças pessoais com inteligência.</p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Produto</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Empresa</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Contato</h4>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: (11) 9999-9999</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <span>contato@wagestorfinanceiroia.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <span>(11) 3333-3333</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 WA Gestor Financeiro IA. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>;
};
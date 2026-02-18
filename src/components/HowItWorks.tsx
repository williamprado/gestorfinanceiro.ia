
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "1. Cadastre-se",
      description: "Crie sua conta gratuita em menos de 2 minutos e comece a usar imediatamente.",
      color: "bg-[#DCF8C6] text-[#128C7E]"
    },
    {
      icon: BarChart3,
      title: "2. Configure seu Dashboard",
      description: "Personalize categorias e configure suas fontes de renda e gastos principais.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Target,
      title: "3. Defina suas Metas",
      description: "Estabeleça objetivos financeiros e acompanhe seu progresso em tempo real.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">COMO FUNCIONA</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simples de usar, poderoso nos resultados
          </p>
          <p className="text-gray-500 mt-4">
            Conheça o funcionamento da plataforma e veja como é simples gerenciar suas finanças.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${step.color}`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de usuários que já transformaram suas finanças com o WA Gestor Financeiro IA
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-[#128C7E] hover:bg-gray-100 text-lg px-8 py-4">
              Começar Agora Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

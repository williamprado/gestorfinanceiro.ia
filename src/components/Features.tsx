
import { FeatureCard } from "./FeatureCard";
import { BarChart3, Target, Tag, FileText, MessageCircle, TrendingUp } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard Intuitivo",
      description: "Visualize suas finanças em tempo real com gráficos e indicadores que mostram exatamente para onde seu dinheiro está indo.",
      color: "blue"
    },
    {
      icon: TrendingUp,
      title: "Controle de Entradas e Saídas",
      description: "Registre e categorize suas receitas e despesas de forma simples, mantendo um controle detalhado de suas finanças.",
      color: "green"
    },
    {
      icon: Target,
      title: "Metas Financeiras",
      description: "Defina e acompanhe suas metas financeiras, visualizando seu progresso e mantendo-se motivado a alcançar seus objetivos.",
      color: "purple"
    },
    {
      icon: Tag,
      title: "Categorias Personalizáveis",
      description: "Crie e personalize categorias de acordo com suas necessidades, organizando suas transações conforme seu estilo de vida.",
      color: "yellow"
    },
    {
      icon: FileText,
      title: "Relatórios Detalhados",
      description: "Gere relatórios personalizados para analisar seus gastos e receitas, identificando padrões e oportunidades de economia.",
      color: "indigo"
    },
    {
      icon: MessageCircle,
      title: "WA Gestor Financeiro IA no WhatsApp",
      description: "Registre receitas e despesas diretamente pelo WhatsApp. Basta enviar uma mensagem para nosso assistente virtual e ele lançará automaticamente em sua conta.",
      color: "orange"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">RECURSOS</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo o que você precisa para controlar suas finanças
          </p>
          <p className="text-gray-500 mt-4">
            Conheça as principais funcionalidades que tornam o WA Gestor Financeiro IA a melhor escolha para gerenciar suas finanças pessoais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

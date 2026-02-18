
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: "50.000+",
      label: "Usuários Ativos",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      value: "R$ 500M+",
      label: "Valor Gerenciado",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfação",
      color: "text-orange-600"
    },
    {
      icon: Clock,
      value: "2 min",
      label: "Tempo de Setup",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-orange-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">NÚMEROS QUE FALAM POR SI</h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Confiado por milhares de pessoas e empresas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-orange-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

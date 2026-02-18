
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Settings, BarChart3 } from "lucide-react";

const DashboardEmpresarial = () => {
  const stats = [
    {
      title: "Receitas no período",
      value: "R$ 8.300,00",
      change: "+1.0%",
      changeType: "positive"
    },
    {
      title: "Despesas no período",
      value: "R$ 516,67",
      change: "Pendente: R$ 0,00",
      changeType: "neutral"
    },
    {
      title: "Saldo do período",
      value: "R$ 7.783,33",
      change: "+6.2%",
      changeType: "positive"
    },
    {
      title: "Despesas/Receitas",
      value: "6.2%",
      badge: "Saúde Financeira",
      badgeType: "excellent",
      changeType: "positive"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tabs defaultValue="personal" className="w-auto">
                <TabsList>
                  <TabsTrigger value="personal">Pessoal</TabsTrigger>
                  <TabsTrigger value="empresarial">Empresarial</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="bg-orange-500 rounded-full p-1">
                <span className="text-white font-bold text-sm px-2">JW</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Empresarial</h1>
            <p className="text-gray-600">Visão geral das suas finanças empresariais</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tabs defaultValue="dia" className="w-auto">
              <TabsList>
                <TabsTrigger value="dia">Dia</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
                <TabsTrigger value="mes">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Personalizar
            </Button>
          </div>
        </div>

        {/* Financial Summary Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-500 rounded-full p-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Resumo Financeiro Empresarial: Março/2025</h2>
              <p className="text-sm text-gray-600">Período: 01/03/2025 a 31/03/2025 • Dados atuais</p>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'neutral' ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                )}
                {stat.badge && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">{stat.badge}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {stat.badgeType === 'excellent' ? 'Excelente' : 'Bom'}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Fluxo de Caixa Empresarial</h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Opções
            </Button>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Fluxo de Caixa</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEmpresarial;

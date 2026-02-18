import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Calendar,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";

interface ChartData {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface CategoryData {
  categoria: string;
  valor: number;
  cor: string;
}

interface FilteredTransaction {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "receita" | "despesa";
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Função para formatar a data para exibição (DD/MM/YYYY)
const formatarData = (dataString: string) => {
  if (!dataString) return "";
  const [ano, mes, dia] = dataString.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
};

// Função para obter a data atual no formato do banco (YYYY-MM-DD)
const getDataAtual = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
};

// Função para obter o primeiro dia da semana no formato do banco (YYYY-MM-DD)
const getPrimeiroDiaSemana = () => {
  const now = new Date();
  const primeiroDiaSemana = new Date(now);
  primeiroDiaSemana.setDate(now.getDate() - now.getDay());
  return `${primeiroDiaSemana.getFullYear()}-${String(
    primeiroDiaSemana.getMonth() + 1
  ).padStart(2, "0")}-${String(primeiroDiaSemana.getDate()).padStart(2, "0")}`;
};

// Função para obter o primeiro dia do mês no formato do banco (YYYY-MM-DD)
const getPrimeiroDiaMes = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;
};

// Função para obter o primeiro dia do trimestre no formato do banco (YYYY-MM-DD)
const getPrimeiroDiaTrimestre = () => {
  const now = new Date();
  const mes = Math.floor(now.getMonth() / 3) * 3 + 1;
  return `${now.getFullYear()}-${String(mes).padStart(2, "0")}-01`;
};

// Função para obter o primeiro dia do ano no formato do banco (YYYY-MM-DD)
const getPrimeiroDiaAno = () => {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
};

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const { toast } = useToast();
  const { transacoes, loading: loadingTransacoes } = useTransacoes();
  const { categorias, loading: loadingCategorias } = useCategorias();

  const processedData = useMemo(() => {
    if (loadingTransacoes || !transacoes.length) {
      return {
        chartData: [] as ChartData[],
        categoryData: [] as CategoryData[],
        filteredTransactions: [] as FilteredTransaction[],
      };
    }

    const hoje = getDataAtual();

    // Filtrar transações baseado no período
    const filteredByPeriod = transacoes.filter((transacao) => {
      const dataTransacao = transacao.data.split("T")[0];

      switch (selectedPeriod) {
        case "semana":
          return dataTransacao >= getPrimeiroDiaSemana();
        case "mes":
          return dataTransacao >= getPrimeiroDiaMes();
        case "trimestre":
          return dataTransacao >= getPrimeiroDiaTrimestre();
        case "ano":
          return dataTransacao >= getPrimeiroDiaAno();
        default:
          return true;
      }
    });

    // Calcular dados do gráfico baseado no período
    let chartData: ChartData[] = [];

    if (selectedPeriod === "semana") {
      // Agrupar por dia da semana
      const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
      chartData = days.map((day) => {
        const dayIndex = days.indexOf(day);
        const dayTransactions = filteredByPeriod.filter((t) => {
          const [ano, mes, dia] = t.data.split("T")[0].split("-");
          const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
          return data.getDay() === dayIndex;
        });

        const receitas = dayTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = dayTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        return {
          periodo: day,
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });
    } else if (selectedPeriod === "mes") {
      // Agrupar por dia do mês
      const now = new Date();
      const primeiroDiaMes = getPrimeiroDiaMes();
      const diasNoMes = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      chartData = Array.from({ length: diasNoMes }, (_, i) => {
        const dia = String(i + 1).padStart(2, "0");
        const dataDia = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${dia}`;

        const transacoesDia = filteredByPeriod.filter(
          (t) => t.data.split("T")[0] === dataDia
        );

        const receitas = transacoesDia
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = transacoesDia
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        return {
          periodo: dia,
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });
    } else if (selectedPeriod === "trimestre") {
      // Agrupar por trimestre dos últimos 4 trimestres
      for (let i = 3; i >= 0; i--) {
        const quarterYear = new Date().getFullYear() - Math.floor(i / 4);
        const quarterIndex = (new Date().getMonth() / 3 - i + 4) % 4;
        const quarterStart = quarterIndex * 3;

        const quarterTransactions = filteredByPeriod.filter((t) => {
          const [ano, mes, dia] = t.data.split("T")[0].split("-");
          const transactionDate = new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
          );
          return (
            transactionDate.getFullYear() === quarterYear &&
            transactionDate.getMonth() >= quarterStart &&
            transactionDate.getMonth() < quarterStart + 3
          );
        });

        const receitas = quarterTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = quarterTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        chartData.push({
          periodo: `Q${quarterIndex + 1} ${quarterYear}`,
          receitas,
          despesas,
          saldo: receitas - despesas,
        });
      }
    } else if (selectedPeriod === "ano") {
      // Agrupar por ano dos últimos 5 anos
      for (let i = 4; i >= 0; i--) {
        const targetYear = new Date().getFullYear() - i;
        const yearTransactions = filteredByPeriod.filter((t) => {
          const [ano, mes, dia] = t.data.split("T")[0].split("-");
          const transactionDate = new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
          );
          return transactionDate.getFullYear() === targetYear;
        });

        const receitas = yearTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = yearTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        chartData.push({
          periodo: targetYear.toString(),
          receitas,
          despesas,
          saldo: receitas - despesas,
        });
      }
    }

    // Calcular dados por categoria
    const categoryMap = new Map<string, CategoryData>();

    filteredByPeriod
      .filter((t) => t.tipo === "despesa")
      .forEach((transaction) => {
        const categoryName = transaction.categorias?.nome || "Sem categoria";
        const categoryColor = transaction.categorias?.cor || "#6B7280";

        if (categoryMap.has(categoryName)) {
          const existingCategory = categoryMap.get(categoryName)!;
          categoryMap.set(categoryName, {
            ...existingCategory,
            valor: existingCategory.valor + Number(transaction.valor),
          });
        } else {
          categoryMap.set(categoryName, {
            categoria: categoryName,
            valor: Number(transaction.valor),
            cor: categoryColor,
          });
        }
      });

    const categoryData = Array.from(categoryMap.values());

    // Filtrar transações para a tabela
    const filteredTransactions = filteredByPeriod
      .filter((transaction) => {
        if (selectedCategory === "todas") return true;
        if (selectedCategory === "receita")
          return transaction.tipo === "receita";
        if (selectedCategory === "despesa")
          return transaction.tipo === "despesa";
        return true;
      })
      .map((transaction) => ({
        id: transaction.id,
        data: transaction.data,
        descricao: transaction.descricao,
        categoria: transaction.categorias?.nome || "Sem categoria",
        valor: Number(transaction.valor),
        tipo: transaction.tipo,
      }))
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 50);

    return {
      chartData,
      categoryData,
      filteredTransactions,
    };
  }, [transacoes, selectedPeriod, selectedCategory, loadingTransacoes]);

  const { chartData, categoryData, filteredTransactions } = processedData;

  const chartConfig = {
    receitas: {
      label: "Receitas",
      color: "#22c55e",
    },
    despesas: {
      label: "Despesas",
      color: "#ef4444",
    },
    saldo: {
      label: "Saldo",
      color: "#3b82f6",
    },
  };

  const handleExportReport = () => {
    try {
      // Preparar dados para exportação
      const reportData = {
        periodo: selectedPeriod,
        dataGeracao: new Date().toLocaleDateString("pt-BR"),
        resumo: {
          totalReceitas: totalReceitas,
          totalDespesas: totalDespesas,
          saldoTotal: saldoTotal,
        },
        dadosMensais: chartData,
        categorias: categoryData,
        transacoes: filteredTransactions,
      };

      // Criar CSV das transações
      const csvHeader = "Data,Descrição,Categoria,Valor,Tipo\n";
      const csvData = filteredTransactions
        .map(
          (transaction) =>
            `${transaction.data},"${transaction.descricao}","${transaction.categoria}",${transaction.valor},${transaction.tipo}`
        )
        .join("\n");

      const csvContent = csvHeader + csvData;

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio-financeiro-${selectedPeriod}-${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado com sucesso!",
        description: "O arquivo CSV foi baixado para seu computador.",
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast({
        title: "Erro ao exportar relatório",
        description:
          "Ocorreu um erro ao tentar exportar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Calcular totais baseado nos dados do período atual
  const totalReceitas = chartData.reduce(
    (acc: number, item: ChartData) => acc + (item.receitas || 0),
    0
  );
  const totalDespesas = chartData.reduce(
    (acc: number, item: ChartData) => acc + (item.despesas || 0),
    0
  );
  const saldoTotal = totalReceitas - totalDespesas;

  // Obter chave correta para o eixo X baseado no período
  const getXAxisKey = () => {
    if (selectedPeriod === "mes") return "periodo";
    return "periodo";
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Relatórios
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Visualize e analise seus dados financeiros - {selectedPeriod}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Semana</SelectItem>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-green-600">
                R$ {totalReceitas.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Período: {selectedPeriod}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-red-600">
                R$ {totalDespesas.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Período: {selectedPeriod}
              </p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg md:text-2xl font-bold ${
                  saldoTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R$ {saldoTotal.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                {saldoTotal >= 0 ? "Resultado positivo" : "Resultado negativo"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes tipos de relatórios */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="overview" className="text-sm">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-sm">
              Categorias
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-sm">
              Transações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Gráfico de barras - Receitas vs Despesas */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <FileText className="w-5 h-5 mr-2 text-orange-500" />
                    Receitas vs Despesas - {selectedPeriod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey={getXAxisKey()}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} width={80} />
                        <ChartTooltip />
                        <Bar dataKey="receitas" fill="#22c55e" />
                        <Bar dataKey="despesas" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de linha - Evolução do saldo */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Evolução do Saldo - {selectedPeriod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey={getXAxisKey()}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} width={80} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="saldo"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Gráfico de pizza - Despesas por categoria */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <PieChartIcon className="w-5 h-5 mr-2 text-orange-500" />
                    Despesas por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="valor"
                          label={{ fontSize: 12 }}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de categorias */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Detalhamento por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {categoryData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.cor }}
                          />
                          <span className="font-medium text-sm md:text-base">
                            {item.categoria}
                          </span>
                        </div>
                        <span className="font-bold text-sm md:text-base">
                          R$ {item.valor.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="w-full">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-base md:text-lg">
                  Transações - {selectedPeriod}
                </CardTitle>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="receita">Receitas</SelectItem>
                    <SelectItem value="despesa">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right w-[150px]">
                          Valor
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatarData(transaction.data)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.descricao}
                          </TableCell>
                          <TableCell>{transaction.categoria}</TableCell>
                          <TableCell
                            className={`text-right font-medium whitespace-nowrap ${
                              transaction.tipo === "receita"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.tipo === "receita" ? "+" : "-"}R${" "}
                            {Math.abs(transaction.valor).toLocaleString(
                              "pt-BR"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-4 text-sm md:text-base text-muted-foreground">
                      Nenhuma transação encontrada para o filtro selecionado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Relatorios;

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";
import { NovoItemMercadoModal } from "@/components/NovoItemMercadoModal";
import { EditarItemMercadoModal } from "@/components/EditarItemMercadoModal";
import { NovaCategoriaModal } from "@/components/NovaCategoriaModal";
import { EditarCategoriaModal } from "@/components/EditarCategoriaModal";
import { EditarOrcamentoModal } from "@/components/EditarOrcamentoModal";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";
import { useCategoriasMercado } from "@/hooks/useCategoriasMercado";
import { useItensMercado } from "@/hooks/useItensMercado";
import { useOrcamentosMercado } from "@/hooks/useOrcamentosMercado";
import { ScrollArea } from "@/components/ui/scroll-area";

// Interface para compatibilidade com componentes existentes
interface ItemMercadoForm {
  descricao: string;
  categoria_mercado_id?: string;
  unidade_medida: string;
  quantidade_atual: number;
  quantidade_ideal: number;
  preco_atual: number;
}

interface CategoriaMercadoForm {
  nome: string;
  descricao?: string;
  cor: string;
  ativa: boolean;
}

// Simulando dados de despesas de supermercado (normalmente viriam de um contexto/hook)
const despesasSupermercado = [
  {
    id: "1",
    descricao: "Compras do mês",
    valor: 850,
    categoria: "Alimentação",
    data: "2025-06-01",
  },
  {
    id: "2",
    descricao: "Feira",
    valor: 120,
    categoria: "Alimentação",
    data: "2025-06-08",
  },
  {
    id: "3",
    descricao: "Açougue",
    valor: 180,
    categoria: "Alimentação",
    data: "2025-06-12",
  },
];

const Mercado = () => {
  const handleImportarCategoriasPadrao = async () => {
    type CategoriaMercadoPadrao = { nome: string; descricao: string; cor: string };
    const categoriasPadrao: CategoriaMercadoPadrao[] = [
      { nome: 'Alimentação Básica', descricao: 'Itens essenciais de alimentação', cor: '#10B981' },
      { nome: 'Limpeza', descricao: 'Produtos de limpeza e higiene', cor: '#3B82F6' },
      { nome: 'Higiene Pessoal', descricao: 'Produtos de cuidado pessoal', cor: '#8B5CF6' },
      { nome: 'Bebidas', descricao: 'Bebidas em geral', cor: '#F59E0B' },
      { nome: 'Carnes e Proteínas', descricao: 'Carnes, peixes e proteínas', cor: '#EF4444' },
      { nome: 'Laticínios', descricao: 'Leite, queijos e derivados', cor: '#06B6D4' },
      { nome: 'Frutas e Verduras', descricao: 'Hortifruti em geral', cor: '#84CC16' },
    ];

    try {
      for (const categoria of categoriasPadrao) {
        // A função createCategoriaMercado espera um objeto com mais campos,
        // então precisamos adicionar os que faltam com valores padrão.
        await createCategoriaMercado({ ...categoria, ativa: true });
      }
      toast({
        title: "Sucesso!",
        description: "Categorias de mercado padrão importadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao importar categorias de mercado padrão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar as categorias de mercado padrão. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  const { toast } = useToast();
  const { categoriasDespesa } = useCategorias();
  const {
    categoriasMercado,
    createCategoriaMercado,
    updateCategoriaMercado,
    deleteCategoriaMercado,
  } = useCategoriasMercado();
  const {
    itensMercado,
    createItemMercado,
    updateItemMercado,
    deleteItemMercado,
  } = useItensMercado();
  const {
    orcamentosMercado,
    createOrcamentoMercado,
    updateOrcamentoMercado,
    getOrcamentoAtivo,
  } = useOrcamentosMercado();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [itemParaEditar, setItemParaEditar] = useState<any>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<any>(null);
  const [modalEditarCategoriaAberto, setModalEditarCategoriaAberto] =
    useState(false);
  const [orcamentoMensal, setOrcamentoMensal] = useState(0);
  const [estimativaGastos, setEstimativaGastos] = useState(0);
  const [categoriaOrcamento, setCategoriaOrcamento] = useState("");
  const [modalOrcamentoAberto, setModalOrcamentoAberto] = useState(false);

  // Carregar orçamento ativo e buscar nome da categoria
  useEffect(() => {
    if (orcamentosMercado.length > 0) {
      const orcamentoAtivo = orcamentosMercado[0]; // Pega o primeiro orçamento ativo
      if (orcamentoAtivo) {
        setOrcamentoMensal(orcamentoAtivo.valor_orcamento);
        setEstimativaGastos(orcamentoAtivo.estimativa_gastos);

        // Buscar o nome da categoria pelo ID
        const categoria = categoriasDespesa.find(
          (cat) => cat.id === orcamentoAtivo.categoria_despesa
        );
        setCategoriaOrcamento(
          categoria ? categoria.nome : orcamentoAtivo.categoria_despesa
        );
      }
    }
  }, [orcamentosMercado, categoriasDespesa]);

  // Cálculos do orçamento mensal baseados na categoria selecionada e na lista de mercado
  const dadosOrcamento = useMemo(() => {
    // Gastos reais calculados pelos itens da lista
    const gastosItensLista = itensMercado.reduce((total, item) => {
      return total + item.preco_atual * item.quantidade_atual;
    }, 0);

    // Saldo disponível = Orçamento - Gastos Reais (não a estimativa)
    const saldoDisponivel = orcamentoMensal - gastosItensLista;
    const percentualGasto =
      orcamentoMensal > 0 ? (gastosItensLista / orcamentoMensal) * 100 : 0;
    const orcamentoExcedido = gastosItensLista > orcamentoMensal;

    return {
      orcamento: orcamentoMensal,
      gastosItensLista,
      estimativaGastos: estimativaGastos,
      saldoDisponivel,
      percentualGasto,
      orcamentoExcedido,
    };
  }, [orcamentoMensal, estimativaGastos, itensMercado]);

  const stockLevels = [
    {
      color: "bg-green-500",
      label: "ESTOQUE ADEQUADO",
      description: "(Quantidade atual é ideal)",
    },
    {
      color: "bg-yellow-500",
      label: "ESTOQUE MÉDIO",
      description: "(Quantidade entre 30% e 99% do ideal)",
    },
    {
      color: "bg-red-500",
      label: "ESTOQUE BAIXO",
      description: "(Menos de 30% do ideal)",
    },
    {
      color: "bg-gray-500",
      label: "SEM ESTOQUE",
      description: "(Sem itens ou item não foi adicionado na lista de compras)",
    },
  ];

  const categoriasAtivas = categoriasMercado.filter((cat) => cat.ativa);
  const categoriasDisponiveis = [
    "all",
    ...categoriasAtivas.map((cat) => cat.nome),
  ];

  const itemsFiltrados = itensMercado.filter((item) => {
    const matchCategoria =
      selectedCategory === "all" ||
      item.categorias_mercado?.nome === selectedCategory;
    const matchDescricao = item.descricao
      .toLowerCase()
      .includes(filtroDescricao.toLowerCase());
    return matchCategoria && matchDescricao;
  });

  const limparFiltros = () => {
    setSelectedCategory("all");
    setFiltroDescricao("");
  };

  const handleAdicionarItem = async (novoItem: ItemMercadoForm) => {
    await createItemMercado(novoItem);
  };

  const handleEditarItem = async (itemEditado: any) => {
    console.log("Item recebido para editar:", itemEditado);
    await updateItemMercado(itemEditado.id, itemEditado);
  };

  const handleExcluirItem = async (id: string) => {
    await deleteItemMercado(id);
  };

  const handleAdicionarCategoria = async (
    novaCategoria: CategoriaMercadoForm
  ) => {
    await createCategoriaMercado(novaCategoria);
  };

  const handleEditarCategoria = async (categoriaEditada: any) => {
    await updateCategoriaMercado(categoriaEditada.id, categoriaEditada);
  };

  const handleExcluirCategoria = async (id: string) => {
    await deleteCategoriaMercado(id);
  };

  const abrirModalEdicao = (item: any) => {
    setItemParaEditar(item);
    setModalEditarAberto(true);
  };

  const abrirModalEdicaoCategoria = (categoria: any) => {
    setCategoriaParaEditar(categoria);
    setModalEditarCategoriaAberto(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "estoque_adequado":
        return "text-green-600";
      case "estoque_medio":
        return "text-yellow-600";
      case "estoque_baixo":
        return "text-red-600";
      case "sem_estoque":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const handleSalvarOrcamento = async (
    novoOrcamento: number,
    novaEstimativa: number,
    categoriaSelecionada: string
  ) => {
    const mesAtual = new Date().toISOString().slice(0, 7) + "-01"; // YYYY-MM-01

    // Verificar se já existe um orçamento ativo para esta categoria no mês atual
    const orcamentoExistente = getOrcamentoAtivo(categoriaSelecionada);

    if (orcamentoExistente) {
      // Atualizar orçamento existente
      await updateOrcamentoMercado(orcamentoExistente.id, {
        valor_orcamento: novoOrcamento,
        estimativa_gastos: novaEstimativa,
        categoria_despesa: categoriaSelecionada,
      });
    } else {
      // Criar novo orçamento
      await createOrcamentoMercado({
        categoria_despesa: categoriaSelecionada,
        valor_orcamento: novoOrcamento,
        estimativa_gastos: novaEstimativa,
        mes_referencia: mesAtual,
        ativo: true,
      });
    }

    setOrcamentoMensal(novoOrcamento);
    setEstimativaGastos(novaEstimativa);
    setCategoriaOrcamento(categoriaSelecionada);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mercado
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Gerencie seu estoque e lista de compras
          </p>
        </div>

        {/* Alerta de Orçamento Excedido */}
        {dadosOrcamento.orcamentoExcedido && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm md:text-base text-red-800 font-semibold">
                ⚠️ Orçamento Excedido!
              </h3>
            </div>
            <p className="text-sm md:text-base text-red-700 mt-1">
              Você ultrapassou o orçamento mensal em R${" "}
              {Math.abs(dadosOrcamento.saldoDisponivel).toLocaleString(
                "pt-BR",
                { minimumFractionDigits: 2 }
              )}
            </p>
          </div>
        )}

        {/* Orçamento Mensal Card */}
        <Card
          className={`p-4 md:p-6 border-l-4 ${dadosOrcamento.orcamentoExcedido
              ? "border-l-red-500 bg-red-50"
              : dadosOrcamento.percentualGasto > 80
                ? "border-l-yellow-500 bg-yellow-50"
                : "border-l-wa-green"
            }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Orçamento Mensal
              </h2>
              <p className="text-sm text-gray-600">
                Categoria: {categoriaOrcamento}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOrcamentoAberto(true)}
              className="w-full md:w-auto"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="space-y-4">
            <div
              className={`text-2xl md:text-3xl font-bold ${dadosOrcamento.orcamentoExcedido
                  ? "text-red-600"
                  : "text-gray-900"
                }`}
            >
              R${" "}
              {dadosOrcamento.orcamento.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-sm md:text-base text-gray-600">
                  Gastos Reais (Lista de Mercado):
                </span>
                <span className="font-bold text-purple-600">
                  R${" "}
                  {dadosOrcamento.gastosItensLista.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-sm md:text-base text-gray-600">
                  Estimativa de Gastos:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-full md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${dadosOrcamento.orcamentoExcedido
                          ? "bg-red-500"
                          : dadosOrcamento.percentualGasto > 80
                            ? "bg-yellow-500"
                            : "bg-gradient-to-r from-green-400 to-yellow-500"
                        }`}
                      style={{
                        width: `${Math.min(
                          dadosOrcamento.percentualGasto,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`font-bold ${dadosOrcamento.orcamentoExcedido
                        ? "text-red-600"
                        : "text-gray-900"
                      }`}
                  >
                    R${" "}
                    {dadosOrcamento.estimativaGastos.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-sm md:text-base text-gray-600">
                  Saldo Disponível:
                </span>
                <div className="flex items-center space-x-2">
                  {dadosOrcamento.saldoDisponivel >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`font-bold ${dadosOrcamento.saldoDisponivel >= 0
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    R${" "}
                    {Math.abs(dadosOrcamento.saldoDisponivel).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="itens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="itens">Itens</TabsTrigger>
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
          </TabsList>

          <TabsContent value="itens" className="space-y-6">
            {/* Stock Level Legend */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {stockLevels.map((level, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${level.color}`}
                    ></div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {level.label}
                      </span>
                      <span className="text-xs text-gray-600 md:ml-1">
                        {level.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filtros */}
            <Card className="p-4 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar itens..."
                    value={filtroDescricao}
                    onChange={(e) => setFiltroDescricao(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categoriasAtivas.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.nome}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={limparFiltros}
                    className="w-full md:w-auto"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </Card>

            {/* Items Table/Cards */}
            <Card className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Lista de Itens
                </h2>
                <NovoItemMercadoModal
                  trigger={
                    <Button className="w-full md:w-auto bg-wa-green hover:bg-wa-green-dark">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>
                  }
                />
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <ScrollArea className="rounded-md border h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Unid. Medida</TableHead>
                        <TableHead>Qtd. Atual</TableHead>
                        <TableHead>Qtd. Ideal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Preço Est.</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsFiltrados.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            {item.categorias_mercado?.nome || "Sem categoria"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.descricao}
                          </TableCell>
                          <TableCell>{item.unidade_medida}</TableCell>
                          <TableCell>{item.quantidade_atual}</TableCell>
                          <TableCell>{item.quantidade_ideal}</TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            R$ {item.preco_atual.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirModalEdicao(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir Item
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir "
                                      {item.descricao}"? Esta ação não pode ser
                                      desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleExcluirItem(item.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {/* Mobile Cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {itemsFiltrados.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.descricao}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.categorias_mercado?.nome || "Sem categoria"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirModalEdicao(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{item.descricao}
                                "?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleExcluirItem(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unidade:</span>
                        <span>{item.unidade_medida}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quantidade:</span>
                        <span>
                          {item.quantidade_atual} / {item.quantidade_ideal}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Preço Estimado:</span>
                        <span className="font-medium">
                          R$ {item.preco_atual.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categorias" className="space-y-6">
            <Card className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Categorias</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleImportarCategoriasPadrao}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Importar Categorias Padrão
                  </Button>
                  <NovaCategoriaModal
                    trigger={
                      <Button className="w-full md:w-auto bg-wa-green hover:bg-wa-green-dark">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriasMercado.map((categoria) => (
                      <TableRow key={categoria.id}>
                        <TableCell className="font-medium">
                          {categoria.nome}
                        </TableCell>
                        <TableCell>{categoria.descricao}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: categoria.cor }}
                            ></div>
                            <span className="text-sm text-gray-600">
                              {categoria.cor}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${categoria.ativa
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {categoria.ativa ? "Ativa" : "Inativa"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                abrirModalEdicaoCategoria(categoria)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Excluir Categoria
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a categoria "
                                    {categoria.nome}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleExcluirCategoria(categoria.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {categoriasMercado.map((categoria) => (
                  <Card key={categoria.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {categoria.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {categoria.descricao}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirModalEdicaoCategoria(categoria)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir Categoria
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a categoria "
                                {categoria.nome}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleExcluirCategoria(categoria.id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.cor }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {categoria.cor}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${categoria.ativa
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {categoria.ativa ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modais */}
        <EditarItemMercadoModal
          item={itemParaEditar}
          open={modalEditarAberto}
          onOpenChange={setModalEditarAberto}
          onEditarItem={handleEditarItem}
        />

        <EditarCategoriaModal
          categoria={categoriaParaEditar}
          open={modalEditarCategoriaAberto}
          onOpenChange={setModalEditarCategoriaAberto}
        />

        <EditarOrcamentoModal
          open={modalOrcamentoAberto}
          onOpenChange={setModalOrcamentoAberto}
          orcamentoAtual={orcamentoMensal}
          estimativaAtual={
            estimativaGastos > 0
              ? estimativaGastos
              : dadosOrcamento.gastosItensLista
          }
          categoriaAtual={categoriaOrcamento}
          onSalvarOrcamento={handleSalvarOrcamento}
        />
      </div>
    </DashboardLayout>
  );
};

export default Mercado;

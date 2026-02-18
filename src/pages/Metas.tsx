import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { NovaMetaModal } from "@/components/NovaMetaModal";
import { EditarMetaModal } from "@/components/EditarMetaModal";
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Tag,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMetas } from "@/hooks/useMetas";
import { useCategoriasMetas } from "@/hooks/useCategoriasMetas";

// Interface para compatibilidade com componentes existentes
interface MetaForm {
  titulo: string;
  tipo: "economia" | "receita" | "despesa" | "investimento";
  valor_alvo: number;
  valor_atual: number;
  data_inicio: string;
  data_limite: string;
  status: "ativa" | "concluida" | "pausada" | "vencida";
  categoria_meta_id?: string;
  descricao?: string;
}

// Função para formatar a data para exibição (DD/MM/YYYY)
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString + "T12:00:00");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Metas = () => {
  const { toast } = useToast();
  const { metas, createMeta, updateMeta, deleteMeta } = useMetas();
  const {
    categoriasMetas,
    createCategoriaMeta,
    updateCategoriaMeta,
    deleteCategoriaMeta,
  } = useCategoriasMetas();

  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [metaParaEditar, setMetaParaEditar] = useState<any>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("lista");

  // Estados para categorias
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [novaCategoriaCor, setNovaCategoriaCor] = useState("#10B981");
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = useState("");

  const adicionarMeta = async (novaMeta: any) => {
    await createMeta(novaMeta);
  };

  const editarMeta = async (metaEditada: any) => {
    await updateMeta(metaEditada.id, metaEditada);
  };

  const excluirMeta = async (id: string) => {
    await deleteMeta(id);
  };

  const abrirModalEdicao = (meta: any) => {
    setMetaParaEditar(meta);
    setModalEditarAberto(true);
  };

  const limparFiltros = () => {
    setFiltroStatus("todas");
    setFiltroTipo("todos");
    setBusca("");
  };

  // Funções para categorias
  const adicionarCategoriaMeta = async () => {
    if (!novaCategoriaNome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome da categoria.",
        variant: "destructive",
      });
      return;
    }

    await createCategoriaMeta({
      nome: novaCategoriaNome,
      cor: novaCategoriaCor,
      descricao: novaCategoriaDescricao,
      ativa: true,
    });

    setNovaCategoriaNome("");
    setNovaCategoriaCor("#10B981");
    setNovaCategoriaDescricao("");
  };

  const cancelarAdicionarCategoria = () => {
    setNovaCategoriaNome("");
    setNovaCategoriaCor("#10B981");
    setNovaCategoriaDescricao("");
    setAbaAtiva("lista"); // Switch back to lista tab
  };

  const toggleCategoriaMeta = async (id: string) => {
    const categoria = categoriasMetas.find((c) => c.id === id);
    if (categoria) {
      await updateCategoriaMeta(id, { ativa: !categoria.ativa });
    }
  };

  const excluirCategoriaMeta = async (id: string) => {
    await deleteCategoriaMeta(id);
  };

  const handleImportarCategoriasPadrao = async () => {
    type CategoriaMetaPadrao = { nome: string; cor: string; descricao: string };
    const categoriasPadrao: CategoriaMetaPadrao[] = [
      { nome: 'Emergência', cor: '#EF4444', descricao: 'Reserva para emergências e imprevistos' },
      { nome: 'Viagem', cor: '#3B82F6', descricao: 'Economias para viagens e férias' },
      { nome: 'Investimentos', cor: '#10B981', descricao: 'Aportes em investimentos' },
      { nome: 'Casa Própria', cor: '#F59E0B', descricao: 'Economia para compra da casa própria' },
      { nome: 'Educação', cor: '#8B5CF6', descricao: 'Investimento em cursos e formação' },
    ];

    try {
      for (const categoria of categoriasPadrao) {
        await createCategoriaMeta({ ...categoria, ativa: true });
      }
      toast({
        title: "Sucesso!",
        description: "Categorias de metas padrão importadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao importar categorias de metas padrão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar as categorias de metas padrão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const metasFiltradas = metas.filter((meta) => {
    const matchStatus =
      filtroStatus === "todas" || meta.status === filtroStatus;
    const matchTipo = filtroTipo === "todos" || meta.tipo === filtroTipo;
    const matchBusca =
      meta.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (meta.categorias_metas?.nome || "")
        .toLowerCase()
        .includes(busca.toLowerCase());

    return matchStatus && matchTipo && matchBusca;
  });

  const calcularProgresso = (valorAtual: number, valorAlvo: number) => {
    return Math.min((valorAtual / valorAlvo) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-blue-500";
      case "concluida":
        return "bg-green-500";
      case "pausada":
        return "bg-yellow-500";
      case "vencida":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativa":
        return <Clock className="w-4 h-4" />;
      case "concluida":
        return <CheckCircle className="w-4 h-4" />;
      case "pausada":
        return <AlertCircle className="w-4 h-4" />;
      case "vencida":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "economia":
        return "bg-green-100 text-green-800";
      case "receita":
        return "bg-blue-100 text-blue-800";
      case "despesa":
        return "bg-red-100 text-red-800";
      case "investimento":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Estatísticas
  const totalMetas = metas.length;
  const metasAtivas = metas.filter((m) => m.status === "ativa").length;
  const metasConcluidas = metas.filter((m) => m.status === "concluida").length;
  const progressoMedio =
    totalMetas > 0
      ? metas.reduce(
        (acc, meta) =>
          acc + calcularProgresso(meta.valor_atual, meta.valor_alvo),
        0
      ) / totalMetas
      : 0;

  // Cores da paleta específica
  const cores = [
    "#10B981", // verde
    "#3B82F6", // azul
    "#8B5CF6", // roxo
    "#EF4444", // vermelho
    "#F59E0B", // laranja
    "#6B7280", // cinza
    "#EC4899", // rosa
    "#14B8A6", // teal
    "#F97316", // laranja escuro
    "#84CC16", // verde lima
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Metas Financeiras
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Defina e acompanhe seus objetivos financeiros
            </p>
          </div>
          <NovaMetaModal
            onAdicionarMeta={adicionarMeta}
            categoriasMetas={categoriasMetas.filter((c) => c.ativa) as any}
          />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Metas
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{totalMetas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Metas Ativas
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-blue-600">
                {metasAtivas}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-green-600">
                {metasConcluidas}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Progresso Médio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-wa-green-dark">
                {progressoMedio.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar metas..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  title="Filtrar por status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-green"
                >
                  <option value="todas">Todos os Status</option>
                  <option value="ativa">Ativas</option>
                  <option value="concluida">Concluídas</option>
                  <option value="pausada">Pausadas</option>
                  <option value="vencida">Vencidas</option>
                </select>

                <select
                  title="Filtrar por tipo"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-green"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="economia">Economia</option>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                  <option value="investimento">Investimento</option>
                </select>

                <Button
                  variant="outline"
                  onClick={limparFiltros}
                  className="w-full sm:w-auto"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={abaAtiva}
          onValueChange={setAbaAtiva}
          className="space-y-4"
        >
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="lista" className="text-sm">
              Lista de Metas
            </TabsTrigger>
            <TabsTrigger value="progresso" className="text-sm">
              Progresso
            </TabsTrigger>
            <TabsTrigger value="categorias" className="text-sm">
              Categorias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">
                  Metas ({metasFiltradas.length})
                </CardTitle>
                <CardDescription>
                  Gerencie suas metas financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Versão Desktop da Tabela */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Meta</TableHead>
                        <TableHead className="min-w-[100px]">Tipo</TableHead>
                        <TableHead className="min-w-[200px]">
                          Progresso
                        </TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Prazo</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metasFiltradas.map((meta) => (
                        <TableRow key={meta.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{meta.titulo}</div>
                              <div className="text-sm text-gray-500">
                                {meta.categorias_metas?.nome || "Sem categoria"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTipoColor(meta.tipo)}>
                              {meta.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>
                                  R$ {meta.valor_atual.toLocaleString()}
                                </span>
                                <span>
                                  R$ {meta.valor_alvo.toLocaleString()}
                                </span>
                              </div>
                              <Progress
                                value={calcularProgresso(
                                  meta.valor_atual,
                                  meta.valor_alvo
                                )}
                              />
                              <div className="text-xs text-gray-500">
                                {calcularProgresso(
                                  meta.valor_atual,
                                  meta.valor_alvo
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                meta.status
                              )} text-white`}
                            >
                              {getStatusIcon(meta.status)}
                              <span className="ml-1">{meta.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDateForDisplay(meta.data_limite)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirModalEdicao(meta)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="sm:max-w-[425px]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir Meta
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir a meta "
                                      {meta.titulo}"? Esta ação não pode ser
                                      desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => excluirMeta(meta.id)}
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

                {/* Versão Mobile - Cards */}
                <div className="md:hidden space-y-4">
                  {metasFiltradas.map((meta) => (
                    <Card key={meta.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {meta.titulo}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {meta.categorias_metas?.nome || "Sem categoria"}
                            </p>
                          </div>
                          <Badge className={getTipoColor(meta.tipo)}>
                            {meta.tipo}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>R$ {meta.valor_atual.toLocaleString()}</span>
                            <span>R$ {meta.valor_alvo.toLocaleString()}</span>
                          </div>
                          <Progress
                            value={calcularProgresso(
                              meta.valor_atual,
                              meta.valor_alvo
                            )}
                          />
                          <div className="text-xs text-gray-500 text-center">
                            {calcularProgresso(
                              meta.valor_atual,
                              meta.valor_alvo
                            ).toFixed(1)}
                            %
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="space-y-1">
                            <Badge
                              className={`${getStatusColor(
                                meta.status
                              )} text-white`}
                            >
                              {getStatusIcon(meta.status)}
                              <span className="ml-1">{meta.status}</span>
                            </Badge>
                            <div className="text-xs text-gray-500">
                              Prazo: {formatDateForDisplay(meta.data_limite)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirModalEdicao(meta)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-[425px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Excluir Meta
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a meta "
                                    {meta.titulo}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => excluirMeta(meta.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progresso">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {metasFiltradas.map((meta) => (
                <Card key={meta.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base md:text-lg">
                          {meta.titulo}
                        </CardTitle>
                        <CardDescription>
                          {meta.categorias_metas?.nome || "Sem categoria"}
                        </CardDescription>
                      </div>
                      <Badge className={getTipoColor(meta.tipo)}>
                        {meta.tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm text-gray-500">
                          {calcularProgresso(
                            meta.valor_atual,
                            meta.valor_alvo
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={calcularProgresso(
                          meta.valor_atual,
                          meta.valor_alvo
                        )}
                      />
                      <div className="flex justify-between text-sm">
                        <span>
                          Atual: R$ {meta.valor_atual.toLocaleString()}
                        </span>
                        <span>Meta: R$ {meta.valor_alvo.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          Prazo: {formatDateForDisplay(meta.data_limite)}
                        </span>
                        <Badge
                          className={`${getStatusColor(
                            meta.status
                          )} text-white`}
                        >
                          {meta.status}
                        </Badge>
                      </div>
                      {meta.descricao && (
                        <p className="text-sm text-gray-600 mt-2">
                          {meta.descricao}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categorias">
            <div className="space-y-4 md:space-y-6">
              {/* Formulário para nova categoria */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Adicionar Nova Categoria
                  </CardTitle>
                  <CardDescription>
                    Crie categorias personalizadas para suas metas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoriaNome">Nome da Categoria *</Label>
                      <Input
                        id="categoriaNome"
                        placeholder="Ex: Casa Própria, Carro..."
                        value={novaCategoriaNome}
                        onChange={(e) => setNovaCategoriaNome(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoriaCor">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="categoriaCor"
                          type="color"
                          title="Selecionar cor personalizada"
                          value={novaCategoriaCor}
                          onChange={(e) => setNovaCategoriaCor(e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-md"
                        />
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cores.map((cor) => (
                            <button
                              key={cor}
                              type="button"
                              title={`Selecionar cor ${cor}`}
                              onClick={() => setNovaCategoriaCor(cor)}
                              className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                              style={{ backgroundColor: cor }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoriaDescricao">Descrição</Label>
                      <Input
                        id="categoriaDescricao"
                        placeholder="Descrição opcional..."
                        value={novaCategoriaDescricao}
                        onChange={(e) =>
                          setNovaCategoriaDescricao(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleImportarCategoriasPadrao}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Importar Categorias Padrão
                      </Button>
                      <Button
                        onClick={adicionarCategoriaMeta}
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Categoria
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={cancelarAdicionarCategoria}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de categorias */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Categorias ({categoriasMetas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Versão Desktop da Tabela */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">
                            Categoria
                          </TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="min-w-[100px]">
                            Status
                          </TableHead>
                          <TableHead className="text-right w-[200px]">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoriasMetas.map((categoria) => (
                          <TableRow key={categoria.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: categoria.cor }}
                                />
                                <span>{categoria.nome}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {categoria.descricao || "Sem descrição"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${categoria.ativa
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {categoria.ativa ? "Ativa" : "Inativa"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleCategoriaMeta(categoria.id)
                                  }
                                >
                                  {categoria.ativa ? "Desativar" : "Ativar"}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="sm:max-w-[425px]">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Excluir Categoria
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir a
                                        categoria "{categoria.nome}"? Esta ação
                                        não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          excluirCategoriaMeta(categoria.id)
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

                  {/* Versão Mobile - Cards */}
                  <div className="md:hidden space-y-4">
                    {categoriasMetas.map((categoria) => (
                      <Card key={categoria.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: categoria.cor }}
                              />
                              <span className="font-medium">
                                {categoria.nome}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${categoria.ativa
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {categoria.ativa ? "Ativa" : "Inativa"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600">
                            {categoria.descricao || "Sem descrição"}
                          </p>

                          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCategoriaMeta(categoria.id)}
                              className="text-sm"
                            >
                              {categoria.ativa ? "Desativar" : "Ativar"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-[425px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Excluir Categoria
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a categoria "
                                    {categoria.nome}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      excluirCategoriaMeta(categoria.id)
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
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Edição */}
        <EditarMetaModal
          meta={metaParaEditar}
          open={modalEditarAberto}
          onOpenChange={setModalEditarAberto}
          onEditarMeta={editarMeta}
        />
      </div>
    </DashboardLayout>
  );
};

export default Metas;

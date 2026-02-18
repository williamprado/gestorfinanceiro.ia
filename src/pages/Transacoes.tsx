import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react";
import { useCategorias } from "@/hooks/useCategorias";
import { useTransacoes } from "@/hooks/useTransacoes";

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: "receita" | "despesa";
}

const Transacoes = () => {
  const { categoriasReceita, categoriasDespesa } = useCategorias();
  const { transacoes } = useTransacoes();

  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const transacoesFiltradas = transacoes
    .filter((transacao) => {
      const matchDescricao = transacao.descricao
        .toLowerCase()
        .includes(filtro.toLowerCase());
      const matchTipo = tipoFiltro === "" || transacao.tipo === tipoFiltro;
      const matchCategoria =
        categoriaFiltro === "" ||
        transacao.categorias?.nome === categoriaFiltro;
      return matchDescricao && matchTipo && matchCategoria;
    })
    .sort(
      (a, b) =>
        new Date(b.data + "T00:00:00").getTime() -
        new Date(a.data + "T00:00:00").getTime()
    );

  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((total, transacao) => total + transacao.valor, 0);
  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((total, transacao) => total + transacao.valor, 0);
  const saldoTotal = totalReceitas - totalDespesas;

  const categorias = [
    ...new Set(transacoes.map((t) => t.categorias?.nome).filter(Boolean)),
  ];

  const limparFiltros = () => {
    setFiltro("");
    setTipoFiltro("");
    setCategoriaFiltro("");
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Transações
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Visualização completa de receitas e despesas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-2 md:p-3">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Total Receitas
                </p>
                <p className="text-lg md:text-2xl font-bold text-green-600">
                  R${" "}
                  {totalReceitas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-full p-2 md:p-3">
                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Total Despesas
                </p>
                <p className="text-lg md:text-2xl font-bold text-red-600">
                  R${" "}
                  {totalDespesas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div
                className={`${
                  saldoTotal >= 0 ? "bg-blue-100" : "bg-orange-100"
                } rounded-full p-2 md:p-3`}
              >
                <DollarSign
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    saldoTotal >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Saldo Total</p>
                <p
                  className={`text-lg md:text-2xl font-bold ${
                    saldoTotal >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  R${" "}
                  {saldoTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-2 md:p-3">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Transações</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {transacoes.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 md:p-6 mb-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
            Filtros
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar transações..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                id="tipo-filtro"
                title="Filtrar por tipo"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Todos os tipos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
              <select
                id="categoria-filtro"
                title="Filtrar por categoria"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
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
        </Card>

        {/* Tabela de Transações - Visível apenas em desktop */}
        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell className="font-medium">
                      {transacao.descricao}
                    </TableCell>
                    <TableCell>
                      {transacao.categorias?.nome || "Sem categoria"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transacao.tipo === "receita"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        transacao.data + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        transacao.tipo === "receita"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transacao.tipo === "receita" ? "+" : "-"} R${" "}
                      {transacao.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Visualização Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {transacoesFiltradas.length === 0 ? (
            <Card className="p-4">
              <p className="text-center text-gray-500">
                Nenhuma transação encontrada.
              </p>
            </Card>
          ) : (
            transacoesFiltradas.map((transacao) => (
              <Card key={transacao.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {transacao.descricao}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {transacao.categorias?.nome || "Sem categoria"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transacao.tipo === "receita"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Data</p>
                      <p className="font-medium">
                        {new Date(
                          transacao.data + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valor</p>
                      <p
                        className={`font-medium ${
                          transacao.tipo === "receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transacao.tipo === "receita" ? "+" : "-"} R${" "}
                        {transacao.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transacoes;

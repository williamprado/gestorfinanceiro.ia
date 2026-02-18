import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { NovoTipoManutencaoModal } from "./NovoTipoManutencaoModal";
import { EditarTipoManutencaoModal } from "./EditarTipoManutencaoModal";
import { useTiposManutencao, TipoManutencao } from "@/hooks/useTiposManutencao";
import { useState } from "react";

interface GerenciarTiposManutencaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GerenciarTiposManutencaoModal = ({
  open,
  onOpenChange
}: GerenciarTiposManutencaoModalProps) => {
  const { tiposManutencao, loading, adicionarTipo, editarTipo, excluirTipo } = useTiposManutencao();
  const [novoTipoModalOpen, setNovoTipoModalOpen] = useState(false);
  const [editarTipoModalOpen, setEditarTipoModalOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoManutencao | null>(null);

  const abrirEdicao = (tipo: TipoManutencao) => {
    setTipoSelecionado(tipo);
    setEditarTipoModalOpen(true);
  };

  const getSistemaColor = (sistema: string) => {
    const colors: { [key: string]: string } = {
      "Motor": "bg-red-100 text-red-800 border-red-200",
      "Transmissão": "bg-blue-100 text-blue-800 border-blue-200",
      "Freios": "bg-orange-100 text-orange-800 border-orange-200",
      "Suspensão": "bg-purple-100 text-purple-800 border-purple-200",
      "Elétrico": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Arrefecimento": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Alimentação": "bg-green-100 text-green-800 border-green-200",
      "Escapamento": "bg-gray-100 text-gray-800 border-gray-200",
      "Direção": "bg-pink-100 text-pink-800 border-pink-200",
      "Pneus e Rodas": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[sistema] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Settings className="w-6 h-6 mr-2 text-wa-green" />
                Gerenciar Tipos de Manutenção
              </DialogTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setNovoTipoModalOpen(true)}
                  className="bg-wa-green hover:bg-wa-green-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Tipo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-wa-green" />
              </div>
            ) : tiposManutencao.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposManutencao.map((tipo) => (
                  <Card key={tipo.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tipo.nome}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirEdicao(tipo)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => excluirTipo(tipo.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getSistemaColor(tipo.sistema)}>
                            {tipo.sistema}
                          </Badge>
                          <span className="text-sm text-gray-600 font-medium">
                            {tipo.intervalo_km.toLocaleString()} km
                          </span>
                        </div>
                        {tipo.descricao && (
                          <p className="text-sm text-gray-600">{tipo.descricao}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum tipo de manutenção cadastrado</p>
                <Button
                  onClick={() => setNovoTipoModalOpen(true)}
                  className="mt-3 bg-wa-green hover:bg-wa-green-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Tipo
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <NovoTipoManutencaoModal
        open={novoTipoModalOpen}
        onOpenChange={setNovoTipoModalOpen}
        onAdicionarTipo={adicionarTipo}
      />

      <EditarTipoManutencaoModal
        open={editarTipoModalOpen}
        onOpenChange={setEditarTipoModalOpen}
        onEditarTipo={editarTipo}
        tipo={tipoSelecionado}
      />
    </>
  );
};
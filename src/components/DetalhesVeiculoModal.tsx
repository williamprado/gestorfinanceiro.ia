import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Edit, Trash2, AlertTriangle, Settings } from "lucide-react";
import { useState } from "react";
import { AtualizarQuilometragemModal } from "./AtualizarQuilometragemModal";
import { Veiculo } from "@/hooks/useVeiculos";
import { ManutencaoPendente } from "@/hooks/useManutencoesPendentes";

interface DetalhesVeiculoModalProps {
  veiculo: Veiculo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manutencoes: ManutencaoPendente[];
  onExcluirVeiculo: (id: string) => void;
  onEditarVeiculo: () => void;
  onAtualizarQuilometragem: (id: string, novaQuilometragem: number) => void;
}

export const DetalhesVeiculoModal = ({
  veiculo,
  open,
  onOpenChange,
  manutencoes,
  onExcluirVeiculo,
  onEditarVeiculo,
  onAtualizarQuilometragem
}: DetalhesVeiculoModalProps) => {
  const [quilometragemModalOpen, setQuilometragemModalOpen] = useState(false);

  const handleExcluir = () => {
    if (veiculo) {
      onExcluirVeiculo(veiculo.id);
      onOpenChange(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Atrasada":
        return "bg-red-100 text-red-800 border-red-200";
      case "Em dia":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!veiculo) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Car className="w-6 h-6 mr-2 text-wa-green" />
                {veiculo.marca} {veiculo.modelo} {veiculo.ano}
              </DialogTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditarVeiculo}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExcluir}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Gerenciamento de manutenções e histórico do veículo</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informações do Veículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-wa-green" />
                  Informações do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Marca:</p>
                    <p className="font-medium">{veiculo.marca}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modelo:</p>
                    <p className="font-medium">{veiculo.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ano:</p>
                    <p className="font-medium">{veiculo.ano}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Placa:</p>
                    <p className="font-medium">{veiculo.placa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cor:</p>
                    <p className="font-medium">{veiculo.cor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Combustível:</p>
                    <p className="font-medium">{veiculo.combustivel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data de aquisição:</p>
                    <p className="font-medium">{veiculo.data_aquisicao || "Não informada"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Quilometragem:</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {veiculo.quilometragem.toLocaleString()} km
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuilometragemModalOpen(true)}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Atualizar Quilometragem
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manutenções Pendentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-wa-green" />
                  Manutenções Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {manutencoes.length > 0 ? (
                  <div className="space-y-3">
                    {manutencoes.map((manutencao) => (
                      <div key={manutencao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{manutencao.tipo}</h4>
                          <p className="text-sm text-gray-600">Sistema: {manutencao.sistema}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(manutencao.status)}>
                            {manutencao.status}
                          </Badge>
                          <span className="text-sm text-gray-600">{manutencao.proximaEm}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            Realizar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhuma manutenção pendente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AtualizarQuilometragemModal
        veiculo={veiculo}
        open={quilometragemModalOpen}
        onOpenChange={setQuilometragemModalOpen}
        onAtualizarQuilometragem={onAtualizarQuilometragem}
      />
    </>
  );
};

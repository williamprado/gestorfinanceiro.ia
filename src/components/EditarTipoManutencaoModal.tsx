
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TipoManutencao } from "@/hooks/useTiposManutencao";

interface EditarTipoManutencaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditarTipo: (tipo: TipoManutencao) => void;
  tipo: TipoManutencao | null;
}

const sistemas = [
  "Motor",
  "Transmissão",
  "Freios",
  "Suspensão",
  "Elétrico",
  "Arrefecimento",
  "Alimentação",
  "Escapamento",
  "Direção",
  "Pneus e Rodas"
];

export const EditarTipoManutencaoModal = ({
  open,
  onOpenChange,
  onEditarTipo,
  tipo
}: EditarTipoManutencaoModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    sistema: '',
    intervaloKm: '',
    descricao: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (tipo) {
      setFormData({
        nome: tipo.nome,
        sistema: tipo.sistema,
        intervaloKm: tipo.intervalo_km.toString(),
        descricao: tipo.descricao
      });
    }
  }, [tipo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.sistema || !formData.intervaloKm) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!tipo) return;

    const tipoEditado: TipoManutencao = {
      ...tipo,
      nome: formData.nome.trim(),
      sistema: formData.sistema,
      intervalo_km: parseInt(formData.intervaloKm),
      descricao: formData.descricao.trim()
    };

    onEditarTipo(tipoEditado);
    onOpenChange(false);

    toast({
      title: "Sucesso",
      description: "Tipo de manutenção editado com sucesso!"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-wa-green" />
            Editar Tipo de Manutenção
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Manutenção *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Troca de óleo do motor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sistema">Sistema *</Label>
            <Select value={formData.sistema} onValueChange={(value) => handleInputChange('sistema', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sistema" />
              </SelectTrigger>
              <SelectContent>
                {sistemas.map((sistema) => (
                  <SelectItem key={sistema} value={sistema}>
                    {sistema}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intervaloKm">Intervalo (km) *</Label>
            <Input
              id="intervaloKm"
              type="number"
              value={formData.intervaloKm}
              onChange={(e) => handleInputChange('intervaloKm', e.target.value)}
              placeholder="Ex: 10000"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descrição opcional da manutenção"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-wa-green hover:bg-wa-green-dark">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

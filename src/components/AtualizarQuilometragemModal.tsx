
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Veiculo } from "@/hooks/useVeiculos";

interface AtualizarQuilometragemModalProps {
  veiculo: Veiculo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAtualizarQuilometragem: (id: string, novaQuilometragem: number) => void;
}

export const AtualizarQuilometragemModal = ({
  veiculo,
  open,
  onOpenChange,
  onAtualizarQuilometragem
}: AtualizarQuilometragemModalProps) => {
  const [quilometragem, setQuilometragem] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (veiculo) {
      setQuilometragem(veiculo.quilometragem.toString());
    }
  }, [veiculo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!veiculo || !quilometragem.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma quilometragem válida.",
        variant: "destructive"
      });
      return;
    }

    const novaQuilometragem = parseInt(quilometragem);
    
    if (novaQuilometragem < 0) {
      toast({
        title: "Erro",
        description: "A quilometragem não pode ser negativa.",
        variant: "destructive"
      });
      return;
    }

    if (novaQuilometragem < veiculo.quilometragem) {
      toast({
        title: "Erro",
        description: "A nova quilometragem não pode ser menor que a atual.",
        variant: "destructive"
      });
      return;
    }

    onAtualizarQuilometragem(veiculo.id, novaQuilometragem);
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: "Quilometragem atualizada com sucesso!"
    });
  };

  if (!veiculo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Car className="w-5 h-5 mr-2 text-orange-500" />
            Atualizar Quilometragem
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>Veículo:</strong> {veiculo.marca} {veiculo.modelo} {veiculo.ano}</p>
            <p><strong>Quilometragem atual:</strong> {veiculo.quilometragem.toLocaleString()} km</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quilometragem">Nova Quilometragem (km) *</Label>
              <Input
                id="quilometragem"
                type="number"
                min={veiculo.quilometragem}
                value={quilometragem}
                onChange={(e) => setQuilometragem(e.target.value)}
                placeholder="Ex: 150000"
                required
              />
              <p className="text-xs text-gray-500">
                A nova quilometragem deve ser maior ou igual à atual
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Atualizar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

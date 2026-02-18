
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'fixa' | 'variavel';
}

interface EditarDespesaModalProps {
  despesa: Despesa | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (despesa: Despesa) => void;
}

export const EditarDespesaModal = ({ despesa, isOpen, onClose, onSave }: EditarDespesaModalProps) => {
  const { toast } = useToast();
  const { categoriasDespesa } = useCategorias();
  
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    data: '',
    tipo: 'variavel' as 'fixa' | 'variavel'
  });

  useEffect(() => {
    if (despesa) {
      setFormData({
        descricao: despesa.descricao,
        valor: despesa.valor.toString(),
        categoria: despesa.categoria,
        data: despesa.data,
        tipo: despesa.tipo
      });
    }
  }, [despesa]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor || !formData.categoria || !formData.data) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!despesa) return;

    const despesaAtualizada: Despesa = {
      ...despesa,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria,
      data: formData.data,
      tipo: formData.tipo
    };

    onSave(despesaAtualizada);
    onClose();
    
    toast({
      title: "Sucesso!",
      description: "Despesa atualizada com sucesso",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Ex: Aluguel, Supermercado, Conta de Luz..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({...formData, valor: e.target.value})}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <select
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Selecione uma categoria</option>
              {categoriasDespesa.map(categoria => (
                <option key={categoria.id} value={categoria.nome}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Despesa</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tipo"
                  value="fixa"
                  checked={formData.tipo === 'fixa'}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as 'fixa' | 'variavel'})}
                  className="text-orange-600"
                />
                <span>Despesa Fixa</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tipo"
                  value="variavel"
                  checked={formData.tipo === 'variavel'}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as 'fixa' | 'variavel'})}
                  className="text-orange-600"
                />
                <span>Despesa Variável</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

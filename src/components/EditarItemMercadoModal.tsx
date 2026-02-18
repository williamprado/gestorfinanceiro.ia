
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ItemMercado } from "@/hooks/useItensMercado";
import { useCategoriasMercado } from "@/hooks/useCategoriasMercado";

interface EditarItemMercadoModalProps {
  item: ItemMercado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditarItem: (item: ItemMercado) => void;
}

export const EditarItemMercadoModal = ({ item, open, onOpenChange, onEditarItem }: EditarItemMercadoModalProps) => {
  const [formData, setFormData] = useState({
    categoria_mercado_id: '',
    descricao: '',
    unidade_medida: 'unidade',
    quantidade_atual: '',
    quantidade_ideal: '',
    preco_atual: ''
  });
  const { toast } = useToast();
  const { categoriasMercado } = useCategoriasMercado();

  useEffect(() => {
    if (item) {
      setFormData({
        categoria_mercado_id: item.categoria_mercado_id || '',
        descricao: item.descricao,
        unidade_medida: item.unidade_medida,
        quantidade_atual: item.quantidade_atual?.toString() || '0',
        quantidade_ideal: item.quantidade_ideal?.toString() || '1',
        preco_atual: item.preco_atual?.toString() || '0'
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('FormData no submit:', formData);

    if (!formData.categoria_mercado_id || !formData.descricao || !formData.quantidade_ideal || !formData.preco_atual || !item) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const quantidadeAtual = Number(formData.quantidade_atual) || 0;
    const quantidadeIdeal = Number(formData.quantidade_ideal);
    let status: 'estoque_adequado' | 'estoque_medio' | 'estoque_baixo' | 'sem_estoque' = 'estoque_adequado';

    if (quantidadeAtual === 0) {
      status = 'sem_estoque';
    } else if (quantidadeAtual < quantidadeIdeal * 0.3) {
      status = 'estoque_baixo';
    } else if (quantidadeAtual < quantidadeIdeal) {
      status = 'estoque_medio';
    }

    const itemEditado: ItemMercado = {
      id: item.id,
      user_id: item.user_id,
      categoria_mercado_id: formData.categoria_mercado_id,
      descricao: formData.descricao,
      unidade_medida: formData.unidade_medida,
      quantidade_atual: quantidadeAtual,
      quantidade_ideal: quantidadeIdeal,
      status: status,
      preco_atual: Number(formData.preco_atual),
      created_at: item.created_at,
      updated_at: item.updated_at
    };

    console.log('Item editado final:', itemEditado);
    onEditarItem(itemEditado);
    onOpenChange(false);

    toast({
      title: "Sucesso",
      description: "Item editado com sucesso!"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria_mercado_id">Categoria *</Label>
              <Select value={formData.categoria_mercado_id} onValueChange={(value) => handleInputChange('categoria_mercado_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasMercado
                    .filter(categoria => categoria.ativa)
                    .map(categoria => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Ex: Arroz branco tipo 1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade_medida">Unidade de Medida</Label>
              <Select value={formData.unidade_medida} onValueChange={(value) => handleInputChange('unidade_medida', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="kg">Quilograma (kg)</SelectItem>
                  <SelectItem value="g">Grama (g)</SelectItem>
                  <SelectItem value="l">Litro (l)</SelectItem>
                  <SelectItem value="ml">Mililitro (ml)</SelectItem>
                  <SelectItem value="pacote">Pacote</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade_atual">Quantidade Atual</Label>
              <Input
                id="quantidade_atual"
                type="number"
                min="0"
                value={formData.quantidade_atual}
                onChange={(e) => handleInputChange('quantidade_atual', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade_ideal">Quantidade Ideal *</Label>
              <Input
                id="quantidade_ideal"
                type="number"
                min="1"
                value={formData.quantidade_ideal}
                onChange={(e) => handleInputChange('quantidade_ideal', e.target.value)}
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco_atual">Preço Estimado (R$) *</Label>
            <Input
              id="preco_atual"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco_atual}
              onChange={(e) => handleInputChange('preco_atual', e.target.value)}
              placeholder="Ex: 4.29"
              required
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

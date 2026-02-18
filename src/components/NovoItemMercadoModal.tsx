import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItensMercado } from "@/hooks/useItensMercado";
import { useCategoriasMercado } from "@/hooks/useCategoriasMercado";

interface NovoItemMercadoModalProps {
  trigger?: React.ReactNode;
}

export const NovoItemMercadoModal = ({ trigger }: NovoItemMercadoModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoria_mercado_id: '',
    descricao: '',
    unidade_medida: 'unidade',
    quantidade_atual: '',
    quantidade_ideal: '',
    preco_atual: ''
  });
  const { toast } = useToast();
  const { createItemMercado } = useItensMercado();
  const { categoriasMercado } = useCategoriasMercado();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoria_mercado_id || !formData.descricao || !formData.quantidade_ideal || !formData.preco_atual) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const precoNumerico = parseFloat(formData.preco_atual.replace(/[R$\s]/g, '').replace(',', '.'));
    if (isNaN(precoNumerico)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um preço válido.",
        variant: "destructive"
      });
      return;
    }

    const result = await createItemMercado({
      categoria_mercado_id: formData.categoria_mercado_id || null,
      descricao: formData.descricao,
      unidade_medida: formData.unidade_medida,
      quantidade_atual: Number(formData.quantidade_atual) || 0,
      quantidade_ideal: Number(formData.quantidade_ideal),
      preco_atual: precoNumerico
    });

    if (result.error) {
      toast({
        title: "Erro ao criar item",
        description: result.error.message,
        variant: "destructive"
      });
      return;
    }

    // Resetar formulário
    setFormData({
      categoria_mercado_id: '',
      descricao: '',
      unidade_medida: 'unidade',
      quantidade_atual: '',
      quantidade_ideal: '',
      preco_atual: ''
    });

    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-wa-green hover:bg-wa-green-dark">
            <Plus className="w-4 h-4 mr-2" />
            Itens
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria_mercado_id} onValueChange={(value) => handleInputChange('categoria_mercado_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasMercado.filter(cat => cat.ativa).map(categoria => (
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
              value={formData.preco_atual}
              onChange={(e) => handleInputChange('preco_atual', e.target.value)}
              placeholder="Ex: 4,29"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-wa-green hover:bg-wa-green-dark">
              Adicionar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

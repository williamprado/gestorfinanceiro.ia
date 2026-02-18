
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";

interface EditarOrcamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamentoAtual: number;
  estimativaAtual: number;
  categoriaAtual?: string;
  onSalvarOrcamento: (novoOrcamento: number, novaEstimativa: number, categoriaSelecionada: string) => void;
}

export const EditarOrcamentoModal = ({
  open,
  onOpenChange,
  orcamentoAtual,
  estimativaAtual,
  categoriaAtual = "",
  onSalvarOrcamento
}: EditarOrcamentoModalProps) => {
  const [orcamento, setOrcamento] = useState(orcamentoAtual.toString());
  const [estimativa, setEstimativa] = useState(estimativaAtual.toString());
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categoriaAtual);
  const { toast } = useToast();
  const { categoriasDespesa } = useCategorias();

  useEffect(() => {
    setOrcamento(orcamentoAtual.toString());
    setEstimativa(estimativaAtual.toString());
    setCategoriaSelecionada(categoriaAtual);
  }, [orcamentoAtual, estimativaAtual, categoriaAtual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoOrcamento = parseFloat(orcamento);
    const novaEstimativa = parseFloat(estimativa);

    if (isNaN(novoOrcamento) || novoOrcamento <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido para o orçamento.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(novaEstimativa) || novaEstimativa < 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido para a estimativa.",
        variant: "destructive"
      });
      return;
    }

    if (!categoriaSelecionada) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria de despesa.",
        variant: "destructive"
      });
      return;
    }

    onSalvarOrcamento(novoOrcamento, novaEstimativa, categoriaSelecionada);
    onOpenChange(false);

    toast({
      title: "Sucesso",
      description: "Orçamento atualizado com sucesso!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Orçamento Mensal</DialogTitle>
          <DialogDescription>
            Configure seu orçamento mensal e selecione a categoria de despesa para controle de gastos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria de Despesa</Label>
            <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriasDespesa.map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      ></div>
                      <span>{categoria.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orcamento">Orçamento Mensal (R$)</Label>
            <Input
              id="orcamento"
              type="number"
              step="0.01"
              min="0"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              placeholder="Ex: 1500.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimativa">Estimativa de Gastos (R$)</Label>
            <Input
              id="estimativa"
              type="number"
              step="0.01"
              min="0"
              value={estimativa}
              onChange={(e) => setEstimativa(e.target.value)}
              placeholder="Ex: 850.00"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-wa-green hover:bg-wa-green-dark">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

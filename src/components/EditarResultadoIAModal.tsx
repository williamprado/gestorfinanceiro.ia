import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { AnalysisResult } from "@/hooks/useIAAnalysis";
import { useCategorias } from "@/hooks/useCategorias";

interface EditarResultadoIAModalProps {
  resultado: AnalysisResult;
  onSave: (id: string, updates: Partial<AnalysisResult>) => void;
}

export const EditarResultadoIAModal = ({ resultado, onSave }: EditarResultadoIAModalProps) => {
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState(resultado.descricao);
  const [valor, setValor] = useState(resultado.valor.toString());
  const [data, setData] = useState(resultado.data);
  const [categoria, setCategoria] = useState(resultado.categoria);
  const [categoriaId, setCategoriaId] = useState(resultado.categoria_id || '');
  const [confianca, setConfianca] = useState(resultado.confianca.toString());

  const { categoriasDespesa, categoriasReceita } = useCategorias();

  const handleSave = () => {
    const updates: Partial<AnalysisResult> = {
      descricao,
      valor: parseFloat(valor),
      data,
      categoria,
      categoria_id: categoriaId || null, // Enviar null se vazio
      confianca: parseInt(confianca)
    };

    onSave(resultado.id, updates);
    setOpen(false);
  };

  const handleCategoriaChange = (value: string) => {
    setCategoriaId(value);
    const categoriasList = resultado.tipo === 'despesa' ? categoriasDespesa : categoriasReceita;
    const selectedCategoria = categoriasList.find(cat => cat.id === value);
    if (selectedCategoria) {
      setCategoria(selectedCategoria.nome);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Resultado da Análise</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoriaId} onValueChange={handleCategoriaChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {(resultado.tipo === 'despesa' ? categoriasDespesa : categoriasReceita).map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="confianca">Confiança (%)</Label>
            <Input
              id="confianca"
              type="number"
              min="0"
              max="100"
              value={confianca}
              onChange={(e) => setConfianca(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-wa-green hover:bg-wa-green-dark">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";

interface Divida {
  id: string;
  descricao: string;
  valor_total: number;
  valor_pago: number;
  valor_restante: number;
  data_vencimento: string;
  parcelas: number;
  parcelas_pagas: number;
  status: 'pendente' | 'vencida' | 'quitada';
  categoria?: string;
  categorias?: {
    nome: string;
    cor: string;
    icone: string;
  };
  credor: string;
}

interface EditarDividaModalProps {
  isOpen: boolean;
  onClose: () => void;
  divida: Divida | null;
  onSave: (dividaEditada: Divida) => void;
}

export const EditarDividaModal = ({ isOpen, onClose, divida, onSave }: EditarDividaModalProps) => {
  const { toast } = useToast();
  const { categoriasDespesa } = useCategorias();
  
  const [descricao, setDescricao] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [parcelasPagas, setParcelasPagas] = useState('');
  const [categoria, setCategoria] = useState('');
  const [credor, setCredor] = useState('');

  useEffect(() => {
    if (divida) {
      setDescricao(divida.descricao || '');
      setValorTotal(divida.valor_total?.toString() || '');
      setValorPago(divida.valor_pago?.toString() || '0');
      setDataVencimento(divida.data_vencimento || '');
      setParcelas(divida.parcelas?.toString() || '');
      setParcelasPagas(divida.parcelas_pagas?.toString() || '0');
      setCategoria(divida.categorias?.nome || divida.categoria || '');
      setCredor(divida.credor || '');
    }
  }, [divida]);

  const handleSave = () => {
    if (!descricao || !valorTotal || !dataVencimento || !parcelas || !categoria || !credor) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const valorTotalNum = parseFloat(valorTotal);
    const valorPagoNum = parseFloat(valorPago) || 0;
    const parcelasNum = parseInt(parcelas);
    const parcelasPagasNum = parseInt(parcelasPagas) || 0;

    if (!divida) return;

    const dividaEditada: Divida = {
      ...divida,
      descricao,
      valor_total: valorTotalNum,
      valor_pago: valorPagoNum,
      valor_restante: valorTotalNum - valorPagoNum,
      data_vencimento: dataVencimento,
      parcelas: parcelasNum,
      parcelas_pagas: parcelasPagasNum,
      categoria,
      credor,
      status: parcelasPagasNum >= parcelasNum ? 'quitada' : 
               new Date(dataVencimento) < new Date() ? 'vencida' : 'pendente'
    };

    onSave(dividaEditada);
    onClose();

    toast({
      title: "Sucesso",
      description: "Dívida editada com sucesso!",
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Dívida</DialogTitle>
          <DialogDescription>
            Edite as informações da dívida abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Cartão de crédito"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credor">Credor *</Label>
            <Input
              id="credor"
              value={credor}
              onChange={(e) => setCredor(e.target.value)}
              placeholder="Ex: Banco ABC"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valorTotal">Valor Total *</Label>
            <Input
              id="valorTotal"
              type="number"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              placeholder="0,00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valorPago">Valor Pago</Label>
            <Input
              id="valorPago"
              type="number"
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              placeholder="0,00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parcelas">Total de Parcelas *</Label>
            <Input
              id="parcelas"
              type="number"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              placeholder="Ex: 12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parcelasPagas">Parcelas Pagas</Label>
            <Input
              id="parcelasPagas"
              type="number"
              value={parcelasPagas}
              onChange={(e) => setParcelasPagas(e.target.value)}
              placeholder="Ex: 2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Selecione uma categoria</option>
              {categoriasDespesa.map(cat => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
            <Input
              id="dataVencimento"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

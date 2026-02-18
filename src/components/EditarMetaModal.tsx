import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategoriasMetas } from "@/hooks/useCategoriasMetas";

// Função para formatar a data para o formato do input date (YYYY-MM-DD)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  // Adiciona a hora para evitar problemas com timezone
  const date = new Date(dateString + "T12:00:00");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Função para formatar a data para o formato do banco (YYYY-MM-DD)
const formatDateForDatabase = (dateString: string) => {
  if (!dateString) return null;
  // Adiciona a hora para evitar problemas com timezone
  const date = new Date(dateString + "T12:00:00");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface Meta {
  id: string;
  titulo: string;
  tipo: "economia" | "receita" | "despesa" | "investimento";
  valor_alvo: number;
  valor_atual: number;
  data_inicio: string;
  data_limite: string;
  status: "ativa" | "concluida" | "pausada" | "vencida";
  categoria_meta_id?: string;
  descricao?: string;
  categorias_metas?: {
    nome: string;
  };
}

interface EditarMetaModalProps {
  meta: Meta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditarMeta: (meta: Meta) => void;
}

export const EditarMetaModal = ({
  meta,
  open,
  onOpenChange,
  onEditarMeta,
}: EditarMetaModalProps) => {
  const { toast } = useToast();
  const { categoriasMetas } = useCategoriasMetas();
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "economia" as "economia" | "receita" | "despesa" | "investimento",
    valor_alvo: "",
    valor_atual: "",
    data_inicio: "",
    data_limite: "",
    status: "ativa" as "ativa" | "concluida" | "pausada" | "vencida",
    categoria_meta_id: "",
    descricao: "",
  });

  useEffect(() => {
    if (meta) {
      setFormData({
        titulo: meta.titulo,
        tipo: meta.tipo,
        valor_alvo: meta.valor_alvo.toString(),
        valor_atual: meta.valor_atual.toString(),
        data_inicio: formatDateForInput(meta.data_inicio),
        data_limite: formatDateForInput(meta.data_limite),
        status: meta.status,
        categoria_meta_id: meta.categoria_meta_id || "",
        descricao: meta.descricao || "",
      });
    }
  }, [meta]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !meta ||
      !formData.titulo ||
      !formData.valor_alvo ||
      !formData.data_limite ||
      !formData.categoria_meta_id
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Remover campos undefined ou null antes de enviar
    const metaEditada: Partial<Meta> = {
      titulo: formData.titulo,
      tipo: formData.tipo,
      valor_alvo: Number(formData.valor_alvo),
      valor_atual: formData.valor_atual ? Number(formData.valor_atual) : 0,
      data_inicio: formatDateForDatabase(formData.data_inicio),
      data_limite: formatDateForDatabase(formData.data_limite),
      status: formData.status,
      categoria_meta_id: formData.categoria_meta_id || null,
      descricao: formData.descricao || null,
    };

    // Remover campos undefined ou vazios
    Object.keys(metaEditada).forEach((key) => {
      if (
        metaEditada[key as keyof typeof metaEditada] === undefined ||
        metaEditada[key as keyof typeof metaEditada] === ""
      ) {
        delete metaEditada[key as keyof typeof metaEditada];
      }
    });

    onEditarMeta({ ...meta, ...metaEditada });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!meta) return null;

  // Filtra apenas categorias ativas
  const categoriasAtivas = categoriasMetas.filter((cat) => cat.ativa);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Meta *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria_meta_id">Categoria *</Label>
              <Select
                value={formData.categoria_meta_id}
                onValueChange={(value) =>
                  handleInputChange("categoria_meta_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasAtivas.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Meta</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economia">Economia</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Redução de Despesa</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_alvo">Valor Alvo (R$) *</Label>
              <Input
                id="valor_alvo"
                type="number"
                min="0"
                step="0.01"
                value={formData.valor_alvo}
                onChange={(e) =>
                  handleInputChange("valor_alvo", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_atual">Valor Atual (R$)</Label>
              <Input
                id="valor_atual"
                type="number"
                min="0"
                step="0.01"
                value={formData.valor_atual}
                onChange={(e) =>
                  handleInputChange("valor_atual", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) =>
                  handleInputChange("data_inicio", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_limite">Data Limite *</Label>
              <Input
                id="data_limite"
                type="date"
                value={formData.data_limite}
                onChange={(e) =>
                  handleInputChange("data_limite", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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

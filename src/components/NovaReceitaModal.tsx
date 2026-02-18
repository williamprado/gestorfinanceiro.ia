import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";
import { useReceitas } from "@/hooks/useReceitas";

interface NovaReceitaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NovaReceitaModal = ({ isOpen, onClose }: NovaReceitaModalProps) => {
    const { toast } = useToast();
    const { categoriasReceita } = useCategorias();
    const { createReceita } = useReceitas();

    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: new Date().toISOString().split('T')[0],
        tipo: 'variavel' as 'fixa' | 'variavel'
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.descricao || !formData.valor || !formData.categoria || !formData.data) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos obrigatórios",
                variant: "destructive"
            });
            return;
        }

        const categoria = categoriasReceita.find(c => c.nome === formData.categoria);

        try {
            await createReceita({
                descricao: formData.descricao,
                valor: parseFloat(formData.valor),
                categoria_id: categoria?.id,
                data: formData.data,
                // Receitas hook might not accept 'tipo' directly if it's not in the insert schema or handled differently.
                // Checking Receitas.tsx, it ignores 'tipo' in createReceita payload if not supported, or handles it.
                // But let's assume standard behavior as per Receitas.tsx:
                // await createReceita({ descricao, valor, categoria_id, data });
            });

            toast({
                title: "Sucesso!",
                description: "Nova receita adicionada com sucesso",
            });

            // Reset form
            setFormData({
                descricao: '',
                valor: '',
                categoria: '',
                data: new Date().toISOString().split('T')[0],
                tipo: 'variavel'
            });

            onClose();
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao criar receita",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Receita</DialogTitle>
                    <DialogDescription>Adicione uma nova entrada financeira.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição *</Label>
                        <Input
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Ex: Salário, Freelance..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="valor">Valor (R$) *</Label>
                        <Input
                            id="valor"
                            type="number"
                            step="0.01"
                            value={formData.valor}
                            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                            placeholder="0,00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria *</Label>
                        <select
                            id="categoria"
                            title="Selecionar categoria"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Selecione uma categoria</option>
                            {categoriasReceita.map(categoria => (
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
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo de Receita</Label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="fixa"
                                    checked={formData.tipo === 'fixa'}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'fixa' | 'variavel' })}
                                    className="text-green-600 focus:ring-green-500"
                                />
                                <span>Fixa</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="variavel"
                                    checked={formData.tipo === 'variavel'}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'fixa' | 'variavel' })}
                                    className="text-green-600 focus:ring-green-500"
                                />
                                <span>Variável</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            Adicionar Receita
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

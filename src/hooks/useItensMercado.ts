import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ItemMercado {
  id: string;
  user_id: string;
  categoria_mercado_id?: string;
  descricao: string;
  unidade_medida: string;
  quantidade_atual: number;
  quantidade_ideal: number;
  preco_atual: number;
  status: 'estoque_adequado' | 'estoque_medio' | 'estoque_baixo' | 'sem_estoque';
  created_at: string;
  updated_at: string;
  categorias_mercado?: {
    nome: string;
    cor: string;
    descricao?: string;
  };
}

export const useItensMercado = () => {
  const [itensMercado, setItensMercado] = useState<ItemMercado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItensMercado = async () => {
    try {
      const { data, error } = await supabase
        .from('itens_mercado')
        .select(`
          *,
          categorias_mercado (nome, cor, descricao)
        `)
        .order('descricao', { ascending: true });

      if (error) throw error;
      setItensMercado((data || []) as ItemMercado[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar itens de mercado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItemMercado = async (item: Omit<ItemMercado, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categorias_mercado' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('itens_mercado')
        .insert([{
          ...item,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Refetch todos os itens para garantir que os dados estão atualizados com joins
      await fetchItensMercado();
      
      toast({
        title: "Item criado",
        description: "Item de mercado criado com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar item",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateItemMercado = async (id: string, updates: Partial<ItemMercado>) => {
    try {
      const { data, error } = await supabase
        .from('itens_mercado')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Refetch todos os itens para garantir que os dados estão atualizados com joins
      await fetchItensMercado();
      
      toast({
        title: "Item atualizado",
        description: "Item de mercado atualizado com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteItemMercado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('itens_mercado')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItensMercado(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item removido",
        description: "Item de mercado removido com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover item",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchItensMercado();
  }, []);

  return {
    itensMercado,
    loading,
    createItemMercado,
    updateItemMercado,
    deleteItemMercado,
    refetch: fetchItensMercado
  };
};
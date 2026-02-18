import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CategoriaMercado {
  id: string;
  user_id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategoriasMercado = () => {
  const [categoriasMercado, setCategoriasMercado] = useState<CategoriaMercado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategoriasMercado = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias_mercado')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setCategoriasMercado((data || []) as CategoriaMercado[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar categorias de mercado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategoriaMercado = async (categoria: Omit<CategoriaMercado, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_mercado')
        .insert([{
          ...categoria,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      setCategoriasMercado(prev => [data as CategoriaMercado, ...prev]);
      
      toast({
        title: "Categoria criada",
        description: "Categoria de mercado criada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateCategoriaMercado = async (id: string, updates: Partial<CategoriaMercado>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_mercado')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategoriasMercado(prev => prev.map(categoria => categoria.id === id ? data as CategoriaMercado : categoria));
      
      toast({
        title: "Categoria atualizada",
        description: "Categoria de mercado atualizada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteCategoriaMercado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categorias_mercado')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategoriasMercado(prev => prev.filter(categoria => categoria.id !== id));
      
      toast({
        title: "Categoria removida",
        description: "Categoria de mercado removida com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover categoria",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchCategoriasMercado();
  }, []);

  return {
    categoriasMercado,
    loading,
    createCategoriaMercado,
    updateCategoriaMercado,
    deleteCategoriaMercado,
    refetch: fetchCategoriasMercado
  };
};
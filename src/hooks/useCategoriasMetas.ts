import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CategoriaMeta {
  id: string;
  user_id: string;
  nome: string;
  cor: string;
  descricao?: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategoriasMetas = () => {
  const [categoriasMetas, setCategoriasMetas] = useState<CategoriaMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategoriasMetas = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias_metas')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setCategoriasMetas((data || []) as CategoriaMeta[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar categorias de metas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategoriaMeta = async (categoria: Omit<CategoriaMeta, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_metas')
        .insert([{
          ...categoria,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      setCategoriasMetas(prev => [data as CategoriaMeta, ...prev]);
      
      toast({
        title: "Categoria criada",
        description: "Categoria de meta criada com sucesso!",
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

  const updateCategoriaMeta = async (id: string, updates: Partial<CategoriaMeta>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_metas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategoriasMetas(prev => prev.map(categoria => categoria.id === id ? data as CategoriaMeta : categoria));
      
      toast({
        title: "Categoria atualizada",
        description: "Categoria de meta atualizada com sucesso!",
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

  const deleteCategoriaMeta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categorias_metas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategoriasMetas(prev => prev.filter(categoria => categoria.id !== id));
      
      toast({
        title: "Categoria removida",
        description: "Categoria de meta removida com sucesso!",
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
    fetchCategoriasMetas();
  }, []);

  return {
    categoriasMetas,
    loading,
    createCategoriaMeta,
    updateCategoriaMeta,
    deleteCategoriaMeta,
    refetch: fetchCategoriasMetas
  };
};
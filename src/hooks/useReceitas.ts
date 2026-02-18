import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Receita {
  id: string;
  user_id: string;
  categoria_id?: string;
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
  updated_at: string;
  categorias?: {
    nome: string;
    cor: string;
    icone: string;
  };
}

export const useReceitas = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReceitas = async () => {
    try {
      // Buscar dados da tabela receitas
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas')
        .select(`
          *,
          categorias (nome, cor, icone)
        `);

      if (receitasError) throw receitasError;

      // Buscar dados da tabela transacoes com tipo receita
      const { data: transacoesData, error: transacoesError } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .eq('tipo', 'receita');

      if (transacoesError) throw transacoesError;

      // Combinar os dados
      const allReceitas = [
        ...(receitasData || []),
        ...(transacoesData || [])
      ];

      // Ordenar por data
      const sortedReceitas = allReceitas.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setReceitas(sortedReceitas);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar receitas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReceita = async (receita: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categorias'>) => {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .insert([{
          ...receita,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setReceitas(prev => [data, ...prev]);
      
      toast({
        title: "Receita criada",
        description: "Receita criada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar receita",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateReceita = async (id: string, updates: Partial<Receita>) => {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setReceitas(prev => prev.map(receita => receita.id === id ? data : receita));
      
      toast({
        title: "Receita atualizada",
        description: "Receita atualizada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar receita",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteReceita = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReceitas(prev => prev.filter(receita => receita.id !== id));
      
      toast({
        title: "Receita removida",
        description: "Receita removida com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover receita",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, []);

  return {
    receitas,
    loading,
    createReceita,
    updateReceita,
    deleteReceita,
    refetch: fetchReceitas
  };
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Despesa {
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

export const useDespesas = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDespesas = async () => {
    try {
      // Buscar dados da tabela despesas
      const { data: despesasData, error: despesasError } = await supabase
        .from('despesas')
        .select(`
          *,
          categorias (nome, cor, icone)
        `);

      if (despesasError) throw despesasError;

      // Buscar dados da tabela transacoes com tipo despesa
      const { data: transacoesData, error: transacoesError } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .eq('tipo', 'despesa');

      if (transacoesError) throw transacoesError;

      // Combinar os dados
      const allDespesas = [
        ...(despesasData || []),
        ...(transacoesData || [])
      ];

      // Ordenar por data
      const sortedDespesas = allDespesas.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setDespesas(sortedDespesas);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar despesas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDespesa = async (despesa: Omit<Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categorias'>) => {
    try {
      const { data, error } = await supabase
        .from('despesas')
        .insert([{
          ...despesa,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setDespesas(prev => [data, ...prev]);
      
      toast({
        title: "Despesa criada",
        description: "Despesa criada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar despesa",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateDespesa = async (id: string, updates: Partial<Despesa>) => {
    try {
      const { data, error } = await supabase
        .from('despesas')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setDespesas(prev => prev.map(despesa => despesa.id === id ? data : despesa));
      
      toast({
        title: "Despesa atualizada",
        description: "Despesa atualizada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar despesa",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteDespesa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('despesas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDespesas(prev => prev.filter(despesa => despesa.id !== id));
      
      toast({
        title: "Despesa removida",
        description: "Despesa removida com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover despesa",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  return {
    despesas,
    loading,
    createDespesa,
    updateDespesa,
    deleteDespesa,
    refetch: fetchDespesas
  };
};
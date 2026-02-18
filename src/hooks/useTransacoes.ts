import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Transacao {
  id: string;
  user_id: string;
  categoria_id?: string;
  tipo: 'receita' | 'despesa';
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

export const useTransacoes = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransacoes = async () => {
    try {
      // Buscar dados da tabela transacoes
      const { data: transacoesData, error: transacoesError } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (nome, cor, icone)
        `);

      if (transacoesError) throw transacoesError;

      // Buscar dados da tabela receitas
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas')
        .select(`
          *,
          categorias (nome, cor, icone)
        `);

      if (receitasError) throw receitasError;

      // Buscar dados da tabela despesas
      const { data: despesasData, error: despesasError } = await supabase
        .from('despesas')
        .select(`
          *,
          categorias (nome, cor, icone)
        `);

      if (despesasError) throw despesasError;

      // Combinar todos os dados
      const allTransacoes = [
        ...(transacoesData || []).map(t => ({ ...t, tipo: t.tipo })),
        ...(receitasData || []).map(r => ({ ...r, tipo: 'receita' as const })),
        ...(despesasData || []).map(d => ({ ...d, tipo: 'despesa' as const }))
      ];

      // Ordenar por data
      const sortedTransacoes = allTransacoes.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setTransacoes(sortedTransacoes as Transacao[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransacao = async (transacao: Omit<Transacao, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categorias'>) => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .insert([{
          ...transacao,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setTransacoes(prev => [data as Transacao, ...prev]);
      
      toast({
        title: "Transação criada",
        description: "Transação criada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateTransacao = async (id: string, updates: Partial<Transacao>) => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categorias (nome, cor, icone)
        `)
        .single();

      if (error) throw error;
      setTransacoes(prev => prev.map(transacao => transacao.id === id ? data as Transacao : transacao));
      
      toast({
        title: "Transação atualizada",
        description: "Transação atualizada com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar transação",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteTransacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransacoes(prev => prev.filter(transacao => transacao.id !== id));
      
      toast({
        title: "Transação removida",
        description: "Transação removida com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover transação",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  // Filtros para compatibilidade
  const receitas = transacoes.filter(t => t.tipo === 'receita');
  const despesas = transacoes.filter(t => t.tipo === 'despesa');

  return {
    transacoes,
    receitas,
    despesas,
    loading,
    createTransacao,
    updateTransacao,
    deleteTransacao,
    refetch: fetchTransacoes
  };
};
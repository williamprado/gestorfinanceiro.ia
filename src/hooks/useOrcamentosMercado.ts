import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OrcamentoMercado {
  id: string;
  user_id: string;
  categoria_despesa: string;
  valor_orcamento: number;
  estimativa_gastos: number;
  mes_referencia: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useOrcamentosMercado = () => {
  const [orcamentosMercado, setOrcamentosMercado] = useState<OrcamentoMercado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrcamentosMercado = async () => {
    try {
      const { data, error } = await supabase
        .from('orcamentos_mercado')
        .select('*')
        .eq('ativo', true)
        .order('mes_referencia', { ascending: false });

      if (error) throw error;
      setOrcamentosMercado((data || []) as OrcamentoMercado[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar orçamentos de mercado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrcamentoMercado = async (orcamento: Omit<OrcamentoMercado, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orcamentos_mercado')
        .insert([{
          ...orcamento,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      setOrcamentosMercado(prev => [data as OrcamentoMercado, ...prev]);
      
      toast({
        title: "Orçamento criado",
        description: "Orçamento de mercado criado com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar orçamento",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateOrcamentoMercado = async (id: string, updates: Partial<OrcamentoMercado>) => {
    try {
      const { data, error } = await supabase
        .from('orcamentos_mercado')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOrcamentosMercado(prev => prev.map(orcamento => orcamento.id === id ? data as OrcamentoMercado : orcamento));
      
      toast({
        title: "Orçamento atualizado",
        description: "Orçamento de mercado atualizado com sucesso!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar orçamento",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteOrcamentoMercado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orcamentos_mercado')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOrcamentosMercado(prev => prev.filter(orcamento => orcamento.id !== id));
      
      toast({
        title: "Orçamento removido",
        description: "Orçamento de mercado removido com sucesso!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover orçamento",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const getOrcamentoAtivo = (categoria: string) => {
    const mesAtual = new Date().toISOString().slice(0, 7); // YYYY-MM
    return orcamentosMercado.find(o => 
      o.categoria_despesa === categoria && 
      o.mes_referencia.startsWith(mesAtual)
    );
  };

  useEffect(() => {
    fetchOrcamentosMercado();
  }, []);

  return {
    orcamentosMercado,
    loading,
    createOrcamentoMercado,
    updateOrcamentoMercado,
    deleteOrcamentoMercado,
    getOrcamentoAtivo,
    refetch: fetchOrcamentosMercado
  };
};
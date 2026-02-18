import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalysisResult {
  id: string;
  upload_id?: string;
  file_name: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string;
  categoria_id?: string;
  data: string;
  confianca: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export const useIAAnalysis = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ia_analysis_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults((data || []) as AnalysisResult[]);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarResultado = async (resultado: Omit<AnalysisResult, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('ia_analysis_results')
        .insert({
          ...resultado,
          user_id: user.id
        });

      if (error) throw error;
      await fetchResults();
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      throw error;
    }
  };

  const atualizarCategoria = async (id: string, categoria_id: string) => {
    try {
      const { error } = await supabase
        .from('ia_analysis_results')
        .update({ categoria_id })
        .eq('id', id);

      if (error) throw error;
      
      setResults(prev => 
        prev.map(result => 
          result.id === id ? { ...result, categoria_id } : result
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const atualizarStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('ia_analysis_results')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setResults(prev => 
        prev.map(result => 
          result.id === id ? { ...result, status } : result
        )
      );

      const message = status === 'approved' ? 'aprovada' : 'rejeitada';
      toast({
        title: `Transação ${message}`,
        description: `A transação foi ${message}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const editarResultado = async (id: string, updates: Partial<AnalysisResult>) => {
    try {
      const { error } = await supabase
        .from('ia_analysis_results')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setResults(prev => 
        prev.map(result => 
          result.id === id ? { ...result, ...updates } : result
        )
      );

      toast({
        title: "Resultado atualizado",
        description: "Resultado da análise atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao editar resultado:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar resultado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const excluirResultado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ia_analysis_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setResults(prev => prev.filter(result => result.id !== id));

      toast({
        title: "Resultado excluído",
        description: "Resultado da análise excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir resultado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir resultado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    results,
    isLoading,
    salvarResultado,
    atualizarStatus,
    atualizarCategoria,
    editarResultado,
    excluirResultado,
    fetchResults
  };
};
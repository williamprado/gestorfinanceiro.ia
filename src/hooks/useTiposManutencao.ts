import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TipoManutencao {
  id: string;
  nome: string;
  sistema: string;
  intervalo_km: number;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export const useTiposManutencao = () => {
  const [tiposManutencao, setTiposManutencao] = useState<TipoManutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTiposManutencao = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tipos_manutencao')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tipos de manutenção:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar tipos de manutenção",
          variant: "destructive"
        });
        return;
      }

      setTiposManutencao(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tipos de manutenção",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarTipo = async (novoTipo: Omit<TipoManutencao, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('tipos_manutencao')
        .insert([{
          ...novoTipo,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar tipo de manutenção:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar tipo de manutenção",
          variant: "destructive"
        });
        return;
      }

      setTiposManutencao(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Tipo de manutenção adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar tipo de manutenção",
        variant: "destructive"
      });
    }
  };

  const editarTipo = async (tipoEditado: TipoManutencao) => {
    try {
      const { error } = await supabase
        .from('tipos_manutencao')
        .update({
          nome: tipoEditado.nome,
          sistema: tipoEditado.sistema,
          intervalo_km: tipoEditado.intervalo_km,
          descricao: tipoEditado.descricao
        })
        .eq('id', tipoEditado.id);

      if (error) {
        console.error('Erro ao editar tipo de manutenção:', error);
        toast({
          title: "Erro",
          description: "Erro ao editar tipo de manutenção",
          variant: "destructive"
        });
        return;
      }

      setTiposManutencao(prev => prev.map(t => t.id === tipoEditado.id ? tipoEditado : t));
      toast({
        title: "Sucesso",
        description: "Tipo de manutenção editado com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar tipo de manutenção",
        variant: "destructive"
      });
    }
  };

  const excluirTipo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tipos_manutencao')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir tipo de manutenção:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir tipo de manutenção",
          variant: "destructive"
        });
        return;
      }

      setTiposManutencao(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Sucesso",
        description: "Tipo de manutenção excluído com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tipo de manutenção",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTiposManutencao();
  }, []);

  return {
    tiposManutencao,
    loading,
    adicionarTipo,
    editarTipo,
    excluirTipo,
    refetch: fetchTiposManutencao
  };
};
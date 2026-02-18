import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: string;
  placa?: string;
  cor?: string;
  combustivel?: string;
  data_aquisicao?: string;
  quilometragem: number;
  created_at?: string;
  updated_at?: string;
}

export const useVeiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar veículos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar veículos",
          variant: "destructive"
        });
        return;
      }

      setVeiculos(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar veículos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarVeiculo = async (novoVeiculo: Omit<Veiculo, 'id'>) => {
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
        .from('veiculos')
        .insert([{
          ...novoVeiculo,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar veículo:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar veículo",
          variant: "destructive"
        });
        return;
      }

      setVeiculos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Veículo adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar veículo",
        variant: "destructive"
      });
    }
  };

  const editarVeiculo = async (veiculoEditado: Veiculo) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .update({
          marca: veiculoEditado.marca,
          modelo: veiculoEditado.modelo,
          ano: veiculoEditado.ano,
          placa: veiculoEditado.placa,
          cor: veiculoEditado.cor,
          combustivel: veiculoEditado.combustivel,
          data_aquisicao: veiculoEditado.data_aquisicao,
          quilometragem: veiculoEditado.quilometragem
        })
        .eq('id', veiculoEditado.id);

      if (error) {
        console.error('Erro ao editar veículo:', error);
        toast({
          title: "Erro",
          description: "Erro ao editar veículo",
          variant: "destructive"
        });
        return;
      }

      setVeiculos(prev => prev.map(v => v.id === veiculoEditado.id ? veiculoEditado : v));
      toast({
        title: "Sucesso",
        description: "Veículo editado com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar veículo",
        variant: "destructive"
      });
    }
  };

  const excluirVeiculo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir veículo:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir veículo",
          variant: "destructive"
        });
        return;
      }

      setVeiculos(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Sucesso",
        description: "Veículo excluído com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir veículo",
        variant: "destructive"
      });
    }
  };

  const atualizarQuilometragem = async (id: string, novaQuilometragem: number) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .update({ quilometragem: novaQuilometragem })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar quilometragem:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar quilometragem",
          variant: "destructive"
        });
        return;
      }

      setVeiculos(prev => prev.map(v => v.id === id ? { ...v, quilometragem: novaQuilometragem } : v));
      toast({
        title: "Sucesso",
        description: "Quilometragem atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar quilometragem",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  return {
    veiculos,
    loading,
    adicionarVeiculo,
    editarVeiculo,
    excluirVeiculo,
    atualizarQuilometragem,
    refetch: fetchVeiculos
  };
};
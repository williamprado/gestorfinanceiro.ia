import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Veiculo } from "./useVeiculos";
import { TipoManutencao } from "./useTiposManutencao";

export interface ManutencaoPendente {
  id: string;
  veiculo_id: string;
  tipo_manutencao_id: string;
  tipo: string;
  sistema: string;
  status: "Atrasada" | "Em dia" | "Pendente";
  proximaEm: string;
  realizada?: boolean;
  veiculo?: Veiculo;
  tipoManutencao?: TipoManutencao;
}

export const useManutencoesPendentes = (veiculos: Veiculo[], tiposManutencao: TipoManutencao[]) => {
  const [manutencoesPendentes, setManutencoesPendentes] = useState<ManutencaoPendente[]>([]);
  const [manutencaoRealizada, setManutencaoRealizada] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchManutencaoRealizada = async () => {
    try {
      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .eq('status', 'realizada')
        .order('data_realizada', { ascending: false });

      if (error) {
        console.error('Erro ao buscar manutenções realizadas:', error);
        return;
      }

      setManutencaoRealizada(data || []);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const calcularManutencoesPendentes = () => {
    const pendentes: ManutencaoPendente[] = [];

    veiculos.forEach(veiculo => {
      tiposManutencao.forEach(tipo => {
        // Buscar a última manutenção realizada deste tipo para este veículo
        const ultimaManutencao = manutencaoRealizada.find(m => 
          m.veiculo_id === veiculo.id && m.tipo_manutencao_id === tipo.id
        );

        let status: "Atrasada" | "Em dia" | "Pendente";
        let proximaEm: string;
        let quilometragemUltimaManutencao = 0;

        if (ultimaManutencao) {
          // Se já foi feita manutenção, calcular baseado na última
          quilometragemUltimaManutencao = ultimaManutencao.quilometragem_realizada;
          const proximaQuilometragem = quilometragemUltimaManutencao + tipo.intervalo_km;
          const kmRestantes = proximaQuilometragem - veiculo.quilometragem;

          if (kmRestantes <= 0) {
            status = "Atrasada";
            proximaEm = `Atrasada em ${Math.abs(kmRestantes).toLocaleString()} km`;
          } else if (kmRestantes <= tipo.intervalo_km * 0.1) {
            status = "Pendente";
            proximaEm = `Em ${kmRestantes.toLocaleString()} km`;
          } else {
            status = "Em dia";
            proximaEm = `Em ${kmRestantes.toLocaleString()} km`;
          }
        } else {
          // Se nunca foi feita, calcular baseado na quilometragem atual
          const kmExcedentes = veiculo.quilometragem % tipo.intervalo_km;
          const kmParaProxima = tipo.intervalo_km - kmExcedentes;

          if (veiculo.quilometragem >= tipo.intervalo_km) {
            status = "Atrasada";
            proximaEm = `Atrasada em ${kmExcedentes.toLocaleString()} km`;
          } else if (kmParaProxima <= tipo.intervalo_km * 0.1) {
            status = "Pendente";
            proximaEm = `Em ${kmParaProxima.toLocaleString()} km`;
          } else {
            status = "Em dia";
            proximaEm = `Em ${kmParaProxima.toLocaleString()} km`;
          }
        }

        pendentes.push({
          id: `${veiculo.id}-${tipo.id}`,
          veiculo_id: veiculo.id,
          tipo_manutencao_id: tipo.id,
          tipo: tipo.nome,
          sistema: tipo.sistema,
          status,
          proximaEm,
          veiculo,
          tipoManutencao: tipo
        });
      });
    });

    // Ordenar por prioridade: Atrasada -> Pendente -> Em dia
    pendentes.sort((a, b) => {
      const statusOrder = { "Atrasada": 0, "Pendente": 1, "Em dia": 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setManutencoesPendentes(pendentes);
    setLoading(false);
  };

  const realizarManutencao = async (manutencaoPendente: ManutencaoPendente) => {
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

      const veiculo = manutencaoPendente.veiculo;
      if (!veiculo) return;

      // Criar registro de manutenção realizada
      const { error } = await supabase
        .from('manutencoes')
        .insert([{
          user_id: user.id,
          veiculo_id: manutencaoPendente.veiculo_id,
          tipo_manutencao_id: manutencaoPendente.tipo_manutencao_id,
          quilometragem_realizada: veiculo.quilometragem,
          data_realizada: new Date().toISOString().split('T')[0],
          status: 'realizada'
        }]);

      if (error) {
        console.error('Erro ao realizar manutenção:', error);
        toast({
          title: "Erro",
          description: "Erro ao realizar manutenção",
          variant: "destructive"
        });
        return;
      }

      // Atualizar dados após inserção
      await fetchManutencaoRealizada();
      
      toast({
        title: "Sucesso",
        description: "Manutenção realizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar manutenção",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (veiculos.length > 0 && tiposManutencao.length > 0) {
        await fetchManutencaoRealizada();
      } else {
        setLoading(false);
      }
    };
    
    loadData();
  }, [veiculos, tiposManutencao]);

  // Recalcular quando as manutenções realizadas mudarem
  useEffect(() => {
    if (veiculos.length > 0 && tiposManutencao.length > 0) {
      calcularManutencoesPendentes();
    }
  }, [manutencaoRealizada]);

  return {
    manutencoesPendentes,
    loading,
    realizarManutencao,
    refetch: () => {
      fetchManutencaoRealizada();
      calcularManutencoesPendentes();
    }
  };
};
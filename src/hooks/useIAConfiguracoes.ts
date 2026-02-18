import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IAConfiguracao {
  id?: string;
  api_key: string;
  modelo: string;
}

export const useIAConfiguracoes = () => {
  const [configuracao, setConfiguracao] = useState<IAConfiguracao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfiguracao();
  }, []);

  const fetchConfiguracao = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ia_configuracoes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setConfiguracao(data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarConfiguracao = async (apiKey: string, modelo: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const configData = {
        user_id: user.id,
        api_key: apiKey,
        modelo: modelo
      };

      let error;
      if (configuracao?.id) {
        // Atualizar configuração existente
        const { error: updateError } = await supabase
          .from('ia_configuracoes')
          .update({ api_key: apiKey, modelo: modelo })
          .eq('id', configuracao.id);
        error = updateError;
      } else {
        // Criar nova configuração
        const { error: insertError } = await supabase
          .from('ia_configuracoes')
          .insert(configData);
        error = insertError;
      }

      if (error) throw error;

      await fetchConfiguracao();
      
      toast({
        title: "Configuração salva",
        description: "Chave API e modelo OpenAI configurados com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    configuracao,
    isLoading,
    salvarConfiguracao,
    isConfigured: !!configuracao?.api_key
  };
};
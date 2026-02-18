import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Meta {
  id: string;
  user_id: string;
  categoria_meta_id?: string;
  titulo: string;
  tipo: "economia" | "receita" | "despesa" | "investimento";
  valor_alvo: number;
  valor_atual: number;
  data_inicio: string;
  data_limite: string;
  status: "ativa" | "concluida" | "pausada" | "vencida";
  descricao?: string;
  created_at: string;
  updated_at: string;
  categorias_metas?: {
    nome: string;
    cor: string;
    descricao?: string;
  };
}

export const useMetas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetas = async () => {
    try {
      const { data, error } = await supabase
        .from("metas")
        .select(
          `
          *,
          categorias_metas (nome, cor, descricao)
        `
        )
        .order("data_limite", { ascending: true });

      if (error) throw error;
      setMetas((data || []) as Meta[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar metas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeta = async (
    meta: Omit<
      Meta,
      "id" | "user_id" | "created_at" | "updated_at" | "categorias_metas"
    >
  ) => {
    try {
      const { data, error } = await supabase
        .from("metas")
        .insert([
          {
            ...meta,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select(
          `
          *,
          categorias_metas (nome, cor, descricao)
        `
        )
        .single();

      if (error) throw error;
      setMetas((prev) => [data as Meta, ...prev]);

      toast({
        title: "Meta criada",
        description: "Meta criada com sucesso!",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateMeta = async (id: string, updates: Partial<Meta>) => {
    try {
      // Remover campos que não devem ser atualizados
      const {
        categorias_metas,
        created_at,
        updated_at,
        user_id,
        ...updateData
      } = updates;

      const { data, error } = await supabase
        .from("metas")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          categorias_metas (nome, cor, descricao)
        `
        )
        .single();

      if (error) throw error;
      setMetas((prev) =>
        prev.map((meta) => (meta.id === id ? (data as Meta) : meta))
      );

      toast({
        title: "Meta atualizada",
        description: "Meta atualizada com sucesso!",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteMeta = async (id: string) => {
    try {
      const { error } = await supabase.from("metas").delete().eq("id", id);

      if (error) throw error;
      setMetas((prev) => prev.filter((meta) => meta.id !== id));

      toast({
        title: "Meta removida",
        description: "Meta removida com sucesso!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover meta",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  return {
    metas,
    loading,
    createMeta,
    updateMeta,
    deleteMeta,
    refetch: fetchMetas,
  };
};

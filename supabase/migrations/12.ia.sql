-- Criar tabela para configurações OpenAI do usuário
CREATE TABLE public.ia_configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  api_key TEXT NOT NULL,
  modelo TEXT NOT NULL DEFAULT 'gpt-4o',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela para uploads de arquivos
CREATE TABLE public.ia_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para resultados de análises
CREATE TABLE public.ia_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  upload_id UUID REFERENCES public.ia_uploads(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  confianca INTEGER NOT NULL CHECK (confianca >= 0 AND confianca <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.ia_configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_analysis_results ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para ia_configuracoes
CREATE POLICY "Users can view their own ia_configuracoes"
ON public.ia_configuracoes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ia_configuracoes"
ON public.ia_configuracoes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ia_configuracoes"
ON public.ia_configuracoes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ia_configuracoes"
ON public.ia_configuracoes FOR DELETE
USING (auth.uid() = user_id);

-- Políticas RLS para ia_uploads
CREATE POLICY "Users can view their own ia_uploads"
ON public.ia_uploads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ia_uploads"
ON public.ia_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ia_uploads"
ON public.ia_uploads FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ia_uploads"
ON public.ia_uploads FOR DELETE
USING (auth.uid() = user_id);

-- Políticas RLS para ia_analysis_results
CREATE POLICY "Users can view their own ia_analysis_results"
ON public.ia_analysis_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ia_analysis_results"
ON public.ia_analysis_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ia_analysis_results"
ON public.ia_analysis_results FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ia_analysis_results"
ON public.ia_analysis_results FOR DELETE
USING (auth.uid() = user_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_ia_configuracoes_updated_at
BEFORE UPDATE ON public.ia_configuracoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ia_uploads_updated_at
BEFORE UPDATE ON public.ia_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ia_analysis_results_updated_at
BEFORE UPDATE ON public.ia_analysis_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para uploads de IA
INSERT INTO storage.buckets (id, name, public) VALUES ('ia-uploads', 'ia-uploads', false);

-- Políticas para o bucket ia-uploads
CREATE POLICY "Users can view their own ia uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'ia-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own ia files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ia-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ia files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ia-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ia files"
ON storage.objects FOR DELETE
USING (bucket_id = 'ia-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
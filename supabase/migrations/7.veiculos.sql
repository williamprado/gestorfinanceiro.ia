-- Criar tabela de veículos
CREATE TABLE public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano TEXT NOT NULL,
  placa TEXT,
  cor TEXT,
  combustivel TEXT,
  data_aquisicao DATE,
  quilometragem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de tipos de manutenção
CREATE TABLE public.tipos_manutencao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  sistema TEXT NOT NULL,
  intervalo_km INTEGER NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de manutenções
CREATE TABLE public.manutencoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  tipo_manutencao_id UUID NOT NULL REFERENCES public.tipos_manutencao(id) ON DELETE CASCADE,
  quilometragem_realizada INTEGER,
  data_realizada DATE,
  data_proxima DATE,
  quilometragem_proxima INTEGER,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_manutencao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;

-- Políticas para veículos
CREATE POLICY "Users can view their own veiculos" 
ON public.veiculos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own veiculos" 
ON public.veiculos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own veiculos" 
ON public.veiculos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own veiculos" 
ON public.veiculos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para tipos de manutenção
CREATE POLICY "Users can view their own tipos_manutencao" 
ON public.tipos_manutencao 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tipos_manutencao" 
ON public.tipos_manutencao 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tipos_manutencao" 
ON public.tipos_manutencao 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tipos_manutencao" 
ON public.tipos_manutencao 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para manutenções
CREATE POLICY "Users can view their own manutencoes" 
ON public.manutencoes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own manutencoes" 
ON public.manutencoes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own manutencoes" 
ON public.manutencoes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own manutencoes" 
ON public.manutencoes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_veiculos_updated_at
  BEFORE UPDATE ON public.veiculos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tipos_manutencao_updated_at
  BEFORE UPDATE ON public.tipos_manutencao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manutencoes_updated_at
  BEFORE UPDATE ON public.manutencoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
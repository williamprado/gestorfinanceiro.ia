-- Create categorias_metas table
CREATE TABLE public.categorias_metas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#10B981',
  descricao TEXT,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metas table
CREATE TABLE public.metas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_meta_id UUID REFERENCES public.categorias_metas(id),
  titulo TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('economia', 'receita', 'despesa', 'investimento')),
  valor_alvo NUMERIC NOT NULL CHECK (valor_alvo > 0),
  valor_atual NUMERIC NOT NULL DEFAULT 0 CHECK (valor_atual >= 0),
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_limite DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('ativa', 'concluida', 'pausada', 'vencida')) DEFAULT 'ativa',
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categorias_metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categorias_metas
CREATE POLICY "Users can view their own categorias_metas" 
ON public.categorias_metas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categorias_metas" 
ON public.categorias_metas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias_metas" 
ON public.categorias_metas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias_metas" 
ON public.categorias_metas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for metas
CREATE POLICY "Users can view their own metas" 
ON public.metas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own metas" 
ON public.metas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metas" 
ON public.metas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metas" 
ON public.metas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categorias_metas_updated_at
BEFORE UPDATE ON public.categorias_metas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metas_updated_at
BEFORE UPDATE ON public.metas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update meta status based on progress and dates
CREATE OR REPLACE FUNCTION public.update_meta_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update status based on progress and dates
  IF NEW.valor_atual >= NEW.valor_alvo THEN
    NEW.status = 'concluida';
  ELSIF NEW.data_limite < CURRENT_DATE AND NEW.status = 'ativa' THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update meta status
CREATE TRIGGER update_meta_status_trigger
BEFORE INSERT OR UPDATE ON public.metas
FOR EACH ROW
EXECUTE FUNCTION public.update_meta_status();

-- Create indexes for better performance
CREATE INDEX idx_categorias_metas_user_id ON public.categorias_metas(user_id);
CREATE INDEX idx_categorias_metas_ativa ON public.categorias_metas(ativa);

CREATE INDEX idx_metas_user_id ON public.metas(user_id);
CREATE INDEX idx_metas_categoria_meta_id ON public.metas(categoria_meta_id);
CREATE INDEX idx_metas_tipo ON public.metas(tipo);
CREATE INDEX idx_metas_status ON public.metas(status);
CREATE INDEX idx_metas_data_limite ON public.metas(data_limite);
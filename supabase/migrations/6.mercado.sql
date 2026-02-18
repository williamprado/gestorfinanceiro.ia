-- Create categorias_mercado table
CREATE TABLE public.categorias_mercado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT NOT NULL DEFAULT '#10B981',
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itens_mercado table
CREATE TABLE public.itens_mercado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_mercado_id UUID REFERENCES public.categorias_mercado(id),
  descricao TEXT NOT NULL,
  unidade_medida TEXT NOT NULL DEFAULT 'unidade',
  quantidade_atual NUMERIC NOT NULL DEFAULT 0 CHECK (quantidade_atual >= 0),
  quantidade_ideal NUMERIC NOT NULL DEFAULT 1 CHECK (quantidade_ideal > 0),
  preco_atual NUMERIC DEFAULT 0 CHECK (preco_atual >= 0),
  status TEXT NOT NULL DEFAULT 'estoque_baixo' CHECK (status IN ('estoque_adequado', 'estoque_medio', 'estoque_baixo', 'sem_estoque')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orcamentos_mercado table
CREATE TABLE public.orcamentos_mercado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_despesa TEXT NOT NULL DEFAULT 'Alimentação',
  valor_orcamento NUMERIC NOT NULL DEFAULT 0 CHECK (valor_orcamento >= 0),
  estimativa_gastos NUMERIC NOT NULL DEFAULT 0 CHECK (estimativa_gastos >= 0),
  mes_referencia DATE NOT NULL DEFAULT CURRENT_DATE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, categoria_despesa, mes_referencia)
);

-- Enable Row Level Security
ALTER TABLE public.categorias_mercado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_mercado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos_mercado ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categorias_mercado
CREATE POLICY "Users can view their own categorias_mercado" 
ON public.categorias_mercado 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categorias_mercado" 
ON public.categorias_mercado 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias_mercado" 
ON public.categorias_mercado 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias_mercado" 
ON public.categorias_mercado 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for itens_mercado
CREATE POLICY "Users can view their own itens_mercado" 
ON public.itens_mercado 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own itens_mercado" 
ON public.itens_mercado 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itens_mercado" 
ON public.itens_mercado 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itens_mercado" 
ON public.itens_mercado 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for orcamentos_mercado
CREATE POLICY "Users can view their own orcamentos_mercado" 
ON public.orcamentos_mercado 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orcamentos_mercado" 
ON public.orcamentos_mercado 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orcamentos_mercado" 
ON public.orcamentos_mercado 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orcamentos_mercado" 
ON public.orcamentos_mercado 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categorias_mercado_updated_at
BEFORE UPDATE ON public.categorias_mercado
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itens_mercado_updated_at
BEFORE UPDATE ON public.itens_mercado
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orcamentos_mercado_updated_at
BEFORE UPDATE ON public.orcamentos_mercado
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update item status based on quantities
CREATE OR REPLACE FUNCTION public.update_item_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update status based on current vs ideal quantity
  IF NEW.quantidade_atual <= 0 THEN
    NEW.status = 'sem_estoque';
  ELSIF NEW.quantidade_atual >= NEW.quantidade_ideal THEN
    NEW.status = 'estoque_adequado';
  ELSIF NEW.quantidade_atual >= (NEW.quantidade_ideal * 0.3) THEN
    NEW.status = 'estoque_medio';
  ELSE
    NEW.status = 'estoque_baixo';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update item status
CREATE TRIGGER update_item_status_trigger
BEFORE INSERT OR UPDATE ON public.itens_mercado
FOR EACH ROW
EXECUTE FUNCTION public.update_item_status();

-- Create indexes for better performance
CREATE INDEX idx_categorias_mercado_user_id ON public.categorias_mercado(user_id);
CREATE INDEX idx_categorias_mercado_ativa ON public.categorias_mercado(ativa);

CREATE INDEX idx_itens_mercado_user_id ON public.itens_mercado(user_id);
CREATE INDEX idx_itens_mercado_categoria_id ON public.itens_mercado(categoria_mercado_id);
CREATE INDEX idx_itens_mercado_status ON public.itens_mercado(status);

CREATE INDEX idx_orcamentos_mercado_user_id ON public.orcamentos_mercado(user_id);
CREATE INDEX idx_orcamentos_mercado_ativo ON public.orcamentos_mercado(ativo);
CREATE INDEX idx_orcamentos_mercado_mes_referencia ON public.orcamentos_mercado(mes_referencia);
-- Create enum for category types
CREATE TYPE public.categoria_tipo AS ENUM ('receita', 'despesa');

-- Create categorias table
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo categoria_tipo NOT NULL,
  cor TEXT DEFAULT '#3B82F6',
  icone TEXT DEFAULT 'DollarSign',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receitas table
CREATE TABLE public.receitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create despesas table
CREATE TABLE public.despesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categorias
CREATE POLICY "Users can view their own categorias" 
ON public.categorias 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categorias" 
ON public.categorias 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias" 
ON public.categorias 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias" 
ON public.categorias 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for receitas
CREATE POLICY "Users can view their own receitas" 
ON public.receitas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receitas" 
ON public.receitas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receitas" 
ON public.receitas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receitas" 
ON public.receitas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for despesas
CREATE POLICY "Users can view their own despesas" 
ON public.despesas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own despesas" 
ON public.despesas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own despesas" 
ON public.despesas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own despesas" 
ON public.despesas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categorias_updated_at
BEFORE UPDATE ON public.categorias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receitas_updated_at
BEFORE UPDATE ON public.receitas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_despesas_updated_at
BEFORE UPDATE ON public.despesas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_categorias_user_id ON public.categorias(user_id);
CREATE INDEX idx_categorias_tipo ON public.categorias(tipo);
CREATE INDEX idx_receitas_user_id ON public.receitas(user_id);
CREATE INDEX idx_receitas_categoria_id ON public.receitas(categoria_id);
CREATE INDEX idx_receitas_data ON public.receitas(data);
CREATE INDEX idx_despesas_user_id ON public.despesas(user_id);
CREATE INDEX idx_despesas_categoria_id ON public.despesas(categoria_id);
CREATE INDEX idx_despesas_data ON public.despesas(data);
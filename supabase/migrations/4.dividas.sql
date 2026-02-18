-- Create dividas table
CREATE TABLE public.dividas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id),
  descricao TEXT NOT NULL,
  valor_total NUMERIC NOT NULL CHECK (valor_total > 0),
  valor_pago NUMERIC NOT NULL DEFAULT 0 CHECK (valor_pago >= 0),
  valor_restante NUMERIC NOT NULL CHECK (valor_restante >= 0),
  data_vencimento DATE NOT NULL,
  parcelas INTEGER NOT NULL DEFAULT 1 CHECK (parcelas > 0),
  parcelas_pagas INTEGER NOT NULL DEFAULT 0 CHECK (parcelas_pagas >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'vencida', 'quitada')) DEFAULT 'pendente',
  credor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dividas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dividas
CREATE POLICY "Users can view their own dividas" 
ON public.dividas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dividas" 
ON public.dividas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dividas" 
ON public.dividas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dividas" 
ON public.dividas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dividas_updated_at
BEFORE UPDATE ON public.dividas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update valor_restante
CREATE OR REPLACE FUNCTION public.update_valor_restante()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_restante = NEW.valor_total - NEW.valor_pago;
  
  -- Auto-update status based on payment and due date
  IF NEW.valor_restante <= 0 THEN
    NEW.status = 'quitada';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_restante > 0 THEN
    NEW.status = 'vencida';
  ELSE
    NEW.status = 'pendente';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update valor_restante and status
CREATE TRIGGER update_divida_calculations
BEFORE INSERT OR UPDATE ON public.dividas
FOR EACH ROW
EXECUTE FUNCTION public.update_valor_restante();

-- Create indexes for better performance
CREATE INDEX idx_dividas_user_id ON public.dividas(user_id);
CREATE INDEX idx_dividas_categoria_id ON public.dividas(categoria_id);
CREATE INDEX idx_dividas_status ON public.dividas(status);
CREATE INDEX idx_dividas_data_vencimento ON public.dividas(data_vencimento);
CREATE INDEX idx_dividas_credor ON public.dividas(credor);
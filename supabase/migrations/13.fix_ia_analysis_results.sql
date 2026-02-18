-- Add categoria_id column to ia_analysis_results table
ALTER TABLE public.ia_analysis_results 
ADD COLUMN categoria_id uuid REFERENCES public.categorias(id);
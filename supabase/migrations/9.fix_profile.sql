-- Adicionar campos faltantes na tabela profiles para suportar dados completos do perfil
ALTER TABLE public.profiles 
ADD COLUMN telefone TEXT,
ADD COLUMN endereco TEXT,
ADD COLUMN avatar_url TEXT;

-- Criar índice no user_id para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
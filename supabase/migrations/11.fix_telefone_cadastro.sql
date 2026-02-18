-- Correção para salvar telefone no cadastro de usuários
-- Este arquivo corrige o problema onde o telefone não estava sendo salvo na tabela profiles

-- 1. Atualizar função handle_new_user para incluir campo telefone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, organization_name, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'organization_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'telefone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Corrigir dados de usuários existentes que se cadastraram mas não têm telefone salvo
-- (telefone ficou apenas nos metadados do auth.users)
UPDATE public.profiles 
SET telefone = (
  SELECT u.raw_user_meta_data->>'telefone'
  FROM auth.users u 
  WHERE u.id = profiles.user_id
)
WHERE telefone IS NULL 
AND EXISTS (
  SELECT 1 FROM auth.users u 
  WHERE u.id = profiles.user_id 
  AND u.raw_user_meta_data->>'telefone' IS NOT NULL
  AND u.raw_user_meta_data->>'telefone' != ''
);

-- 3. Verificar se a correção funcionou (opcional - para debug)
-- SELECT 
--   p.name, 
--   p.telefone, 
--   u.raw_user_meta_data->>'telefone' as telefone_metadata,
--   p.created_at
-- FROM public.profiles p
-- JOIN auth.users u ON p.user_id = u.id
-- ORDER BY p.created_at DESC
-- LIMIT 5;

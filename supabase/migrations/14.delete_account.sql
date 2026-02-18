-- Função para deletar conta do usuário e todos os dados relacionados
CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Deletar o usuário do auth.users (isso vai disparar o ON DELETE CASCADE)
  DELETE FROM auth.users WHERE id = user_id;
  
  -- Verificar se o usuário foi deletado
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    success := true;
  ELSE
    success := false;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
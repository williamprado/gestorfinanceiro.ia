-- Recriar a função corrigida sem referência a intervalo_meses
CREATE OR REPLACE FUNCTION public.calcular_proxima_manutencao()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Se a manutenção foi realizada, calcular a próxima apenas com base em quilometragem
  IF NEW.data_realizada IS NOT NULL AND NEW.quilometragem_realizada IS NOT NULL THEN
    -- Buscar intervalo de quilometragem do tipo de manutenção
    SELECT 
      CASE 
        WHEN tm.intervalo_km IS NOT NULL 
        THEN NEW.quilometragem_realizada + tm.intervalo_km
        ELSE NULL 
      END
    INTO NEW.quilometragem_proxima
    FROM public.tipos_manutencao tm
    WHERE tm.id = NEW.tipo_manutencao_id;
    
    NEW.status = 'realizada';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recriar o trigger
CREATE TRIGGER calcular_proxima_manutencao_trigger
  BEFORE INSERT OR UPDATE ON public.manutencoes
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_proxima_manutencao();
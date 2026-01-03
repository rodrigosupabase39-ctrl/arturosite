-- EJECUTAR ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- Este script genera slugs para todos los registros existentes en actores y actrices
-- que no tengan slug asignado

-- Generar slugs para actores sin slug
DO $$
DECLARE
  actor_record RECORD;
  generated_slug TEXT;
  counter INTEGER;
  unique_slug TEXT;
BEGIN
  FOR actor_record IN SELECT id, nombre FROM public.actores WHERE slug IS NULL OR slug = '' LOOP
    -- Generar slug base
    generated_slug := LOWER(TRIM(actor_record.nombre));
    generated_slug := REGEXP_REPLACE(generated_slug, '[áàäâ]', 'a', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[éèëê]', 'e', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[íìïî]', 'i', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[óòöô]', 'o', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[úùüû]', 'u', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[ñ]', 'n', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[^a-z0-9]+', '-', 'g');
    generated_slug := REGEXP_REPLACE(generated_slug, '^-+|-+$', '', 'g');
    generated_slug := SUBSTRING(generated_slug, 1, 100);
    
    -- Verificar si el slug ya existe
    unique_slug := generated_slug;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM public.actores WHERE slug = unique_slug AND id != actor_record.id) LOOP
      unique_slug := generated_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Actualizar el registro con el slug único
    UPDATE public.actores 
    SET slug = unique_slug 
    WHERE id = actor_record.id;
  END LOOP;
END $$;

-- Generar slugs para actrices sin slug
DO $$
DECLARE
  actriz_record RECORD;
  generated_slug TEXT;
  counter INTEGER;
  unique_slug TEXT;
BEGIN
  FOR actriz_record IN SELECT id, nombre FROM public.actrices WHERE slug IS NULL OR slug = '' LOOP
    -- Generar slug base
    generated_slug := LOWER(TRIM(actriz_record.nombre));
    generated_slug := REGEXP_REPLACE(generated_slug, '[áàäâ]', 'a', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[éèëê]', 'e', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[íìïî]', 'i', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[óòöô]', 'o', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[úùüû]', 'u', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[ñ]', 'n', 'gi');
    generated_slug := REGEXP_REPLACE(generated_slug, '[^a-z0-9]+', '-', 'g');
    generated_slug := REGEXP_REPLACE(generated_slug, '^-+|-+$', '', 'g');
    generated_slug := SUBSTRING(generated_slug, 1, 100);
    
    -- Verificar si el slug ya existe
    unique_slug := generated_slug;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM public.actrices WHERE slug = unique_slug AND id != actriz_record.id) LOOP
      unique_slug := generated_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Actualizar el registro con el slug único
    UPDATE public.actrices 
    SET slug = unique_slug 
    WHERE id = actriz_record.id;
  END LOOP;
END $$;

-- Verificar resultados
SELECT 'Actores con slug generado:' as info, COUNT(*) as total FROM public.actores WHERE slug IS NOT NULL AND slug != '';
SELECT 'Actrices con slug generado:' as info, COUNT(*) as total FROM public.actrices WHERE slug IS NOT NULL AND slug != '';




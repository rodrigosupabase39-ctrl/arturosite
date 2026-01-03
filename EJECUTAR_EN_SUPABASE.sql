-- ============================================
-- EJECUTAR ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- ============================================
-- Este script genera slugs para TODOS los registros existentes
-- en actores, actrices y talentos_sub_18 que no tengan slug

-- ============================================
-- 1. GENERAR SLUGS PARA ACTORES
-- ============================================
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
    
    RAISE NOTICE 'Actor actualizado: % -> %', actor_record.nombre, unique_slug;
  END LOOP;
END $$;

-- ============================================
-- 2. GENERAR SLUGS PARA ACTRICES
-- ============================================
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
    
    RAISE NOTICE 'Actriz actualizada: % -> %', actriz_record.nombre, unique_slug;
  END LOOP;
END $$;

-- ============================================
-- 3. GENERAR SLUGS PARA TALENTOS SUB 18
-- ============================================
DO $$
DECLARE
  talento_record RECORD;
  generated_slug TEXT;
  counter INTEGER;
  unique_slug TEXT;
BEGIN
  FOR talento_record IN SELECT id, nombre FROM public.talentos_sub_18 WHERE slug IS NULL OR slug = '' LOOP
    -- Generar slug base
    generated_slug := LOWER(TRIM(talento_record.nombre));
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
    
    WHILE EXISTS (SELECT 1 FROM public.talentos_sub_18 WHERE slug = unique_slug AND id != talento_record.id) LOOP
      unique_slug := generated_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Actualizar el registro con el slug único
    UPDATE public.talentos_sub_18 
    SET slug = unique_slug 
    WHERE id = talento_record.id;
    
    RAISE NOTICE 'Talento sub 18 actualizado: % -> %', talento_record.nombre, unique_slug;
  END LOOP;
END $$;

-- ============================================
-- 4. VERIFICAR RESULTADOS
-- ============================================
SELECT 
  'Actores con slug' as tabla,
  COUNT(*) as total_con_slug,
  (SELECT COUNT(*) FROM public.actores) as total_registros
FROM public.actores 
WHERE slug IS NOT NULL AND slug != ''

UNION ALL

SELECT 
  'Actrices con slug' as tabla,
  COUNT(*) as total_con_slug,
  (SELECT COUNT(*) FROM public.actrices) as total_registros
FROM public.actrices 
WHERE slug IS NOT NULL AND slug != ''

UNION ALL

SELECT 
  'Talentos Sub 18 con slug' as tabla,
  COUNT(*) as total_con_slug,
  (SELECT COUNT(*) FROM public.talentos_sub_18) as total_registros
FROM public.talentos_sub_18 
WHERE slug IS NOT NULL AND slug != '';

-- ============================================
-- 5. VER EJEMPLOS DE SLUGS GENERADOS
-- ============================================
SELECT 'ACTORES' as tipo, nombre, slug FROM public.actores WHERE slug IS NOT NULL LIMIT 5;
SELECT 'ACTRICES' as tipo, nombre, slug FROM public.actrices WHERE slug IS NOT NULL LIMIT 5;
SELECT 'TALENTOS SUB 18' as tipo, nombre, slug FROM public.talentos_sub_18 WHERE slug IS NOT NULL LIMIT 5;




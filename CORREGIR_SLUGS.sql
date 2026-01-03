-- ============================================
-- EJECUTAR ESTE SQL PARA CORREGIR LOS SLUGS
-- ============================================
-- Este script corrige la función de generación de slugs y regenera todos los slugs

-- ============================================
-- PASO 1: Corregir la función de generación de slugs
-- ============================================
CREATE OR REPLACE FUNCTION generate_slug_from_name(name_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  -- Convertir a minúsculas y trim
  result := LOWER(TRIM(name_text));
  
  -- Reemplazar acentos y caracteres especiales
  result := REGEXP_REPLACE(result, '[áàäâ]', 'a', 'gi');
  result := REGEXP_REPLACE(result, '[éèëê]', 'e', 'gi');
  result := REGEXP_REPLACE(result, '[íìïî]', 'i', 'gi');
  result := REGEXP_REPLACE(result, '[óòöô]', 'o', 'gi');
  result := REGEXP_REPLACE(result, '[úùüû]', 'u', 'gi');
  result := REGEXP_REPLACE(result, '[ñ]', 'n', 'gi');
  
  -- Reemplazar caracteres no alfanuméricos con guiones
  result := REGEXP_REPLACE(result, '[^a-z0-9]+', '-', 'g');
  
  -- Eliminar guiones al inicio y final
  result := REGEXP_REPLACE(result, '^-+|-+$', '', 'g');
  
  -- Limitar longitud
  result := SUBSTRING(result, 1, 100);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PASO 2: Regenerar slugs para ACTORES
-- ============================================
UPDATE public.actores
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '' OR slug LIKE '-%';

-- Manejar duplicados en actores
DO $$
DECLARE
  actor_rec RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER;
BEGIN
  FOR actor_rec IN 
    SELECT id, nombre, slug 
    FROM public.actores 
    WHERE slug IN (
      SELECT slug 
      FROM public.actores 
      WHERE slug IS NOT NULL AND slug != '' AND slug NOT LIKE '-%'
      GROUP BY slug 
      HAVING COUNT(*) > 1
    )
    ORDER BY id
  LOOP
    base_slug := actor_rec.slug;
    new_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (
      SELECT 1 FROM public.actores 
      WHERE slug = new_slug AND id != actor_rec.id
    ) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    UPDATE public.actores 
    SET slug = new_slug 
    WHERE id = actor_rec.id;
  END LOOP;
END $$;

-- ============================================
-- PASO 3: Regenerar slugs para ACTRICES
-- ============================================
UPDATE public.actrices
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '' OR slug LIKE '-%';

-- Manejar duplicados en actrices
DO $$
DECLARE
  actriz_rec RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER;
BEGIN
  FOR actriz_rec IN 
    SELECT id, nombre, slug 
    FROM public.actrices 
    WHERE slug IN (
      SELECT slug 
      FROM public.actrices 
      WHERE slug IS NOT NULL AND slug != '' AND slug NOT LIKE '-%'
      GROUP BY slug 
      HAVING COUNT(*) > 1
    )
    ORDER BY id
  LOOP
    base_slug := actriz_rec.slug;
    new_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (
      SELECT 1 FROM public.actrices 
      WHERE slug = new_slug AND id != actriz_rec.id
    ) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    UPDATE public.actrices 
    SET slug = new_slug 
    WHERE id = actriz_rec.id;
  END LOOP;
END $$;

-- ============================================
-- PASO 4: Regenerar slugs para TALENTOS SUB 18
-- ============================================
UPDATE public.talentos_sub_18
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '' OR slug LIKE '-%';

-- Manejar duplicados en talentos_sub_18
DO $$
DECLARE
  talento_rec RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER;
BEGIN
  FOR talento_rec IN 
    SELECT id, nombre, slug 
    FROM public.talentos_sub_18 
    WHERE slug IN (
      SELECT slug 
      FROM public.talentos_sub_18 
      WHERE slug IS NOT NULL AND slug != '' AND slug NOT LIKE '-%'
      GROUP BY slug 
      HAVING COUNT(*) > 1
    )
    ORDER BY id
  LOOP
    base_slug := talento_rec.slug;
    new_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (
      SELECT 1 FROM public.talentos_sub_18 
      WHERE slug = new_slug AND id != talento_rec.id
    ) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    UPDATE public.talentos_sub_18 
    SET slug = new_slug 
    WHERE id = talento_rec.id;
  END LOOP;
END $$;

-- ============================================
-- PASO 5: Verificar resultados corregidos
-- ============================================
SELECT '=== ACTORES ===' as info;
SELECT nombre, slug FROM public.actores WHERE slug IS NOT NULL LIMIT 5;

SELECT '=== ACTRICES ===' as info;
SELECT nombre, slug FROM public.actrices WHERE slug IS NOT NULL LIMIT 5;

SELECT '=== TALENTOS SUB 18 ===' as info;
SELECT nombre, slug FROM public.talentos_sub_18 WHERE slug IS NOT NULL LIMIT 5;

-- Verificar que no hay slugs mal formados
SELECT '=== SLUGS MAL FORMADOS (deberían estar vacíos) ===' as info;
SELECT 'Actores' as tabla, COUNT(*) as mal_formados 
FROM public.actores WHERE slug LIKE '-%'
UNION ALL
SELECT 'Actrices' as tabla, COUNT(*) as mal_formados 
FROM public.actrices WHERE slug LIKE '-%'
UNION ALL
SELECT 'Talentos Sub 18' as tabla, COUNT(*) as mal_formados 
FROM public.talentos_sub_18 WHERE slug LIKE '-%';




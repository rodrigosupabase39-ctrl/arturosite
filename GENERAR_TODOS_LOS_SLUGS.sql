-- ============================================
-- EJECUTAR TODO ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- ============================================
-- Este script genera slugs para TODOS los registros existentes
-- Ejecutá todo de una vez, copiá y pegá todo el contenido

-- ============================================
-- PASO 1: Crear función para generar slugs
-- ============================================
CREATE OR REPLACE FUNCTION generate_slug_from_name(name_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  TRIM(name_text),
                  '[áàäâ]', 'a', 'gi'
                ),
                '[éèëê]', 'e', 'gi'
              ),
              '[íìïî]', 'i', 'gi'
            ),
            '[óòöô]', 'o', 'gi'
          ),
          '[úùüû]', 'u', 'gi'
        ),
        '[ñ]', 'n', 'gi'
      ),
      '[^a-z0-9]+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PASO 2: Generar slugs para ACTORES
-- ============================================
UPDATE public.actores
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

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
      WHERE slug IS NOT NULL AND slug != ''
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
-- PASO 3: Generar slugs para ACTRICES
-- ============================================
UPDATE public.actrices
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

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
      WHERE slug IS NOT NULL AND slug != ''
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
-- PASO 4: Generar slugs para TALENTOS SUB 18
-- ============================================
UPDATE public.talentos_sub_18
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

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
      WHERE slug IS NOT NULL AND slug != ''
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
-- PASO 5: Verificar resultados
-- ============================================
SELECT 
  'Actores' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sin_slug,
  COUNT(*) as total
FROM public.actores

UNION ALL

SELECT 
  'Actrices' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sin_slug,
  COUNT(*) as total
FROM public.actrices

UNION ALL

SELECT 
  'Talentos Sub 18' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sin_slug,
  COUNT(*) as total
FROM public.talentos_sub_18;

-- ============================================
-- PASO 6: Ver ejemplos de slugs generados
-- ============================================
SELECT '=== EJEMPLOS ACTORES ===' as info;
SELECT nombre, slug FROM public.actores WHERE slug IS NOT NULL LIMIT 5;

SELECT '=== EJEMPLOS ACTRICES ===' as info;
SELECT nombre, slug FROM public.actrices WHERE slug IS NOT NULL LIMIT 5;

SELECT '=== EJEMPLOS TALENTOS SUB 18 ===' as info;
SELECT nombre, slug FROM public.talentos_sub_18 WHERE slug IS NOT NULL LIMIT 5;




-- ============================================
-- EJECUTAR ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- ============================================
-- Versión simplificada que funciona mejor en el SQL Editor

-- ============================================
-- 1. GENERAR SLUGS PARA ACTORES
-- ============================================
-- Primero, crear una función auxiliar para generar slugs
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

-- Actualizar actores con slugs
UPDATE public.actores
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- Manejar duplicados agregando números
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
-- 2. GENERAR SLUGS PARA ACTRICES
-- ============================================
UPDATE public.actrices
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- Manejar duplicados
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
-- 3. GENERAR SLUGS PARA TALENTOS SUB 18
-- ============================================
UPDATE public.talentos_sub_18
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- Manejar duplicados
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
-- 4. VERIFICAR RESULTADOS
-- ============================================
SELECT 
  'Actores' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.actores

UNION ALL

SELECT 
  'Actrices' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.actrices

UNION ALL

SELECT 
  'Talentos Sub 18' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.talentos_sub_18;

-- ============================================
-- 5. VER EJEMPLOS
-- ============================================
SELECT 'ACTORES' as tipo, nombre, slug FROM public.actores WHERE slug IS NOT NULL LIMIT 5;
SELECT 'ACTRICES' as tipo, nombre, slug FROM public.actrices WHERE slug IS NOT NULL LIMIT 5;
SELECT 'TALENTOS SUB 18' as tipo, nombre, slug FROM public.talentos_sub_18 WHERE slug IS NOT NULL LIMIT 5;




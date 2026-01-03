-- ============================================
-- VERSIÓN SIMPLE - EJECUTAR PASO A PASO
-- ============================================
-- Si la versión anterior da error, ejecutá estos comandos uno por uno

-- PASO 1: Crear función para generar slugs
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

-- PASO 2: Actualizar actores
UPDATE public.actores
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- PASO 3: Actualizar actrices
UPDATE public.actrices
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- PASO 4: Actualizar talentos sub 18
UPDATE public.talentos_sub_18
SET slug = generate_slug_from_name(nombre)
WHERE slug IS NULL OR slug = '';

-- PASO 5: Verificar resultados
SELECT 
  'Actores' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.actores;

SELECT 
  'Actrices' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.actrices;

SELECT 
  'Talentos Sub 18' as tabla,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as con_slug,
  COUNT(*) as total
FROM public.talentos_sub_18;

-- PASO 6: Ver ejemplos
SELECT nombre, slug FROM public.actores WHERE slug IS NOT NULL LIMIT 5;
SELECT nombre, slug FROM public.actrices WHERE slug IS NOT NULL LIMIT 5;
SELECT nombre, slug FROM public.talentos_sub_18 WHERE slug IS NOT NULL LIMIT 5;




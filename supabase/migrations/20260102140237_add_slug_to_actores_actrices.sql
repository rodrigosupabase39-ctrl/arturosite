-- Agregar columna slug a actores
ALTER TABLE public.actores 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear índice único para slug en actores
CREATE UNIQUE INDEX IF NOT EXISTS idx_actores_slug ON public.actores(slug);

-- Agregar columna slug a actrices
ALTER TABLE public.actrices 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear índice único para slug en actrices
CREATE UNIQUE INDEX IF NOT EXISTS idx_actrices_slug ON public.actrices(slug);

-- Generar slugs para registros existentes en actores
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

-- Generar slugs para registros existentes en actrices
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

-- Comentarios
COMMENT ON COLUMN public.actores.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN public.actrices.slug IS 'Slug único para URLs amigables';




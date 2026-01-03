-- Agregar columna slug a talentos_sub_18
ALTER TABLE public.talentos_sub_18 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear índice único para slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_talentos_sub_18_slug ON public.talentos_sub_18(slug);

-- Generar slugs para registros existentes
-- Función para generar slug desde nombre
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
  END LOOP;
END $$;

-- Comentario
COMMENT ON COLUMN public.talentos_sub_18.slug IS 'Slug único para URLs amigables';




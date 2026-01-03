-- Asegurar que la columna slug existe en todas las tablas
-- Esta migración es idempotente (se puede ejecutar múltiples veces sin problemas)

-- Agregar columna slug a actores si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'actores' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.actores ADD COLUMN slug TEXT;
    RAISE NOTICE 'Columna slug agregada a actores';
  ELSE
    RAISE NOTICE 'Columna slug ya existe en actores';
  END IF;
END $$;

-- Agregar columna slug a actrices si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'actrices' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.actrices ADD COLUMN slug TEXT;
    RAISE NOTICE 'Columna slug agregada a actrices';
  ELSE
    RAISE NOTICE 'Columna slug ya existe en actrices';
  END IF;
END $$;

-- Agregar columna slug a talentos_sub_18 si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'talentos_sub_18' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.talentos_sub_18 ADD COLUMN slug TEXT;
    RAISE NOTICE 'Columna slug agregada a talentos_sub_18';
  ELSE
    RAISE NOTICE 'Columna slug ya existe en talentos_sub_18';
  END IF;
END $$;

-- Crear índices únicos si no existen
CREATE UNIQUE INDEX IF NOT EXISTS idx_actores_slug ON public.actores(slug) WHERE slug IS NOT NULL AND slug != '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_actrices_slug ON public.actrices(slug) WHERE slug IS NOT NULL AND slug != '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_talentos_sub_18_slug ON public.talentos_sub_18(slug) WHERE slug IS NOT NULL AND slug != '';

-- Comentarios
COMMENT ON COLUMN public.actores.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN public.actrices.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN public.talentos_sub_18.slug IS 'Slug único para URLs amigables';




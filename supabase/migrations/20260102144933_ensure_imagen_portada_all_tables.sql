-- Asegurar que la columna imagen_portada_url existe en todas las tablas
-- Esta migración es idempotente (se puede ejecutar múltiples veces)

-- Agregar columna imagen_portada_url a actores si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'actores' 
    AND column_name = 'imagen_portada_url'
  ) THEN
    ALTER TABLE public.actores ADD COLUMN imagen_portada_url TEXT;
    RAISE NOTICE 'Columna imagen_portada_url agregada a actores';
  ELSE
    RAISE NOTICE 'Columna imagen_portada_url ya existe en actores';
  END IF;
END $$;

-- Agregar columna imagen_portada_url a actrices si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'actrices' 
    AND column_name = 'imagen_portada_url'
  ) THEN
    ALTER TABLE public.actrices ADD COLUMN imagen_portada_url TEXT;
    RAISE NOTICE 'Columna imagen_portada_url agregada a actrices';
  ELSE
    RAISE NOTICE 'Columna imagen_portada_url ya existe en actrices';
  END IF;
END $$;

-- Agregar columna imagen_portada_url a talentos_sub_18 si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'talentos_sub_18' 
    AND column_name = 'imagen_portada_url'
  ) THEN
    ALTER TABLE public.talentos_sub_18 ADD COLUMN imagen_portada_url TEXT;
    RAISE NOTICE 'Columna imagen_portada_url agregada a talentos_sub_18';
  ELSE
    RAISE NOTICE 'Columna imagen_portada_url ya existe en talentos_sub_18';
  END IF;
END $$;

-- Comentarios
COMMENT ON COLUMN public.actores.imagen_portada_url IS 'URL de la imagen de portada para la página personal del actor';
COMMENT ON COLUMN public.actrices.imagen_portada_url IS 'URL de la imagen de portada para la página personal de la actriz';
COMMENT ON COLUMN public.talentos_sub_18.imagen_portada_url IS 'URL de la imagen de portada para la página personal del talento sub 18';




-- ============================================
-- EJECUTAR ESTE SQL PRIMERO EN EL SQL EDITOR
-- ============================================
-- Este script agrega la columna slug si no existe

-- Agregar columna slug a actores
ALTER TABLE public.actores ADD COLUMN IF NOT EXISTS slug TEXT;

-- Agregar columna slug a actrices
ALTER TABLE public.actrices ADD COLUMN IF NOT EXISTS slug TEXT;

-- Agregar columna slug a talentos_sub_18
ALTER TABLE public.talentos_sub_18 ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS idx_actores_slug ON public.actores(slug) WHERE slug IS NOT NULL AND slug != '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_actrices_slug ON public.actrices(slug) WHERE slug IS NOT NULL AND slug != '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_talentos_sub_18_slug ON public.talentos_sub_18(slug) WHERE slug IS NOT NULL AND slug != '';

-- Verificar que las columnas se crearon
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('actores', 'actrices', 'talentos_sub_18')
  AND column_name = 'slug'
ORDER BY table_name;




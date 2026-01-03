-- ============================================
-- EJECUTAR ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- ============================================
-- Este script agrega la columna imagen_portada_url a TODAS las tablas
-- si no existe

-- Agregar columna imagen_portada_url a actores
ALTER TABLE public.actores 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Agregar columna imagen_portada_url a actrices
ALTER TABLE public.actrices 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Agregar columna imagen_portada_url a talentos_sub_18
ALTER TABLE public.talentos_sub_18 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Verificar que las columnas se crearon
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('actores', 'actrices', 'talentos_sub_18')
  AND column_name = 'imagen_portada_url'
ORDER BY table_name;




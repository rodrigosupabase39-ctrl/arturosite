-- Agregar campo 'orden' a las tablas de talentos para permitir ordenamiento personalizado

-- Agregar columna 'orden' a la tabla actores
ALTER TABLE public.actores 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla actrices
ALTER TABLE public.actrices 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla guionistas
ALTER TABLE public.guionistas 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla directores
ALTER TABLE public.directores 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Establecer valores iniciales de 'orden' basados en el orden de creación (created_at)
-- Los más antiguos tendrán menor orden (aparecerán primero)
WITH ranked_actores AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.actores
)
UPDATE public.actores
SET orden = ranked_actores.rn - 1
FROM ranked_actores
WHERE actores.id = ranked_actores.id;

WITH ranked_actrices AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.actrices
)
UPDATE public.actrices
SET orden = ranked_actrices.rn - 1
FROM ranked_actrices
WHERE actrices.id = ranked_actrices.id;

WITH ranked_guionistas AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.guionistas
)
UPDATE public.guionistas
SET orden = ranked_guionistas.rn - 1
FROM ranked_guionistas
WHERE guionistas.id = ranked_guionistas.id;

WITH ranked_directores AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.directores
)
UPDATE public.directores
SET orden = ranked_directores.rn - 1
FROM ranked_directores
WHERE directores.id = ranked_directores.id;


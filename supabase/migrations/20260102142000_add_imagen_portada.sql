-- Agregar columna imagen_portada_url a las tablas de talentos
-- Esta imagen se mostrará como portada grande en la página de detalle

-- Actores
ALTER TABLE public.actores 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Actrices
ALTER TABLE public.actrices 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Talentos Sub 18
ALTER TABLE public.talentos_sub_18 
ADD COLUMN IF NOT EXISTS imagen_portada_url TEXT;

-- Comentarios
COMMENT ON COLUMN public.actores.imagen_portada_url IS 'URL de la imagen de portada para la página personal del actor';
COMMENT ON COLUMN public.actrices.imagen_portada_url IS 'URL de la imagen de portada para la página personal de la actriz';
COMMENT ON COLUMN public.talentos_sub_18.imagen_portada_url IS 'URL de la imagen de portada para la página personal del talento sub 18';




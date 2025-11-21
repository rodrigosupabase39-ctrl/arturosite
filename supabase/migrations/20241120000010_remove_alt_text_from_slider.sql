-- Eliminar el campo alt_text de la tabla slider_imagenes si existe
ALTER TABLE public.slider_imagenes DROP COLUMN IF EXISTS alt_text;


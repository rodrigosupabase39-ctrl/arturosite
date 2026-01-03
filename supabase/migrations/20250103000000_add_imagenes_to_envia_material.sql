-- Add imagenes_urls column to envia_material table
ALTER TABLE public.envia_material 
ADD COLUMN IF NOT EXISTS imagenes_urls JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN public.envia_material.imagenes_urls IS 'Array de URLs de imágenes subidas';


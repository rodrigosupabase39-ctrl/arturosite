-- EJECUTAR ESTE SQL EN EL SQL EDITOR DE SUPABASE
-- Un solo registro de ejemplo para talentos_sub_18

-- Deshabilitar RLS temporalmente
ALTER TABLE public.talentos_sub_18 DISABLE ROW LEVEL SECURITY;

-- Insertar un solo registro
INSERT INTO public.talentos_sub_18 (nombre, video_url, imagen_principal_url, imagenes_urls, bloques, imagen_principal_index, orden) VALUES
('Sofía Martínez', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
 '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop"]'::jsonb,
 '[{"tipo": "television", "contenido": "Protagonista infantil en serie \"Aventuras en el Barrio\" (Disney Channel, 2022-actualidad). Interpretó el papel de Luna durante 2 temporadas, recibiendo reconocimiento por su naturalidad y carisma.", "order": 0}, {"tipo": "cine", "contenido": "Papel principal en \"El Verano de los Sueños\" (2023). Película familiar que participó en el Festival Internacional de Cine para Niños y Jóvenes.", "order": 1}, {"tipo": "teatro", "contenido": "Obra infantil \"El Mago de Oz\" en Teatro Nacional (2022). Interpretó el papel de Dorothy con gran éxito de público familiar.", "order": 2}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Escuela de Artes para Jóvenes (2020-actualidad). Talleres especializados en actuación para niños y adolescentes.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo.", "order": 4}]'::jsonb,
 0, 0);

-- Rehabilitar RLS
ALTER TABLE public.talentos_sub_18 ENABLE ROW LEVEL SECURITY;

-- Verificar que se insertó
SELECT id, nombre, orden FROM public.talentos_sub_18 LIMIT 1;




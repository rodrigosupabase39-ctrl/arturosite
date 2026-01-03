-- Insertar 10 talentos sub 18 de ejemplo
-- Solo insertar si la tabla está vacía

DO $$
BEGIN
  -- Verificar si la tabla está vacía
  IF (SELECT COUNT(*) FROM public.talentos_sub_18) = 0 THEN
    -- Insertar los datos
    INSERT INTO public.talentos_sub_18 (nombre, video_url, imagen_principal_url, imagenes_urls, bloques, imagen_principal_index, orden) VALUES
    ('Sofía Martínez', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Protagonista infantil en serie \"Aventuras en el Barrio\" (Disney Channel, 2022-actualidad). Interpretó el papel de Luna durante 2 temporadas, recibiendo reconocimiento por su naturalidad y carisma.", "order": 0}, {"tipo": "cine", "contenido": "Papel principal en \"El Verano de los Sueños\" (2023). Película familiar que participó en el Festival Internacional de Cine para Niños y Jóvenes.", "order": 1}, {"tipo": "teatro", "contenido": "Obra infantil \"El Mago de Oz\" en Teatro Nacional (2022). Interpretó el papel de Dorothy con gran éxito de público familiar.", "order": 2}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Escuela de Artes para Jóvenes (2020-actualidad). Talleres especializados en actuación para niños y adolescentes.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo.", "order": 4}]'::jsonb,
     0, 0),
    
    ('Mateo Fernández', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 
     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Co-protagonista en serie juvenil \"Generación Z\" (Netflix, 2023-actualidad). Serie que aborda temas relevantes para adolescentes contemporáneos.", "order": 0}, {"tipo": "cine", "contenido": "Papel secundario en \"El Camino del Héroe\" (2022). Película de aventuras familiar que fue estrenada en cines nacionales.", "order": 1}, {"tipo": "teatro", "contenido": "Obra juvenil \"Los Jóvenes del Futuro\" en Teatro del Sur (2023). Participación en elenco joven con gran recepción del público.", "order": 2}, {"tipo": "publicidades", "contenido": "Campaña publicitaria para marca de ropa juvenil (2023). Comercial que se transmitió en redes sociales y alcanzó millones de visualizaciones.", "order": 3}, {"tipo": "formacion", "contenido": "Talleres de actuación para jóvenes en Centro de Artes Escénicas (2021-actualidad). Especialización en actuación para cine y televisión.", "order": 4}, {"tipo": "instagram", "contenido": "@mateofernandez.oficial - 32.5K seguidores. Contenido sobre actuación, vida estudiantil y proyectos artísticos.", "order": 5}]'::jsonb,
     0, 1),
    
    ('Valentina López', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 
     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Presentadora juvenil en programa \"Chicos en Acción\" (Canal 9, 2022-actualidad). Programa educativo y de entretenimiento para niños y adolescentes.", "order": 0}, {"tipo": "cine", "contenido": "Protagonista en \"La Aventura de los Amigos\" (2023). Película familiar que fue seleccionada para participar en festivales internacionales de cine infantil.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"Peter Pan\" en Teatro Colón (2022). Interpretó el papel de Campanita con gran éxito de crítica y público.", "order": 2}, {"tipo": "publicidades", "contenido": "Campaña publicitaria para marca de juguetes educativos (2022-2023). Imagen de marca que incluyó spots televisivos y presencia en redes sociales.", "order": 3}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Instituto de Artes para Jóvenes (2020-actualidad). Talleres especializados en expresión corporal y vocal.", "order": 4}, {"tipo": "premios", "contenido": "Mejor Actriz Joven - Premios de Teatro Infantil 2023. Nominación a Revelación del Año - Premios de Televisión Infantil 2022.", "order": 5}, {"tipo": "instagram", "contenido": "@valentinalopez.oficial - 58.3K seguidores. Contenido sobre actuación, proyectos artísticos y vida estudiantil.", "order": 6}]'::jsonb,
     0, 2),
    
    ('Benjamín Torres', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Actor recurrente en serie \"La Vida en el Colegio\" (Disney Channel, 2023-actualidad). Personaje que apareció en 12 episodios de la primera temporada.", "order": 0}, {"tipo": "cine", "contenido": "Papel secundario en \"El Misterio del Bosque\" (2022). Película de aventuras familiar que participó en festivales de cine para niños.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"El Principito\" en Teatro Nacional (2023). Interpretó el papel principal con gran naturalidad y sensibilidad.", "order": 2}, {"tipo": "formacion", "contenido": "Talleres de actuación en Escuela de Artes Escénicas para Jóvenes (2021-actualidad). Especialización en teatro y expresión corporal.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo. Francés: Básico (nivel A1).", "order": 4}]'::jsonb,
     0, 3),
    
    ('Isabella García', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 
     'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Protagonista en serie juvenil \"Amigas para Siempre\" (Netflix, 2023-actualidad). Serie que aborda la amistad y los desafíos de la adolescencia.", "order": 0}, {"tipo": "cine", "contenido": "Actriz principal en \"El Verano Inolvidable\" (2023). Película familiar que fue estrenada en cines y plataformas digitales.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"Alicia en el País de las Maravillas\" en Teatro del Sur (2022). Interpretó el papel de Alicia con gran versatilidad y carisma.", "order": 2}, {"tipo": "publicidades", "contenido": "Campaña publicitaria para marca de productos para adolescentes (2023). Imagen de marca que incluyó presencia en redes sociales y eventos.", "order": 3}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Centro de Formación Artística para Jóvenes (2020-actualidad). Talleres especializados en actuación para cine y televisión.", "order": 4}, {"tipo": "instagram", "contenido": "@isabellagarcia.oficial - 41.7K seguidores. Contenido sobre actuación, moda juvenil y proyectos artísticos.", "order": 5}]'::jsonb,
     0, 4),
    
    ('Santiago Ramírez', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 
     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Co-protagonista en serie \"Los Jóvenes Detectives\" (Canal 7, 2023-actualidad). Serie de misterio y aventuras para público juvenil.", "order": 0}, {"tipo": "cine", "contenido": "Papel principal en \"La Búsqueda del Tesoro\" (2022). Película de aventuras familiar que participó en festivales internacionales.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"El Mago de Oz\" en Teatro Nacional (2023). Interpretó el papel del Espantapájaros con gran sentido del humor.", "order": 2}, {"tipo": "formacion", "contenido": "Talleres de actuación en Instituto de Artes para Jóvenes (2021-actualidad). Especialización en comedia y expresión corporal.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo.", "order": 4}]'::jsonb,
     0, 5),
    
    ('Emma Rodríguez', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Actriz recurrente en serie \"Vida de Estudiante\" (Disney Channel, 2022-actualidad). Personaje que apareció en múltiples episodios con gran aceptación del público.", "order": 0}, {"tipo": "cine", "contenido": "Papel secundario en \"El Mundo Mágico\" (2023). Película de fantasía familiar que fue estrenada en cines nacionales.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"La Bella y la Bestia\" en Teatro Colón (2022). Interpretó el papel de Bella con gran elegancia y sensibilidad.", "order": 2}, {"tipo": "publicidades", "contenido": "Campaña publicitaria para marca de productos para niños (2022-2023). Imagen de marca que incluyó spots televisivos y presencia en redes sociales.", "order": 3}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Escuela de Artes Escénicas para Jóvenes (2020-actualidad). Talleres especializados en teatro musical y expresión vocal.", "order": 4}, {"tipo": "instagram", "contenido": "@emmarodriguez.oficial - 29.8K seguidores. Contenido sobre actuación, proyectos artísticos y vida estudiantil.", "order": 5}]'::jsonb,
     0, 6),
    
    ('Lucas Morales', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 
     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Protagonista en serie juvenil \"Aventuras en la Escuela\" (Netflix, 2023-actualidad). Serie que aborda las experiencias y desafíos de los estudiantes adolescentes.", "order": 0}, {"tipo": "cine", "contenido": "Actriz principal en \"El Verano de los Sueños\" (2023). Película familiar que participó en festivales de cine para niños y jóvenes.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"El Principito\" en Teatro del Sur (2023). Interpretó el papel del Principito con gran sensibilidad y profundidad.", "order": 2}, {"tipo": "formacion", "contenido": "Talleres de actuación en Centro de Formación Artística para Jóvenes (2021-actualidad). Especialización en actuación para teatro y cine.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo. Portugués: Básico (nivel A1).", "order": 4}]'::jsonb,
     0, 7),
    
    ('Olivia Sánchez', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 
     'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Co-protagonista en serie \"Los Jóvenes Talentos\" (Canal 9, 2023-actualidad). Serie que muestra las vidas de jóvenes artistas y sus sueños.", "order": 0}, {"tipo": "cine", "contenido": "Papel secundario en \"La Aventura de los Amigos\" (2023). Película familiar que fue seleccionada para participar en festivales internacionales.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"Peter Pan\" en Teatro Nacional (2022). Interpretó el papel de Wendy con gran naturalidad y carisma.", "order": 2}, {"tipo": "publicidades", "contenido": "Campaña publicitaria para marca de productos para adolescentes (2023). Imagen de marca que incluyó presencia en redes sociales y eventos.", "order": 3}, {"tipo": "formacion", "contenido": "Estudiante de actuación en Instituto de Artes para Jóvenes (2020-actualidad). Talleres especializados en expresión corporal y vocal.", "order": 4}, {"tipo": "premios", "contenido": "Mejor Actriz Joven - Premios de Teatro Infantil 2023. Nominación a Revelación del Año - Premios de Televisión Juvenil 2022.", "order": 5}, {"tipo": "instagram", "contenido": "@oliviasanchez.oficial - 36.4K seguidores. Contenido sobre actuación, proyectos artísticos y vida estudiantil.", "order": 6}]'::jsonb,
     0, 8),
    
    ('Noah Herrera', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop',
     '["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop"]'::jsonb,
     '[{"tipo": "television", "contenido": "Actor recurrente en serie \"La Vida en el Colegio\" (Disney Channel, 2023-actualidad). Personaje que apareció en 15 episodios con gran aceptación del público.", "order": 0}, {"tipo": "cine", "contenido": "Papel principal en \"El Misterio del Bosque\" (2022). Película de aventuras familiar que participó en festivales de cine para niños.", "order": 1}, {"tipo": "teatro", "contenido": "Obra \"Alicia en el País de las Maravillas\" en Teatro Colón (2023). Interpretó el papel del Sombrerero Loco con gran versatilidad.", "order": 2}, {"tipo": "formacion", "contenido": "Talleres de actuación en Escuela de Artes Escénicas para Jóvenes (2021-actualidad). Especialización en comedia y expresión corporal.", "order": 3}, {"tipo": "idiomas", "contenido": "Inglés: Intermedio (nivel B1). Español: Nativo.", "order": 4}]'::jsonb,
     0, 9);
    
    RAISE NOTICE 'Insertados 10 talentos sub 18 de ejemplo';
  ELSE
    RAISE NOTICE 'La tabla ya tiene datos, no se insertaron registros';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error al insertar datos: %', SQLERRM;
END $$;




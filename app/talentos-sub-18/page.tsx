'use client';

import { Box, Typography, CircularProgress, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTalentosList } from '@/hooks/useTalentosList';
import { nombreToSlug } from '@/lib/utils/slug';

export default function TalentosSub18Page() {
  const { data, isLoading, error } = useTalentosList('talentos-sub-18');

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#030303',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 6, sm: 8 },
        }}
      >
        <Container 
          maxWidth={false}
          sx={{ 
            px: { xs: 3, sm: 4, md: 6 },
            width: '100%',
            maxWidth: '100% !important',
          }}
        >
          {/* Título */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
              fontWeight: 300,
              color: 'white',
              textAlign: 'center',
              mb: { xs: 3, sm: 4, md: 5 },
              fontFamily: 'var(--font-oswald), sans-serif',
              letterSpacing: { xs: '3px', sm: '4px', md: '5px' },
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              pb: 2,
              opacity: 0,
              transform: 'translateY(-30px)',
              animation: 'fadeInDown 0.8s ease-in forwards',
              '@keyframes fadeInDown': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(-30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            TALENTOS SUB 18
          </Typography>

          {/* Grid de talentos sub 18 */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress 
                sx={{
                  color: '#ff4444',
                }}
              />
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="error">
                Error al cargar los talentos sub 18. Por favor, intenta nuevamente.
              </Typography>
            </Box>
          )}

          {data && data.talentos && data.talentos.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                No hay talentos sub 18 registrados aún.
              </Typography>
            </Box>
          )}

          {data && data.talentos && data.talentos.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(5, 1fr)',
                  xl: 'repeat(6, 1fr)',
                },
                gap: { xs: 3, sm: 4, md: 5 },
                width: '100%',
              }}
            >
              {data.talentos.map((talento) => {
                // Asegurar que imagenes_urls sea un array
                let imagenesArray: string[] = [];
                try {
                  if (Array.isArray(talento.imagenes_urls)) {
                    imagenesArray = talento.imagenes_urls;
                  } else if (typeof talento.imagenes_urls === 'string') {
                    imagenesArray = JSON.parse(talento.imagenes_urls);
                  }
                } catch (error) {
                  console.error('Error al parsear imagenes_urls:', error);
                  imagenesArray = [];
                }

                // Obtener la imagen principal o la primera disponible
                const imagenPrincipal = talento.imagen_principal_url || 
                  (imagenesArray && imagenesArray.length > 0 ? imagenesArray[0] : null);

                // Usar el slug guardado en la BD, o generar uno si no existe (compatibilidad)
                const slug = (talento as any).slug || nombreToSlug(talento.nombre);

                return (
                  <Link
                    href={`/talentos-sub-18/${slug}`}
                    key={talento.id}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, opacity 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {/* Imagen del talento */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '100%', sm: '100%', md: '100%' },
                          aspectRatio: '1',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          mb: 1.5,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {imagenPrincipal ? (
                          <Image
                            src={imagenPrincipal}
                            alt={talento.nombre}
                            fill
                            style={{
                              objectFit: 'cover',
                            }}
                            sizes="(max-width: 600px) 150px, (max-width: 960px) 180px, 200px"
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#e0e0e0',
                              color: '#999',
                            }}
                          >
                            <Typography variant="body2">Sin imagen</Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Nombre del talento */}
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          fontFamily: 'var(--font-sora), sans-serif',
                          fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                          fontWeight: 300,
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.4,
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {talento.nombre}
                      </Typography>
                    </Box>
                  </Link>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}


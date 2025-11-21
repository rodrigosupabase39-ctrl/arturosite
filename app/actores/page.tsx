'use client';

import { Box, Typography, Grid, CircularProgress, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTalentosList } from '@/hooks/useTalentosList';

export default function ActoresPage() {
  const { data, isLoading, error } = useTalentosList('actores');

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f0',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 6, sm: 8 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
          {/* Título */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 700,
              color: '#333',
              textAlign: 'center',
              mb: { xs: 4, sm: 6 },
              fontFamily: 'var(--font-sora), sans-serif',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            ACTORES
          </Typography>

          {/* Grid de actores */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="error">
                Error al cargar los actores. Por favor, intenta nuevamente.
              </Typography>
            </Box>
          )}

          {data && data.talentos && data.talentos.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No hay actores registrados aún.
              </Typography>
            </Box>
          )}

          {data && data.talentos && data.talentos.length > 0 && (
            <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
              {data.talentos.map((actor) => {
                // Asegurar que imagenes_urls sea un array
                let imagenesArray: string[] = [];
                try {
                  if (Array.isArray(actor.imagenes_urls)) {
                    imagenesArray = actor.imagenes_urls;
                  } else if (typeof actor.imagenes_urls === 'string') {
                    imagenesArray = JSON.parse(actor.imagenes_urls);
                  }
                } catch (error) {
                  console.error('Error al parsear imagenes_urls:', error);
                  imagenesArray = [];
                }

                // Obtener la imagen principal o la primera disponible
                const imagenPrincipal = actor.imagen_principal_url || 
                  (imagenesArray && imagenesArray.length > 0 ? imagenesArray[0] : null);

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={actor.id}>
                    <Link
                      href={`/actores/${actor.id}`}
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
                      {/* Imagen del actor */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '150px', sm: '180px', md: '200px' },
                          height: { xs: '150px', sm: '180px', md: '200px' },
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          mb: 1.5,
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {imagenPrincipal ? (
                          <Image
                            src={imagenPrincipal}
                            alt={actor.nombre}
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

                      {/* Nombre del actor */}
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: 'center',
                          fontFamily: 'var(--font-sora), sans-serif',
                          fontSize: { xs: '0.875rem', sm: '0.95rem' },
                          fontWeight: 400,
                          color: '#333',
                          lineHeight: 1.4,
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                        }}
                      >
                        {actor.nombre}
                      </Typography>
                    </Box>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}


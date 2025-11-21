'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Divider, 
  Dialog, 
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import Header from '@/components/Header';
import { useTalento } from '@/hooks/useTalento';

export default function GuionistaPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: guionista, isLoading, error } = useTalento('guionistas', id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  if (isLoading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error || !guionista) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Error al cargar el guionista. Por favor, intenta nuevamente.
          </Typography>
        </Container>
      </>
    );
  }

  // Procesar imágenes
  let imagenesArray: string[] = [];
  try {
    if (Array.isArray(guionista.imagenes_urls)) {
      imagenesArray = guionista.imagenes_urls.filter(img => img && img.trim() !== '');
    } else if (typeof guionista.imagenes_urls === 'string') {
      const parsed = JSON.parse(guionista.imagenes_urls);
      imagenesArray = Array.isArray(parsed) ? parsed.filter((img: string) => img && img.trim() !== '') : [];
    }
  } catch (error) {
    console.error('Error al parsear imagenes_urls:', error);
    imagenesArray = [];
  }

  // Procesar bloques
  let bloques: Array<{ tipo: string; contenido: string; order?: number }> = [];
  try {
    if (Array.isArray(guionista.bloques)) {
      bloques = guionista.bloques;
    } else if (typeof guionista.bloques === 'string') {
      bloques = JSON.parse(guionista.bloques);
    }
    // Ordenar bloques por order si existe
    bloques = bloques.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error al parsear bloques:', error);
    bloques = [];
  }

  // Combinar todas las imágenes: principal primero, luego el resto
  let todasLasImagenes: string[] = [];
  
  // Agregar todas las imágenes del array primero
  if (imagenesArray && imagenesArray.length > 0) {
    imagenesArray.forEach(img => {
      if (img && typeof img === 'string' && img.trim() !== '' && !todasLasImagenes.includes(img)) {
        todasLasImagenes.push(img);
      }
    });
  }
  
  // Si hay imagen principal y no está en el array, agregarla al inicio
  if (guionista.imagen_principal_url && guionista.imagen_principal_url.trim() !== '') {
    if (!todasLasImagenes.includes(guionista.imagen_principal_url)) {
      todasLasImagenes.unshift(guionista.imagen_principal_url);
    } else {
      todasLasImagenes = todasLasImagenes.filter(img => img !== guionista.imagen_principal_url);
      todasLasImagenes.unshift(guionista.imagen_principal_url);
    }
  }
  
  // Si no hay ninguna imagen pero hay imagen_principal_url, usarla
  if (todasLasImagenes.length === 0 && guionista.imagen_principal_url && guionista.imagen_principal_url.trim() !== '') {
    todasLasImagenes = [guionista.imagen_principal_url];
  }

  // Mapeo de tipos de bloque a títulos
  const tipoBloqueTitulos: Record<string, string> = {
    television: 'Televisión',
    teatro: 'Teatro',
    cine: 'Cine',
    publicidades: 'Publicidades',
    formacion: 'Formación',
    instagram: 'Instagram',
    premios: 'Premios / Distinciones / Menciones',
    idiomas: 'Idiomas',
    'web-oficial': 'Web Oficial',
    facebook: 'Facebook',
    experiencia: 'Experiencia',
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#fafafa',
          pt: { xs: 3, sm: 5 },
          pb: { xs: 5, sm: 8 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Nombre del guionista */}
          <Box sx={{ mb: { xs: 5, sm: 6, md: 7 } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 600,
                color: '#1a1a1a',
                textAlign: 'left',
                fontFamily: 'var(--font-sora), sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {guionista.nombre}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, sm: 4, md: 6 } }}>
            {/* Columna izquierda: Imágenes y Video */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box>
                {/* Galería de todas las imágenes */}
                {todasLasImagenes.length > 0 ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1.5,
                      mb: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    {todasLasImagenes.map((img, index) => (
                      <Box
                        key={`${img}-${index}`}
                        onClick={() => setSelectedImage(img)}
                        sx={{
                          position: 'relative',
                          width: { xs: '100px', sm: '120px', md: '140px' },
                          height: { xs: '100px', sm: '120px', md: '140px' },
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-2px) scale(1.05)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            '&::after': {
                              opacity: 1,
                            },
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                          },
                        }}
                      >
                        <img
                          src={img}
                          alt={`${guionista.nombre} ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '3/4',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                      Sin imágenes
                    </Typography>
                  </Box>
                )}

                {/* Botón para video si existe - junto a las imágenes */}
                {guionista.video_url && (
                  <Box sx={{ display: 'inline-block', mt: 1 }}>
                    <Button
                      onClick={() => setShowVideo(true)}
                      variant="contained"
                      startIcon={<PlayArrowIcon sx={{ fontSize: '1.25rem' }} />}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        padding: { xs: '10px 20px', sm: '12px 24px' },
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-sora), sans-serif',
                        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
                        },
                        '& .MuiButton-startIcon': {
                          marginRight: 1,
                          marginLeft: 0,
                        },
                      }}
                    >
                      Ver Video
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            
            {/* Columna derecha: Información / Bloques */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box>
                {bloques.length > 0 ? (
                  bloques.map((bloque, index) => (
                    <Box key={index} sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          p: { xs: 2.5, sm: 3.5 },
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          border: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            fontFamily: 'var(--font-sora), sans-serif',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            lineHeight: 1.4,
                          }}
                        >
                          {tipoBloqueTitulos[bloque.tipo] || bloque.tipo}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: 'var(--font-sora), sans-serif',
                            color: '#4a4a4a',
                            lineHeight: 1.8,
                            whiteSpace: 'pre-line',
                            fontSize: { xs: '0.9375rem', sm: '1rem' },
                            fontWeight: 300,
                          }}
                        >
                          {bloque.contenido}
                        </Typography>
                      </Box>
                      {index < bloques.length - 1 && (
                        <Divider 
                          sx={{ 
                            mt: { xs: 3, sm: 4 },
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                          }} 
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'left', py: 6 }}>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#999',
                        fontFamily: 'var(--font-sora), sans-serif',
                      }}
                    >
                      No hay información disponible aún.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Modal de imagen */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        {selectedImage && (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: 40,
                height: 40,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Imagen */}
            <Box
              sx={{
                position: 'relative',
                width: 'auto',
                maxWidth: '90vw',
                height: 'auto',
                maxHeight: '90vh',
              }}
            >
              <img
                src={selectedImage}
                alt={`${guionista?.nombre} - Imagen ampliada`}
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Modal de video */}
      <Dialog
        open={showVideo}
        onClose={() => setShowVideo(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            boxShadow: 'none',
            maxWidth: '90vw',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          {/* Botón cerrar */}
          <IconButton
            onClick={() => setShowVideo(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              width: 40,
              height: 40,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Video iframe */}
          {guionista?.video_url && (
            <iframe
              src={guionista.video_url.replace('watch?v=', 'embed/').split('&')[0]}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title={`Video de ${guionista.nombre}`}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useSliderImagenes } from '@/hooks/useSliderImagenes';

export default function Slider() {
  const { data, isLoading, error } = useSliderImagenes();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = data?.imagenes || [];

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <Box
      sx={{
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        minHeight: { xs: 'auto', md: '85vh' },
        overflow: 'hidden',
      }}
    >
      {/* Left Column - Texto sobre Nosotros */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          padding: { xs: '48px 24px', md: '80px 60px', lg: '100px 80px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          minHeight: { xs: '400px', md: '85vh' },
          flexShrink: 0,
        }}
      >
        <Box sx={{ maxWidth: '500px' }}>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2rem' },
              fontWeight: 400,
              letterSpacing: { xs: '2px', md: '6px' },
              lineHeight: 1.3,
              color: 'black',
              textTransform: 'uppercase',
              marginBottom: { xs: '16px', md: '17px' },
              fontFamily: 'var(--font-sora), sans-serif',
            }}
          >
            Somos una agencia dedicada a representar talento artístico.
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 300,
              letterSpacing: '1px',
              lineHeight: 1.7,
              color: 'black',
              marginBottom: { xs: '24px', md: '32px' },
            }}
          >
            Conectamos actores, actrices, guionistas y directores con proyectos que merecen su destreza.
          </Typography>
          <Button
            component={Link}
            href="/contacto"
            variant="outlined"
            sx={{
              borderColor: 'black',
              color: 'black',
              padding: { xs: '12px 24px', md: '14px 32px' },
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 400,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderRadius: 0,
              borderWidth: '1px',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'black',
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Contacto por propuestas
          </Button>
        </Box>
      </Box>

      {/* Right Column - Slider con overlay diagonal blanco */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          minHeight: { xs: '60vh', md: '92vh' },
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          marginRight: { xs: 0, md: '-16px', lg: '-32px' },
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography variant="body2" color="error">
              Error al cargar las imágenes del slider
            </Typography>
          </Box>
        )}

        {!isLoading && !error && slides.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No hay imágenes en el slider
            </Typography>
          </Box>
        )}

        {!isLoading && !error && slides.length > 0 && (
          <>
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
                  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: currentSlide === index ? 1 : 0,
                }}
              >
                <Image
                  src={slide.imagen_url}
                  alt="Slider image"
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  priority={currentSlide === index}
                  sizes="60vw"
                />
              </Box>
            ))}
            
            {/* Overlay diagonal blanco en la esquina superior izquierda */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderTop: { xs: '80px solid white', md: '120px solid white' },
                borderRight: { xs: '80px solid transparent', md: '120px solid transparent' },
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            
            {/* Dots indicator */}
            {slides.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  zIndex: 2,
                }}
              >
                {slides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                    }}
                    sx={{
                      width: currentSlide === index ? 32 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'white',
                        width: 24,
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}


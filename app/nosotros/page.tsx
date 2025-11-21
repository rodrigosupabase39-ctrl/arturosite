'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';

const teamMembers = [
  {
    id: 1,
    name: 'Sofia Soler',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    description: 'Con más de 10 años de experiencia en la industria del entretenimiento, Sofia se especializa en descubrir y desarrollar nuevos talentos. Su pasión por el arte dramático y su ojo agudo para el potencial artístico la han convertido en una figura clave en la representación de actores y actrices.',
  },
  {
    id: 2,
    name: 'Ana Gonzalo',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop',
    description: 'Ana combina su formación en gestión cultural con un profundo conocimiento del mercado audiovisual. Dedicada a construir relaciones sólidas entre talentos y proyectos, trabaja incansablemente para posicionar a nuestros representados en las mejores oportunidades del sector.',
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: { xs: '60px', md: '100px' },
          paddingBottom: { xs: '60px', md: '100px' },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Título Principal */}
        <Box
          sx={{
            marginBottom: { xs: '48px', md: '60px' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 400,
              fontFamily: 'var(--font-sora), sans-serif',
              color: 'black',
              letterSpacing: '1px',
            }}
          >
            Nosotros
          </Typography>
        </Box>

        {/* Equipo */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: '48px', md: '60px' },
            alignItems: 'start',
          }}
        >
          {teamMembers.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Imagen */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', md: '350px' },
                  marginBottom: { xs: '24px', md: '32px' },
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  sizes="(max-width: 960px) 100vw, 50vw"
                  priority={member.id === 1}
                />
              </Box>

              {/* Nombre */}
              <Typography
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 400,
                  marginBottom: { xs: '12px', md: '16px' },
                  fontFamily: 'var(--font-sora), sans-serif',
                  color: 'black',
                  letterSpacing: '0.5px',
                }}
              >
                {member.name}
              </Typography>

              {/* Descripción */}
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 300,
                  letterSpacing: '0.3px',
                  lineHeight: 1.7,
                  color: 'black',
                }}
              >
                {member.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}


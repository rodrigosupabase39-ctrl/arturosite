'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Header from '@/components/Header';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
} from '@mui/material';
import { contactoSchema, ContactoFormData } from '@/schemas/contactoSchema';
import { useContacto } from '@/hooks/useContacto';

export default function ContactoPage() {
  const { mutate: sendContacto, isPending } = useContacto();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
  });

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      fontSize: '0.95rem',
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
      '& input::placeholder': {
        color: 'rgba(0, 0, 0, 0.4)',
        opacity: 1,
        fontSize: '0.85rem',
      },
      '& textarea::placeholder': {
        color: 'rgba(0, 0, 0, 0.4)',
        opacity: 1,
        fontSize: '0.85rem',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'black',
      fontSize: '0.95rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black',
    },
  };

  const onSubmit = (data: ContactoFormData) => {
    sendContacto(data, {
      onSuccess: () => {
        toast.success('¡Mensaje enviado exitosamente! Te contactaremos a la brevedad.');
        reset();
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
      },
    });
  };

  return (
    <>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          paddingTop: { xs: '48px', md: '80px' },
          paddingBottom: { xs: '48px', md: '80px' },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: { xs: '16px', md: '24px' },
              textAlign: 'center',
              fontFamily: 'var(--font-sora), sans-serif',
              color: 'black',
            }}
          >
            Contacto por propuestas
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              fontWeight: 300,
              letterSpacing: '1px',
              lineHeight: 1.7,
              color: 'black',
              marginBottom: { xs: '32px', md: '48px' },
              textAlign: 'center',
            }}
          >
            ¿Tienes un proyecto en mente? Contáctanos y te responderemos a la brevedad.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Nombre"
                {...register('nombre')}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': {
                      borderColor: 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Apellido"
                {...register('apellido')}
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': {
                      borderColor: 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              required
              sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    borderColor: 'black',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'black',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
            />

            <TextField
              fullWidth
              label="Mensaje"
              {...register('mensaje')}
              error={!!errors.mensaje}
              helperText={errors.mensaje?.message}
              required
              multiline
              rows={6}
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    borderColor: 'black',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'black',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
            />

                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    disabled={isPending}
                    sx={{
                borderColor: 'black',
                color: 'black',
                padding: '14px 32px',
                fontSize: '1rem',
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
                    {isPending ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}


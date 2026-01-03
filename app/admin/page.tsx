'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
} from '@mui/material';
import { loginSchema, LoginFormData } from '@/schemas/loginSchema';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // Si hay sesión, redirigir al dashboard
          router.push('/admin/dashboard');
          return;
        }
        // Si la respuesta es 401 o cualquier otro error, no hay sesión
        // Esto es normal, simplemente mostrar el formulario
      } catch (error) {
        // Error de conexión, también mostrar formulario
        console.error('Error verificando sesión:', error);
      } finally {
        // Siempre ocultar el loading y mostrar el formulario
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      // Login exitoso
      toast.success('¡Bienvenido!');
      router.push('/admin/dashboard');
      router.refresh(); // Refrescar para que el middleware detecte la sesión
    } catch (error) {
      toast.error('Error de conexión. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'white',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box 
      data-admin="true"
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'white',
      }}
    >
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: { xs: '48px', md: '80px' },
        paddingBottom: { xs: '48px', md: '80px' },
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 400,
            marginBottom: { xs: '16px', md: '24px' },
            textAlign: 'center',
            fontFamily: 'var(--font-sora), sans-serif',
            color: 'black',
            letterSpacing: '1px',
          }}
        >
          Admin Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              '& .MuiFormHelperText-root': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            required
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
              '& .MuiFormHelperText-root': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          />

          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={loading}
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
              '&:disabled': {
                borderColor: '#ccc',
                color: '#ccc',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
        </Box>
        </Box>
      </Container>
    </Box>
  );
}


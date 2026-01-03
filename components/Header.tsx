'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import { contactoSchema, ContactoFormData } from '@/schemas/contactoSchema';
import { useContacto } from '@/hooks/useContacto';

const menuItemsLeft = [
  { label: 'Actores', href: '/actores' },
  { label: 'Actrices', href: '/actrices' },
  { label: 'Talentos Sub 18', href: '/talentos-sub-18' },
];

const allMenuItems = [...menuItemsLeft];

// URL de Instagram
const INSTAGRAM_URL = 'https://www.instagram.com/arturo.villanueva1/';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactoOpen, setContactoOpen] = useState(false);
  const { mutate: sendContacto, isPending } = useContacto();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenContacto = () => {
    setContactoOpen(true);
  };

  const handleCloseContacto = () => {
    setContactoOpen(false);
    reset();
  };

  const onSubmitContacto = (data: ContactoFormData) => {
    sendContacto(data, {
      onSuccess: () => {
        toast.success('¡Mensaje enviado exitosamente! Te contactaremos a la brevedad.');
        reset();
        handleCloseContacto();
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
      },
    });
  };

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
    },
    '& .MuiInputLabel-root': {
      color: 'black',
      fontSize: '0.95rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black',
    },
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250, backgroundColor: '#030303', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box
          sx={{ 
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'var(--font-oswald), sans-serif',
            textTransform: 'uppercase',
            display: 'flex',
            gap: 1,
          }}
        >
          <Box component="span">ARTURO</Box>
          <Box component="span" sx={{ color: '#ff8787' }}>VILLANUEVA</Box>
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: 'white',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              transform: 'rotate(90deg)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {allMenuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href} 
              sx={{ 
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.1)',
                  paddingLeft: '32px',
                  '& .MuiListItemText-primary': {
                    color: '#ff4444',
                    fontWeight: 700,
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: '#ff4444',
                  transform: 'scaleY(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::before': {
                  transform: 'scaleY(1)',
                }
              }}
            >
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    transition: 'color 0.3s ease, font-weight 0.3s ease',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      {/* Iconos fijos a la izquierda solo en la página principal */}
      {isHomePage && (
        <Box
          sx={{
            position: 'fixed',
            left: { xs: 16, sm: 24, md: 32 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <IconButton
            component="a"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              minWidth: { xs: 36, sm: 40 },
              padding: 0,
              borderRadius: 0,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 68, 68, 0.8)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <InstagramIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              '&:hover .contacto-label': {
                opacity: 1,
                transform: 'translateX(0)',
              },
            }}
          >
            <IconButton
              onClick={handleOpenContacto}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                minWidth: { xs: 36, sm: 40 },
                padding: 0,
                borderRadius: 0,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.8)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <EmailIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            </IconButton>
            <Typography
              className="contacto-label"
              sx={{
                position: 'absolute',
                left: { xs: 48, sm: 52 },
                whiteSpace: 'nowrap',
                opacity: 0,
                transform: 'translateX(-10px)',
                transition: 'all 0.3s ease',
                color: 'white',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                fontFamily: 'var(--font-sora), sans-serif',
                fontWeight: 500,
                pointerEvents: 'none',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              Contacto
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              '&:hover .material-label': {
                opacity: 1,
                transform: 'translateX(0)',
              },
            }}
          >
            <IconButton
              component="a"
              href="/envia-material"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                minWidth: { xs: 36, sm: 40 },
                padding: 0,
                borderRadius: 0,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.8)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <DescriptionIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            </IconButton>
            <Typography
              className="material-label"
              sx={{
                position: 'absolute',
                left: { xs: 48, sm: 52 },
                whiteSpace: 'nowrap',
                opacity: 0,
                transform: 'translateX(-10px)',
                transition: 'all 0.3s ease',
                color: 'white',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                fontFamily: 'var(--font-sora), sans-serif',
                fontWeight: 500,
                pointerEvents: 'none',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              Enviar Material
            </Typography>
          </Box>
        </Box>
      )}
      <AppBar position="static" sx={{ backgroundColor: '#030303', boxShadow: 'none', borderBottom: 'none' }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          position: 'relative',
          minHeight: { xs: '56px', sm: '64px' },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Left logo */}
          <Typography
            variant="h4"
            component={Link}
            href="/"
            sx={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontWeight: 400,
              color: 'white',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              textDecoration: 'none',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              gap: 1,
            }}
          >
            <Box component="span">ARTURO</Box>
            <Box component="span" sx={{ color: '#ff4444' }}>VILLANUEVA</Box>
          </Typography>

          {/* Right menu items */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 4,
            alignItems: 'center',
          }}>
            {menuItemsLeft.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#ff4444',
                    fontWeight: 700,
                    transform: 'translateY(-2px)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0',
                    height: '1px',
                    backgroundColor: '#ff4444',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '100%',
                  }
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>


          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              display: { md: 'none' },
              position: 'absolute',
              right: 0,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, backgroundColor: '#030303' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Modal de Contacto */}
      <Dialog
        open={contactoOpen}
        onClose={handleCloseContacto}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'var(--font-sora), sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            color: 'black',
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
          }}
        >
          Contacto
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitContacto)}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre *"
                {...register('nombre')}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                sx={textFieldStyle}
                fullWidth
              />
              <TextField
                label="Apellido *"
                {...register('apellido')}
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
                sx={textFieldStyle}
                fullWidth
              />
              <TextField
                label="Email *"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={textFieldStyle}
                fullWidth
              />
              <TextField
                label="Mensaje *"
                multiline
                rows={4}
                {...register('mensaje')}
                error={!!errors.mensaje}
                helperText={errors.mensaje?.message}
                sx={textFieldStyle}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
            <Button
              onClick={handleCloseContacto}
              sx={{
                color: 'black',
                borderColor: 'black',
                borderRadius: 0,
                borderWidth: '1px',
                borderStyle: 'solid',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'black',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="outlined"
              disabled={isPending}
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: 0,
                borderWidth: '1px',
                textTransform: 'none',
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
              {isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}


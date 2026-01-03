'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import LogoutIcon from '@mui/icons-material/Logout';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';

const drawerWidth = 280;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/admin/dashboard' },
  { label: 'Alta', icon: <PersonAddIcon />, href: '/admin/alta' },
  { label: 'Contactos', icon: <EmailIcon />, href: '/admin/contactos' },
  { label: 'Material', icon: <AttachEmailIcon />, href: '/admin/material' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/admin');
          return;
        }
        setLoading(false);
        // Marcar que la carga inicial terminó después de un breve delay
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 100);
      } catch (error) {
        router.push('/admin');
      }
    };
    
    checkSession();
  }, [router]);

  // Detectar cambios de ruta
  useEffect(() => {
    if (prevPathname !== pathname) {
      setIsNavigating(true);
      // Resetear el estado de navegación después de un breve delay
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 150); // Reducido para que sea más rápido y menos molesto
      setPrevPathname(pathname);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigation = (href: string | null) => {
    if (!href) return;
    if (href === pathname) return; // Si ya estamos en esa página, no hacer nada
    
    startTransition(() => {
      router.push(href);
      setMobileOpen(false);
    });
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          minHeight: '80px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontWeight: 400,
            color: 'black',
            fontSize: '1.75rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Admin Arturo
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ py: 2, flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.href)}
                disabled={isPending && isActive}
                sx={{
                  mx: 1,
                  borderRadius: 0,
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: 'black',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'white' : 'black',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.5px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto', flexShrink: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          disabled={isPending}
          sx={{
            borderColor: 'black',
            color: 'black',
            padding: '12px 24px',
            fontSize: '0.95rem',
            fontWeight: 400,
            letterSpacing: '0.5px',
            textTransform: 'none',
            borderRadius: 0,
            borderWidth: '1px',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'black',
              backgroundColor: 'black',
              color: 'white',
            },
            '&.Mui-disabled': {
              borderColor: '#ccc',
              color: '#ccc',
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  // Si está cargando la sesión inicial, mostrar preloader completo
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress 
          size={40}
          thickness={4}
          sx={{
            color: '#ff4444',
          }}
        />
      </Box>
    );
  }

  return (
    <Box data-admin="true" sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar para móvil */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'black' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontWeight: 400,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            Admin Arturo
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e0e0e0',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }} />
        {/* Preloader solo durante transiciones, no durante carga inicial */}
        {(isPending || isNavigating) && !loading && !isInitialLoad && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: { xs: 0, md: drawerWidth },
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(250, 250, 250, 0.95)',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
              transition: 'opacity 0.2s ease-in-out',
              animation: 'fadeIn 0.2s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            <CircularProgress 
              size={40}
              thickness={4}
              sx={{
                color: '#ff4444',
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            opacity: (isPending || isNavigating) && !loading && !isInitialLoad ? 0.3 : 1,
            transition: 'opacity 0.15s ease',
            pointerEvents: (isPending || isNavigating) && !loading && !isInitialLoad ? 'none' : 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}


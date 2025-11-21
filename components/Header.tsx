'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const menuItemsLeft = [
  { label: 'Actores', href: '/actores' },
  { label: 'Actrices', href: '/actrices' },
  { label: 'Nosotros', href: '/nosotros' },
];

const menuItemsRight = [
  { label: 'Guionistas', href: '/guionistas' },
  { label: 'Directores', href: '/directores' },
];

const allMenuItems = [...menuItemsLeft, ...menuItemsRight];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
          }}
        >
          Club Semilla
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              transform: 'rotate(90deg)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  paddingLeft: '32px',
                  '& .MuiListItemText-primary': {
                    color: 'black',
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
                  backgroundColor: 'black',
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
                    transition: 'color 0.3s ease, font-weight 0.3s ease',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Box sx={{ padding: '16px', width: '100%' }}>
            <Button
              component={Link}
              href="/envia-material"
              variant="outlined"
              fullWidth
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
              }}
            >
              Envía material
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: 'none' }}>
        <Toolbar sx={{ 
          justifyContent: 'center', 
          position: 'relative',
          minHeight: { xs: '56px', sm: '64px' },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Left menu items */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 4,
            position: 'absolute',
            left: { md: 40, lg: 60 },
          }}>
            {menuItemsLeft.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'black',
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
                    backgroundColor: 'black',
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

          {/* Center logo */}
          <Typography
            variant="h4"
            component={Link}
            href="/"
            sx={{ 
              fontFamily: 'var(--font-oooh-baby), cursive',
              fontWeight: 400,
              color: 'black',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Club Semilla
          </Typography>

          {/* Right menu items */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 4,
            alignItems: 'center',
            position: 'absolute',
            right: { md: 40, lg: 60 },
          }}>
            {menuItemsRight.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'black',
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
                    backgroundColor: 'black',
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
            <Button
              component={Link}
              href="/envia-material"
              variant="outlined"
              sx={{
                borderColor: 'black',
                color: 'black',
                padding: '8px 20px',
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
              }}
            >
              Envía material
            </Button>
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
              color: 'black',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'black',
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}


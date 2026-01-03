'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '@/components/admin/AdminLayout';
import { usePropuestas, PropuestaItem } from '@/hooks/usePropuestas';
import { useDeletePropuesta } from '@/hooks/useDeletePropuesta';

export default function AdminPropuestasPage() {
  const { data, isLoading, error } = usePropuestas();
  const { mutate: deletePropuesta, isPending: isDeleting } = useDeletePropuesta();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propuestaToDelete, setPropuestaToDelete] = useState<PropuestaItem | null>(null);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDeleteClick = (propuesta: PropuestaItem) => {
    setPropuestaToDelete(propuesta);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (propuestaToDelete) {
      deletePropuesta(propuestaToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPropuestaToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPropuestaToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            fontFamily: 'var(--font-sora), sans-serif',
            color: 'black',
            letterSpacing: '1px',
            marginBottom: { xs: '24px', md: '32px' },
          }}
        >
          Propuestas
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">
              Error al cargar las propuestas. Por favor, intenta nuevamente.
            </Typography>
          </Box>
        )}

        {data && data.propuestas && data.propuestas.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                color: '#666',
                fontFamily: 'var(--font-sora), sans-serif',
              }}
            >
              No hay propuestas recibidas aún.
            </Typography>
          </Box>
        )}

        {data && data.propuestas && data.propuestas.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.propuestas.map((propuesta: PropuestaItem) => (
              <Accordion
                key={propuesta.id}
                expanded={expanded === propuesta.id}
                onChange={handleAccordionChange(propuesta.id)}
                sx={{
                  borderRadius: 0,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'black',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'var(--font-sora), sans-serif',
                          color: 'black',
                          mb: 0.5,
                        }}
                      >
                        {propuesta.nombre} {propuesta.apellido}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#666',
                          fontFamily: 'var(--font-sora), sans-serif',
                          mb: 0.5,
                        }}
                      >
                        {propuesta.email}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: '#999',
                          fontFamily: 'var(--font-sora), sans-serif',
                        }}
                      >
                        Recibida: {formatDate(propuesta.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Información del contacto */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sora), sans-serif',
                        color: '#333',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 2,
                      }}
                    >
                      Información de Contacto
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                          Nombre:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          {propuesta.nombre}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                          Apellido:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          {propuesta.apellido}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                          Email:
                        </Typography>
                        <MuiLink
                          href={`mailto:${propuesta.email}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {propuesta.email}
                        </MuiLink>
                      </Box>
                    </Box>
                  </Box>

                  {/* Mensaje */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sora), sans-serif',
                        color: '#333',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 2,
                      }}
                    >
                      Mensaje
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'var(--font-sora), sans-serif',
                          color: '#333',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {propuesta.mensaje}
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Botón de acción */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(propuesta)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 0,
                      }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la propuesta de {propuestaToDelete?.nombre} {propuestaToDelete?.apellido}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ textTransform: 'none' }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}


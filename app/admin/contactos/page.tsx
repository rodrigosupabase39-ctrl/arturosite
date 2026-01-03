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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '@/components/admin/AdminLayout';
import { useContactos, ContactoItem } from '@/hooks/useContactos';
import { useDeleteContacto } from '@/hooks/useDeleteContacto';

export default function AdminContactosPage() {
  const { data, isLoading, error } = useContactos();
  const { mutate: deleteContacto, isPending: isDeleting } = useDeleteContacto();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactoToDelete, setContactoToDelete] = useState<ContactoItem | null>(null);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDeleteClick = (contacto: ContactoItem) => {
    setContactoToDelete(contacto);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contactoToDelete) {
      deleteContacto(contactoToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setContactoToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setContactoToDelete(null);
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
          Contactos
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress 
              sx={{
                color: '#ff4444',
              }}
            />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">
              Error al cargar los contactos. Por favor, intenta nuevamente.
            </Typography>
          </Box>
        )}

        {data && data.contactos && data.contactos.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No hay contactos registrados aún.
            </Typography>
          </Box>
        )}

        {data && data.contactos && data.contactos.length > 0 && (
          <Box>
            {data.contactos.map((contacto) => (
              <Accordion
                key={contacto.id}
                expanded={expanded === contacto.id}
                onChange={handleAccordionChange(contacto.id)}
                sx={{
                  mb: 2,
                  borderRadius: 0,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: expanded === contacto.id ? '#f5f5f5' : 'white',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {contacto.nombre} {contacto.apellido}
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#666', mt: 0.5 }}>
                        {contacto.email} • {formatDate(contacto.created_at)}
                      </Typography>
                    </Box>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(contacto);
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#d32f2f',
                        fontSize: '0.85rem',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        userSelect: 'none',
                        opacity: isDeleting ? 0.6 : 1,
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '1rem' }} />
                      <Typography component="span" sx={{ fontSize: '0.85rem' }}>
                        Eliminar
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 2 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#666',
                        mb: 0.5,
                      }}
                    >
                      Mensaje:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '0.95rem',
                        color: 'black',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {contacto.mensaje}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-sora), sans-serif', fontWeight: 600 }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el contacto de {contactoToDelete?.nombre} {contactoToDelete?.apellido}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelDelete}
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
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="outlined"
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              borderRadius: 0,
              borderWidth: '1px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
              },
              '&:disabled': {
                borderColor: '#ccc',
                color: '#ccc',
              },
            }}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}


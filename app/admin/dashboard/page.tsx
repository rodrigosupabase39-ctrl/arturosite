'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Grid, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTalentosStats } from '@/hooks/useTalentosStats';
import { useTalentosList, TalentoItem } from '@/hooks/useTalentosList';
import { useDeleteTalento } from '@/hooks/useDeleteTalento';
import { useReorderTalentos } from '@/hooks/useReorderTalentos';

type TipoTalento = 'actores' | 'actrices' | 'talentos-sub-18' | null;

const tipoLabels: Record<'actores' | 'actrices' | 'talentos-sub-18', string> = {
  actores: 'Actores registrados',
  actrices: 'Actrices registradas',
  'talentos-sub-18': 'Talentos Sub 18 registrados',
};

// Componente para cada item sortable
function SortableTalentoItem({
  talento,
  onEdit,
  onDelete,
}: {
  talento: TalentoItem;
  onEdit: (id: string) => void;
  onDelete: (talento: TalentoItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(talento.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
        sx={{
          p: 1.5,
          borderRadius: 0,
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fafafa',
            borderColor: 'black',
          },
        }}
    >
      {/* Icono de arrastre */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          color: '#999',
          '&:hover': {
            color: '#333',
          },
        }}
      >
        <DragIndicatorIcon />
      </Box>

      {/* Imagen pequeña */}
      {(() => {
        const imagenUrl = talento.imagen_principal_url || 
                         (talento.imagenes_urls && talento.imagenes_urls.length > 0 ? talento.imagenes_urls[0] : null);
        
        return imagenUrl ? (
          <Box
            component="img"
            src={imagenUrl}
            alt={talento.nombre}
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              backgroundColor: '#e0e0e0',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#999',
                textTransform: 'uppercase',
              }}
            >
              Sin img
            </Typography>
          </Box>
        );
      })()}
      
      {/* Nombre */}
      <Typography
        sx={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'black',
          fontFamily: 'var(--font-sora), sans-serif',
          flexGrow: 1,
        }}
      >
        {talento.nombre}
      </Typography>
      
      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => onEdit(String(talento.id))}
          size="small"
          sx={{
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => onDelete(talento)}
          size="small"
          sx={{
            color: '#d32f2f',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoTalento>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [talentoToDelete, setTalentoToDelete] = useState<{ id: string; nombre: string } | null>(null);
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useTalentosStats();
  const { data: listData, isLoading: isLoadingList } = useTalentosList(tipoSeleccionado);
  const { mutate: deleteTalento, isPending: isDeleting } = useDeleteTalento(tipoSeleccionado || 'actores');
  const { mutate: reorderTalentos } = useReorderTalentos();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCardClick = (tipo: 'actores' | 'actrices' | 'talentos-sub-18') => {
    // Si ya está seleccionado, deseleccionarlo (cerrar la lista)
    if (tipoSeleccionado === tipo) {
      setTipoSeleccionado(null);
    } else {
      setTipoSeleccionado(tipo);
    }
  };

  const handleEditClick = (talentoId: string) => {
    if (tipoSeleccionado) {
      router.push(`/admin/alta?tipo=${tipoSeleccionado}&id=${talentoId}`);
    }
  };

  const handleDeleteClick = (talento: TalentoItem) => {
    setTalentoToDelete({ id: String(talento.id), nombre: talento.nombre });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (talentoToDelete && tipoSeleccionado) {
      deleteTalento(
        { id: talentoToDelete.id },
        {
          onSuccess: () => {
            toast.success('Talento eliminado exitosamente');
            setDeleteDialogOpen(false);
            setTalentoToDelete(null);
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar el talento');
          },
        }
      );
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTalentoToDelete(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !listData?.talentos || !tipoSeleccionado) return;

    const oldIndex = listData.talentos.findIndex((t) => String(t.id) === active.id);
    const newIndex = listData.talentos.findIndex((t) => String(t.id) === over.id);

    if (oldIndex !== newIndex) {
      const reorderedItems = arrayMove(listData.talentos, oldIndex, newIndex);
      
      // Actualizar el orden en la base de datos
      const itemsToUpdate = reorderedItems.map((item, index) => ({
        id: String(item.id),
        orden: index,
      }));

      reorderTalentos({
        tipo: tipoSeleccionado,
        items: itemsToUpdate,
      });
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            fontFamily: 'var(--font-sora), sans-serif',
            color: 'black',
            letterSpacing: '1px',
            marginBottom: { xs: '20px', md: '24px' },
          }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={2}>
          {/* Actores */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              onClick={() => handleCardClick('actores')}
              sx={{
                p: 2,
                borderRadius: 0,
                border: tipoSeleccionado === 'actores' ? '2px solid black' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  borderColor: 'black',
                },
                backgroundColor: tipoSeleccionado === 'actores' ? '#f5f5f5' : 'white',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'black',
                  marginBottom: 0.5,
                }}
              >
                {isLoadingStats ? <CircularProgress size={20} /> : stats?.actores ?? 0}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  color: '#666',
                  letterSpacing: '0.5px',
                }}
              >
                {tipoLabels.actores}
              </Typography>
            </Paper>
          </Grid>

          {/* Actrices */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              onClick={() => handleCardClick('actrices')}
              sx={{
                p: 2,
                borderRadius: 0,
                border: tipoSeleccionado === 'actrices' ? '2px solid black' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  borderColor: 'black',
                },
                backgroundColor: tipoSeleccionado === 'actrices' ? '#f5f5f5' : 'white',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'black',
                  marginBottom: 0.5,
                }}
              >
                {isLoadingStats ? <CircularProgress size={20} /> : stats?.actrices ?? 0}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  color: '#666',
                  letterSpacing: '0.5px',
                }}
              >
                {tipoLabels.actrices}
              </Typography>
            </Paper>
          </Grid>

          {/* Talentos Sub 18 */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              onClick={() => handleCardClick('talentos-sub-18')}
              sx={{
                p: 2,
                borderRadius: 0,
                border: tipoSeleccionado === 'talentos-sub-18' ? '2px solid black' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  borderColor: 'black',
                },
                backgroundColor: tipoSeleccionado === 'talentos-sub-18' ? '#f5f5f5' : 'white',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'black',
                  marginBottom: 0.5,
                }}
              >
                {isLoadingStats ? <CircularProgress size={20} /> : stats?.talentosSub18 ?? 0}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  color: '#666',
                  letterSpacing: '0.5px',
                }}
              >
                {tipoLabels['talentos-sub-18']}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Lista de talentos cuando se selecciona una categoría */}
        {tipoSeleccionado && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
                letterSpacing: '0.5px',
                marginBottom: 2,
              }}
            >
              {tipoLabels[tipoSeleccionado]}
            </Typography>

            {isLoadingList ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : listData?.talentos && listData.talentos.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={listData.talentos.map((t) => String(t.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {listData.talentos.map((talento: TalentoItem) => (
                      <SortableTalentoItem
                        key={talento.id}
                        talento={talento}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </Box>
                </SortableContext>
              </DndContext>
            ) : (
              <Box
                sx={{
                  py: 4,
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
                  No hay {tipoLabels[tipoSeleccionado].toLowerCase()} registrados aún.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {!tipoSeleccionado && (
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', md: '1rem' },
                fontWeight: 300,
                letterSpacing: '0.3px',
                lineHeight: 1.6,
                color: 'black',
              }}
            >
              Bienvenido al panel de administración. Aquí podrás gestionar el contenido del sitio,
              agregar actores y actrices. Haz clic en una categoría para ver la lista de talentos.
            </Typography>
          </Box>
        )}

        {/* Dialog de confirmación para eliminar */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontFamily: 'var(--font-sora), sans-serif',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            Confirmar eliminación
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: 'var(--font-sora), sans-serif',
                fontSize: '0.95rem',
              }}
            >
              ¿Estás seguro de que deseas eliminar a <strong>{talentoToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCancelDelete}
              sx={{
                color: 'black',
                borderColor: 'black',
                '&:hover': {
                  borderColor: 'black',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              variant="outlined"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                color: 'white',
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#c62828',
                },
              }}
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={20} /> : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}


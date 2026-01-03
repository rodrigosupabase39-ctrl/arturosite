'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Input,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
import { useSliderImagenes, SliderImagen } from '@/hooks/useSliderImagenes';
import { useCreateSliderImagen } from '@/hooks/useCreateSliderImagen';
import { useDeleteSliderImagen } from '@/hooks/useDeleteSliderImagen';
import { useReorderSliderImagenes } from '@/hooks/useReorderSliderImagenes';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

// Componente para cada item sortable
function SortableSliderItem({
  imagen,
  onDelete,
}: {
  imagen: SliderImagen;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: imagen.id });

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
        p: 2,
        borderRadius: 0,
        border: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.3s ease',
        mb: 2,
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

      {/* Imagen preview */}
      <Box
        sx={{
          width: 120,
          height: 80,
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imagen.imagen_url ? (
            <img
              src={imagen.imagen_url}
              alt="Slider image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
        ) : (
          <ImageIcon sx={{ fontSize: 40, color: '#999' }} />
        )}
      </Box>

      {/* Información */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#666',
            fontSize: '0.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            mb: 0.5,
          }}
        >
          {imagen.imagen_url.split('/').pop() || imagen.imagen_url}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#999',
            fontSize: '0.7rem',
            display: 'block',
            mt: 0.5,
          }}
        >
          Orden: {imagen.orden + 1}
        </Typography>
      </Box>

      {/* Botón eliminar */}
      <IconButton
        onClick={() => onDelete(imagen.id)}
        sx={{
          color: '#d32f2f',
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
}

export default function SliderAdminPage() {
  const { data, isLoading, error } = useSliderImagenes();
  const createImagen = useCreateSliderImagen();
  const deleteImagen = useDeleteSliderImagen();
  const reorderImagenes = useReorderSliderImagenes();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generar preview cuando se selecciona un archivo
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const isValidType = allowedTypes.includes(file.type.toLowerCase());
      
      if (!isValidType && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        toast.error('Por favor, selecciona una imagen válida (JPG, PNG, WEBP o GIF)');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona una imagen');
      return;
    }

    try {
      setIsUploading(true);

      // Comprimir imagen
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      let fileToUpload = selectedFile;
      if (selectedFile.size > 500 * 1024) {
        fileToUpload = await imageCompression(selectedFile, options);
        const compressedFileWithType = new File(
          [fileToUpload],
          fileToUpload.name,
          { type: 'image/jpeg' }
        );
        fileToUpload = compressedFileWithType;
      }

      // Usar el hook para crear la imagen (esto invalidará la query automáticamente)
      createImagen.mutate(
        { imagen: fileToUpload },
        {
          onSuccess: () => {
            // Limpiar formulario solo después de éxito
            setSelectedFile(null);
            setPreviewUrl(null);
            
            // Limpiar input file
            const fileInput = document.getElementById('slider-image-upload') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          },
          onError: (error: Error) => {
            // El error ya se maneja en el hook con toast
            console.error('Error al subir imagen:', error);
          },
          onSettled: () => {
            setIsUploading(false);
          },
        }
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar imagen';
      toast.error(errorMessage);
      setIsUploading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && data?.imagenes) {
      const oldIndex = data.imagenes.findIndex((img) => img.id === active.id);
      const newIndex = data.imagenes.findIndex((img) => img.id === over.id);

      const newOrder = arrayMove(data.imagenes, oldIndex, newIndex);
      const ids = newOrder.map((img) => img.id);

      reorderImagenes.mutate({ ids });
    }
  };

  const handleDelete = () => {
    if (deleteDialog) {
      deleteImagen.mutate(deleteDialog, {
        onSuccess: () => {
          setDeleteDialog(null);
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 1,
              fontFamily: 'var(--font-sora), sans-serif',
            }}
          >
            Gestionar Slider
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.95rem',
            }}
          >
            Agrega, elimina y reordena las imágenes del slider principal de la home.
          </Typography>
        </Box>

        {/* Sección para subir nueva imagen */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 0,
            border: '1px solid #e0e0e0',
            backgroundColor: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontFamily: 'var(--font-sora), sans-serif',
            }}
          >
            Agregar Nueva Imagen
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Input de archivo */}
            <Box>
              <Input
                id="slider-image-upload"
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={handleFileSelect}
                sx={{ display: 'none' }}
              />
              <label htmlFor="slider-image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
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
                  Seleccionar Imagen
                </Button>
              </label>
              {selectedFile && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    color: '#666',
                    fontSize: '0.85rem',
                  }}
                >
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>

            {/* Preview de imagen */}
            {previewUrl && (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 250,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #e0e0e0',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}

            {/* Botón subir */}
            <Box>
              <Button
                variant="contained"
                startIcon={isUploading || createImagen.isPending ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || createImagen.isPending}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 0,
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#ccc',
                    color: '#999',
                  },
                }}
              >
                {isUploading || createImagen.isPending ? 'Subiendo...' : 'Agregar Imagen'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Lista de imágenes */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontFamily: 'var(--font-sora), sans-serif',
            }}
          >
            Imágenes del Slider
          </Typography>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">
              Error al cargar las imágenes del slider. Por favor, intenta nuevamente.
            </Typography>
          </Box>
        )}

        {data && data.imagenes && data.imagenes.length === 0 && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px dashed #e0e0e0',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No hay imágenes en el slider. Agrega la primera imagen para comenzar.
            </Typography>
          </Paper>
        )}

        {data && data.imagenes && data.imagenes.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.imagenes.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.imagenes.map((imagen) => (
                <SortableSliderItem
                  key={imagen.id}
                  imagen={imagen}
                  onDelete={(id) => setDeleteDialog(id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Box>

      {/* Dialog de confirmación para eliminar */}
      {deleteDialog && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
          onClick={() => setDeleteDialog(null)}
        >
          <Paper
            sx={{
              p: 3,
              maxWidth: 400,
              borderRadius: 0,
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontFamily: 'var(--font-sora), sans-serif',
              }}
            >
              Confirmar Eliminación
            </Typography>
            <Typography sx={{ mb: 3 }}>
              ¿Estás seguro de que deseas eliminar esta imagen del slider? Esta acción no se puede deshacer.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setDeleteDialog(null)}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  borderRadius: 0,
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                disabled={deleteImagen.isPending}
                sx={{
                  textTransform: 'none',
                  borderRadius: 0,
                  padding: '8px 24px',
                }}
              >
                {deleteImagen.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Eliminar'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </AdminLayout>
  );
}

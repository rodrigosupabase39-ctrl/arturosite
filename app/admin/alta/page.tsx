'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
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
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import AdminLayout from '@/components/admin/AdminLayout';
import { altaTalentoSchema, AltaTalentoFormData, BloqueTalento } from '@/schemas/altaTalentoSchema';
import { useAltaTalento } from '@/hooks/useAltaTalento';
import { useTalento } from '@/hooks/useTalento';
import { useUpdateTalento } from '@/hooks/useUpdateTalento';
import { exportBloquesToPDF, exportBloquesToExcel } from '@/lib/utils/exportBloques';

const tipoTalentoOptions = [
  { value: 'actores', label: 'Actores' },
  { value: 'actrices', label: 'Actrices' },
  { value: 'talentos-sub-18', label: 'Talentos Sub 18' },
];

const tipoBloqueOptions = [
  { value: 'television', label: 'Televisión' },
  { value: 'teatro', label: 'Teatro' },
  { value: 'cine', label: 'Cine' },
  { value: 'publicidades', label: 'Publicidades' },
  { value: 'formacion', label: 'Formación' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'premios', label: 'PREMIOS / DISTINCIONES / MENCIONES' },
  { value: 'idiomas', label: 'Idiomas' },
  { value: 'web-oficial', label: 'Web oficial' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'experiencia', label: 'Experiencia' },
];

// Componente para bloques ordenables (drag and drop)
function SortableBloqueItem({ 
  field, 
  index, 
  bloque, 
  tipoLabel, 
  onRemove,
  onEdit,
  watch 
}: { 
  field: { id: string };
  index: number;
  bloque: any;
  tipoLabel: string;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  watch: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 1.5, sm: 2 },
          borderRadius: 0,
          border: '1px solid #e0e0e0',
          backgroundColor: 'white',
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Icono de drag */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'grab',
            color: '#999',
            '&:hover': {
              color: 'black',
            },
            '&:active': {
              cursor: 'grabbing',
            },
            mt: { xs: 0, md: 1 },
            flexShrink: 0,
          }}
        >
          <DragHandleIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            minWidth: 0,
          }}
        >
          <Box sx={{ flex: { xs: '1', md: '0 0 30%' }, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 600,
                color: '#666',
                mb: { xs: 0.25, sm: 0.5 },
              }}
            >
              Tipo:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                fontWeight: 500,
                color: 'black',
                wordBreak: 'break-word',
              }}
            >
              {tipoLabel}
            </Typography>
          </Box>

          <Box sx={{ flex: { xs: '1', md: '1' }, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 600,
                color: '#666',
                mb: { xs: 0.25, sm: 0.5 },
              }}
            >
              Contenido:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                color: 'black',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {bloque?.contenido || 'Sin contenido'}
            </Typography>
          </Box>

          <Box sx={{ 
            flex: { xs: '0 0 auto', md: '0 0 auto' }, 
            display: 'flex', 
            alignItems: { xs: 'flex-end', md: 'flex-start' }, 
            gap: { xs: 0.5, sm: 1 }, 
            pt: { xs: 0, md: 1 },
            alignSelf: { xs: 'flex-end', md: 'auto' },
          }}>
            <IconButton
              type="button"
              onClick={() => onEdit(index)}
              size="small"
              sx={{
                color: '#1976d2',
                padding: { xs: '6px', sm: '8px' },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <EditIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
            </IconButton>
            <IconButton
              type="button"
              onClick={() => onRemove(index)}
              size="small"
              sx={{
                color: '#d32f2f',
                padding: { xs: '6px', sm: '8px' },
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

// Componente para mostrar preview de imágenes
// Componente para mostrar imágenes existentes (URLs)
function ExistingImagePreview({ 
  imageUrl, 
  index, 
  isPrincipal,
  isPortada,
  onSetPrincipal,
  onSetPortada,
  onRemove
}: { 
  imageUrl: string; 
  index: number;
  isPrincipal: boolean;
  isPortada: boolean;
  onSetPrincipal: (index: number) => void;
  onSetPortada: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 16px)' },
      }}
    >
      <Paper
        sx={{
          p: 1,
          borderRadius: 0,
          border: isPrincipal ? '2px solid #1976d2' : '1px solid #e0e0e0',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Badge de imagen principal */}
        {isPrincipal && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 0,
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              zIndex: 3,
              textTransform: 'uppercase',
            }}
          >
            Principal
          </Box>
        )}

        {/* Botón para eliminar imagen */}
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(211, 47, 47, 0.9)',
            color: 'white',
            zIndex: 3,
            width: '28px',
            height: '28px',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 1)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        {/* Imagen */}
        <Box
          component="img"
          src={imageUrl}
          alt={`Imagen ${index + 1}`}
          sx={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
            cursor: 'pointer',
          }}
          onClick={() => onSetPrincipal(index)}
        />

        {/* Botones para establecer como principal o portada */}
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            gap: 1,
            flexDirection: 'column',
          }}
        >
          {!isPrincipal && (
            <Button
              size="small"
              onClick={() => onSetPrincipal(index)}
              sx={{
                fontSize: '0.75rem',
                textTransform: 'none',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Establecer como principal
            </Button>
          )}
          <Button
            size="small"
            onClick={() => onSetPortada(index)}
            variant={isPortada ? 'contained' : 'outlined'}
            sx={{
              fontSize: '0.75rem',
              textTransform: 'none',
              color: isPortada ? 'white' : '#d32f2f',
              borderColor: '#d32f2f',
              backgroundColor: isPortada ? '#d32f2f' : 'transparent',
              '&:hover': {
                backgroundColor: isPortada ? '#b71c1c' : 'rgba(211, 47, 47, 0.04)',
                borderColor: '#d32f2f',
              },
            }}
          >
            {isPortada ? 'Quitar portada' : 'Establecer como portada'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function ImagePreview({ 
  file, 
  index, 
  isPrincipal,
  isPortada,
  onSetPrincipal,
  onSetPortada,
  onRemove
}: { 
  file: File; 
  index: number;
  isPrincipal: boolean;
  isPortada: boolean;
  onSetPrincipal: (index: number) => void;
  onSetPortada: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Limpiar URL cuando el componente se desmonte o el archivo cambie
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 16px)' },
      }}
    >
      <Paper
        sx={{
          p: 1,
          borderRadius: 0,
          border: isPrincipal ? '2px solid #1976d2' : '1px solid #e0e0e0',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Badge de imagen principal */}
        {isPrincipal && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 0,
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              zIndex: 3,
              textTransform: 'uppercase',
            }}
          >
            Principal
          </Box>
        )}

        {/* Badge de imagen de portada */}
        {isPortada && (
          <Box
            sx={{
              position: 'absolute',
              top: isPrincipal ? 40 : 8,
              right: 8,
              backgroundColor: '#d32f2f',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 0,
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              zIndex: 3,
              textTransform: 'uppercase',
            }}
          >
            Portada
          </Box>
        )}

        {/* Botón para eliminar imagen */}
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(211, 47, 47, 0.9)',
            color: 'white',
            zIndex: 3,
            width: '28px',
            height: '28px',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 1)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: '16px' }} />
        </IconButton>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '75%', // Aspect ratio 4:3
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={file.name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#666',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={file.name}
            >
              {file.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#999',
                fontSize: '0.7rem',
              }}
            >
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
            {!isPrincipal && (
              <Button
                size="small"
                onClick={() => onSetPrincipal(index)}
                sx={{
                  minWidth: 'auto',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: '#1976d2',
                  borderColor: '#1976d2',
                  borderRadius: 0,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderColor: '#1976d2',
                  },
                }}
                variant="outlined"
              >
                Principal
              </Button>
            )}
            <Button
              size="small"
              onClick={() => onSetPortada(index)}
              variant={isPortada ? 'contained' : 'outlined'}
              sx={{
                minWidth: 'auto',
                padding: '4px 8px',
                fontSize: '0.7rem',
                textTransform: 'none',
                color: isPortada ? 'white' : '#d32f2f',
                borderColor: '#d32f2f',
                backgroundColor: isPortada ? '#d32f2f' : 'transparent',
                borderRadius: 0,
                borderWidth: '1px',
                borderStyle: 'solid',
                '&:hover': {
                  backgroundColor: isPortada ? '#b71c1c' : 'rgba(211, 47, 47, 0.04)',
                  borderColor: '#d32f2f',
                },
              }}
            >
              {isPortada ? 'Sin portada' : 'Portada'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function AdminAltaPageContent() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs de imágenes existentes
  const router = useRouter();
  const searchParams = useSearchParams();
  const talentoId = searchParams.get('id');
  const tipoFromUrl = searchParams.get('tipo') as 'actores' | 'actrices' | 'talentos-sub-18' | null;
  
  const isEditMode = !!talentoId && !!tipoFromUrl;
  const { mutate: saveTalento, isPending: isSubmitting } = useAltaTalento();
  const { mutate: updateTalento, isPending: isUpdating } = useUpdateTalento(
    tipoFromUrl || 'actores',
    talentoId || ''
  );
  
  // Cargar datos del talento si estamos en modo edición
  const { data: talentoData, isLoading: isLoadingTalento } = useTalento(tipoFromUrl, talentoId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<AltaTalentoFormData>({
    resolver: zodResolver(altaTalentoSchema) as any,
    defaultValues: {
      tipo: tipoFromUrl || 'actores' as const,
      nombre: '',
      imagenes: [],
      videoUrl: '',
      bloques: [],
      imagenPrincipal: 0, // Primera imagen por defecto
      imagenPortada: undefined, // Imagen de portada (opcional)
    },
  });

  // Cargar datos del talento cuando esté disponible (modo edición)
  useEffect(() => {
    if (isEditMode && talentoData) {
      setValue('tipo', tipoFromUrl || 'actores');
      setValue('nombre', talentoData.nombre || '');
      setValue('videoUrl', talentoData.video_url || '');
      // Cargar bloques con el tipo correcto
      const bloquesCargados = (talentoData.bloques || []).map((bloque: any) => ({
        tipo: bloque.tipo as BloqueTalento['tipo'],
        contenido: bloque.contenido,
        order: bloque.order ?? 0,
      }));
      setValue('bloques', bloquesCargados);
      
      // Cargar imágenes existentes (URLs)
      const imagenesUrls = (talentoData.imagenes_urls as string[]) || [];
      setExistingImages(imagenesUrls);
      setValue('imagenPrincipal', talentoData.imagen_principal_index || 0);
      
      // Cargar imagen de portada si existe
      if ((talentoData as any).imagen_portada_url) {
        // Buscar el índice de la imagen de portada en el array de imágenes
        const portadaIndex = imagenesUrls.findIndex(url => url === (talentoData as any).imagen_portada_url);
        if (portadaIndex !== -1) {
          setValue('imagenPortada', portadaIndex);
        }
      }
    }
  }, [talentoData, isEditMode, tipoFromUrl, setValue]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'bloques',
  });

  // Estado para controlar si se muestra el formulario de agregar bloque
  const [mostrarFormularioBloque, setMostrarFormularioBloque] = useState(false);

  // Estado para saber qué bloque se está editando (null si no se está editando ninguno, o el índice)
  const [bloqueEditando, setBloqueEditando] = useState<number | null>(null);

  // Estado para el bloque temporal que se está creando o editando
  const [bloqueTemporal, setBloqueTemporal] = useState<{ 
    tipo: 'television' | 'teatro' | 'cine' | 'publicidades' | 'formacion' | 'instagram' | 'premios' | 'idiomas' | 'web-oficial' | 'facebook' | 'experiencia';
    contenido: string;
  }>({
    tipo: 'television',
    contenido: '',
  });

  const imagenes = watch('imagenes') || [];
  const imagenPrincipal = watch('imagenPrincipal') || 0;
  const imagenPortada = watch('imagenPortada');

  // Función para eliminar una imagen
  const handleRemoveImagen = (indexToRemove: number) => {
    const currentImagenes = imagenes || [];
    const newImagenes = currentImagenes.filter((_: File, index: number) => index !== indexToRemove);
    setValue('imagenes', newImagenes);
    
    // Si se elimina la imagen principal, establecer la primera como principal
    if (imagenPrincipal === indexToRemove && newImagenes.length > 0) {
      setValue('imagenPrincipal', 0);
    } else if (imagenPrincipal > indexToRemove && newImagenes.length > 0) {
      // Ajustar el índice de la imagen principal si estaba después de la eliminada
      setValue('imagenPrincipal', imagenPrincipal - 1);
    } else if (newImagenes.length === 0) {
      // Si no quedan imágenes, resetear el índice principal
      setValue('imagenPrincipal', 0);
    }
    
    toast.success('Imagen eliminada');
  };

  // Función para comprimir imágenes
  const compressImages = async (files: File[]): Promise<File[]> => {
    const options = {
      maxSizeMB: 1, // Tamaño máximo: 1MB
      maxWidthOrHeight: 1920, // Resolución máxima: 1920px
      useWebWorker: true, // Usar Web Worker para mejor rendimiento
      fileType: 'image/jpeg', // Convertir a JPEG para mejor compresión
    };

    try {
      setIsCompressing(true);
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            // Solo comprimir si es imagen y pesa más de 500KB
            if (file.size > 500 * 1024 && (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))) {
              const compressedFile = await imageCompression(file, options);
              
              // Asegurar que el archivo comprimido tenga el tipo MIME correcto
              const compressedFileWithType = new File(
                [compressedFile],
                compressedFile.name,
                { type: 'image/jpeg' }
              );
              
              console.log(
                `Imagen comprimida: ${file.name} - ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
              );
              return compressedFileWithType;
            }
            
            // Si no se comprime, asegurar que tenga tipo MIME
            if (!file.type && /\.(jpg|jpeg)$/i.test(file.name)) {
              return new File([file], file.name, { type: 'image/jpeg' });
            }
            if (!file.type && /\.png$/i.test(file.name)) {
              return new File([file], file.name, { type: 'image/png' });
            }
            
            return file;
          } catch (error) {
            console.error(`Error al comprimir ${file.name}:`, error);
            // Si falla la compresión, devolver el archivo original
            return file;
          }
        })
      );
      setIsCompressing(false);
      return compressedFiles;
    } catch (error) {
      console.error('Error al comprimir imágenes:', error);
      setIsCompressing(false);
      toast.error('Error al comprimir imágenes. Se usarán las originales.');
      return files;
    }
  };

  // Función para establecer imagen principal (considerando imágenes existentes y nuevas)
  const handleSetImagenPrincipal = (index: number) => {
    setValue('imagenPrincipal', index);
  };

  // Función para establecer imagen de portada
  const handleSetImagenPortada = (index: number) => {
    if (imagenPortada === index) {
      // Si ya es la portada, deseleccionarla
      setValue('imagenPortada', undefined);
    } else {
      setValue('imagenPortada', index);
    }
  };

  // Función para eliminar una imagen existente (URL)
  const handleRemoveExistingImage = (indexToRemove: number) => {
    const newExistingImages = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(newExistingImages);
    
    const currentPrincipal = imagenPrincipal;
    
    // Si se elimina la imagen principal, ajustar el índice
    if (currentPrincipal === indexToRemove) {
      if (newExistingImages.length > 0) {
        setValue('imagenPrincipal', newExistingImages.length - 1);
      } else if (imagenes.length > 0) {
        setValue('imagenPrincipal', 0);
      }
    } else if (currentPrincipal > indexToRemove && currentPrincipal < existingImages.length) {
      // Si la imagen principal está después de la eliminada, ajustar el índice
      setValue('imagenPrincipal', currentPrincipal - 1);
    } else if (currentPrincipal >= existingImages.length) {
      // Si la imagen principal es una nueva imagen, ajustar restando 1
      setValue('imagenPrincipal', currentPrincipal - 1);
    }
    
    toast.success('Imagen eliminada');
  };

  const handleAddBloque = () => {
    setBloqueEditando(null);
    setBloqueTemporal({
      tipo: 'television',
      contenido: '',
    });
    setMostrarFormularioBloque(true);
  };

  const handleEditBloque = (index: number) => {
    const bloque = watch(`bloques.${index}`);
    if (bloque) {
      setBloqueEditando(index);
      setBloqueTemporal({
        tipo: bloque.tipo,
        contenido: bloque.contenido || '',
      });
      setMostrarFormularioBloque(true);
    }
  };

  const handleCancelarBloque = () => {
    // Limpiar el formulario temporal
    setBloqueTemporal({
      tipo: 'television',
      contenido: '',
    });
    setBloqueEditando(null);
    // Ocultar el formulario y mostrar el botón +
    setMostrarFormularioBloque(false);
  };

  const handleSaveBloque = () => {
    // Validar que el bloque temporal tenga tipo y contenido
    if (!bloqueTemporal.tipo || !bloqueTemporal.contenido.trim()) {
      toast.error('Por favor, completa el tipo y contenido del bloque');
      return;
    }

    if (bloqueEditando !== null) {
      // Modo edición: actualizar el bloque existente
      setValue(`bloques.${bloqueEditando}.tipo`, bloqueTemporal.tipo);
      setValue(`bloques.${bloqueEditando}.contenido`, bloqueTemporal.contenido.trim());
      toast.success('Bloque actualizado. Haz clic en "Actualizar talento" para guardar los cambios.');
    } else {
      // Modo creación: agregar nuevo bloque
      append({
        tipo: bloqueTemporal.tipo,
        contenido: bloqueTemporal.contenido.trim(),
        order: fields.length, // El orden será la posición actual
      });
      toast.success('Bloque agregado. Haz clic en "Guardar" o "Actualizar talento" para guardar los cambios.');
    }

    // Limpiar el formulario temporal
    setBloqueTemporal({
      tipo: 'television',
      contenido: '',
    });
    setBloqueEditando(null);

    // Ocultar el formulario y mostrar el botón +
    setMostrarFormularioBloque(false);
  };

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Función para manejar el drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      // Usar move de useFieldArray para reordenar
      move(oldIndex, newIndex);

      // Actualizar el orden en cada bloque después de mover
      const currentBloques = watch('bloques') || [];
      currentBloques.forEach((bloque: any, index: number) => {
        setValue(`bloques.${index}.order`, index);
      });

      toast.success('Orden actualizado');
    }
  };

  const handleRemoveBloque = (index: number) => {
    remove(index);
    toast.success('Bloque eliminado');
  };

  const onSubmit = (data: AltaTalentoFormData): void => {
    // Si es modo edición, verificar que haya al menos una imagen (existente o nueva)
    if (isEditMode) {
      const hasExistingImages = existingImages.length > 0;
      const hasNewImages = data.imagenes && data.imagenes.length > 0;
      if (!hasExistingImages && !hasNewImages) {
        toast.error('Debes tener al menos una imagen (existente o nueva)');
        return;
      }
    } else {
      // Si es modo creación, requerir al menos una imagen nueva
      if (!data.imagenes || data.imagenes.length === 0) {
        toast.error('Debes subir al menos una imagen');
        return;
      }
    }

    // Actualizar el orden de los bloques antes de enviar
    const bloquesConOrden = (data.bloques || []).map((bloque, index) => ({
      ...bloque,
      order: bloque.order ?? index,
    }));

    // Preparar los datos para enviar
    // Si estamos en modo edición, también necesitamos enviar las imágenes existentes que no se eliminaron
    const dataToSend = {
      ...data,
      imagenes: (data.imagenes || []) as File[], // Nuevas imágenes (Files)
      bloques: bloquesConOrden, // Bloques con orden actualizado
      existingImages: isEditMode ? existingImages : [], // Imágenes existentes que no se eliminaron (solo en modo edición)
    };

    if (isEditMode && talentoId && tipoFromUrl) {
      // Modo edición - usar PUT
      updateTalento(dataToSend as any, {
        onSuccess: () => {
          toast.success('¡Talento actualizado exitosamente!');
          // Redirigir al dashboard después de un breve delay
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1000);
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Error al actualizar el talento');
        },
      });
    } else {
      // Modo creación - usar POST
      saveTalento(dataToSend, {
        onSuccess: () => {
          toast.success('¡Talento agregado exitosamente!');
          reset();
          // Resetear el índice de imagen principal
          setValue('imagenPrincipal', 0);
          // Ocultar formulario de bloque si está visible
          setMostrarFormularioBloque(false);
          // Redirigir al dashboard después de un breve delay
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1000);
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Error al agregar el talento');
        },
      });
    }
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
      '& input::placeholder': {
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
          {isEditMode ? 'Editar Talento' : 'Alta de Talento'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Primera fila: Tipo de Talento y Nombre en dos columnas */}
          <Box 
            sx={{ 
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}
          >
            {/* Tipo de Talento */}
            <Box sx={{ flex: { xs: '1', md: '0 0 40%' } }}>
              <FormControl fullWidth error={!!errors.tipo}>
                <InputLabel 
                  sx={{ 
                    ...textFieldStyle['& .MuiInputLabel-root'],
                    fontSize: '0.95rem',
                  }}
                >
                  Tipo de Talento *
                </InputLabel>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Tipo de Talento *"
                      sx={{
                        ...textFieldStyle['& .MuiOutlinedInput-root'],
                        borderRadius: 0,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.tipo ? 'error.main' : 'black',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.tipo ? 'error.main' : 'black',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.tipo ? 'error.main' : 'black',
                        },
                      }}
                    >
                      {tipoTalentoOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.tipo && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: 'block' }}>
                    {errors.tipo.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Nombre */}
            <Box sx={{ flex: { xs: '1', md: '1' } }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre *"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    sx={textFieldStyle}
                    value={field.value || ''}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Video URL */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="videoUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Link de video (YouTube)"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  error={!!errors.videoUrl}
                  helperText={errors.videoUrl?.message || 'Opcional'}
                  value={field.value || ''}
                  InputProps={{
                    sx: {
                      '& input::placeholder': {
                        color: 'rgba(0, 0, 0, 0.4)',
                        opacity: 1,
                        fontSize: '0.85rem',
                      },
                    },
                  }}
                  sx={textFieldStyle}
                />
              )}
            />
          </Box>

          {/* Imágenes */}
          <Box sx={{ mb: 3 }}>
              <FormControl fullWidth error={!!errors.imagenes}>
                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: errors.imagenes ? 'error.main' : 'black',
                    mb: 1,
                  }}
                >
                  Imágenes *
                </Typography>
                <Controller
                  name="imagenes"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={async (e) => {
                            const newFiles = Array.from(e.target.files || []);
                            if (newFiles.length > 0) {
                              // Validar tipos de archivo antes de agregar
                              const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
                              const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
                              
                              const invalidFiles = newFiles.filter((file: File) => {
                                const fileType = file.type?.toLowerCase() || '';
                                const fileName = file.name.toLowerCase();
                                const isValidType = fileType && allowedTypes.includes(fileType);
                                const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
                                
                                // Si no tiene tipo MIME pero tiene extensión válida, es válido
                                if (!fileType && isValidExtension) {
                                  return false; // Es válido
                                }
                                
                                return !isValidType && !isValidExtension;
                              });

                              if (invalidFiles.length > 0) {
                                const invalidNames = invalidFiles.map((f: File) => f.name).join(', ');
                                console.error('Archivos inválidos:', invalidFiles.map((f: File) => ({ name: f.name, type: f.type })));
                                toast.error(`Algunos archivos no son válidos: ${invalidNames}. Solo se aceptan: PNG, JPG, JPEG, WEBP o GIF`);
                                e.target.value = '';
                                return;
                              }

                              // Combinar las imágenes existentes con las nuevas
                              const existingFiles = value || [];
                              const allFiles = [...existingFiles, ...newFiles];
                              
                              toast.info('Comprimiendo imágenes...');
                              const compressedFiles = await compressImages(allFiles);
                              onChange(compressedFiles);
                              toast.success(`${newFiles.length} imagen(es) agregada(s). Total: ${compressedFiles.length}`);
                              
                              // Limpiar el input para permitir seleccionar más imágenes
                              e.target.value = '';
                            }
                          }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                          disabled={isCompressing}
                        />
                        <Box
                          sx={{
                            width: '100%',
                            minHeight: '56px',
                            border: '1px solid',
                            borderColor: errors.imagenes ? 'error.main' : 'black',
                            borderRadius: 0,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 14px',
                            backgroundColor: 'white',
                            fontSize: '0.85rem',
                            color: (!value || value.length === 0) ? 'rgba(0, 0, 0, 0.4)' : 'black',
                          }}
                        >
                          {value && value.length > 0 ? (
                            <Typography sx={{ fontSize: '0.85rem', color: 'black' }}>
                              {value.length} archivo(s) seleccionado(s)
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0, 0, 0, 0.4)', fontStyle: 'normal' }}>
                              Examinar... No se seleccionaron archivos.
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {/* Mostrar imágenes existentes (modo edición) */}
                      {existingImages.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', color: 'black', mb: 2, fontSize: '0.75rem' }}>
                            Imágenes existentes ({existingImages.length})
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 2,
                            }}
                          >
                            {existingImages.map((imageUrl: string, index: number) => (
                              <ExistingImagePreview 
                                key={`existing-${index}`} 
                                imageUrl={imageUrl} 
                                index={index}
                                isPrincipal={imagenPrincipal === index}
                                isPortada={imagenPortada === index}
                                onSetPrincipal={handleSetImagenPrincipal}
                                onSetPortada={handleSetImagenPortada}
                                onRemove={handleRemoveExistingImage}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {/* Mostrar nuevas imágenes seleccionadas */}
                      {value && value.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', color: 'black', mb: 2, fontSize: '0.75rem' }}>
                            Nuevas imágenes ({value.length})
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 2,
                            }}
                          >
                            {value.map((file: File, index: number) => {
                              // El índice total considera las imágenes existentes
                              const totalIndex = existingImages.length + index;
                              return (
                                <ImagePreview 
                                  key={`${file.name}-${index}`} 
                                  file={file} 
                                  index={totalIndex}
                                  isPrincipal={imagenPrincipal === totalIndex}
                                  isPortada={imagenPortada === totalIndex}
                                  onSetPrincipal={handleSetImagenPrincipal}
                                  onSetPortada={handleSetImagenPortada}
                                  onRemove={handleRemoveImagen}
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                      
                      {(!value || value.length === 0) && existingImages.length === 0 && (
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666', fontStyle: 'italic', fontSize: '0.7rem' }}>
                          No se seleccionaron archivos.
                        </Typography>
                      )}
                    </>
                  )}
                />
                {errors.imagenes && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.imagenes.message as string}
                  </Typography>
                )}
              </FormControl>
          </Box>

          {/* Bloques Dinámicos */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sora), sans-serif',
                  color: 'black',
                  letterSpacing: '0.5px',
                }}
              >
                Bloques de Información
              </Typography>
              {/* Botón + para agregar bloque - solo se muestra cuando NO está el formulario visible */}
              {!mostrarFormularioBloque && (
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddBloque}
                  sx={{
                    borderColor: 'black',
                    color: 'black',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
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
                  Agregar bloque
                </Button>
              )}
            </Box>

            {/* Formulario para agregar nuevo bloque - solo se muestra cuando mostrarFormularioBloque es true */}
            {mostrarFormularioBloque && (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 0,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'black',
                    mb: 2,
                  }}
                >
                  {bloqueEditando !== null ? 'Editar bloque' : 'Agregar nuevo bloque'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'flex-start' },
                  }}
                >
                  <Box sx={{ flex: { xs: '1', md: '0 0 30%' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de bloque *</InputLabel>
                      <Select
                        value={bloqueTemporal.tipo}
                        onChange={(e) => setBloqueTemporal({ ...bloqueTemporal, tipo: e.target.value as any })}
                        label="Tipo de bloque *"
                        sx={{
                          borderRadius: 0,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                        }}
                      >
                        {tipoBloqueOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: { xs: '1', md: '1' } }}>
                    <TextField
                      fullWidth
                      label="Contenido *"
                      multiline
                      rows={3}
                      value={bloqueTemporal.contenido}
                      onChange={(e) => setBloqueTemporal({ ...bloqueTemporal, contenido: e.target.value })}
                      sx={textFieldStyle}
                      placeholder="Escribe el contenido del bloque..."
                    />
                  </Box>

                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 auto' }, 
                      display: 'flex', 
                      gap: 1,
                      flexDirection: { xs: 'row', md: 'row' },
                      alignItems: { xs: 'stretch', md: 'flex-start' },
                      width: { xs: '100%', md: 'auto' },
                      pt: { md: 1 },
                    }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleCancelarBloque}
                      sx={{
                        borderColor: '#666',
                        color: '#666',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        borderRadius: 0,
                        borderWidth: '1px',
                        transition: 'all 0.3s ease',
                        flex: { xs: '1', md: '0 0 auto' },
                        '&:hover': {
                          borderColor: '#333',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          color: '#333',
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleSaveBloque}
                      sx={{
                        borderColor: 'black',
                        color: 'black',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        borderRadius: 0,
                        borderWidth: '1px',
                        transition: 'all 0.3s ease',
                        flex: { xs: '1', md: '0 0 auto' },
                        '&:hover': {
                          borderColor: 'black',
                          backgroundColor: 'black',
                          color: 'white',
                        },
                      }}
                    >
                      Guardar bloque
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Lista de bloques guardados */}
            {fields.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  py: 3,
                }}
              >
                No hay bloques agregados. Completa el formulario de arriba y haz clic en "Guardar bloque".
              </Typography>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'black',
                    }}
                  >
                    Bloques guardados ({fields.length}) - Arrastra para reordenar
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PictureAsPdfIcon sx={{ fontSize: '18px' }} />}
                      onClick={() => {
                        const bloques = fields.map((field, index) => ({
                          tipo: watch(`bloques.${index}.tipo`),
                          contenido: watch(`bloques.${index}.contenido`),
                        }));
                        exportBloquesToPDF(bloques);
                      }}
                      sx={{
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        textTransform: 'none',
                        borderRadius: 0,
                        fontSize: '0.8rem',
                        padding: '6px 12px',
                        '&:hover': {
                          borderColor: '#b71c1c',
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        },
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TableChartIcon sx={{ fontSize: '18px' }} />}
                      onClick={() => {
                        const bloques = fields.map((field, index) => ({
                          tipo: watch(`bloques.${index}.tipo`),
                          contenido: watch(`bloques.${index}.contenido`),
                        }));
                        exportBloquesToExcel(bloques);
                      }}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        textTransform: 'none',
                        borderRadius: 0,
                        fontSize: '0.8rem',
                        padding: '6px 12px',
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      Excel
                    </Button>
                  </Box>
                </Box>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.map((field, index) => {
                      const bloque = watch(`bloques.${index}`);
                      const tipoLabel = tipoBloqueOptions.find(opt => opt.value === bloque?.tipo)?.label || bloque?.tipo || 'Sin tipo';
                      
                      return (
                        <SortableBloqueItem
                          key={field.id}
                          field={field}
                          index={index}
                          bloque={bloque}
                          tipoLabel={tipoLabel}
                          onRemove={handleRemoveBloque}
                          onEdit={handleEditBloque}
                          watch={watch}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </>
            )}
          </Box>

          {/* Botón de envío */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                if (isEditMode) {
                  // En modo edición, cancelar y volver al dashboard
                  router.push('/admin/dashboard');
                } else {
                  // En modo creación, limpiar el formulario
                  reset();
                  setValue('imagenPrincipal', 0);
                  setMostrarFormularioBloque(false);
                  setExistingImages([]);
                }
              }}
              disabled={isSubmitting || isUpdating}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                },
              }}
            >
              {isEditMode ? 'Cancelar' : 'Limpiar'}
            </Button>
            <Button
              type="submit"
              variant="outlined"
              disabled={isSubmitting || isUpdating || isLoadingTalento}
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
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                },
              }}
            >
              {isSubmitting || isUpdating ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                'Actualizar Talento'
              ) : (
                'Guardar Talento'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default function AdminAltaPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    }>
      <AdminAltaPageContent />
    </Suspense>
  );
}

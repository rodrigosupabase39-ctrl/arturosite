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
  Grid,
  Chip,
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
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMaterial, MaterialItem } from '@/hooks/useMaterial';
import { useDeleteMaterial } from '@/hooks/useDeleteMaterial';
import { exportToPDF, exportToExcel } from '@/lib/utils/exportMaterial';
import { toast } from 'sonner';

export default function AdminMaterialPage() {
  const { data, isLoading, error } = useMaterial();
  const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteMaterial();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<MaterialItem | null>(null);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDeleteClick = (material: MaterialItem) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      deleteMaterial(materialToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setMaterialToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
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

  const handleExportPDF = () => {
    if (!data || !data.materiales || data.materiales.length === 0) {
      toast.error('No hay materiales para exportar');
      return;
    }
    try {
      exportToPDF(data.materiales);
      toast.success('PDF exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error('Error al exportar PDF');
    }
  };

  const handleExportExcel = () => {
    if (!data || !data.materiales || data.materiales.length === 0) {
      toast.error('No hay materiales para exportar');
      return;
    }
    try {
      exportToExcel(data.materiales);
      toast.success('Excel exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      toast.error('Error al exportar Excel');
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 700,
              fontFamily: 'var(--font-sora), sans-serif',
              color: 'black',
              letterSpacing: '1px',
            }}
          >
            Material Recibido
          </Typography>
          
          {data && data.materiales && data.materiales.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  textTransform: 'none',
                  borderRadius: 0,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  padding: { xs: '8px 16px', sm: '10px 20px' },
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  },
                }}
              >
                Exportar PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<TableChartIcon />}
                onClick={handleExportExcel}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  borderRadius: 0,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  padding: { xs: '8px 16px', sm: '10px 20px' },
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                Exportar Excel
              </Button>
            </Box>
          )}
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">
              Error al cargar los materiales. Por favor, intenta nuevamente.
            </Typography>
          </Box>
        )}

        {data && data.materiales && data.materiales.length === 0 && (
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
              No hay material recibido aún.
            </Typography>
          </Box>
        )}

        {data && data.materiales && data.materiales.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.materiales.map((material: MaterialItem) => (
              <Accordion
                key={material.id}
                expanded={expanded === material.id}
                onChange={handleAccordionChange(material.id)}
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
                        {material.nombre_completo} {material.apellido}
                        {material.nombre_artistico && ` (${material.nombre_artistico})`}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#666',
                          fontFamily: 'var(--font-sora), sans-serif',
                        }}
                      >
                        {material.email} • {material.whatsapp}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: '#999',
                          fontFamily: 'var(--font-sora), sans-serif',
                          mt: 0.5,
                        }}
                      >
                        Recibido: {formatDate(material.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {material.reel_url && (
                        <Chip
                          label="Reel"
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                      {material.cv_pdf_url && (
                        <Chip
                          label="CV PDF"
                          size="small"
                          sx={{
                            backgroundColor: '#fff3e0',
                            color: '#e65100',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                      {material.imagenes_urls && Array.isArray(material.imagenes_urls) && material.imagenes_urls.length > 0 && (
                        <Chip
                          label={`${material.imagenes_urls.length} Imagen${material.imagenes_urls.length > 1 ? 'es' : ''}`}
                          size="small"
                          sx={{
                            backgroundColor: '#f3e5f5',
                            color: '#7b1fa2',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {/* Información Personal */}
                    <Grid size={{ xs: 12, md: 6 }}>
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
                        Información Personal
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {material.edad && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Edad:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.edad} años
                            </Typography>
                          </Box>
                        )}
                        {material.fecha_nacimiento && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Fecha de Nacimiento:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {new Date(material.fecha_nacimiento).toLocaleDateString('es-AR')}
                            </Typography>
                          </Box>
                        )}
                        {material.nacionalidad && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Nacionalidad:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.nacionalidad}
                            </Typography>
                          </Box>
                        )}
                        {material.residencia_actual && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Residencia Actual:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.residencia_actual}
                            </Typography>
                          </Box>
                        )}
                        {material.nombre_adulto_responsable && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Adulto Responsable:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.nombre_adulto_responsable}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Características Físicas */}
                    <Grid size={{ xs: 12, md: 6 }}>
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
                        Características Físicas
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {material.altura && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Altura:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.altura}
                            </Typography>
                          </Box>
                        )}
                        {material.peso && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Peso:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.peso}
                            </Typography>
                          </Box>
                        )}
                        {material.contextura && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Contextura:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.contextura}
                            </Typography>
                          </Box>
                        )}
                        {material.color_pelo && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Color de Pelo:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.color_pelo}
                            </Typography>
                          </Box>
                        )}
                        {material.color_ojos && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Color de Ojos:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.color_ojos}
                            </Typography>
                          </Box>
                        )}
                        {material.talle_remera && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                              Talle Remera:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333' }}>
                              {material.talle_remera}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Habilidades */}
                    {(material.canta || material.baila || material.idiomas || material.instrumentos || material.deportes || material.otras_habilidades) && (
                      <Grid size={{ xs: 12, md: 6 }}>
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
                          Habilidades
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {material.canta && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Canta:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.canta}
                              </Typography>
                            </Box>
                          )}
                          {material.baila && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Baila:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.baila}
                              </Typography>
                            </Box>
                          )}
                          {material.idiomas && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Idiomas:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.idiomas}
                              </Typography>
                            </Box>
                          )}
                          {material.instrumentos && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Instrumentos:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.instrumentos}
                              </Typography>
                            </Box>
                          )}
                          {material.deportes && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Deportes:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.deportes}
                              </Typography>
                            </Box>
                          )}
                          {material.otras_habilidades && (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                Otras Habilidades:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#333' }}>
                                {material.otras_habilidades}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Material y Links */}
                    <Grid size={{ xs: 12, md: 6 }}>
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
                        Material y Links
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {material.reel_url && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Reel / Video:
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<LaunchIcon />}
                              href={material.reel_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              component="a"
                              sx={{
                                borderColor: 'black',
                                color: 'black',
                                textTransform: 'none',
                                borderRadius: 0,
                                '&:hover': {
                                  borderColor: 'black',
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                              }}
                            >
                              Ver Reel
                            </Button>
                          </Box>
                        )}
                        {material.cv_pdf_url && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              CV PDF:
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              href={material.cv_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              component="a"
                              download
                              sx={{
                                borderColor: 'black',
                                color: 'black',
                                textTransform: 'none',
                                borderRadius: 0,
                                '&:hover': {
                                  borderColor: 'black',
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                              }}
                            >
                              Descargar CV
                            </Button>
                          </Box>
                        )}
                        {material.instagram && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Instagram:
                            </Typography>
                            <MuiLink
                              href={`https://instagram.com/${material.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {material.instagram}
                            </MuiLink>
                          </Box>
                        )}
                        {material.tik_tok && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              TikTok:
                            </Typography>
                            <MuiLink
                              href={`https://tiktok.com/@${material.tik_tok.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {material.tik_tok}
                            </MuiLink>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Imágenes */}
                    {material.imagenes_urls && Array.isArray(material.imagenes_urls) && material.imagenes_urls.length > 0 && (
                      <Grid size={{ xs: 12 }}>
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
                          Imágenes ({material.imagenes_urls.length})
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: 'repeat(2, 1fr)',
                              sm: 'repeat(3, 1fr)',
                              md: 'repeat(4, 1fr)',
                            },
                            gap: 2,
                          }}
                        >
                          {material.imagenes_urls.map((imagenUrl: string, index: number) => (
                            <Box
                              key={index}
                              sx={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '3/4',
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                borderRadius: 0,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                },
                              }}
                              component="a"
                              href={imagenUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={imagenUrl}
                                alt={`Imagen ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Botón Eliminar */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(material)}
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
            ¿Estás seguro de que deseas eliminar el material de {materialToDelete?.nombre_completo} {materialToDelete?.apellido}?
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


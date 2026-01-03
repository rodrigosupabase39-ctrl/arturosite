'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { enviaMaterialSchema, EnviaMaterialFormData } from '@/schemas/enviaMaterialSchema';
import { useEnviaMaterial } from '@/hooks/useEnviaMaterial';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

const steps = [
  'Información Personal',
  'Contacto',
  'Documentación',
  'Características Físicas',
  'Información Médica',
  'Estilo de Vida',
  'Habilidades',
  'Material',
];

export default function EnviaMaterialPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [imagenesFiles, setImagenesFiles] = useState<File[]>([]);
  const { mutate: sendEnviaMaterial, isPending } = useEnviaMaterial();
  const tikTokInputRef = useRef<HTMLInputElement | null>(null);
  const nombreArtisticoInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    watch,
    reset,
    setValue,
  } = useForm<EnviaMaterialFormData>({
    resolver: zodResolver(enviaMaterialSchema),
    mode: 'onChange',
    defaultValues: {
      contextura: '',
      nacionalidad: '',
      residenciaActual: '',
      dni: '',
      colorOjos: '',
      alergias: '',
      alimentacion: '',
      hijos: '',
      acentoNeutro: '',
      deportes: '',
      reelUrl: '',
      cvPdf: '',
      tikTok: '',
      nombreArtistico: '',
    },
  });

  const alimentacionValue = watch('alimentacion');
  const tikTokValue = watch('tikTok');
  const nombreArtisticoValue = watch('nombreArtistico');

  // Limpiar valores incorrectos cuando cambian
  useEffect(() => {
    if (tikTokValue && tikTokValue.toLowerCase().includes('casto')) {
      setValue('tikTok', '');
      if (tikTokInputRef.current) {
        tikTokInputRef.current.value = '';
      }
    }
  }, [tikTokValue, setValue]);

  useEffect(() => {
    if (nombreArtisticoValue && nombreArtisticoValue.toLowerCase().includes('casto') && activeStep === 1) {
      // Solo limpiar si estamos en el paso de contacto (paso 1)
      const tikTokCurrent = watch('tikTok');
      if (tikTokCurrent && tikTokCurrent.includes(nombreArtisticoValue)) {
        setValue('tikTok', '');
        if (tikTokInputRef.current) {
          tikTokInputRef.current.value = '';
        }
      }
    }
  }, [nombreArtisticoValue, activeStep, watch, setValue]);

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data: EnviaMaterialFormData) => {
    // Solo enviar si estamos en el último paso
    if (activeStep !== steps.length - 1) {
      // Si no estamos en el último paso, ir al siguiente
      await handleNext();
      return;
    }

    // Validar el último paso antes de enviar
    const fieldsToValidate = getFieldsForStep(steps.length - 1);
    const isValid = await trigger(fieldsToValidate as any);
    
    if (!isValid) {
      // Si el último paso no es válido, mostrar error
      toast.error('Por favor, completa todos los campos requeridos del último paso.');
      return;
    }
    
    // Preparar datos para enviar, incluyendo el archivo PDF y las imágenes si existen
    const dataToSend = {
      ...data,
      cvPdfFile: cvFile || undefined, // Incluir el archivo si existe
      imagenesFiles: imagenesFiles.length > 0 ? imagenesFiles : undefined, // Incluir las imágenes si existen
    };
    
    sendEnviaMaterial(dataToSend, {
      onSuccess: () => {
        toast.success('¡Formulario enviado exitosamente! Te contactaremos a la brevedad.');
        reset();
        setCvFile(null);
        setImagenesFiles([]);
        setActiveStep(0);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al enviar el formulario. Por favor, intenta nuevamente.');
      },
    });
  };

  const getFieldsForStep = (step: number): (keyof EnviaMaterialFormData)[] => {
    switch (step) {
      case 0:
        return ['nombreCompleto', 'apellido', 'edad', 'fechaNacimiento', 'nombreArtistico', 'nombreAdultoResponsable'];
      case 1:
        return ['email', 'whatsapp', 'tikTok', 'instagram'];
      case 2:
        return ['nacionalidad', 'residenciaActual', 'pasaporte', 'dni', 'licenciaConducir'];
      case 3:
        return ['altura', 'peso', 'contextura', 'colorPelo', 'colorOjos', 'talleRemera', 'pantalon', 'calzado'];
      case 4:
        return ['tatuajes', 'cicatrices', 'alergias'];
      case 5:
        return ['alimentacion', 'alimentacionOtros', 'hijos', 'obraSocial', 'contactoEmergencia'];
      case 6:
        return ['instrumentos', 'canta', 'idiomas', 'acentoNeutro', 'deportes', 'baila', 'otrasHabilidades'];
      case 7:
        return ['reelUrl']; // cvPdf no se valida en el formulario, es opcional
      default:
        return [];
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
      '& textarea::placeholder': {
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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Información Personal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Nombre completo"
              {...register('nombreCompleto')}
              error={!!errors.nombreCompleto}
              helperText={errors.nombreCompleto?.message}
              required
              autoComplete="off"
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              label="Apellido"
              {...register('apellido')}
              error={!!errors.apellido}
              helperText={errors.apellido?.message}
              required
              autoComplete="off"
              sx={textFieldStyle}
            />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Edad"
                {...register('edad')}
                error={!!errors.edad}
                helperText={errors.edad?.message}
                required
                autoComplete="off"
                type="text"
                sx={textFieldStyle}
              />
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                {...register('fechaNacimiento')}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento?.message}
                InputLabelProps={{ shrink: true }}
                required
                sx={textFieldStyle}
              />
            </Box>
            <TextField
              fullWidth
              label="Nombre artístico"
              {...register('nombreArtistico')}
              inputRef={(e) => {
                nombreArtisticoInputRef.current = e;
                register('nombreArtistico').ref(e);
              }}
              autoComplete="off"
              name="artistic-name-stage-name"
              inputProps={{
                autoComplete: 'off',
                'data-lpignore': 'true',
                'data-1p-ignore': 'true',
              }}
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Nombre y apellido de la persona adulta responsable"
              {...register('nombreAdultoResponsable')}
              error={!!errors.nombreAdultoResponsable}
              helperText={errors.nombreAdultoResponsable?.message || 'Solo si sos menor de edad'}
              autoComplete="new-password"
              inputProps={{
                autoComplete: 'new-password',
                'data-lpignore': 'true',
              }}
              sx={textFieldStyle}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Contacto
            </Typography>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              required
              autoComplete="email"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="WhatsApp"
              {...register('whatsapp')}
              error={!!errors.whatsapp}
              helperText={errors.whatsapp?.message}
              required
              autoComplete="tel"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <Box sx={{ marginBottom: 2 }}>
              <Box
                component="label"
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'black',
                  marginBottom: '8px',
                }}
              >
                ¿Tik Tok?
              </Box>
              <input
                key={`tiktok-${activeStep}`}
                type="text"
                {...register('tikTok')}
                ref={(e) => {
                  tikTokInputRef.current = e;
                  register('tikTok').ref(e);
                }}
                autoComplete="off"
                name="tiktok-social-media-field"
                id={`tiktok-input-${activeStep}`}
                data-lpignore="true"
                data-1p-ignore="true"
                onFocus={(e) => {
                  const value = e.target.value;
                  if (value && (value.toLowerCase().includes('casto') || value === 'casto')) {
                    setValue('tikTok', '');
                    e.target.value = '';
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '1px solid black',
                  borderRadius: 0,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-sora), sans-serif',
                  outline: 'none',
                }}
                onBlur={(e) => {
                  if (errors.tikTok) {
                    e.target.style.borderColor = '#d32f2f';
                  } else {
                    e.target.style.borderColor = 'black';
                  }
                }}
              />
              {errors.tikTok && (
                <Box sx={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '4px', marginLeft: '14px' }}>
                  {errors.tikTok.message}
                </Box>
              )}
            </Box>
            <TextField
              fullWidth
              label="Instagram"
              {...register('instagram')}
              autoComplete="new-password"
              name="instagram-username-field"
              id="instagram-username-field"
              inputProps={{
                autoComplete: 'new-password',
                'data-form-type': 'other',
              }}
              sx={textFieldStyle}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Documentación
            </Typography>
            <TextField
              fullWidth
              label="Nacionalidad"
              {...register('nacionalidad')}
              error={!!errors.nacionalidad}
              helperText={errors.nacionalidad?.message}
              required
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Residencia actual"
              {...register('residenciaActual')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Pasaporte (especificar si está vigente por favor)"
              {...register('pasaporte')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="DNI"
              {...register('dni')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Licencia de conducir (especificar categorías por favor)"
              {...register('licenciaConducir')}
              autoComplete="off"
              sx={textFieldStyle}
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Características Físicas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Altura en cm"
                {...register('altura')}
                autoComplete="off"
                type="text"
                sx={textFieldStyle}
              />
              <TextField
                fullWidth
                label="Peso en kg"
                {...register('peso')}
                autoComplete="off"
                type="text"
                sx={textFieldStyle}
              />
            </Box>
            <TextField
              fullWidth
              label="Contextura"
              {...register('contextura')}
              placeholder=""
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Color de pelo y largo en cm"
              {...register('colorPelo')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Color de ojos"
              {...register('colorOjos')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Talle de remera"
                {...register('talleRemera')}
                autoComplete="off"
                sx={{
                  ...textFieldStyle,
                  flex: '1.5',
                }}
              />
              <TextField
                fullWidth
                label="Pantalón"
                {...register('pantalon')}
                autoComplete="off"
                sx={{
                  ...textFieldStyle,
                  flex: 1,
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Calzado"
              {...register('calzado')}
              autoComplete="off"
              sx={textFieldStyle}
            />
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Información Médica
            </Typography>
            <TextField
              fullWidth
              label="¿Tatuajes? ¿Dónde?"
              {...register('tatuajes')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="¿Cicatrices? En caso de tener, especificar en dónde y qué tamaño por favor"
              {...register('cicatrices')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="¿Alergias?"
              {...register('alergias')}
              autoComplete="off"
              sx={textFieldStyle}
            />
          </Box>
        );
      case 5:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Estilo de Vida
            </Typography>
            <FormControl sx={{ marginBottom: 2 }}>
              <FormLabel sx={{ color: 'black', fontWeight: 700 }}>¿Alimentación?</FormLabel>
              <Controller
                name="alimentacion"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field} value={field.value || ''}>
                    <FormControlLabel value="vegetariano" control={<Radio />} label="Vegetariano" />
                    <FormControlLabel value="todo-tipo" control={<Radio />} label="Todo tipo de alimentos" />
                    <FormControlLabel value="vegano" control={<Radio />} label="Vegano" />
                    <FormControlLabel value="otros" control={<Radio />} label="Otros:" />
                  </RadioGroup>
                )}
              />
            </FormControl>
            {alimentacionValue === 'otros' && (
              <TextField
                fullWidth
                label="Especificar"
                {...register('alimentacionOtros')}
                autoComplete="off"
                sx={{ marginBottom: 2, ...textFieldStyle }}
              />
            )}
            <FormControl sx={{ marginBottom: 2 }}>
              <FormLabel sx={{ color: 'black', fontWeight: 700 }}>¿Hijos?</FormLabel>
              <Controller
                name="hijos"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field} value={field.value || ''}>
                    <FormControlLabel value="no" control={<Radio />} label="NO" />
                    <FormControlLabel value="si" control={<Radio />} label="SI" />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <TextField
              fullWidth
              label="OBRA SOCIAL"
              {...register('obraSocial')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Contacto en caso de emergencia y su nombre completo (parentesco)"
              {...register('contactoEmergencia')}
              multiline
              rows={2}
              autoComplete="off"
              sx={textFieldStyle}
            />
          </Box>
        );
      case 6:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Habilidades
            </Typography>
            <TextField
              fullWidth
              label="Instrumentos (Especificar que instrumentos y cuanto saben del dicho instrumento)"
              {...register('instrumentos')}
              multiline
              rows={3}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="¿Canta?"
              {...register('canta')}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Idiomas (Especificar si puede hablar de manera fluida o nativo)"
              {...register('idiomas')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <FormControl sx={{ marginBottom: 2 }}>
              <FormLabel sx={{ color: 'black', fontWeight: 700 }}>¿Acento neutro?</FormLabel>
              <Controller
                name="acentoNeutro"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field} value={field.value || ''}>
                    <FormControlLabel value="si" control={<Radio />} label="SI" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <TextField
              fullWidth
              label="Deportes ¿Cuáles?"
              {...register('deportes')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="¿Baila? ¿Qué tipo de danza?"
              {...register('baila')}
              multiline
              rows={2}
              autoComplete="off"
              sx={{ marginBottom: 2, ...textFieldStyle }}
            />
            <TextField
              fullWidth
              label="Otras habilidades"
              {...register('otrasHabilidades')}
              multiline
              rows={2}
              autoComplete="off"
              sx={textFieldStyle}
            />
          </Box>
        );
      case 7:
        return (
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 3,
                fontFamily: 'var(--font-sora), sans-serif',
                color: 'black',
              }}
            >
              Material
            </Typography>
            <TextField
              fullWidth
              label="Link de reel (YouTube, Vimeo, etc.)"
              type="url"
              {...register('reelUrl')}
              error={!!errors.reelUrl}
              helperText={errors.reelUrl?.message || 'Comparte el enlace de tu reel o video demo'}
              placeholder="https://youtube.com/watch?v=..."
              autoComplete="off"
              sx={{ marginBottom: 3, ...textFieldStyle }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  marginBottom: 2,
                  fontFamily: 'var(--font-sora), sans-serif',
                  color: 'black',
                }}
              >
                CV (PDF)
              </Typography>
              <TextField
                fullWidth
                type="file"
                inputProps={{
                  accept: '.pdf',
                }}
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
                }}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // Validar que sea un PDF
                    if (file.type !== 'application/pdf') {
                      toast.error('Por favor, selecciona un archivo PDF');
                      return;
                    }
                    
                    // Validar tamaño (máximo 10MB)
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxSize) {
                      toast.error('El archivo no debe superar los 10MB');
                      return;
                    }
                    
                    setCvFile(file);
                    toast.success('Archivo PDF seleccionado correctamente');
                  } else {
                    setCvFile(null);
                  }
                }}
              />
              {cvFile && (
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    color: 'black',
                    marginTop: 1,
                    marginBottom: 2,
                  }}
                >
                  Archivo seleccionado: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  color: '#666',
                  fontStyle: 'italic',
                  marginBottom: 3,
                }}
              >
                Sube tu CV en formato PDF
              </Typography>
              
              {/* Campo de imágenes */}
              <Box sx={{ marginTop: 4 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'black',
                    marginBottom: 1.5,
                  }}
                >
                  Imágenes (Opcional)
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  id="imagenes-input"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      // Validar que todos sean imágenes
                      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
                      if (invalidFiles.length > 0) {
                        toast.error('Por favor, selecciona solo archivos de imagen');
                        return;
                      }
                      
                      // Validar tamaño (máximo 5MB por imagen)
                      const maxSize = 5 * 1024 * 1024; // 5MB
                      const oversizedFiles = files.filter(file => file.size > maxSize);
                      if (oversizedFiles.length > 0) {
                        toast.error('Cada imagen no debe superar los 5MB');
                        return;
                      }
                      
                      // Limitar a 10 imágenes máximo
                      if (files.length > 10) {
                        toast.error('Puedes subir máximo 10 imágenes');
                        setImagenesFiles(files.slice(0, 10));
                        return;
                      }
                      
                      setImagenesFiles(files);
                      toast.success(`${files.length} imagen${files.length > 1 ? 'es' : ''} seleccionada${files.length > 1 ? 's' : ''} correctamente`);
                    } else {
                      setImagenesFiles([]);
                    }
                  }}
                />
                <label htmlFor="imagenes-input">
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{
                      borderColor: 'black',
                      color: 'black',
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      fontWeight: 400,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
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
                    Seleccionar Imágenes
                  </Button>
                </label>
                {imagenesFiles.length > 0 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 400,
                        color: 'black',
                        marginBottom: 1,
                      }}
                    >
                      {imagenesFiles.length} imagen{imagenesFiles.length > 1 ? 'es' : ''} seleccionada{imagenesFiles.length > 1 ? 's' : ''}:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {imagenesFiles.map((file, index) => (
                        <Typography
                          key={index}
                          sx={{
                            fontSize: '0.8rem',
                            color: '#666',
                            fontStyle: 'italic',
                          }}
                        >
                          • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 300,
                    color: '#666',
                    fontStyle: 'italic',
                    marginTop: 1.5,
                  }}
                >
                  Puedes subir hasta 10 imágenes (máximo 5MB cada una)
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          paddingTop: { xs: '48px', md: '80px' },
          paddingBottom: { xs: '48px', md: '80px' },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: { xs: '16px', md: '24px' },
              textAlign: 'center',
              fontFamily: 'var(--font-sora), sans-serif',
              color: 'black',
            }}
          >
            Envía tu material
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                marginBottom: 3,
                padding: { xs: '16px 0', md: '24px 0' },
                '& .MuiStep-root': {
                  padding: '0 8px',
                },
                '& .MuiStepLabel-root .Mui-completed': {
                  color: 'black',
                },
                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                  color: '#666',
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: 'black',
                },
                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                  color: 'black',
                  fontWeight: 700,
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: { xs: 24, md: 28 },
                          height: { xs: 24, md: 28 },
                          borderRadius: '50%',
                          backgroundColor: active || completed ? 'black' : '#e0e0e0',
                          color: active || completed ? 'white' : '#999',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                        }}
                      >
                        {index + 1}
                      </Box>
                    )}
                  >
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ marginBottom: 3 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                type="button"
                disabled={activeStep === 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBack();
                }}
                variant="outlined"
                sx={{
                  borderColor: 'black',
                  color: 'black',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
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
                Anterior
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isPending}
                  sx={{
                    borderColor: 'black',
                    color: 'black',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    letterSpacing: '0.5px',
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
                  {isPending ? 'Enviando...' : 'Enviar formulario'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                  variant="outlined"
                  sx={{
                    borderColor: 'black',
                    color: 'black',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
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
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}

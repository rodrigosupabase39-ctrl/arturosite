# Configuración de Supabase

## Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (tarda unos minutos)

### 2. Obtener credenciales
1. Ve a Settings → API en tu proyecto de Supabase
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - Solo para operaciones del servidor

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 4. Conectar proyecto local con Supabase remoto
```bash
supabase link --project-ref tu-project-ref
```

Para obtener el `project-ref`:
- Ve a Settings → General en tu proyecto de Supabase
- El Project ref está en la sección "Reference ID"

### 5. Aplicar migraciones
```bash
# Aplicar todas las migraciones al proyecto remoto
supabase db push
```

Esto creará las tablas:
- `contactos` - Para el formulario de contacto
- `envia_material` - Para el formulario de envía tu material
- Bucket de storage `cv-pdfs` - Para almacenar CVs en PDF

### 6. Configurar autenticación para admin
1. Ve a Authentication → Policies en tu proyecto de Supabase
2. Las políticas RLS ya están configuradas en las migraciones
3. Crea un usuario admin desde Authentication → Users → Add user
4. Usa ese email/contraseña para hacer login en `/admin`

## Estructura de migraciones

Las migraciones se encuentran en `supabase/migrations/`:

- `20241120000001_create_contactos_table.sql` - Tabla de contactos
- `20241120000002_create_envia_material_table.sql` - Tabla de formulario envía material
- `20241120000003_create_storage_buckets.sql` - Bucket para almacenar PDFs

## Comandos útiles

```bash
# Ver estado de las migraciones
supabase migration list

# Crear una nueva migración
supabase migration new nombre_de_la_migracion

# Aplicar migraciones localmente (si usas Supabase local)
supabase db reset

# Aplicar migraciones al proyecto remoto
supabase db push
```

## Próximos pasos

Después de configurar Supabase, actualizar:
- `/app/api/auth/login/route.ts` - Implementar login con Supabase Auth
- `/app/api/auth/logout/route.ts` - Implementar logout
- `/app/api/auth/me/route.ts` - Verificar sesión
- `/app/api/contacto/route.ts` - Guardar mensajes de contacto
- `/app/api/envia-material/route.ts` - Guardar formularios de material


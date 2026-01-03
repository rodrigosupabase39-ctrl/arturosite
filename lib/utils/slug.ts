/**
 * Genera un slug URL-friendly desde un texto
 * Ejemplo: "Sofía Martínez" -> "sofia-martinez"
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Reemplazar acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Reemplazar caracteres especiales y espacios por guiones
    .replace(/[^a-z0-9]+/g, '-')
    // Eliminar guiones al inicio y final
    .replace(/^-+|-+$/g, '')
    // Limitar longitud
    .substring(0, 100);
}

/**
 * Genera un slug único agregando un número si ya existe
 * Ejemplo: "juan-perez" -> "juan-perez-1" si ya existe
 */
export function generateUniqueSlug(
  text: string,
  existingSlugs: string[],
  baseSlug?: string
): string {
  const slug = baseSlug || generateSlug(text);
  
  if (!existingSlugs.includes(slug)) {
    return slug;
  }
  
  // Si existe, agregar número
  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
  
  return uniqueSlug;
}

/**
 * @deprecated Usar generateSlug en su lugar
 * Mantenido para compatibilidad
 */
export function nombreToSlug(nombre: string): string {
  return generateSlug(nombre);
}


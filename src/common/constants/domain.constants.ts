/**
 * =========================================================
 * CONSTANTES DEL DOMINIO: CITAS
 * Define los estados válidos del ciclo de vida de una Cita.
 * =========================================================
 */
export const CITA_ESTADOS_VALIDOS = [
  'Programada',
  'Confirmada',
  'Cancelada',
  'Completada',
  'No Presentado',
] as const; // 'as const' para un tipo literal de string array.

/**
 * El estado por defecto que se asigna a una cita al ser creada.
 */
export const CITA_ESTADO_DEFAULT = 'Programada';

/**
 * =========================================================
 * CONSTANTES DEL DOMINIO: GENERALES/VALIDACIÓN
 * =========================================================
 */

/**
 * Longitud máxima permitida para campos de tipo 'notas' o descripciones cortas.
 */
export const MAX_LENGTH_NOTES = 255;

/**
 * Longitud máxima para campos de tipo 'nombre' o clasificaciones cortas (ej. Tipo de Cita, Estado).
 */
export const MAX_LENGTH_NAME = 50;

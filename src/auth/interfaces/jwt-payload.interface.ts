// src/auth/interfaces/jwt-payload.interface.ts

/**
 * Define la estructura de la carga útil (payload) del JSON Web Token.
 * Esta información se guarda en el token y se utiliza para identificar
 * al usuario y sus permisos al decodificar el token.
 */
export interface JwtPayload {
  /**
   * Identificador único del sujeto (usuario). Es una claim estándar de JWT.
   * Se recomienda usar el ID del usuario de la base de datos.
   */
  sub: string; // ID del Usuario (ej. el 'id' de la entidad Usuario)

  /**
   * Nombre de usuario. Útil para identificar rápidamente al usuario
   * sin necesidad de buscar en la base de datos para cada solicitud.
   */
  nombreUsuario: string;

  /**
   * ID del rol del usuario. Permite realizar comprobaciones de autorización
   * basadas en el rol directamente desde el token.
   */
  idRol: string; // ID del Rol (ej. el 'id' de la entidad Rol)

  /**
   * Nombre del rol del usuario. Facilita la lógica de autorización
   * y la visualización en el frontend sin necesidad de una consulta adicional.
   */
  nombreRol: string; // Nombre del Rol (ej. 'Administrador', 'Profesional', 'Paciente')

  /**
   * Tiempo de emisión del token (timestamp en segundos).
   * Es una claim estándar de JWT.
   */
  iat?: number;

  /**
   * Tiempo de expiración del token (timestamp en segundos).
   * Es una claim estándar de JWT.
   */
  exp?: number;
}

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para la respuesta de la API al retornar un Rol.
 * Define la estructura de datos pública del rol para la visualización del cliente.
 */
export class RolResponseDto {
  /**
   * Identificador único del rol (UUID).
   */
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Identificador único del rol (UUID).',
  })
  id: string;

  /**
   * Nombre único del rol.
   */
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre único del rol (ej. "Administrador", "Profesional").',
  })
  nombre: string;

  /**
   * Descripción del rol.
   */
  @ApiProperty({
    example: 'Rol con permisos para gestionar el sistema.',
    description: 'Descripción del rol.',
    required: false,
  })
  descripcion: string;
}

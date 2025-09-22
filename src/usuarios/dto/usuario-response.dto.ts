import { ApiProperty } from '@nestjs/swagger';
import { RolResponseDto } from '../../roles/dto/rol-response.dto'; // Asegúrate de crear este DTO para el Rol

/**
 * DTO (Data Transfer Object) para la respuesta de la API al retornar un Usuario.
 * Define la estructura de datos segura y pública de un usuario, excluyendo información sensible.
 */
export class UsuarioResponseDto {
  /**
   * Identificador único del usuario (UUID).
   */
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Identificador único del usuario (UUID).',
  })
  id: string;

  /**
   * Nombre de usuario único para inicio de sesión.
   */
  @ApiProperty({
    example: 'johndoe',
    description: 'Nombre de usuario, debe ser único.',
  })
  nombreUsuario: string;

  /**
   * El ID del rol asociado al usuario.
   */
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID del rol asociado al usuario.',
  })
  idRol: string;

  /**
   * El objeto de rol completo asociado a este usuario.
   */
  @ApiProperty({
    type: RolResponseDto, // Reemplaza con el tipo de tu DTO de respuesta para el Rol
    description: 'Detalles del rol asociado al usuario.',
  })
  rol: RolResponseDto;
}

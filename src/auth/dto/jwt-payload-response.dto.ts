// src/auth/dto/jwt-payload-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para documentar la estructura del payload JWT.
 * Usamos una clase para que Swagger pueda inferir el schema.
 */
export class JwtPayloadResponseDto {
  @ApiProperty({
    description: 'ID único del usuario (claim sub).',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  sub: string;

  @ApiProperty({ description: 'Nombre de usuario.', example: 'juan.perez' })
  nombreUsuario: string;

  @ApiProperty({
    description: 'ID del rol del usuario para autorización.',
    example: 'r1s2t3u4-v5w6-7x8y-9z0a-1b2c3d4e5f6g',
  })
  idRol: string;

  @ApiProperty({
    description: 'Nombre del rol del usuario.',
    example: 'Profesional',
  })
  nombreRol: string;

  @ApiProperty({
    description: 'Tiempo de emisión (iat).',
    example: 1678886400,
    required: false,
  })
  iat?: number;

  @ApiProperty({
    description: 'Tiempo de expiración (exp).',
    example: 1678890000,
    required: false,
  })
  exp?: number;
}

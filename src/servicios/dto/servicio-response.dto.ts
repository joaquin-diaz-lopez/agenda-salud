// src/servicios/dto/servicio-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta al retornar un Servicio.
 * Expone todos los detalles públicos del servicio.
 */
export class ServicioResponseDto {
  @ApiProperty({
    example: 'f5e4d3c2-b1a0-9e8d-7c6b-5a4f3e2d1c0b',
    description: 'Identificador único del servicio (UUID).',
  })
  id: string;

  @ApiProperty({
    example: 'Consulta de Cardiología',
    description: 'Nombre del servicio.',
  })
  nombre: string;

  @ApiProperty({
    example: 'Consulta especializada en salud cardiovascular.',
    description: 'Descripción del servicio.',
    nullable: true,
  })
  descripcion: string;

  @ApiProperty({
    example: 45,
    description: 'Duración del servicio en minutos.',
    nullable: true,
  })
  duracionMinutos: number;

  @ApiProperty({
    example: 150.0,
    description: 'Precio del servicio.',
    nullable: true,
  })
  precio: number;
}

// src/profesional-servicios/dto/profesional-servicio-response.dto.ts (Corregido)
import { ApiProperty } from '@nestjs/swagger';
import { ProfesionalResponseDto } from '../../profesionales/dto/profesional-response.dto';
import { ServicioResponseDto } from '../../servicios/dto/servicio-response.dto';

export class ProfesionalServicioResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Identificador único de la asociación.',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identificador único del profesional.',
  })
  idProfesional: string;

  @ApiProperty({
    example: 'f5e4d3c2-b1a0-9e8d-7c6b-5a4f3e2d1c0b',
    description: 'Identificador único del servicio.',
  })
  idServicio: string;

  @ApiProperty({
    description: 'Detalles del profesional asociado.',
    type: ProfesionalResponseDto,
  })
  profesional: ProfesionalResponseDto;

  @ApiProperty({
    description: 'Detalles del servicio asociado.',
    type: ServicioResponseDto,
  })
  servicio: ServicioResponseDto;
}

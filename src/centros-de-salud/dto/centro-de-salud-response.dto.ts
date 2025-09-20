import { ApiProperty } from '@nestjs/swagger';
import { Profesional } from '../../profesionales/entities/profesional.entity';

export class CentroDeSaludResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identificador único del centro de salud (UUID).',
  })
  id: string;

  @ApiProperty({
    example: 'Centro de Salud Acajete',
    description: 'Nombre único del centro de salud.',
  })
  nombre: string;

  @ApiProperty({
    example: 'Calle Principal #123, Acajete, Ver.',
    description: 'Dirección del centro de salud.',
    required: false,
  })
  direccion: string;

  @ApiProperty({
    example: '228-123-4567',
    description: 'Número de teléfono de contacto.',
    required: false,
  })
  telefono: string;

  @ApiProperty({
    example: 'contacto@centrosaludacajete.org',
    description: 'Dirección de correo electrónico del centro de salud.',
    required: false,
  })
  email: string;

  // Si decides incluir la lista de profesionales en la respuesta
  @ApiProperty({
    type: [Profesional],
    description: 'Lista de profesionales asociados a este centro.',
    required: false,
  })
  profesionales?: Profesional[];
}

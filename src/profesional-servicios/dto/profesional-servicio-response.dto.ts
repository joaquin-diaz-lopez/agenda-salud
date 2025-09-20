import { ApiProperty } from '@nestjs/swagger';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

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
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      idUsuario: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      nombre: 'Dr. Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      telefono: '55-1234-5678',
      especialidad: 'Cardiología',
    },
    description: 'Detalles del profesional asociado.',
  })
  profesional: Profesional;

  @ApiProperty({
    example: {
      id: 'f5e4d3c2-b1a0-9e8d-7c6b-5a4f3e2d1c0b',
      nombre: 'Consulta de Cardiología',
      descripcion: 'Consulta especializada en salud cardiovascular.',
      duracionMinutos: 45,
      precio: 150.0,
    },
    description: 'Detalles del servicio asociado.',
  })
  servicio: Servicio;
}

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para la respuesta de la API al retornar una Cita.
 * Define la estructura de datos que se expone públicamente.
 */
export class CitaResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Identificador único de la Cita (UUID).',
  })
  id: string;

  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID del paciente asociado a la cita.',
  })
  idPaciente: string;

  @ApiProperty({
    example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
    description: 'ID del profesional que ofrece la cita.',
  })
  idProfesional: string;

  @ApiProperty({
    example: 'c1d2e3f4-a5b6-7890-1234-567890abcdef',
    description: 'ID del servicio a realizar en la cita.',
  })
  idServicio: string;

  @ApiProperty({
    example: 'd1e2f3a4-b5c6-7890-1234-567890abcdef',
    description: 'ID del slot de disponibilidad reservado para esta cita.',
  })
  idSlotDisponibilidad: string;

  @ApiProperty({
    example: '2025-02-15T09:00:00Z',
    description: 'Hora de inicio de la cita (ISO 8601 con zona horaria).',
  })
  horaInicio: Date;

  @ApiProperty({
    example: '2025-02-15T09:30:00Z',
    description: 'Hora de fin de la cita (ISO 8601 con zona horaria).',
  })
  horaFin: Date;

  @ApiProperty({
    example: 'Subsecuente',
    description: 'Tipo de cita (ej. "Primera vez", "Subsecuente").',
    maxLength: 50,
  })
  tipo: string;

  @ApiProperty({
    example: 'Programada',
    description: 'Estado actual de la cita (ej. "Programada", "Confirmada").',
    maxLength: 50,
  })
  estado: string;

  @ApiProperty({
    example: 'El paciente solicitó confirmar un día antes.',
    description: 'Notas adicionales sobre la cita.',
    required: false,
    nullable: true,
    maxLength: 255,
  })
  notas: string | null;
}

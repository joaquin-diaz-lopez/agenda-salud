import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para la respuesta de la API al retornar un Descanso.
 * Define la estructura de datos segura y pública de un descanso.
 */
export class DescansoResponseDto {
  /**
   * Identificador único del descanso (UUID).
   */
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Identificador único del descanso (UUID).',
  })
  id: string;

  /**
   * El ID (UUID) de la jornada diaria a la que pertenece este descanso.
   */
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID de la jornada diaria asociada al descanso.',
  })
  idJornadaDiaria: string;

  /**
   * Hora de inicio del descanso en formato ISO 8601.
   */
  @ApiProperty({
    example: '2025-01-21T13:00:00Z',
    description: 'Hora de inicio del descanso.',
  })
  horaInicio: Date;

  /**
   * Hora de fin del descanso en formato ISO 8601.
   */
  @ApiProperty({
    example: '2025-01-21T14:00:00Z',
    description: 'Hora de fin del descanso.',
  })
  horaFin: Date;

  /**
   * Razón del descanso (ej. "Almuerzo", "Reunión").
   */
  @ApiProperty({
    example: 'Almuerzo',
    description: 'Razón del descanso.',
  })
  razon: string;
}

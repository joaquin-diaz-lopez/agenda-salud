import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Descanso.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'descansos'.
 */
export class CreateDescansoDto {
  /**
   * El ID (UUID) de la jornada diaria a la que pertenece este descanso.
   */
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID de la jornada diaria asociada al descanso.',
  })
  idJornadaDiaria: string;

  /**
   * Hora de inicio del descanso.
   */
  @IsDate({ message: 'horaInicio debe ser un objeto Date válido.' })
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    example: '2025-01-21T13:00:00Z',
    description:
      'Hora de inicio del descanso. Formato ISO 8601 con zona horaria (UTC recomendado).',
    type: 'string',
    format: 'date-time',
  })
  horaInicio: Date;

  /**
   * Hora de fin del descanso.
   */
  @IsDate({ message: 'horaFin debe ser un objeto Date válido.' })
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    example: '2025-01-21T14:00:00Z',
    description:
      'Hora de fin del descanso. Formato ISO 8601 con zona horaria (UTC recomendado).',
    type: 'string',
    format: 'date-time',
  })
  horaFin: Date;

  /**
   * Razón del descanso (ej. "Almuerzo", "Reunión").
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Almuerzo',
    description: 'Razón del descanso.',
    maxLength: 100,
  })
  razon: string;
}

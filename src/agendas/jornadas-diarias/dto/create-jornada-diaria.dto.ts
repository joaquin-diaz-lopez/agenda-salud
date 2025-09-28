import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!

/**
 * DTO (Data Transfer Object) para la creación de una nueva Jornada Diaria.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'jornadas_diarias'.
 */
export class CreateJornadaDiariaDto {
  /**
   * El ID (UUID) de la agenda profesional a la que pertenece esta jornada.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID de la agenda profesional dueña de esta jornada.',
  })
  idAgendaProfesional: string;

  /**
   * La fecha de la jornada.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida (ej. "YYYY-MM-DD").
   */
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-01-20',
    description:
      'Fecha de la jornada. Se recomienda formato "YYYY-MM-DD" para evitar problemas de zona horaria.',
    format: 'date',
  })
  fecha: Date;

  /**
   * Hora de inicio del trabajo en formato HH:MM.
   * Es obligatoria.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe estar en formato HH:MM',
  })
  @ApiProperty({
    example: '09:00',
    description: 'Hora de inicio de la jornada de trabajo (formato HH:MM).',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  horaInicioTrabajo: string;

  /**
   * Hora de fin del trabajo en formato HH:MM.
   * Es obligatoria.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de fin debe estar en formato HH:MM',
  })
  @ApiProperty({
    example: '17:00',
    description: 'Hora de fin de la jornada de trabajo (formato HH:MM).',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  horaFinTrabajo: string;
}

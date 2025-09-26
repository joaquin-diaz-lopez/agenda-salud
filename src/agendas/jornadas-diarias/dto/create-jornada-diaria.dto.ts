// src/agendas/dto/create-jornada-diaria.dto.ts
import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsString,
  Matches,
} from 'class-validator';

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
  idAgendaProfesional: string;

  /**
   * La fecha de la jornada.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida (ej. "YYYY-MM-DD").
   */
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  /**
   * Hora de inicio del trabajo en formato HH:MM.
   * Es obligatoria.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe estar en formato HH:MM',
  }) // <-- ¡AJUSTE AQUÍ!
  horaInicioTrabajo: string;

  /**
   * Hora de fin del trabajo en formato HH:MM.
   * Es obligatoria.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de fin debe estar en formato HH:MM',
  }) // <-- ¡AJUSTE AQUÍ!
  horaFinTrabajo: string;
}

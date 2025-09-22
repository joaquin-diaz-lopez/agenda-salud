// src/agendas/dto/create-descanso.dto.ts
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Descanso.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'descansos'.
 */
export class CreateDescansoDto {
  /**
   * El ID (UUID) de la jornada diaria a la que pertenece este descanso.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idJornadaDiaria: string;

  /**
   * Hora de inicio del descanso.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida.
   * Nota: Aunque la entidad usa `timestamp with time zone`, en el DTO se suele recibir un string.
   */
  @IsDate({ message: 'horaInicio debe ser un objeto Date válido.' })
  @IsNotEmpty()
  @Type(() => Date) // <-- ¡CORRECCIÓN AQUÍ!
  horaInicio: Date;

  /**
   * Hora de fin del descanso.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida.
   */
  @IsDate({ message: 'horaFin debe ser un objeto Date válido.' })
  @IsNotEmpty()
  @Type(() => Date) // <-- ¡CORRECCIÓN AQUÍ!
  horaFin: Date;

  /**
   * Razón del descanso (ej. "Almuerzo", "Reunión").
   * Es obligatoria, una cadena de texto con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  razon: string;
}

// src/agendas/dto/create-agenda-profesional.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de una nueva Agenda Profesional.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'agendas_profesionales'.
 */
export class CreateAgendaProfesionalDto {
  /**
   * El ID (UUID) del profesional al que pertenece esta agenda.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idProfesional: string;

  /**
   * Nombre opcional para la agenda (ej. "Horario Regular", "Guardias").
   * Es una cadena de texto con una longitud máxima de 100 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;
}

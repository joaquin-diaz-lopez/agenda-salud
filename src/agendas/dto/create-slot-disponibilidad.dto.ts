// src/agendas/dto/create-slot-disponibilidad.dto.ts
import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Slot de Disponibilidad.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'slots_disponibilidad'.
 */
export class CreateSlotDisponibilidadDto {
  /**
   * El ID (UUID) de la jornada diaria a la que pertenece este slot.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idJornadaDiaria: string;

  /**
   * Hora de inicio del slot.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida.
   */
  @IsDateString()
  @IsNotEmpty()
  horaInicio: Date;

  /**
   * Hora de fin del slot.
   * Es obligatoria y debe ser una cadena de fecha ISO 8601 válida.
   */
  @IsDateString()
  @IsNotEmpty()
  horaFin: Date;
}

// src/profesional-servicios/dto/create-profesional-servicio.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTO para la creación de una asociación entre un Profesional y un Servicio.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'profesional_servicios'.
 */
export class CreateProfesionalServicioDto {
  /**
   * El ID (UUID) del profesional al que se asociará el servicio.
   * Debe ser un UUID válido y no puede estar vacío.
   */
  @IsUUID()
  @IsNotEmpty()
  idProfesional: string;

  /**
   * El ID (UUID) del servicio que será ofrecido por el profesional.
   * Debe ser un UUID válido y no puede estar vacío.
   */
  @IsUUID()
  @IsNotEmpty()
  idServicio: string;
}

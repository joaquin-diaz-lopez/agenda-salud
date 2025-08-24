// src/agendas/dto/generate-slots.dto.ts
import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO (Data Transfer Object) para la generación de múltiples Slots de Disponibilidad.
 * Define la estructura y las reglas de validación para los datos
 * esperados al solicitar la generación automática de slots para una jornada.
 */
export class GenerateSlotsDto {
  /**
   * El ID (UUID) de la jornada diaria para la cual se generarán los slots.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idJornadaDiaria: string;

  /**
   * La duración deseada para cada slot, en minutos.
   * Es obligatorio, debe ser un número entero y al menos 1 minuto.
   */
  @IsInt({ message: 'La duración del slot debe ser un número entero.' })
  @Min(1, { message: 'La duración del slot debe ser de al menos 1 minuto.' })
  @Type(() => Number) // Asegura la transformación a tipo numérico
  duracionSlotMinutos: number;
}

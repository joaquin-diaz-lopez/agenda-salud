// src/citas/dto/create-cita.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de una nueva Cita.
 * Define la estructura y las reglas de validación para los datos
 * esperados al agendar una cita.
 */
export class CreateCitaDto {
  /**
   * El ID (UUID) del paciente que reserva la cita.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idPaciente: string;

  /**
   * El ID (UUID) del profesional con quien se agenda la cita.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idProfesional: string;

  /**
   * El ID (UUID) del servicio que se realizará en la cita.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idServicio: string;

  /**
   * El ID (UUID) del slot de disponibilidad que se reserva para esta cita.
   * Es obligatorio y debe ser un UUID válido.
   */
  @IsUUID()
  @IsNotEmpty()
  idSlotDisponibilidad: string;

  /**
   * El tipo de cita (ej. "Primera vez", "Subsecuente").
   * Es obligatorio, una cadena de texto y con una longitud máxima de 50 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  /**
   * Notas adicionales para la cita.
   * Es opcional y con una longitud máxima de 255 caracteres.
   */
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notas?: string;
}

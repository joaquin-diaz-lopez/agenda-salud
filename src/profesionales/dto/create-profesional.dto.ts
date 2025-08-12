// src/profesionales/dto/create-profesional.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Profesional.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'profesionales'.
 */
export class CreateProfesionalDto {
  /**
   * El ID (UUID) del usuario asociado a este profesional.
   * Es obligatorio, ya que cada profesional debe tener un usuario en el sistema.
   */
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  /**
   * Nombre del profesional.
   * Es obligatorio, una cadena de texto y con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  /**
   * Apellido del profesional.
   * Es obligatorio, una cadena de texto y con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  /**
   * Dirección de correo electrónico del profesional.
   * Debe ser un formato de email válido. Aunque en la entidad es nullable,
   * generalmente se hace obligatorio para la creación de un profesional.
   */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  /**
   * Número de teléfono del profesional.
   * Es opcional y con una longitud máxima de 20 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  /**
   * Especialidad médica o de salud del profesional.
   * Es opcional y con una longitud máxima de 100 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  especialidad?: string;

  /**
   * El ID (UUID) del centro de salud al que se asocia el profesional.
   * Es opcional, permitiendo profesionales sin un centro de salud asignado inicialmente.
   */
  @IsOptional()
  @IsUUID()
  idCentroDeSalud?: string;
}

// src/pacientes/dto/create-paciente.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Paciente.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'pacientes'.
 */
export class CreatePacienteDto {
  /**
   * Nombre del paciente.
   * Es obligatorio, una cadena de texto y con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  /**
   * Apellido del paciente.
   * Es obligatorio, una cadena de texto y con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  /**
   * Fecha de nacimiento del paciente.
   * Es opcional y debe ser una cadena de fecha ISO 8601 válida.
   */
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: Date;

  /**
   * Número de teléfono del paciente.
   * Es opcional y con una longitud máxima de 20 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  /**
   * Dirección de correo electrónico del paciente.
   * Es opcional, debe ser un formato de email válido y con una longitud máxima de 150 caracteres.
   */
  @IsOptional() // Ahora es opcional según la entidad (nullable: true)
  @IsEmail()
  @MaxLength(150)
  email?: string;

  /**
   * Dirección de residencia del paciente.
   * Es opcional y con una longitud máxima de 255 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  /**
   * El ID (UUID) del usuario asociado a este paciente.
   * Es opcional, ya que un paciente puede existir sin una cuenta de usuario inicial.
   */
  @IsOptional() // Ahora es opcional según la entidad (nullable: true)
  @IsUUID()
  idUsuario?: string;
}

// src/centros-de-salud/dto/create-centro-de-salud.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Centro de Salud.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'centros_de_salud'.
 */
export class CreateCentroDeSaludDto {
  /**
   * Nombre del centro de salud. Debe ser único, una cadena de texto
   * no vacía y con una longitud máxima de 150 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  /**
   * Dirección del centro de salud.
   * Es opcional y con una longitud máxima de 255 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  /**
   * Número de teléfono del centro de salud.
   * Es opcional y con una longitud máxima de 20 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  /**
   * Dirección de correo electrónico del centro de salud.
   * Es opcional, debe ser un formato de email válido y con una longitud máxima de 150 caracteres.
   */
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;
}

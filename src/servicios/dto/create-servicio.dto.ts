// src/servicios/dto/create-servicio.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer'; // Necesario para transformar el tipo de datos

/**
 * DTO (Data Transfer Object) para la creación de un nuevo Servicio.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'servicios'.
 */
export class CreateServicioDto {
  /**
   * Nombre del servicio. Debe ser único, una cadena de texto
   * no vacía y con una longitud máxima de 100 caracteres.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  /**
   * Descripción opcional del servicio.
   * Debe ser una cadena de texto con una longitud máxima de 255 caracteres.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  /**
   * Duración del servicio en minutos. Es un número entero.
   * Es opcional, pero si se provee, debe ser un entero positivo.
   */
  @IsOptional()
  @Type(() => Number) // Transforma la entrada a tipo numérico
  @IsInt({ message: 'La duración debe ser un número entero.' })
  @Min(1, { message: 'La duración debe ser de al menos 1 minuto.' })
  duracionMinutos?: number;

  /**
   * Precio del servicio. Es un número decimal.
   * Es opcional, pero si se provee, debe ser un número con hasta 2 decimales y no negativo.
   */
  @IsOptional()
  @Type(() => Number) // Transforma la entrada a tipo numérico
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe tener como máximo 2 decimales.' },
  )
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio?: number;
}

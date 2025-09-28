// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) para la solicitud de inicio de sesión.
 * Define la estructura y las reglas de validación para los datos
 * que se esperan en el cuerpo de la solicitud POST /auth/login.
 */
export class LoginDto {
  /**
   * Nombre de usuario del usuario que intenta iniciar sesión.
   * Debe ser una cadena de texto y no puede estar vacío.
   */
  @ApiProperty({
    example: 'juan.perez',
    description: 'Nombre de usuario único',
  }) // 🚨 MEJORA
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  /**
   * Contraseña del usuario que intenta iniciar sesión.
   * Debe ser una cadena de texto, no puede estar vacía y debe tener
   * una longitud mínima para mayor seguridad.
   */
  @ApiProperty({ example: 'PasswordSegura123', description: 'Contraseña' }) // 🚨 MEJORA
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }) // Puedes ajustar la longitud mínima
  contrasena: string;
}

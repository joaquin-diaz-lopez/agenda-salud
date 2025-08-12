// src/usuarios/dto/create-usuario.dto.ts
import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  contrasena: string;

  @IsUUID()
  @IsNotEmpty()
  idRol: string; // El ID del rol al que pertenece este usuario
}

// src/usuarios/dto/create-usuario.dto.ts
import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  contrasena: string;

  @ApiProperty({ description: 'ID del rol asociado al usuario' })
  @IsUUID()
  @IsNotEmpty()
  idRol: string; // El ID del rol al que pertenece este usuario
}

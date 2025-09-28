// src/usuarios/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // 🚨 CORRECCIÓN: Usar @nestjs/mapped-types
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsUUID, IsOptional, IsString, Length } from 'class-validator'; // Importar validadores
import { ApiProperty } from '@nestjs/swagger'; // Importar ApiProperty

/**
 * DTO (Data Transfer Object) para la actualización de un Usuario.
 * Utiliza `PartialType` para heredar todas las propiedades
 * de `CreateUsuarioDto` y marcarlas como opcionales.
 */
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  // Nota: Hereda nombreUsuario, contrasena, e idRol como OPCIONALES.

  // Puedes redefinir las propiedades para añadir documentación específica de Swagger si lo deseas
  // o si quieres añadir validaciones condicionales que no vienen del DTO base.

  @ApiProperty({
    example: 'nueva_contrasenaSegura123',
    description: 'Nueva contraseña (se hasheará antes de guardar).',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @Length(8, 50, {
    message: 'La contraseña debe tener entre 8 y 50 caracteres.',
  })
  contrasena?: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Nuevo ID del rol asociado.',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido.' })
  idRol?: string;
}

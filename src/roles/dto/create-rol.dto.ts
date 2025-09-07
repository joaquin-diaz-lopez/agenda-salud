// src/roles/dto/create-rol.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre único del rol.',
  })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Control total del sistema',
    description: 'Descripción detallada de las responsabilidades del rol.',
  })
  descripcion: string;
}

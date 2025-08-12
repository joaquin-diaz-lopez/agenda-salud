// src/roles/dto/create-rol.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(255)
  descripcion: string;
}

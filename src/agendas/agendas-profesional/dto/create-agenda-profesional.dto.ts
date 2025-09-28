import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgendaProfesionalDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description:
      'ID (UUID) del profesional al que pertenece esta agenda. Debe ser único.',
  })
  idProfesional: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    example: 'Agenda Principal',
    description: 'Nombre opcional para la agenda (ej. "Horario Regular").',
    required: false,
    maxLength: 100,
  })
  nombre?: string;
}

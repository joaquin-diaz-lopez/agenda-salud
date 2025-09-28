import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_LENGTH_NOTES,
  MAX_LENGTH_NAME,
} from '../../common/constants/domain.constants';

/**
 * DTO (Data Transfer Object) para la creación de una nueva Cita.
 */
export class CreateCitaDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID del paciente que reserva la cita.',
  })
  idPaciente: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
    description: 'ID del profesional con quien se agenda la cita.',
  })
  idProfesional: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'c1d2e3f4-a5b6-7890-1234-567890abcdef',
    description: 'ID del servicio que se realizará en la cita.',
  })
  idServicio: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'd1e2f3a4-b5c6-7890-1234-567890abcdef',
    description: 'ID del slot de disponibilidad que se reserva.',
  })
  idSlotDisponibilidad: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_NAME) // <-- Usamos constante
  @ApiProperty({
    example: 'Primera vez',
    description: 'Tipo de cita.',
    maxLength: MAX_LENGTH_NAME, // <-- Usamos constante
  })
  tipo: string;

  @IsString()
  @MaxLength(MAX_LENGTH_NOTES) // <-- Usamos constante
  @IsOptional()
  @ApiProperty({
    example: 'El paciente es alérgico a la penicilina.',
    description: 'Notas adicionales para la cita.',
    required: false,
    nullable: true,
    maxLength: MAX_LENGTH_NOTES, // <-- Usamos constante
  })
  notas?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsString, IsOptional, MaxLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importación necesaria
import {
  CITA_ESTADOS_VALIDOS,
  MAX_LENGTH_NAME,
} from '../../common/constants/domain.constants';

/**
 * DTO para la actualización parcial de una Cita.
 * Hereda todas las propiedades de CreateCitaDto y las hace opcionales.
 * Añade la propiedad 'estado' para actualizar el ciclo de vida de la cita.
 */
export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH_NAME)
  @IsIn(CITA_ESTADOS_VALIDOS as readonly string[], {
    message: `El estado debe ser uno de: ${CITA_ESTADOS_VALIDOS.join(', ')}`,
  })
  @ApiProperty({
    example: 'Confirmada',
    description: 'Estado de la cita (ej. "Confirmada", "Cancelada").',
    required: false,
    maxLength: MAX_LENGTH_NAME,
    enum: CITA_ESTADOS_VALIDOS,
  })
  estado?: string;
}

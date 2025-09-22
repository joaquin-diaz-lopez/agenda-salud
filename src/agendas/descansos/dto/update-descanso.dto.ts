// src/agendas/dto/update-descanso.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDescansoDto } from './create-descanso.dto';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator'; // <-- ¡CAMBIO AQUÍ: IsDateString por IsDate!

/**
 * DTO para la actualización parcial de un Descanso.
 * Hereda todas las propiedades de CreateDescansoDto y las hace opcionales.
 * Las propiedades de fecha también requieren @Type(() => Date) para la transformación.
 */
export class UpdateDescansoDto extends PartialType(CreateDescansoDto) {
  // Sobreescribimos las propiedades de fecha para asegurar la transformación explícita
  @IsOptional()
  @IsDate({ message: 'horaInicio debe ser un objeto Date válido.' })
  @Type(() => Date)
  horaInicio?: Date;

  @IsOptional()
  @IsDate({ message: 'horaFin debe ser un objeto Date válido.' })
  @Type(() => Date)
  horaFin?: Date;
}

// src/agendas/dto/update-jornada-diaria.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateJornadaDiariaDto } from './create-jornada-diaria.dto';

/**
 * DTO para la actualización parcial de una Jornada Diaria.
 * Hereda todas las propiedades de CreateJornadaDiariaDto y las hace opcionales.
 */
export class UpdateJornadaDiariaDto extends PartialType(
  CreateJornadaDiariaDto,
) {}

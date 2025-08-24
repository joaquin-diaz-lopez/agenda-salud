// src/agendas/dto/update-slot-disponibilidad.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDisponibilidadDto } from './create-slot-disponibilidad.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para la actualización parcial de un Slot de Disponibilidad.
 * Hereda las propiedades de CreateSlotDisponibilidadDto y añade campos de estado.
 */
export class UpdateSlotDisponibilidadDto extends PartialType(
  CreateSlotDisponibilidadDto,
) {
  /**
   * Indica si el slot está reservado.
   * Es opcional y debe ser un booleano.
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Asegura la transformación a booleano
  estaReservado?: boolean;

  /**
   * Indica si el slot está bloqueado.
   * Es opcional y debe ser un booleano.
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Asegura la transformación a booleano
  estaBloqueado?: boolean;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDisponibilidadDto } from './create-slot-disponibilidad.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!

export class UpdateSlotDisponibilidadDto extends PartialType(
  CreateSlotDisponibilidadDto,
) {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    example: true,
    description:
      'Indica si el slot está reservado. Solo se puede actualizar a reservado si no está bloqueado.',
    required: false,
  })
  estaReservado?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    example: true,
    description: 'Indica si el slot está bloqueado (no disponible para citas).',
    required: false,
  })
  estaBloqueado?: boolean;
}

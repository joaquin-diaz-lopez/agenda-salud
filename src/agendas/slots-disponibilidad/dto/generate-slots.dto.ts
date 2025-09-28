import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!

export class GenerateSlotsDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
    description: 'ID de la jornada diaria para la cual se generarán los slots.',
  })
  idJornadaDiaria: string;

  @IsInt({ message: 'La duración del slot debe ser un número entero.' })
  @Min(1, { message: 'La duración del slot debe ser de al menos 1 minuto.' })
  @Type(() => Number)
  @ApiProperty({
    example: 30,
    description:
      'La duración deseada para cada slot, en minutos (ej. 15, 30, 60).',
    minimum: 1,
  })
  duracionSlotMinutos: number;
}

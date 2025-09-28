import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!

export class CreateSlotDisponibilidadDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
    description: 'ID de la jornada diaria a la que pertenece este slot.',
  })
  idJornadaDiaria: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-01-21T10:00:00Z',
    description: 'Hora de inicio del slot (ISO 8601 con zona horaria).',
    type: 'string',
    format: 'date-time',
  })
  horaInicio: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-01-21T10:30:00Z',
    description: 'Hora de fin del slot (ISO 8601 con zona horaria).',
    type: 'string',
    format: 'date-time',
  })
  horaFin: Date;
}

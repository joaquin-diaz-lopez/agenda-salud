import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de una asociación entre un Profesional y un Servicio.
 * Define la estructura y las reglas de validación para los datos
 * esperados al crear un registro en la tabla 'profesional_servicios'.
 */
export class CreateProfesionalServicioDto {
  /**
   * El ID (UUID) del profesional al que se asociará el servicio.
   * Debe ser un UUID válido y no puede estar vacío.
   */
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'El UUID del profesional que ofrecerá el servicio.',
  })
  idProfesional: string;

  /**
   * El ID (UUID) del servicio que será ofrecido por el profesional.
   * Debe ser un UUID válido y no puede estar vacío.
   */
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'El UUID del servicio que se asociará al profesional.',
  })
  idServicio: string;
}

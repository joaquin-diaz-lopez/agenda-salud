// src/citas/dto/update-cita.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Necesario para PartialType
import { CreateCitaDto } from './create-cita.dto';

/**
 * DTO para la actualización parcial de una Cita.
 * Hereda todas las propiedades de CreateCitaDto y las hace opcionales,
 * permitiendo actualizar solo los campos necesarios.
 */
export class UpdateCitaDto extends PartialType(CreateCitaDto) {}

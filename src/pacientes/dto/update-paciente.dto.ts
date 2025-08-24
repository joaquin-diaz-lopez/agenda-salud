// src/pacientes/dto/update-paciente.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Necesario para PartialType
import { CreatePacienteDto } from './create-paciente.dto';

/**
 * DTO para la actualización parcial de un Paciente.
 * Hereda todas las propiedades de CreatePacienteDto y las hace opcionales,
 * permitiendo actualizar solo los campos necesarios.
 */
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}

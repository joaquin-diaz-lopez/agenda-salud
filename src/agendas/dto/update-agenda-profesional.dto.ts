// src/agendas/dto/update-agenda-profesional.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendaProfesionalDto } from './create-agenda-profesional.dto';

/**
 * DTO para la actualización parcial de una Agenda Profesional.
 * Hereda todas las propiedades de CreateAgendaProfesionalDto y las hace opcionales.
 */
export class UpdateAgendaProfesionalDto extends PartialType(
  CreateAgendaProfesionalDto,
) {}

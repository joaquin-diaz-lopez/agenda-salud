// src/profesionales/dto/update-profesional.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProfesionalDto } from './create-profesional.dto';

/**
 * DTO (Data Transfer Object) para la actualización de un Profesional.
 * Utiliza `PartialType` de NestJS para heredar todas las propiedades
 * de `CreateProfesionalDto` y marcarlas como opcionales.
 */
export class UpdateProfesionalDto extends PartialType(CreateProfesionalDto) {}

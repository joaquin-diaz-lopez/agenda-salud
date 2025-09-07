// src/usuarios/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

/**
 * DTO (Data Transfer Object) para la actualización de un Usuario.
 * Utiliza `PartialType` de NestJS para heredar todas las propiedades
 * de `CreateUsuarioDto` y marcarlas como opcionales.
 */
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

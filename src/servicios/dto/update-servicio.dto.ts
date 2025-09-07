import { PartialType } from '@nestjs/swagger';
import { CreateServicioDto } from './create-servicio.dto';

// PartialType hace que todas las propiedades de CreateServicioDto sean opcionales.
// Esto es útil para las operaciones de actualización (PATCH).
export class UpdateServicioDto extends PartialType(CreateServicioDto) {}

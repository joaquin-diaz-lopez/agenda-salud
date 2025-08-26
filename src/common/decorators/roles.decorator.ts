// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Decorador personalizado para especificar los roles requeridos para acceder a una ruta.
 * Utiliza SetMetadata de NestJS para adjuntar metadatos de roles a un controlador o método.
 *
 * @param roles Un array de cadenas, donde cada cadena es el nombre de un rol permitido.
 * Ejemplo: @Roles('Administrador', 'Profesional')
 * @returns Un decorador que puede aplicarse a controladores o métodos de controlador.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 'roles' es una clave de metadatos que usaremos en nuestro RolesGuard

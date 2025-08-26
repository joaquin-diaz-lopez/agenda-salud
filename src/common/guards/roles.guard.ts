// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface'; // Importa la interfaz del payload JWT

/**
 * Guard de autorización basado en roles.
 * Determina si un usuario autenticado tiene los roles necesarios para acceder a una ruta.
 *
 * Los roles requeridos se definen usando el decorador @Roles('Rol1', 'Rol2')
 * en el controlador o en métodos individuales.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Método que determina si la solicitud actual puede proceder.
   * @param context El contexto de ejecución actual de la solicitud.
   * @returns `true` si el usuario tiene los roles requeridos, `false` en caso contrario.
   */
  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos del decorador @Roles()
    // El 'reflector' nos permite leer los metadatos adjuntos a un manejador de ruta o a una clase.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Para leer metadatos del método (ruta específica)
      context.getClass(), // Para leer metadatos de la clase (controlador completo)
    ]);

    // Si no se especificaron roles requeridos, permite el acceso por defecto.
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario autenticado del objeto de solicitud
    // Aseguramos que el tipo de req.user sea JwtPayload, ya que nuestro JwtStrategy lo retorna así.
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    // Si no hay usuario autenticado (lo que JwtAuthGuard ya debería manejar), deniega el acceso.
    if (!user) {
      return false;
    }

    // 3. Verificar si el rol del usuario coincide con alguno de los roles requeridos
    // `some()` verifica si al menos un elemento en 'requiredRoles' satisface la condición.
    const hasRole = requiredRoles.some((role) =>
      user.nombreRol?.includes(role),
    );

    return hasRole;
  }
}

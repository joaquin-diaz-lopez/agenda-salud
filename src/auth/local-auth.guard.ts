// src/auth/local-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from '../../src/usuarios/entities/usuario.entity'; // Importa la entidad Usuario

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * Sobreescribe el método handleRequest para añadir logs de depuración.
   * Este método es invocado por Passport para manejar el resultado de la autenticación.
   * @param err Cualquier error que haya ocurrido durante la autenticación.
   * @param user El usuario autenticado (si la autenticación fue exitosa).
   * @param info Información adicional de Passport.
   * @param context El contexto de ejecución de NestJS.
   * @returns El usuario si la autenticación fue exitosa, o lanza una excepción.
   */
  handleRequest(
    err: any,
    user: Usuario,
    info: any,
    context: ExecutionContext,
  ): any {
    // <-- ¡CAMBIO AQUÍ: Tipo de retorno 'any'!

    // Si hay un error o el usuario no fue autenticado, lanza una excepción.
    if (err || !user) {
      console.log(
        'LocalAuthGuard: Autenticación fallida. Lanzando UnauthorizedException.',
      );
      throw err || new UnauthorizedException();
    }

    // Si la autenticación fue exitosa, retorna el usuario.
    return user;
  }
}

// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nombreUsuario', // <-- ¡CAMBIO CLAVE AQUÍ!
      passwordField: 'contrasena', // <-- ¡CAMBIO CLAVE AQUÍ!
    });
  }

  /**
   * Valida las credenciales de un usuario.
   * Este método es llamado por Passport cuando se usa el 'LocalAuthGuard'.
   * @param nombreUsuario El nombre de usuario proporcionado.
   * @param contrasena La contraseña proporcionada.
   * @returns El objeto de usuario si las credenciales son válidas.
   * @throws UnauthorizedException si las credenciales son incorrectas.
   */
  async validate(nombreUsuario: string, contrasena: string): Promise<any> {
    // Usa el AuthService para validar las credenciales del usuario
    const usuario = await this.authService.validateUsuario(
      nombreUsuario,
      contrasena,
    );

    // Si el usuario no es encontrado o las credenciales son inválidas, lanza una excepción
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si el usuario es válido, retorna el objeto de usuario.
    // Passport lo adjuntará a 'req.user' en el controlador.
    return usuario;
  }
}

// src/auth/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface'; // Importa la interfaz JwtPayload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado Authorization: Bearer <token>
      ignoreExpiration: false, // No ignora la expiración del token
      secretOrKey: configService.get<string>('JWT_SECRET')!, // Obtiene el secreto JWT de las variables de entorno
    });
  }

  /**
   * Valida el payload decodificado del JWT.
   * Este método es llamado por Passport después de que el token JWT es extraído y verificado.
   * @param payload La carga útil decodificada del token, tipada con JwtPayload.
   * @returns Un objeto que representa el usuario autenticado. Este objeto se adjuntará a 'req.user' en los controladores.
   * @throws UnauthorizedException si la validación falla (aunque el 'ignoreExpiration: false' ya maneja la expiración).
   */
  validate(payload: JwtPayload) {
    // Aquí puedes realizar validaciones adicionales si es necesario,
    // por ejemplo, verificar si el usuario (payload.sub) todavía existe en la base de datos
    // o si su rol ha cambiado desde que se emitió el token.
    // Para una implementación básica, simplemente retornamos los datos del payload.

    // El objeto retornado aquí será el que esté disponible en 'req.user'
    // cuando se use el JwtAuthGuard en una ruta.
    return {
      id: payload.sub,
      nombreUsuario: payload.nombreUsuario,
      idRol: payload.idRol,
      nombreRol: payload.nombreRol,
    };
  }
}

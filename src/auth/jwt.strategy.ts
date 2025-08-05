// src/auth/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface'; // Importa la interfaz JwtPayload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado Authorization: Bearer <token>
      ignoreExpiration: false, // No ignora la expiración del token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Valida el payload decodificado del JWT.
   * @param payload La carga útil decodificada del token.
   * @returns Un objeto que representa el usuario autenticado (se adjunta a req.user).
   */
  async validate(payload: JwtPayload) {
    // Tipado explícito del payload
    // Aquí puedes realizar validaciones adicionales si es necesario,
    // como verificar si el usuario todavía existe en la base de datos.
    // Para una implementación básica, simplemente retornamos los datos del payload.

    // El objeto retornado aquí será adjuntado a 'req.user' en las rutas protegidas.
    return {
      id: payload.sub,
      nombreUsuario: payload.nombreUsuario,
      idRol: payload.idRol,
      nombreRol: payload.nombreRol,
    };
  }
}

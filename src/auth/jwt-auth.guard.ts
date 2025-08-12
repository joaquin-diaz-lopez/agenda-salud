// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de autenticación JWT.
 * Extiende AuthGuard de @nestjs/passport y utiliza la estrategia 'jwt'.
 * Este guard se usa para proteger las rutas que requieren que el usuario esté
 * autenticado con un token JWT válido.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // 'jwt' se refiere a JwtStrategy

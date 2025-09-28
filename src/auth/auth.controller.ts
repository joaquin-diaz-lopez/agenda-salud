// src/auth/auth.controller.ts
import { JwtPayloadResponseDto } from './dto/jwt-payload-response.dto';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto'; // Importa el DTO para el login
import { Usuario } from '../usuarios/entities/usuario.entity'; // Importa la entidad Usuario
import { JwtPayload } from './interfaces/jwt-payload.interface'; // Importa la interfaz JwtPayload
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Extiende la interfaz Request de Express para incluir la propiedad 'user'
// Esto es necesario para que TypeScript sepa que 'req.user' existe y qué tipo tiene.
declare module 'express' {
  interface Request {
    user: Usuario | JwtPayload; // Puede ser Usuario (para LocalAuth) o JwtPayload (para JwtAuth)
  }
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint para el inicio de sesión de usuarios.
   * Utiliza LocalAuthGuard para validar las credenciales (nombre de usuario y contraseña).
   * Si la validación es exitosa, genera y retorna un token JWT.
   * @param req El objeto de solicitud de Express, que contendrá el usuario validado en req.user.
   * @param loginDto El DTO con las credenciales de login (aunque el guard ya las procesa, se usa para tipado).
   * @returns Un objeto que contiene el token de acceso JWT.
   */
  @ApiOperation({ summary: 'Inicia sesión de usuario y obtiene un token JWT' })
  @ApiBody({ type: LoginDto, description: 'Credenciales de inicio de sesión' })
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesión exitoso. Retorna el token de acceso.',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas (Unauthorized)',
  })
  @UseGuards(LocalAuthGuard) // Aplica el guard de autenticación local
  @Post('login')
  async login(@Request() req: { user: Usuario }, @Body() _loginDto: LoginDto) {
    // Tipado explícito de req.user como Usuario
    // loginDto se usa para tipar el cuerpo, aunque el guard ya validó
    // req.user contiene el objeto de usuario que fue validado por LocalStrategy
    // y excluye la contraseña.
    return this.authService.login(req.user);
  }

  /**
   * Endpoint de ejemplo para una ruta protegida.
   * Requiere un token JWT válido en el encabezado Authorization (Bearer token).
   * Si el token es válido, retorna la información del usuario contenida en el token.
   * @param req El objeto de solicitud de Express, que contendrá el payload del JWT en req.user.
   * @returns La información del usuario autenticado.
   */
  @ApiOperation({ summary: 'Obtiene el perfil del usuario autenticado' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Información del payload del JWT.',
    type: JwtPayloadResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token no proporcionado o inválido.',
  })
  @UseGuards(JwtAuthGuard) // Aplica el guard de autenticación JWT
  @Get('perfil')
  getPerfil(@Request() req: { user: JwtPayload }) {
    // Tipado explícito de req.user como JwtPayload
    // req.user contiene el objeto retornado por JwtStrategy.validate(),
    // que es el payload del JWT (id, nombreUsuario, idRol, nombreRol).
    return req.user;
  }
}

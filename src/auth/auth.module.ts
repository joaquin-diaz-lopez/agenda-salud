// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa ConfigModule y ConfigService
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module'; // Asegúrate de que esta ruta sea correcta

@Module({
  imports: [
    // Importa UsuariosModule para que AuthService pueda interactuar con los usuarios
    UsuariosModule,
    // Configura Passport para la estrategia local y JWT
    PassportModule,
    // Configura JwtModule de forma asíncrona para cargar el secreto desde ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Asegúrate de importar ConfigModule aquí
      inject: [ConfigService], // Inyecta ConfigService para acceder a las variables de entorno
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Obtiene el secreto de las variables de entorno
        signOptions: { expiresIn: '60s' }, // Define la expiración del token (ajusta según tus necesidades)
      }),
    }),
  ],
  // Provee los servicios y estrategias de autenticación
  providers: [AuthService, LocalStrategy, JwtStrategy],
  // Declara el controlador de autenticación
  controllers: [AuthController],
  // Exporta AuthService y JwtModule si otros módulos necesitan usarlos (ej. para proteger rutas)
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

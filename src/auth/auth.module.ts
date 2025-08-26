// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        console.log(
          'AuthModule: JWT_SECRET configurado:',
          jwtSecret ? 'Cargado' : 'NO CARGADO o UNDEFINED',
        );
        return {
          secret: jwtSecret,
          // --- ¡CAMBIO CLAVE AQUÍ: AUMENTAMOS EL TIEMPO DE EXPIRACIÓN! ---
          signOptions: { expiresIn: '1h' }, // Token expira en 1 hora (o '1d' para un día)
          // --- FIN DEL CAMBIO ---
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

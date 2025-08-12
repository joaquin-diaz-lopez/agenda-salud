import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ProfesionalServiciosModule } from './profesional-servicios/profesional-servicios.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { CentrosDeSaludModule } from './centros-de-salud/centros-de-salud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    RolesModule,
    UsuariosModule,
    ProfesionalesModule,
    ServiciosModule,
    ProfesionalServiciosModule,
    CentrosDeSaludModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

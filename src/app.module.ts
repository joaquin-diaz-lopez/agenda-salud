import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    // Aquí importarás los módulos específicos para cada entidad,
    // una vez que los crees (ej. UsuariosModule, RolesModule, etc.).
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process'; // Importa process para acceder a las variables de entorno

// Las entidades aquí; en tanto se crean los módulos
import { Usuario } from './usuarios/entities/usuario.entity';
import { Rol } from './roles/entities/rol.entity';
import { Profesional } from './profesionales/entities/profesional.entity';
import { Paciente } from './pacientes/entities/paciente.entity';
import { CentroDeSalud } from './centros-de-salud/entities/centro-de-salud.entity';
import { AgendaProfesional } from './agendas/entities/agenda-profesional.entity';
import { JornadaDiaria } from './agendas/entities/jornada-diaria.entity';
import { SlotDisponibilidad } from './agendas/entities/slot-disponibilidad.entity';
import { Descanso } from './agendas/entities/descanso.entity';
import { Cita } from './citas/entities/cita.entity';
import { HistorialMedicoElectronico } from './historiales-medicos/entities/historial-medico-electronico.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: [
        Usuario,
        Rol,
        Profesional,
        Paciente,
        CentroDeSalud,
        AgendaProfesional,
        JornadaDiaria,
        SlotDisponibilidad,
        Descanso,
        Cita,
        HistorialMedicoElectronico,
      ],
      synchronize: process.env.SYNCHRONIZE_DB === 'true', // Lee del .env, será 'true' inicialmente
      logging: ['query', 'error'], // Para ver las queries SQL generadas
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

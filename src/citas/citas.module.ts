// src/citas/citas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity'; // Importa la entidad Cita

// Módulos de dependencias para CitasService
import { PacientesModule } from '../pacientes/pacientes.module';
import { ProfesionalesModule } from '../profesionales/profesionales.module';
import { ServiciosModule } from '../servicios/servicios.module';
import { AgendasModule } from 'src/agendas/agendas.module';

// TODO: Descomentar y asegurar que este módulo esté disponible una vez creado.
// Este módulo contendrá SlotDisponibilidadService.
// import { AgendasModule } from '../agendas/agendas.module';

/**
 * Módulo para la gestión de Citas.
 * Integra la entidad Cita con su servicio y controlador,
 * y establece las dependencias necesarias con otros módulos
 * para el correcto funcionamiento de las operaciones de agendamiento.
 */
@Module({
  imports: [
    // Registra la entidad 'Cita' con TypeORM.
    TypeOrmModule.forFeature([Cita]),

    // Importa módulos cuyos servicios son inyectados en CitasService.
    PacientesModule,
    ProfesionalesModule,
    ServiciosModule,
    AgendasModule,
  ],
  providers: [CitasService], // Registra CitasService como proveedor
  controllers: [CitasController], // Registra CitasController como controlador
  exports: [CitasService], // Exporta CitasService si otros módulos lo necesitan (ej. HistorialesMedicosModule)
})
export class CitasModule {}

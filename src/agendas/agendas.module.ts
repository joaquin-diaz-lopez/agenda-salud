// src/agendas/agendas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades del módulo de Agendas
import { AgendaProfesional } from './entities/agenda-profesional.entity';
import { JornadaDiaria } from './entities/jornada-diaria.entity';
import { Descanso } from './entities/descanso.entity';
import { SlotDisponibilidad } from './entities/slot-disponibilidad.entity';

// Servicios del módulo de Agendas
import { AgendaProfesionalService } from './agenda-profesional.service';
import { JornadaDiariaService } from './jornada-diaria.service';
import { DescansoService } from './descanso.service';
import { SlotDisponibilidadService } from './slot-disponibilidad.service';

// Controladores del módulo de Agendas
import { AgendaProfesionalController } from './agenda-profesional.controller';
import { JornadaDiariaController } from './jornada-diaria.controller';
import { DescansoController } from './descanso.controller';
import { SlotDisponibilidadController } from './slot-disponibilidad.controller';

// Otros módulos necesarios para las inyecciones de dependencia en los servicios de Agendas
import { ProfesionalesModule } from '../profesionales/profesionales.module';

/**
 * Módulo para la gestión integral de Agendas de Profesionales.
 * Encapsula la lógica de negocio, entidades, servicios y controladores
 * relacionados con las agendas, jornadas, descansos y slots de disponibilidad.
 */
@Module({
  imports: [
    // Registra todas las entidades del módulo con TypeORM
    TypeOrmModule.forFeature([
      AgendaProfesional,
      JornadaDiaria,
      Descanso,
      SlotDisponibilidad,
    ]),
    // Importa el módulo de Profesionales porque AgendaProfesionalService lo necesita
    ProfesionalesModule,
  ],
  providers: [
    // Registra todos los servicios del módulo como proveedores
    AgendaProfesionalService,
    JornadaDiariaService,
    DescansoService,
    SlotDisponibilidadService,
  ],
  controllers: [
    // Registra todos los controladores del módulo
    AgendaProfesionalController,
    JornadaDiariaController,
    DescansoController,
    SlotDisponibilidadController,
  ],
  exports: [
    // Exporta los servicios que otros módulos podrían necesitar (ej. CitasModule necesita SlotDisponibilidadService)
    AgendaProfesionalService, // Podría ser útil si se necesita acceder a agendas desde fuera
    JornadaDiariaService, // Podría ser útil si se necesita acceder a jornadas desde fuera
    SlotDisponibilidadService, // ¡CRUCIAL! Exportado para ser inyectado en CitasService
  ],
})
export class AgendasModule {}

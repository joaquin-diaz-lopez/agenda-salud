// src/agendas/agendas.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaProfesional } from './entities/agenda-profesional.entity';
import { AgendaProfesionalService } from './agenda-profesional.service';
import { AgendaProfesionalController } from './agenda-profesional.controller';

import { ProfesionalesModule } from '../profesionales/profesionales.module';
import { DescansosModule } from './descansos/descansos.module';
import { JornadasDiariasModule } from './jornadas-diarias/jornadas-diarias.module';
import { SlotsDisponibilidadModule } from 'src/agendas/slots-disponibilidad/slots-disponibilidad.module';

/**
 * Módulo para la gestión integral de Agendas de Profesionales.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AgendaProfesional]),
    ProfesionalesModule,
    forwardRef(() => DescansosModule),
    forwardRef(() => JornadasDiariasModule),
    forwardRef(() => SlotsDisponibilidadModule),
  ],
  providers: [AgendaProfesionalService],
  controllers: [AgendaProfesionalController],
  exports: [AgendaProfesionalService],
})
export class AgendasModule {}

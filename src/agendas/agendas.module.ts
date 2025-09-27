// src/agendas/agendas.module.ts
import { Module } from '@nestjs/common';
import { DescansosModule } from './descansos/descansos.module';
import { JornadasDiariasModule } from './jornadas-diarias/jornadas-diarias.module';
import { SlotsDisponibilidadModule } from 'src/agendas/slots-disponibilidad/slots-disponibilidad.module';
import { AgendasProfesionalModule } from './agendas-profesional/agendas-profesional.module';
/**
 * Módulo para la gestión integral de Agendas de Profesionales.
 */
@Module({
  imports: [
    DescansosModule,
    JornadasDiariasModule,
    SlotsDisponibilidadModule,
    AgendasProfesionalModule,
  ],
})
export class AgendasModule {}

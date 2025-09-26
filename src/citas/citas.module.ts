// src/citas/citas.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';

import { PacientesModule } from '../pacientes/pacientes.module';
import { ProfesionalesModule } from '../profesionales/profesionales.module';
import { ServiciosModule } from '../servicios/servicios.module';
import { SlotsDisponibilidadModule } from '../agendas/slots-disponibilidad/slots-disponibilidad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),

    PacientesModule,
    ProfesionalesModule,
    ServiciosModule,
    forwardRef(() => SlotsDisponibilidadModule),
  ],
  providers: [CitasService],
  controllers: [CitasController],
  exports: [CitasService],
})
export class CitasModule {}

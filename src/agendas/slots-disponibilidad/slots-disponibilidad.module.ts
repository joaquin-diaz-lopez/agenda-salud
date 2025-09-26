import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotDisponibilidad } from './entities/slot-disponibilidad.entity';
import { SlotDisponibilidadController } from './slot-disponibilidad.controller';
import { SlotDisponibilidadService } from './slot-disponibilidad.service';
import { JornadasDiariasModule } from 'src/agendas/jornadas-diarias/jornadas-diarias.module';
import { DescansosModule } from 'src/agendas/descansos/descansos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SlotDisponibilidad]),
    forwardRef(() => JornadasDiariasModule),
    forwardRef(() => DescansosModule),
  ],
  controllers: [SlotDisponibilidadController],
  providers: [SlotDisponibilidadService],
  exports: [forwardRef(() => SlotDisponibilidadService)],
})
export class SlotsDisponibilidadModule {}

// src/agendas/descansos/descansos.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Descanso } from './entities/descanso.entity';
import { DescansoService } from './descanso.service';
import { DescansoController } from './descanso.controller';
import { AgendasModule } from '../agendas.module';
import { JornadasDiariasModule } from '../jornadas-diarias/jornadas-diarias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Descanso]),
    forwardRef(() => AgendasModule),
    forwardRef(() => JornadasDiariasModule),
  ],
  providers: [DescansoService],
  controllers: [DescansoController],
  exports: [DescansoService],
})
export class DescansosModule {}

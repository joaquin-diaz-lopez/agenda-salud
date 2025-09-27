// src/agendas/descansos/descansos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Descanso } from './entities/descanso.entity';
import { DescansoService } from './descanso.service';
import { DescansoController } from './descanso.controller';
import { JornadasDiariasModule } from '../jornadas-diarias/jornadas-diarias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Descanso]), JornadasDiariasModule],
  providers: [DescansoService],
  controllers: [DescansoController],
  exports: [DescansoService],
})
export class DescansosModule {}

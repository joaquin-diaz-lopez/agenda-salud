// src/agendas/agendas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Descanso } from './entities/descanso.entity';
import { DescansoService } from './descanso.service';
import { DescansoController } from './descanso.controller';
import { AgendasModule } from '../agendas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Descanso]), AgendasModule],
  providers: [DescansoService],
  controllers: [DescansoController],
  exports: [],
})
export class DescansosModule {}

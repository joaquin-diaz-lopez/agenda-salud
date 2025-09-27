import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaProfesional } from './entities/agenda-profesional.entity';
import { AgendaProfesionalController } from './agenda-profesional.controller';
import { AgendaProfesionalService } from './agenda-profesional.service';
import { ProfesionalesModule } from 'src/profesionales/profesionales.module';

@Module({
  imports: [TypeOrmModule.forFeature([AgendaProfesional]), ProfesionalesModule],
  controllers: [AgendaProfesionalController],
  providers: [AgendaProfesionalService],
  exports: [AgendaProfesionalService],
})
export class AgendasProfesionalModule {}

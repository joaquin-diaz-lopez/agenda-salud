import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JornadaDiaria } from './entities/jornada-diaria.entity';
import { JornadaDiariaController } from './jornada-diaria.controller';
import { JornadaDiariaService } from './jornada-diaria.service';
import { AgendasProfesionalModule } from '../agendas-profesional/agendas-profesional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JornadaDiaria]),
    AgendasProfesionalModule,
  ],
  controllers: [JornadaDiariaController],
  providers: [JornadaDiariaService],
  exports: [JornadaDiariaService],
})
export class JornadasDiariasModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JornadaDiaria } from './entities/jornada-diaria.entity';
import { JornadaDiariaController } from './jornada-diaria.controller';
import { JornadaDiariaService } from './jornada-diaria.service';
import { AgendasModule } from '../agendas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JornadaDiaria]),
    forwardRef(() => AgendasModule),
  ],
  controllers: [JornadaDiariaController],
  providers: [JornadaDiariaService],
  exports: [JornadaDiariaService],
})
export class JornadasDiariasModule {}

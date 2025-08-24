// src/profesional-servicios/profesional-servicios.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- ¡Importar forwardRef!
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalServiciosService } from './profesional-servicios.service';
import { ProfesionalServiciosController } from './profesional-servicios.controller';
import { ProfesionalServicio } from './entities/profesional-servicio.entity';
import { ProfesionalesModule } from '../profesionales/profesionales.module'; // Importa el módulo de profesionales
import { ServiciosModule } from '../servicios/servicios.module'; // Importa el módulo de servicios

/**
 * Módulo para la gestión de la tabla intermedia ProfesionalServicio.
 * Permite la asociación de profesionales con los servicios que ofrecen.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ProfesionalServicio]), // Registra la entidad ProfesionalServicio
    forwardRef(() => ProfesionalesModule), // <-- ¡Ajuste para dependencia circular!
    // Necesario para que ProfesionalServiciosService pueda usar ProfesionalesService
    ServiciosModule, // Necesario para que ProfesionalServiciosService pueda usar ServiciosService
  ],
  providers: [ProfesionalServiciosService],
  controllers: [ProfesionalServiciosController],
  exports: [ProfesionalServiciosService], // Exporta el servicio si otros módulos lo necesitan
})
export class ProfesionalServiciosModule {}

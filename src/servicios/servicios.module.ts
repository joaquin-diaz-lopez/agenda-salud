// src/servicios/servicios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule para la integración con la base de datos
import { ServiciosService } from './servicios.service'; // Importa el Servicio de Servicios
import { ServiciosController } from './servicios.controller'; // Importa el Controlador de Servicios
import { Servicio } from './entities/servicio.entity'; // Importa la Entidad Servicio

/**
 * Módulo para la gestión de Servicios.
 * Define los componentes (controladores, servicios, entidades de base de datos)
 * relacionados con los servicios de la agenda de salud y los organiza
 * para el sistema de inyección de dependencias de NestJS.
 */
@Module({
  imports: [
    // Registra la entidad 'Servicio' con TypeORM para que el módulo pueda
    // interactuar con la tabla de servicios en la base de datos.
    TypeOrmModule.forFeature([Servicio]),
  ],
  providers: [
    // Registra ServiciosService como un proveedor, haciéndolo inyectable
    // en otros componentes (como controladores o otros servicios).
    ServiciosService,
  ],
  controllers: [
    // Registra ServiciosController como un controlador, exponiendo sus
    // métodos como endpoints HTTP.
    ServiciosController,
  ],
  exports: [
    // Exporta ServiciosService para que otros módulos (ej. CitasModule, ProfesionalServiciosModule)
    // puedan inyectarlo y utilizar sus funcionalidades.
    ServiciosService,
  ],
})
export class ServiciosModule {}

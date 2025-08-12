// src/centros-de-salud/centros-de-salud.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentrosDeSaludService } from './centros-de-salud.service';
import { CentrosDeSaludController } from './centros-de-salud.controller';
import { CentroDeSalud } from './entities/centro-de-salud.entity'; // Importa la entidad CentroDeSalud

/**
 * Módulo para la gestión de Centros de Salud.
 * Define los componentes (controlador, servicio, entidad de base de datos)
 * relacionados con los centros de salud y los organiza
 * para el sistema de inyección de dependencias de NestJS.
 */
@Module({
  imports: [
    // Registra la entidad 'CentroDeSalud' con TypeORM para que el módulo pueda
    // interactuar con la tabla de centros de salud en la base de datos.
    TypeOrmModule.forFeature([CentroDeSalud]),
  ],
  providers: [CentrosDeSaludService], // Registra CentrosDeSaludService como un proveedor
  controllers: [CentrosDeSaludController], // Registra CentrosDeSaludController como un controlador
  exports: [CentrosDeSaludService], // Exporta el servicio por si otros módulos lo necesitan (ej. ProfesionalesModule)
})
export class CentrosDeSaludModule {}

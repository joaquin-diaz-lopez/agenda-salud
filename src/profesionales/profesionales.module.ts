// src/profesionales/profesionales.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalesService } from './profesionales.service';
import { ProfesionalesController } from './profesionales.controller';
import { Profesional } from './entities/profesional.entity'; // Importa la entidad Profesional
import { UsuariosModule } from '../usuarios/usuarios.module'; // Importa UsuariosModule
import { CentroDeSalud } from '../centros-de-salud/entities/centro-de-salud.entity'; // Importa la entidad CentroDeSalud
// Si ya tiene un módulo para CentroDeSalud con un servicio findAll/findOne, descomente lo siguiente:
// import { CentrosDeSaludModule } from '../centros-de-salud/centros-de-salud.module';

/**
 * Módulo para la gestión de Profesionales.
 * Define los componentes (controlador, servicio, entidad de base de datos)
 * relacionados con los profesionales de la salud y sus dependencias.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Profesional, CentroDeSalud]), // Registra Profesional y CentroDeSalud para sus repositorios
    UsuariosModule, // Necesario porque ProfesionalesService inyecta UsuariosService
    // CentrosDeSaludModule, // Si el servicio de profesionales usa un servicio de CentrosDeSalud, importe aquí
  ],
  providers: [ProfesionalesService], // Registra ProfesionalesService como proveedor
  controllers: [ProfesionalesController], // Registra ProfesionalesController como controlador
  exports: [ProfesionalesService], // ¡Importante! Exporta el servicio para que otros módulos (como ProfesionalServiciosModule) puedan usarlo
})
export class ProfesionalesModule {}

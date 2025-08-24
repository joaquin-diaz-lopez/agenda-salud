// src/pacientes/pacientes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity'; // Importa la entidad Paciente
import { UsuariosModule } from '../usuarios/usuarios.module'; // Importa UsuariosModule

/**
 * Módulo para la gestión de Pacientes.
 * Define los componentes (controlador, servicio, entidad de base de datos)
 * relacionados con los pacientes y sus dependencias.
 */
@Module({
  imports: [
    // Registra la entidad 'Paciente' con TypeORM para que el módulo pueda
    // interactuar con la tabla de pacientes en la base de datos.
    TypeOrmModule.forFeature([Paciente]),
    // Importa UsuariosModule porque PacientesService inyecta UsuariosService
    // para buscar y validar usuarios.
    UsuariosModule,
  ],
  providers: [PacientesService], // Registra PacientesService como un proveedor
  controllers: [PacientesController], // Registra PacientesController como un controlador
  exports: [PacientesService], // Exporta el servicio por si otros módulos lo necesitan (ej. CitasModule)
})
export class PacientesModule {}

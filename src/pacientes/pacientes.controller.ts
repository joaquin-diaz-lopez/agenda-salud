// src/pacientes/pacientes.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto'; // Importa el DTO de creación
import { UpdatePacienteDto } from './dto/update-paciente.dto'; // Importa el DTO de actualización
import { Paciente } from './entities/paciente.entity'; // Importa la entidad Paciente

/**
 * Controlador para la gestión de Pacientes.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los pacientes.
 */
@Controller('pacientes') // Define la ruta base para este controlador: /pacientes
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  /**
   * Crea un nuevo paciente.
   * Maneja las solicitudes POST a /pacientes.
   * @param createPacienteDto El DTO con los datos para crear el paciente.
   * @returns El paciente recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(
    @Body() createPacienteDto: CreatePacienteDto,
  ): Promise<Paciente> {
    return this.pacientesService.create(createPacienteDto);
  }

  /**
   * Obtiene todos los pacientes.
   * Maneja las solicitudes GET a /pacientes.
   * @returns Un array de todos los pacientes.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  /**
   * Obtiene un paciente específico por su ID.
   * Maneja las solicitudes GET a /pacientes/:id.
   * @param id El ID (UUID) del paciente a buscar.
   * @returns El paciente encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Paciente | null> {
    return this.pacientesService.findOne(id);
  }

  /**
   * Actualiza parcialmente un paciente existente.
   * Maneja las solicitudes PATCH a /pacientes/:id.
   * @param id El ID del paciente a actualizar.
   * @param updatePacienteDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Paciente actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    return await this.pacientesService.actualiza(id, updatePacienteDto);
  }
}

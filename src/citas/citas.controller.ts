// src/citas/citas.controller.ts
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
import { CitasService } from './citas.service'; // Importa el servicio de Citas
import { CreateCitaDto } from './dto/create-cita.dto'; // Importa el DTO de creación de Cita
import { UpdateCitaDto } from './dto/update-cita.dto'; // Importa el DTO de actualización de Cita
import { Cita } from './entities/cita.entity'; // Importa la entidad Cita

/**
 * Controlador para la gestión de Citas.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre las citas.
 */
@Controller('citas') // Define la ruta base para este controlador: /citas
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  /**
   * Crea una nueva cita.
   * Maneja las solicitudes POST a /citas.
   * @param createCitaDto El DTO con los datos para crear la cita.
   * @returns La cita recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(@Body() createCitaDto: CreateCitaDto): Promise<Cita> {
    return this.citasService.create(createCitaDto);
  }

  /**
   * Obtiene todas las citas.
   * Maneja las solicitudes GET a /citas.
   * @returns Un array de todas las citas.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  /**
   * Obtiene una cita específica por su ID.
   * Maneja las solicitudes GET a /citas/:id.
   * @param id El ID (UUID) de la cita a buscar.
   * @returns La cita encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Cita | null> {
    return this.citasService.findOne(id);
  }

  /**
   * Actualiza parcialmente una cita existente.
   * Maneja las solicitudes PATCH a /citas/:id.
   * @param id El ID de la cita a actualizar.
   * @param updateCitaDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Cita actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ): Promise<Cita> {
    return await this.citasService.actualiza(id, updateCitaDto);
  }
}

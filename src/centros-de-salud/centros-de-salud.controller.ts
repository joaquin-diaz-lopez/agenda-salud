// src/centros-de-salud/centros-de-salud.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CentrosDeSaludService } from './centros-de-salud.service'; // Importa el servicio de Centros de Salud
import { CreateCentroDeSaludDto } from './dto/create-centro-de-salud.dto'; // Importa el DTO de creación de Centro de Salud
import { CentroDeSalud } from './entities/centro-de-salud.entity'; // Importa la entidad CentroDeSalud

/**
 * Controlador para la gestión de Centros de Salud.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los centros de salud.
 */
@Controller('centros-de-salud') // Define la ruta base para este controlador: /centros-de-salud
export class CentrosDeSaludController {
  constructor(private readonly centrosDeSaludService: CentrosDeSaludService) {}

  /**
   * Crea un nuevo centro de salud.
   * Maneja las solicitudes POST a /centros-de-salud.
   * Utiliza el ValidationPipe global (si está configurado en main.ts) para validar el CreateCentroDeSaludDto.
   * @param createCentroDeSaludDto El DTO con los datos para crear el centro de salud.
   * @returns El centro de salud recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(
    @Body() createCentroDeSaludDto: CreateCentroDeSaludDto,
  ): Promise<CentroDeSalud> {
    return this.centrosDeSaludService.create(createCentroDeSaludDto);
  }

  /**
   * Obtiene todos los centros de salud.
   * Maneja las solicitudes GET a /centros-de-salud.
   * @returns Un array de todos los centros de salud.
   */
  @Get()
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findAll(): Promise<CentroDeSalud[]> {
    return this.centrosDeSaludService.findAll();
  }

  /**
   * Obtiene un centro de salud específico por su ID.
   * Maneja las solicitudes GET a /centros-de-salud/:id.
   * @param id El ID (UUID) del centro de salud a buscar.
   * @returns El centro de salud encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findOne(@Param('id') id: string): Promise<CentroDeSalud | null> {
    return this.centrosDeSaludService.findOne(id);
  }
}

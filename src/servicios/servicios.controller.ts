// src/servicios/servicios.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service'; // Importa el servicio de Servicios
import { CreateServicioDto } from './dto/create-servicio.dto'; // Importa el DTO de creación de servicio
import { Servicio } from './entities/servicio.entity'; // Importa la entidad Servicio

/**
 * Controlador para la gestión de Servicios.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los servicios.
 */
@Controller('servicios') // Define la ruta base para este controlador: /servicios
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  /**
   * Crea un nuevo servicio.
   * Maneja las solicitudes POST a /servicios.
   * Utiliza el ValidationPipe global para validar el CreateServicioDto.
   * @param createServicioDto El DTO con los datos para crear el servicio.
   * @returns El servicio recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(
    @Body() createServicioDto: CreateServicioDto,
  ): Promise<Servicio> {
    return this.serviciosService.create(createServicioDto);
  }

  /**
   * Obtiene todos los servicios.
   * Maneja las solicitudes GET a /servicios.
   * @returns Un array de todos los servicios.
   */
  @Get()
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findAll(): Promise<Servicio[]> {
    return this.serviciosService.findAll();
  }

  /**
   * Obtiene un servicio específico por su ID.
   * Maneja las solicitudes GET a /servicios/:id.
   * @param id El ID (UUID) del servicio a buscar.
   * @returns El servicio encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findOne(@Param('id') id: string): Promise<Servicio | null> {
    return this.serviciosService.findOne(id);
  }
}

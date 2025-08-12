// src/profesional-servicios/profesional-servicios.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfesionalServiciosService } from './profesional-servicios.service';
import { CreateProfesionalServicioDto } from './dto/create-profesional-servicio.dto';
import { ProfesionalServicio } from './entities/profesional-servicio.entity';

/**
 * Controlador para la gestión de asociaciones Profesional-Servicio.
 * Expone endpoints HTTP para crear y consultar qué servicios ofrece cada profesional.
 */
@Controller('profesional-servicios') // Ruta base para este controlador: /profesional-servicios
export class ProfesionalServiciosController {
  constructor(
    private readonly profesionalServiciosService: ProfesionalServiciosService,
  ) {}

  /**
   * Crea una nueva asociación entre un profesional y un servicio.
   * Maneja las solicitudes POST a /profesional-servicios.
   * @param createProfesionalServicioDto El DTO con los IDs del profesional y el servicio.
   * @returns La asociación ProfesionalServicio recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(
    @Body() createProfesionalServicioDto: CreateProfesionalServicioDto,
  ): Promise<ProfesionalServicio> {
    return this.profesionalServiciosService.create(
      createProfesionalServicioDto,
    );
  }

  /**
   * Obtiene todas las asociaciones profesional-servicio.
   * Maneja las solicitudes GET a /profesional-servicios.
   * @returns Un array de todas las asociaciones profesional-servicio.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ProfesionalServicio[]> {
    return this.profesionalServiciosService.findAll();
  }

  /**
   * Obtiene una asociación profesional-servicio específica por su ID.
   * Maneja las solicitudes GET a /profesional-servicios/:id.
   * @param id El ID (UUID) de la asociación a buscar.
   * @returns La asociación encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProfesionalServicio | null> {
    return this.profesionalServiciosService.findOne(id);
  }
}

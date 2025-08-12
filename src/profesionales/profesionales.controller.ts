// src/profesionales/profesionales.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service'; // Importa el servicio de Profesionales
import { CreateProfesionalDto } from './dto/create-profesional.dto'; // Importa el DTO de creación de profesional
import { Profesional } from './entities/profesional.entity'; // Importa la entidad Profesional

/**
 * Controlador para la gestión de Profesionales.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los profesionales.
 */
@Controller('profesionales') // Define la ruta base para este controlador: /profesionales
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  /**
   * Crea un nuevo profesional.
   * Maneja las solicitudes POST a /profesionales.
   * Utiliza el ValidationPipe global (si está configurado en main.ts) para validar el CreateProfesionalDto.
   * @param createProfesionalDto El DTO con los datos para crear el profesional.
   * @returns El profesional recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna un estado 201 Created si es exitoso
  async create(
    @Body() createProfesionalDto: CreateProfesionalDto,
  ): Promise<Profesional> {
    return this.profesionalesService.create(createProfesionalDto);
  }

  /**
   * Obtiene todos los profesionales.
   * Maneja las solicitudes GET a /profesionales.
   * @returns Un array de todos los profesionales.
   */
  @Get()
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findAll(): Promise<Profesional[]> {
    return this.profesionalesService.findAll();
  }

  /**
   * Obtiene un profesional específico por su ID.
   * Maneja las solicitudes GET a /profesionales/:id.
   * @param id El ID (UUID) del profesional a buscar.
   * @returns El profesional encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Retorna un estado 200 OK
  async findOne(@Param('id') id: string): Promise<Profesional | null> {
    return this.profesionalesService.findOne(id);
  }
}

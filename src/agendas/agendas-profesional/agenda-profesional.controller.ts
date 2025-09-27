// src/agendas/agenda-profesional.controller.ts
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
import { AgendaProfesionalService } from './agenda-profesional.service';
import { CreateAgendaProfesionalDto } from './dto/create-agenda-profesional.dto';
import { UpdateAgendaProfesionalDto } from './dto/update-agenda-profesional.dto';
import { AgendaProfesional } from './entities/agenda-profesional.entity';

/**
 * Controlador para la gestión de Agendas Profesionales.
 * Expone los endpoints HTTP para realizar operaciones CRUD sobre las agendas generales de los profesionales.
 */
@Controller('agendas-profesionales') // Ruta base: /agendas-profesionales
export class AgendaProfesionalController {
  constructor(
    private readonly agendaProfesionalService: AgendaProfesionalService,
  ) {}

  /**
   * Crea una nueva agenda profesional.
   * @param createAgendaProfesionalDto El DTO con los datos para crear la agenda.
   * @returns La AgendaProfesional recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAgendaProfesionalDto: CreateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    return this.agendaProfesionalService.create(createAgendaProfesionalDto);
  }

  /**
   * Obtiene todas las agendas profesionales.
   * @returns Un array de todas las agendas profesionales.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AgendaProfesional[]> {
    return this.agendaProfesionalService.findAll();
  }

  /**
   * Obtiene una agenda profesional específica por su ID.
   * @param id El ID (UUID) de la agenda a buscar.
   * @returns La AgendaProfesional encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalService.findOne(id);
  }

  /**
   * Busca una agenda profesional por el ID de un profesional.
   * @param idProfesional El ID (UUID) del profesional.
   * @returns La AgendaProfesional encontrada o null.
   */
  @Get('profesional/:idProfesional')
  @HttpCode(HttpStatus.OK)
  async findByProfesionalId(
    @Param('idProfesional') idProfesional: string,
  ): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalService.findByProfesionalId(idProfesional);
  }

  /**
   * Actualiza parcialmente una agenda profesional existente.
   * @param id El ID de la agenda a actualizar.
   * @param updateAgendaProfesionalDto El DTO con los datos parciales para actualizar.
   * @returns La AgendaProfesional actualizada.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updateAgendaProfesionalDto: UpdateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    return await this.agendaProfesionalService.actualiza(
      id,
      updateAgendaProfesionalDto,
    );
  }
}

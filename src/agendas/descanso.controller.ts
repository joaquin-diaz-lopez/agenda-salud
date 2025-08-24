// src/agendas/descanso.controller.ts
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
import { DescansoService } from './descanso.service';
import { CreateDescansoDto } from './dto/create-descanso.dto';
import { UpdateDescansoDto } from './dto/update-descanso.dto';
import { Descanso } from './entities/descanso.entity';

/**
 * Controlador para la gestión de Descansos.
 * Expone los endpoints HTTP para definir y gestionar los períodos de no disponibilidad dentro de una jornada diaria.
 */
@Controller('descansos') // Ruta base: /descansos
export class DescansoController {
  constructor(private readonly descansoService: DescansoService) {}

  /**
   * Crea un nuevo período de descanso.
   * @param createDescansoDto El DTO con los datos para crear el descanso.
   * @returns El Descanso recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDescansoDto: CreateDescansoDto,
  ): Promise<Descanso> {
    return this.descansoService.create(createDescansoDto);
  }

  /**
   * Obtiene todos los descansos.
   * @returns Un array de todos los descansos.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Descanso[]> {
    return this.descansoService.findAll();
  }

  /**
   * Obtiene un descanso específico por su ID.
   * @param id El ID (UUID) del descanso a buscar.
   * @returns El Descanso encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Descanso | null> {
    return this.descansoService.findOne(id);
  }

  /**
   * Busca descansos por el ID de una jornada diaria.
   * @param idJornadaDiaria El ID (UUID) de la jornada diaria.
   * @returns Un array de Descanso.
   */
  @Get('jornada/:idJornadaDiaria')
  @HttpCode(HttpStatus.OK)
  async findByJornadaDiariaId(
    @Param('idJornadaDiaria') idJornadaDiaria: string,
  ): Promise<Descanso[]> {
    return this.descansoService.findByJornadaDiariaId(idJornadaDiaria);
  }

  /**
   * Actualiza parcialmente un descanso existente.
   * @param id El ID del descanso a actualizar.
   * @param updateDescansoDto El DTO con los datos parciales para actualizar.
   * @returns El Descanso actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updateDescansoDto: UpdateDescansoDto,
  ): Promise<Descanso> {
    return await this.descansoService.actualiza(id, updateDescansoDto);
  }
}

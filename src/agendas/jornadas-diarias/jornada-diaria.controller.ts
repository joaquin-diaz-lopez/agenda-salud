// src/agendas/jornada-diaria.controller.ts
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
import { JornadaDiariaService } from './jornada-diaria.service';
import { CreateJornadaDiariaDto } from './dto/create-jornada-diaria.dto';
import { UpdateJornadaDiariaDto } from './dto/update-jornada-diaria.dto';
import { JornadaDiaria } from './entities/jornada-diaria.entity';

/**
 * Controlador para la gestión de Jornadas Diarias.
 * Expone los endpoints HTTP para realizar operaciones CRUD sobre los horarios de trabajo diarios de un profesional.
 */
@Controller('jornadas-diarias') // Ruta base: /jornadas-diarias
export class JornadaDiariaController {
  constructor(private readonly jornadaDiariaService: JornadaDiariaService) {}

  /**
   * Crea una nueva jornada diaria.
   * @param createJornadaDiariaDto El DTO con los datos para crear la jornada.
   * @returns La JornadaDiaria recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createJornadaDiariaDto: CreateJornadaDiariaDto,
  ): Promise<JornadaDiaria> {
    return this.jornadaDiariaService.create(createJornadaDiariaDto);
  }

  /**
   * Obtiene todas las jornadas diarias.
   * @returns Un array de todas las jornadas diarias.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<JornadaDiaria[]> {
    return this.jornadaDiariaService.findAll();
  }

  /**
   * Obtiene una jornada diaria específica por su ID.
   * @param id El ID (UUID) de la jornada a buscar.
   * @returns La JornadaDiaria encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<JornadaDiaria | null> {
    return this.jornadaDiariaService.findOne(id);
  }

  /**
   * Busca jornadas diarias por el ID de una agenda profesional.
   * @param idAgendaProfesional El ID (UUID) de la agenda profesional.
   * @returns Un array de JornadaDiaria.
   */
  @Get('agenda/:idAgendaProfesional')
  @HttpCode(HttpStatus.OK)
  async findByAgendaProfesionalId(
    @Param('idAgendaProfesional') idAgendaProfesional: string,
  ): Promise<JornadaDiaria[]> {
    return this.jornadaDiariaService.findByAgendaProfesionalId(
      idAgendaProfesional,
    );
  }

  /**
   * Actualiza parcialmente una jornada diaria existente.
   * @param id El ID de la jornada a actualizar.
   * @param updateJornadaDiariaDto El DTO con los datos parciales para actualizar.
   * @returns La JornadaDiaria actualizada.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updateJornadaDiariaDto: UpdateJornadaDiariaDto,
  ): Promise<JornadaDiaria> {
    return await this.jornadaDiariaService.actualiza(
      id,
      updateJornadaDiariaDto,
    );
  }
}
